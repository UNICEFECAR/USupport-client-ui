import { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  useCustomNavigate as useNavigate,
  useGetUserContentEngagements,
} from "#hooks";
import { Page, VideoView } from "#blocks";
import { RootContext } from "#routes";

import {
  destructureVideoData,
  ThemeContext,
  createArticleSlug,
  getLikesAndDislikesForContent,
  isLikedOrDislikedByUser,
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
  const { isTmpUser } = useContext(RootContext);
  const { i18n, t } = useTranslation("pages", {
    keyPrefix: "video-information-page",
  });

  const { data: userContentEngagements } = useGetUserContentEngagements(
    !isTmpUser
  );

  const getVideosIds = async () => {
    // Request video ids from the master DB
    const videoIds = await adminSvc.getVideos();
    return videoIds;
  };

  const {
    data: videoContentEngagements,
    isLoading: isLoadingVideoContentEngagements,
  } = useQuery(["videoContentEngagements", id], async () => {
    console.log("Execute videoContentEngagements with id: ", id);
    const { data } = await userSvc.getContentEngagementsById({
      contentType: "video",
      ids: [id],
    });

    const { likes, dislikes } = data.reduce(
      (acc, engagement) => {
        if (engagement.action === "like") {
          acc.likes += 1;
        } else if (engagement.action === "dislike") {
          acc.dislikes += 1;
        }
        return acc;
      },
      { likes: 0, dislikes: 0 }
    );
    return { likes, dislikes };
  });
  const videoIdsQuery = useQuery(["videoIds"], getVideosIds);

  const getVideoData = async () => {
    const { data } = await cmsSvc.getVideoById(id, i18n.language);

    const finalData = destructureVideoData(data);
    return finalData;
  };

  const {
    data: videoData,
    isFetching: isFetchingVideoData,
    isFetched,
  } = useQuery(["video", i18n.language, id], getVideoData, {
    enabled: !!id,
    onSuccess: (data) => {
      if (data && data.categoryId && !isTmpUser) {
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

    let videos = data.data;

    if (videos.length === 0) {
      let { data: newest } = await cmsSvc.getVideos({
        limit: 3,
        sortBy: "createdAt",
        sortOrder: "desc",
        locale: i18n.language,
        excludeId: videoData.id,
        populate: true,
        ids: videoIdsQuery.data,
      });
      videos = newest.data;
    }

    const videoIds = videos.map((video) => video.id);
    const { likes, dislikes } = await getLikesAndDislikesForContent(
      videoIds,
      "video"
    );

    return videos.map((video) => ({
      ...video,
      likes: likes.get(video.id) || 0,
      dislikes: dislikes.get(video.id) || 0,
    }));
  };

  const {
    data: moreVideos,
    isLoading: isMoreVideosLoading,
    isFetched: isMoreVideosFetched,
    isFetching: isMoreVideosFetching,
    error,
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
  if (error) {
    console.log(error);
  }

  const onVideoClick = () => {
    window.scrollTo(0, 0);
  };

  const { isLiked, isDisliked } = isLikedOrDislikedByUser({
    contentType: "video",
    contentData: videoData,
    userEngagements: userContentEngagements,
  });

  // if (!isVideosActive) {
  //   return (
  //     <Navigate
  //       to={`/client/${localStorage.getItem(
  //         "language"
  //       )}/information-portal?tab=articles`}
  //     />
  //   );
  // }

  const isLoading = isLoadingVideoContentEngagements || isFetchingVideoData;

  return (
    <Page classes="page__video-information" showGoBackArrow={true}>
      {!isLoading && videoData ? (
        <VideoView
          videoData={{
            ...videoData,
            likes: videoContentEngagements?.likes || 0,
            dislikes: videoContentEngagements?.dislikes || 0,
            contentRating: {
              isLikedByUser: isLiked,
              isDislikedByUser: isDisliked,
            },
          }}
          t={t}
          lanugage={i18n.language}
          isTmpUser={isTmpUser}
        />
      ) : isFetched && !isLoading ? (
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
              const { isLiked, isDisliked } = isLikedOrDislikedByUser({
                contentType: "video",
                contentData: video,
                userEngagements: userContentEngagements,
              });
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
                    isLikedByUser={isLiked}
                    isDislikedByUser={isDisliked}
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
