import { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  useCustomNavigate as useNavigate,
  useGetUserContentRatings,
} from "#hooks";
import { Page, VideoView } from "#blocks";

import {
  destructureVideoData,
  ThemeContext,
  createArticleSlug,
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

import "./video-information.scss";

/**
 * VideoInformation
 *
 * Video information
 *
 * @returns {JSX.Element}
 */
export const VideoInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isVideosActive } = useContext(ThemeContext);
  const { i18n, t } = useTranslation("video-information-page");

  const getVideosIds = async () => {
    // Request video ids from the master DB
    const videoIds = await adminSvc.getVideos();
    return videoIds;
  };

  const { data: contentRatings } = useGetUserContentRatings();
  const videoIdsQuery = useQuery(["videoIds"], getVideosIds);

  const getVideoData = async () => {
    const contentRatings = await userSvc.getRatingsForContent({
      contentType: "video",
      contentId: id,
    });

    const { data } = await cmsSvc.getVideoById(id, i18n.language);

    const finalData = destructureVideoData(data);
    finalData.contentRating = contentRatings.data;
    return finalData;
  };

  const {
    data: videoData,
    isFetching: isFetchingVideoData,
    isFetched,
  } = useQuery(["video", i18n.language, id], getVideoData, {
    enabled: !!id,
    onSuccess: (data) => {
      if (data && data.categoryId) {
        clientSvc
          .addClientCategoryInteraction({
            categoryId: data.categoryId,
            videoId: data.id,
            tagIds: data.labels.map((label) => label.id),
          })
          .catch((error) => {
            console.error("Failed to track category interaction:", error);
          });
      }
    },
  });

  const getSimilarVideos = async () => {
    let { data } = await cmsSvc.getVideos({
      limit: 3,
      categoryId: videoData.categoryId,
      locale: i18n.language,
      excludeId: videoData.id,
      populate: true,
      ids: videoIdsQuery.data,
    });

    if (data.length === 0) {
      let { data: newest } = await cmsSvc.getVideos({
        limit: 3,
        sortBy: "createdAt",
        sortOrder: "desc",
        locale: i18n.language,
        excludeId: videoData.id,
        populate: true,
        ids: videoIdsQuery.data,
      });
      return newest.data;
    }
    return data.data;
  };

  const {
    data: moreVideos,
    isLoading: isMoreVideosLoading,
    isFetched: isMoreVideosFetched,
    isFetching: isMoreVideosFetching,
  } = useQuery(["more-videos", id, i18n.language], getSimilarVideos, {
    enabled:
      !isFetchingVideoData &&
      !videoIdsQuery.isLoading &&
      videoIdsQuery.data?.length > 0 &&
      videoData &&
      videoData.categoryId
        ? true
        : false,
  });

  const onVideoClick = () => {
    window.scrollTo(0, 0);
  };

  if (!isVideosActive) {
    return (
      <Navigate
        to={`/client/${localStorage.getItem(
          "language"
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page classes="page__video-information" showGoBackArrow={true}>
      {videoData ? (
        <VideoView videoData={videoData} t={t} lanugage={i18n.language} />
      ) : isFetched ? (
        <h3 className="page__video-information__no-results">
          {t("not_found")}
        </h3>
      ) : (
        <Loading size="lg" />
      )}

      {!isMoreVideosLoading && moreVideos && moreVideos.length > 0 && (
        <Block classes="page__video-information__more-videos">
          <Grid classes="page__video-information__more-videos__main-grid">
            <GridItem md={8} lg={12} classes="more-videos__heading-item">
              <h4>{t("more_videos")}</h4>
            </GridItem>
            {moreVideos.map((video, index) => {
              const isLikedByUser = contentRatings?.some(
                (rating) =>
                  rating.content_id === video.id &&
                  rating.content_type === "video" &&
                  rating.positive === true
              );
              const isDislikedByUser = contentRatings?.some(
                (rating) =>
                  rating.content_id === video.id &&
                  rating.content_type === "video" &&
                  rating.positive === false
              );
              const videoData = destructureVideoData(video);

              return (
                <GridItem
                  classes="page__video-information__more-videos-card"
                  key={index}
                >
                  <CardMedia
                    type="portrait"
                    size="sm"
                    style={{ gridColumn: "span 4" }}
                    title={videoData.title}
                    image={videoData.imageMedium || videoData.imageSmall}
                    description={videoData.description}
                    labels={videoData.labels}
                    creator={videoData.creator}
                    categoryName={videoData.categoryName}
                    likes={videoData.likes}
                    dislikes={videoData.dislikes}
                    isLikedByUser={isLikedByUser}
                    isDislikedByUser={isDislikedByUser}
                    t={t}
                    onClick={() => {
                      navigate(
                        `/information-portal/video/${
                          videoData.id
                        }/${createArticleSlug(videoData.title)}`
                      );
                      onVideoClick();
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
