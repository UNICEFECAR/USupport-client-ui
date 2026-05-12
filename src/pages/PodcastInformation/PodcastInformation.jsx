import { useContext, useEffect, useRef } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  useCustomNavigate as useNavigate,
  useGetUserContentEngagements,
} from "#hooks";
import { Page, PodcastView } from "#blocks";
import { RootContext } from "#routes";

import {
  destructurePodcastData,
  ThemeContext,
  createArticleSlug,
  getLikesAndDislikesForContent,
  isLikedOrDislikedByUser,
} from "@USupport-components-library/utils";
import {
  Block,
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
  const { isTmpUser } = useContext(RootContext);
  const mainScrollRef = useRef(null);
  const sidebarScrollRef = useRef(null);
  const { i18n, t } = useTranslation("pages", {
    keyPrefix: "podcast-information-page",
  });

  const getPodcastsIds = async () => {
    const podcastIds = await adminSvc.getPodcasts();
    return podcastIds;
  };

  const {
    data: userContentEngagements,
    isLoading: isLoadingUserContentEngagements,
  } = useGetUserContentEngagements(!isTmpUser);
  const {
    data: podcastContentEngagements,
    isLoading: isLoadingPodcastContentEngagements,
  } = useQuery(["podcastContentEngagements", id], async () => {
    const { data } = await userSvc.getContentEngagementsById({
      contentType: "podcast",
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
  const podcastIdsQuery = useQuery(["podcastIds"], getPodcastsIds);

  const getPodcastData = async () => {
    const { data } = await cmsSvc.getPodcastById(id, i18n.language);
    const finalData = await destructurePodcastData(data);
    return finalData;
  };

  const {
    data: podcastData,
    isFetching: isFetchingPodcastData,
    isFetched,
  } = useQuery(["podcast", i18n.language, id], getPodcastData, {
    enabled: !!id,
    onSuccess: (data) => {
      if (data && data.categoryId && !isTmpUser) {
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

    let podcastsData = data.data || [];
    if (podcastsData.length === 0) {
      let { data: newest } = await cmsSvc.getPodcasts({
        limit: 3,
        sortBy: "createdAt",
        sortOrder: "desc",
        locale: i18n.language,
        excludeId: podcastData.id,
        populate: true,
        ids: podcastIdsQuery.data,
      });
      podcastsData = newest.data || [];
    }

    const podcastIds = podcastsData.map((podcast) => podcast.id);
    const { likes, dislikes } = await getLikesAndDislikesForContent(
      podcastIds,
      "podcast"
    );

    // Process podcasts with async destructurePodcastData
    const processedPodcasts = await Promise.all(
      podcastsData.map(async (podcast) => {
        const processedPodcast = await destructurePodcastData(podcast);
        return {
          ...processedPodcast,
          likes: likes.get(podcast.id) || 0,
          dislikes: dislikes.get(podcast.id) || 0,
        };
      })
    );
    return processedPodcasts;
  };

  const {
    data: morePodcasts,
    isLoading: isMorePodcastsLoading,
    isFetched: isMorePodcastsFetched,
    isFetching: isMorePodcastsFetching,
  } = useQuery(["more-podcasts", id, i18n.language], getSimilarPodcasts, {
    enabled:
      !isFetchingPodcastData &&
      !podcastIdsQuery.isLoading &&
      podcastIdsQuery.data?.length > 0 &&
      !!podcastData &&
      !!podcastData.categoryId,
  });

  useEffect(() => {
    const sidebarEl = sidebarScrollRef.current;
    const mainEl = mainScrollRef.current;

    if (!sidebarEl || !mainEl) {
      return;
    }

    const handleScroll = () => {
      const podcastHeight = mainEl.scrollHeight;
      const podcastTop = mainEl.offsetTop;
      const viewportHeight = window.innerHeight;

      const maxPodcastScroll =
        podcastHeight > viewportHeight ? podcastHeight - viewportHeight : 1;

      const currentPodcastScroll = window.scrollY - podcastTop;

      const ratio = Math.min(
        1,
        Math.max(0, currentPodcastScroll / (maxPodcastScroll || 1))
      );

      const sidebarScrollable = sidebarEl.scrollHeight - sidebarEl.clientHeight;

      if (sidebarScrollable <= 0) return;

      sidebarEl.scrollTop = ratio * sidebarScrollable;
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [podcastData, morePodcasts?.length]);

  const onPodcastClick = () => {
    window.scrollTo(0, 0);
  };

  const { isLiked, isDisliked } = isLikedOrDislikedByUser({
    contentType: "podcast",
    contentData: podcastData,
    userEngagements: userContentEngagements,
  });

  if (!isPodcastsActive) {
    return (
      <Navigate
        to={`/client/${localStorage.getItem(
          "language"
        )}/information-portal?tab=articles`}
      />
    );
  }

  const isLoading =
    isLoadingUserContentEngagements ||
    isLoadingPodcastContentEngagements ||
    isFetchingPodcastData;

  const renderSidebar = () => {
    if (!isMorePodcastsLoading && morePodcasts?.length > 0) {
      return (
        <aside
          className="page__podcast-information__sidebar"
          ref={sidebarScrollRef}
        >
          <h4 className="page__podcast-information__sidebar__heading">
            {t("more_podcasts")}
          </h4>
          {morePodcasts.map((podcast, index) => {
            const { isLiked, isDisliked } = isLikedOrDislikedByUser({
              contentType: "podcast",
              contentData: podcast,
              userEngagements: userContentEngagements,
            });
            const podcastData = podcast;

            return (
              <CardMedia
                key={index}
                type="portrait"
                size="sm"
                title={podcastData.title}
                image={podcastData.imageMedium || podcastData.imageSmall}
                description={podcastData.description}
                labels={podcastData.labels}
                creator={podcastData.creator}
                categoryName={podcastData.categoryName}
                contentType="podcasts"
                likes={podcastData.likes}
                dislikes={podcastData.dislikes}
                isLikedByUser={isLiked}
                isDislikedByUser={isDisliked}
                t={t}
                onClick={() => {
                  navigate(
                    `/information-portal/podcast/${
                      podcastData.id
                    }/${createArticleSlug(podcastData.title)}`
                  );
                  onPodcastClick();
                }}
              />
            );
          })}
        </aside>
      );
    }

    if (!morePodcasts && isMorePodcastsLoading && isMorePodcastsFetching) {
      return (
        <aside
          className="page__podcast-information__sidebar"
          ref={sidebarScrollRef}
        >
          <Loading size="lg" />
        </aside>
      );
    }

    return null;
  };

  return (
    <Page classes="page__podcast-information" darkBackground>
      <Block classes="page__podcast-information__block">
        <div className="page__podcast-information__layout">
          <div className="page__podcast-information__main" ref={mainScrollRef}>
            {!isLoading && podcastData ? (
              <PodcastView
                podcastData={{
                  ...podcastData,
                  likes: podcastContentEngagements?.likes || 0,
                  dislikes: podcastContentEngagements?.dislikes || 0,
                  contentRating: {
                    isLikedByUser: isLiked,
                    isDislikedByUser: isDisliked,
                  },
                }}
                t={t}
                language={i18n.language}
                isTmpUser={isTmpUser}
              />
            ) : isFetched && !isLoading ? (
              <h3 className="page__podcast-information__no-results">
                {t("not_found")}
              </h3>
            ) : (
              <Loading size="lg" />
            )}
          </div>
          {renderSidebar()}
        </div>

        {!morePodcasts?.length &&
          !isMorePodcastsLoading &&
          isMorePodcastsFetched && (
            <h3 className="page__podcast-information__no-results">
              {t("no_results")}
            </h3>
          )}
      </Block>
    </Page>
  );
};
