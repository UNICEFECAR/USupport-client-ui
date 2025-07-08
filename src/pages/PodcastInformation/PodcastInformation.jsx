import { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  useCustomNavigate as useNavigate,
  useGetUserContentRatings,
} from "#hooks";
import { Page, PodcastView } from "#blocks";

import {
  destructurePodcastData,
  ThemeContext,
} from "@USupport-components-library/utils";
import {
  Block,
  Grid,
  GridItem,
  CardMedia,
  Loading,
} from "@USupport-components-library/src";

import {
  userSvc,
  cmsSvc,
  adminSvc,
  clientSvc,
} from "@USupport-components-library/services";

import "./podcast-information.scss";

/**
 * PodcastInformation
 *
 * Podcast information
 *
 * @returns {JSX.Element}
 */
export const PodcastInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isPodcastsActive } = useContext(ThemeContext);

  const { i18n, t } = useTranslation("podcast-information-page");

  const getPodcastsIds = async () => {
    const podcastIds = await adminSvc.getPodcasts();
    return podcastIds;
  };

  const { data: contentRatings } = useGetUserContentRatings();
  const podcastIdsQuery = useQuery(["podcastIds"], getPodcastsIds);

  const getPodcastData = async () => {
    const contentRatings = await userSvc.getRatingsForContent({
      contentType: "podcast",
      contentId: id,
    });

    const { data } = await cmsSvc.getPodcastById(id, i18n.language);
    const finalData = destructurePodcastData(data);
    finalData.contentRating = contentRatings.data;
    return finalData;
  };

  const {
    data: podcastData,
    isFetching: isFetchingPodcastData,
    isFetched,
  } = useQuery(["podcast", i18n.language, id], getPodcastData, {
    enabled: !!id,
    onSuccess: (data) => {
      if (data && data.categoryId) {
        clientSvc
          .addClientCategoryInteraction({
            categoryId: data.categoryId,
            podcastId: data.id,
            tagIds: data.labels.map((label) => label.id),
          })
          .catch((error) => {
            console.error("Failed to track category interaction:", error);
          });
      }
    },
  });

  const getSimilarPodcasts = async () => {
    let { data } = await cmsSvc.getPodcasts({
      limit: 3,
      categoryId: podcastData.categoryId,
      locale: i18n.language,
      excludeId: podcastData.id,
      populate: true,
      ids: podcastIdsQuery.data,
    });

    if (data.length === 0) {
      let { data: newest } = await cmsSvc.getPodcasts({
        limit: 3,
        sortBy: "createdAt",
        sortOrder: "desc",
        locale: i18n.language,
        excludeId: podcastData.id,
        populate: true,
        ids: podcastIdsQuery.data,
      });
      return newest.data;
    }
    return data.data;
  };

  const { data: morePodcasts, isLoading: isMorePodcastsLoading } = useQuery(
    ["more-podcasts", id, i18n.language],
    getSimilarPodcasts,
    {
      enabled:
        !isFetchingPodcastData &&
        !podcastIdsQuery.isLoading &&
        podcastIdsQuery.data?.length > 0 &&
        podcastData &&
        podcastData.categoryId
          ? true
          : false,
    }
  );

  const onPodcastClick = () => {
    window.scrollTo(0, 0);
  };

  if (!isPodcastsActive) {
    return (
      <Navigate
        to={`/client/${localStorage.getItem(
          "language"
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page classes="page__podcast-information" showGoBackArrow={true}>
      {podcastData ? (
        <PodcastView podcastData={podcastData} t={t} />
      ) : isFetched ? (
        <h3 className="page__podcast-information__no-results">
          {t("not_found")}
        </h3>
      ) : (
        <Loading size="lg" />
      )}

      {!isMorePodcastsLoading && morePodcasts && morePodcasts.length > 0 && (
        <Block classes="page__podcast-information__more-podcasts">
          <Grid classes="page__podcast-information__more-podcasts__main-grid">
            <GridItem md={8} lg={12} classes="more-podcasts__heading-item">
              <h4>{t("more_podcasts")}</h4>
            </GridItem>
            {morePodcasts.map((podcast, index) => {
              const isLikedByUser = contentRatings?.some(
                (rating) =>
                  rating.content_id === podcast.id &&
                  rating.content_type === "podcast" &&
                  rating.positive === true
              );
              const isDislikedByUser = contentRatings?.some(
                (rating) =>
                  rating.content_id === podcast.id &&
                  rating.content_type === "podcast" &&
                  rating.positive === false
              );
              const podcastData = destructurePodcastData(podcast);

              return (
                <GridItem
                  classes="page__podcast-information__more-podcasts-card"
                  key={index}
                >
                  <CardMedia
                    type="portrait"
                    size="sm"
                    style={{ gridColumn: "span 4" }}
                    title={podcastData.title}
                    image={podcastData.imageMedium || podcastData.imageSmall}
                    description={podcastData.description}
                    labels={podcastData.labels}
                    creator={podcastData.creator}
                    categoryName={podcastData.categoryName}
                    contentType="podcasts"
                    likes={podcastData.likes}
                    dislikes={podcastData.dislikes}
                    isLikedByUser={isLikedByUser}
                    isDislikedByUser={isDislikedByUser}
                    t={t}
                    onClick={() => {
                      navigate(`/information-portal/podcast/${podcastData.id}`);
                      onPodcastClick();
                    }}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </Block>
      )}
    </Page>
  );
};
