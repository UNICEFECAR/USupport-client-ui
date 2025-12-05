import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import propTypes from "prop-types";

import {
  Block,
  Grid,
  GridItem,
  Label,
  Like,
  ActionButton,
} from "@USupport-components-library/src";
import { cmsSvc } from "@USupport-components-library/services";
import {
  createArticleSlug,
  constructShareUrl,
} from "@USupport-components-library/utils";

import {
  useAddContentRating,
  useAddContentEngagement,
  useRemoveContentEngagement,
} from "#hooks";

import "./podcast-view.scss";

/**
 * PodcastView
 *
 * PodcastView block
 *
 * @return {jsx}
 */
export const PodcastView = ({ podcastData, t, language, isTmpUser }) => {
  const queryClient = useQueryClient();
  const creator = podcastData.creator ? podcastData.creator : null;

  const { name } = useParams();

  const [isShared, setIsShared] = useState(false);
  const [contentRating, setContentRating] = useState({
    likes: podcastData.likes,
    dislikes: podcastData.dislikes,
    isLikedByUser: podcastData.contentRating?.isLikedByUser || false,
    isDislikedByUser: podcastData.contentRating?.isDislikedByUser || false,
  });
  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [language]);

  useEffect(() => {
    if (podcastData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(podcastData.title);
      const urlSlug = name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/client/${language}/information-portal/podcast/${podcastData.id}/${currentSlug}`;

        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [podcastData?.title, name, language, hasUpdatedUrl]);

  const addContentEngagementMutation = useAddContentEngagement();
  const removeContentEngagementMutation = useRemoveContentEngagement();

  // Track view when podcast is loaded using useQuery
  useQuery(
    ["podcast-view-tracking", podcastData.id],
    async () => {
      addContentEngagementMutation({
        contentId: podcastData.id,
        contentType: "podcast",
        action: "view",
      });
      return true;
    },
    {
      enabled: !!podcastData?.id && !isTmpUser,
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const url = constructShareUrl({
    contentType: "podcast",
    id: podcastData.id,
    name: podcastData.title,
  });

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
    if (!isShared) {
      cmsSvc.addPodcastShareCount(podcastData.id).then(() => {
        setIsShared(true);
      });

      // Track share engagement
      if (!isTmpUser) {
        addContentEngagementMutation({
          contentId: podcastData.id,
          contentType: "podcast",
          action: "share",
        });
      }
    }
  };

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
        id: podcastData.id,
        action: "remove-like",
        contentType: "podcast",
      });
    }
    if (isDislikedByUser && data.positive === null) {
      newData.dislikes = dislikes - 1;
      newData.isDislikedByUser = false;
      cmsSvc.addRating({
        id: podcastData.id,
        action: "remove-dislike",
        contentType: "podcast",
      });
    }

    if (data.positive === true) {
      newData.likes = likes + 1;
      newData.isLikedByUser = true;
      cmsSvc.addRating({
        id: podcastData.id,
        action: "add-like",
        contentType: "podcast",
      });
      if (isDislikedByUser) {
        newData.dislikes = dislikes - 1;
        newData.isDislikedByUser = false;
        cmsSvc.addRating({
          id: podcastData.id,
          action: "remove-dislike",
          contentType: "podcast",
        });
      }
    }

    if (data.positive === false) {
      newData.dislikes = dislikes + 1;
      newData.isDislikedByUser = true;
      cmsSvc.addRating({
        id: podcastData.id,
        action: "add-dislike",
        contentType: "podcast",
      });
      if (isLikedByUser) {
        newData.likes = likes - 1;
        newData.isLikedByUser = false;
        cmsSvc.addRating({
          id: podcastData.id,
          action: "remove-like",
          contentType: "podcast",
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

    if (isRemovingReaction) {
      // Remove like/dislike from engagement tracking
      removeContentEngagementMutation({
        contentId: podcastData.id,
        contentType: "podcast",
      });
    } else {
      // Add like/dislike to engagement tracking
      addContentEngagementMutation({
        contentId: podcastData.id,
        contentType: "podcast",
        action: action === "like" ? "like" : "dislike",
      });
    }

    addContentRatingMutation({
      contentId: podcastData.id,
      positive: action === "like" ? true : isRemovingReaction ? null : false,

      contentType: "podcast",
    });
  };

  return (
    <Block classes="podcast-view">
      <Grid classes="podcast-view__main-grid">
        <GridItem md={8} lg={12} classes="podcast-view__title-item">
          <div className="podcast-view__title-item__container">
            <h3>{podcastData.title}</h3>
            <ActionButton iconName="share" onClick={handleCopyLink} />
          </div>
        </GridItem>

        <GridItem md={8} lg={12} classes="podcast-view__details-item">
          {creator && <p className={"small-text"}>{t("by", { creator })}</p>}

          <div className="podcast-view__details-item__category">
            <p className="small-text ">{podcastData.categoryName}</p>
          </div>
        </GridItem>

        <GridItem xs={3} md={6} lg={8} classes="podcast-view__labels-item">
          {podcastData.labels &&
            podcastData.labels.map((label, index) => {
              return (
                <Label
                  classes={"podcast-view__label"}
                  text={label.name}
                  key={index}
                />
              );
            })}
        </GridItem>

        <GridItem xs={1} md={2} lg={4} classes="podcast-view__like-item">
          <Like
            renderInClient
            handleClick={handleAddRating}
            likes={contentRating?.likes || 0}
            isLiked={contentRating?.isLikedByUser || false}
            dislikes={contentRating?.dislikes || 0}
            isDisliked={contentRating?.isDislikedByUser || false}
            answerId={podcastData.id}
            isTmpUser={isTmpUser}
          />
        </GridItem>

        <GridItem md={8} lg={12} classes="podcast-view__player-item">
          <div className="podcast-view__player-container">
            <iframe
              src={`https://open.spotify.com/embed/${podcastData.spotifyId}`}
              width="100%"
              height="232"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Spotify Podcast Player"
            />
          </div>
        </GridItem>
        <GridItem md={8} lg={12} classes="podcast-view__description-item">
          <p className="podcast-view__description-text">
            {podcastData.description}
          </p>
        </GridItem>
      </Grid>
    </Block>
  );
};

PodcastView.propTypes = {
  podcastData: propTypes.object.isRequired,
  t: propTypes.func.isRequired,
};
