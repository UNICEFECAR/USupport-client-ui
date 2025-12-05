import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import propTypes from "prop-types";

import {
  ActionButton,
  Block,
  Button,
  Grid,
  GridItem,
  Label,
  Like,
} from "@USupport-components-library/src";

import { cmsSvc } from "@USupport-components-library/services";

import {
  ThemeContext,
  createArticleSlug,
  constructShareUrl,
} from "@USupport-components-library/utils";

import {
  useAddContentRating,
  useAddContentEngagement,
  useRemoveContentEngagement,
} from "#hooks";

import "./video-view.scss";

/**
 * VideoView
 *
 * VideoView block
 *
 * @return {jsx}
 */
export const VideoView = ({ videoData, t, language, isTmpUser }) => {
  const { cookieState, setCookieState } = useContext(ThemeContext);
  const queryClient = useQueryClient();
  const creator = videoData.creator ? videoData.creator : null;

  const { name } = useParams();
  const [isShared, setIsShared] = useState(false);

  const [contentRating, setContentRating] = useState({
    likes: videoData.likes || 0,
    dislikes: videoData.dislikes || 0,
    isLikedByUser: videoData.contentRating?.isLikedByUser || false,
    isDislikedByUser: videoData.contentRating?.isDislikedByUser || false,
  });
  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);

  const DISPLAY_VIDEO = cookieState.hasAcceptedAllCookies;

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [language]);

  useEffect(() => {
    if (videoData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(videoData.title);
      const urlSlug = name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/client/${language}/information-portal/article/${videoData.id}/${currentSlug}`;

        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [videoData?.title, name, language, hasUpdatedUrl]);

  const addContentEngagementMutation = useAddContentEngagement();
  const removeContentEngagementMutation = useRemoveContentEngagement();

  useQuery(
    ["video-view-tracking", videoData.id],
    async () => {
      addContentEngagementMutation({
        contentId: videoData.id,
        contentType: "video",
        action: "view",
      });
      return true;
    },
    {
      enabled: !!videoData?.id && !isTmpUser,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const onMutate = (data) => {
    const prevData = JSON.parse(JSON.stringify(contentRating));

    const likes = prevData.likes;
    const dislikes = prevData.dislikes;
    const isLikedByUser = prevData.isLikedByUser;
    const isDislikedByUser = prevData.isDislikedByUser;

    const newData = { ...contentRating };

    if (isLikedByUser && data.positive === null) {
      newData.likes = likes - 1;
      newData.isLikedByUser = false;

      cmsSvc.addRating({
        id: videoData.id,
        action: "remove-like",
        contentType: "video",
      });
    }
    if (isDislikedByUser && data.positive === null) {
      newData.dislikes = dislikes - 1;
      newData.isDislikedByUser = false;
      cmsSvc.addRating({
        id: videoData.id,
        action: "remove-dislike",
        contentType: "video",
      });
    }

    if (data.positive === true) {
      newData.likes = likes + 1;
      newData.isLikedByUser = true;
      cmsSvc.addRating({
        id: videoData.id,
        action: "add-like",
        contentType: "video",
      });
      if (isDislikedByUser) {
        newData.dislikes = dislikes - 1;
        newData.isDislikedByUser = false;
        cmsSvc.addRating({
          id: videoData.id,
          action: "remove-dislike",
          contentType: "video",
        });
      }
    }

    if (data.positive === false) {
      newData.dislikes = dislikes + 1;
      newData.isDislikedByUser = true;
      cmsSvc.addRating({
        id: videoData.id,
        action: "add-dislike",
        contentType: "video",
      });
      if (isLikedByUser) {
        newData.likes = likes - 1;
        newData.isLikedByUser = false;
        cmsSvc.addRating({
          id: videoData.id,
          action: "remove-like",
          contentType: "video",
        });
      }
    }

    setContentRating(newData);

    return () => {
      setContentRating(prevData);
    };
  };

  const onError = (error, rollback) => {
    rollback();
    toast.error(error);
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["userContentRatings"] });
    queryClient.invalidateQueries({ queryKey: ["userContentEngagements"] });
  };

  const addContentRatingMutation = useAddContentRating(
    onMutate,
    onError,
    onSuccess
  );

  const handleAddRating = (action) => {
    if (isTmpUser) return;

    const isRemovingReaction =
      action === "remove-like" || action === "remove-dislike";

    // Track engagement
    if (isRemovingReaction) {
      // Remove like/dislike from engagement tracking
      removeContentEngagementMutation({
        contentId: videoData.id,
        contentType: "video",
      });
    } else {
      // Add like/dislike to engagement tracking
      addContentEngagementMutation({
        contentId: videoData.id,
        contentType: "video",
        action: action === "like" ? "like" : "dislike",
      });
    }

    // Update rating in the rating system
    addContentRatingMutation({
      contentId: videoData.id,
      positive: action === "like" ? true : isRemovingReaction ? null : false,
      contentType: "video",
    });
  };

  const handleOpenCookieBanner = () => {
    setCookieState({
      ...cookieState,
      isBannerOpen: true,
    });
  };

  const renderVideoEmbed = () => {
    if (!videoData || !videoData.videoId) return null;

    if (!DISPLAY_VIDEO) {
      return (
        <div className="video-view__cookie-banner">
          <p>{t("require_cookies")}</p>
          <Button
            onClick={handleOpenCookieBanner}
            color="purple"
            size="sm"
            label={t("cookie_preferences")}
          />
        </div>
      );
    }

    return (
      <div className="video-view__embed-container">
        <iframe
          src={
            videoData.originalUrl && videoData.originalUrl.includes("vimeo.com")
              ? `https://player.vimeo.com/video/${videoData.videoId}`
              : `https://www.youtube.com/embed/${videoData.videoId}`
          }
          title={videoData.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  };

  const url = constructShareUrl({
    contentType: "video",
    id: videoData.id,
    name: videoData.title,
  });

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
    if (!isShared) {
      cmsSvc.addVideoShareCount(videoData.id).then(() => {
        setIsShared(true);
      });

      // Track share engagement
      if (!isTmpUser) {
        addContentEngagementMutation({
          contentId: videoData.id,
          contentType: "video",
          action: "share",
        });
      }
    }
  };

  return (
    <Block classes="video-view">
      <Grid classes="video-view__main-grid">
        <GridItem md={8} lg={12} classes="video-view__title-item">
          <div className="video-view__title-item__container">
            <h3>{videoData.title}</h3>
            <ActionButton onClick={handleCopyLink} iconName="share" />
          </div>
        </GridItem>

        <GridItem md={8} lg={12} classes="video-view__details-item">
          {creator && <p className={"small-text"}>{t("by", { creator })}</p>}

          <div className="video-view__details-item__category">
            <p className="small-text ">{videoData.categoryName}</p>
          </div>
        </GridItem>

        <GridItem xs={3} md={6} lg={8} classes="video-view__labels-item">
          {videoData.labels &&
            videoData.labels.map((label, index) => {
              return (
                <Label
                  classes={"video-view__label"}
                  text={label.name}
                  key={index}
                />
              );
            })}
        </GridItem>

        <GridItem xs={1} md={2} lg={4} classes="video-view__like-item">
          <Like
            renderInClient
            handleClick={handleAddRating}
            likes={contentRating?.likes || 0}
            isLiked={contentRating?.isLikedByUser || false}
            dislikes={contentRating?.dislikes || 0}
            isDisliked={contentRating?.isDislikedByUser || false}
            answerId={videoData.id}
            isTmpUser={isTmpUser}
          />
        </GridItem>

        <GridItem md={8} lg={12} classes="video-view__embed-item">
          {renderVideoEmbed()}
        </GridItem>

        <GridItem md={8} lg={12} classes="video-view__description-item">
          <p className="video-view__description-text">
            {videoData.description}
          </p>
        </GridItem>
      </Grid>
    </Block>
  );
};

VideoView.propTypes = {
  /**
   * Video data
   * */
  videoData: propTypes.shape({
    title: propTypes.string,
    creator: propTypes.string,
    description: propTypes.string,
    videoId: propTypes.string,
    labels: propTypes.arrayOf(
      propTypes.shape({
        name: propTypes.string,
      })
    ),
  }).isRequired,
};

VideoView.defaultProps = {
  videoData: {
    labels: [],
    title: "",
    creator: "",
    description: "",
    videoId: "",
  },
};
