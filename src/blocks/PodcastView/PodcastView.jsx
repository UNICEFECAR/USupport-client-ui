import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
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
import { createArticleSlug } from "@USupport-components-library/utils";

import { useAddContentRating } from "#hooks";

import "./podcast-view.scss";

const countriesMap = {
  global: "global",
  kz: "kazakhstan",
  pl: "poland",
  ro: "romania",
};

const constructShareUrl = ({ contentType, id, name }) => {
  const country = localStorage.getItem("country");
  const language = localStorage.getItem("language");
  const subdomain = window.location.hostname.split(".")[0];
  const nameSlug = createArticleSlug(name);

  if (subdomain === "staging") {
    return `https://staging.usupport.online/${language}/information-portal/${contentType}/${id}/${nameSlug}`;
  }

  if (country === "global") {
    return `https://usupport.online/${language}/information-portal/${contentType}/${id}`;
  }
  const countryName = countriesMap[country.toLocaleLowerCase()];

  if (window.location.hostname.includes("staging")) {
    return `https://${countryName}.staging.usupport.online/${language}/information-portal/${contentType}/${id}`;
  }
  const url = `https://${countryName}.usupport.online/${language}/information-portal/${contentType}/${id}`;
  return url;
};

/**
 * PodcastView
 *
 * PodcastView block
 *
 * @return {jsx}
 */
export const PodcastView = ({ podcastData, t, language }) => {
  const queryClient = useQueryClient();
  const creator = podcastData.creator ? podcastData.creator : null;

  const { name } = useParams();

  const [isShared, setIsShared] = useState(false);
  const [contentRating, setContentRating] = useState(podcastData.contentRating);
  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [language]);

  useEffect(() => {
    if (podcastData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(podcastData.title);
      const urlSlug = name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/${language}/information-portal/article/${videoData.id}/${currentSlug}`;

        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [podcastData?.title, name, language, hasUpdatedUrl]);

  const url = constructShareUrl({
    contentType: "podcast",
    id: podcastData.id,
    name: podcastData.title,
  });

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
    if (!isShared)
      cmsSvc.addPodcastShareCount(podcastData.id).then(() => {
        setIsShared(true);
      });
  };

  useEffect(() => {
    setContentRating(podcastData.contentRating);
  }, [podcastData.contentRating]);

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
  };

  const addContentRatingMutation = useAddContentRating(
    onMutate,
    onError,
    onSuccess
  );

  const handleAddRating = (action) => {
    addContentRatingMutation({
      contentId: podcastData.id,
      positive:
        action === "like"
          ? true
          : action === "remove-like" || action === "remove-dislike"
          ? null
          : false,
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
