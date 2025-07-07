import React, { useState, useCallback, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import {
  Grid,
  GridItem,
  Block,
  TabsUnderlined,
  Loading,
  CardMedia,
} from "@USupport-components-library/src";

import { Page, GiveSuggestion } from "#blocks";
import {
  useCustomNavigate as useNavigate,
  useEventListener,
  useGetUserContentRatings,
} from "#hooks";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import {
  destructureArticleData,
  destructureVideoData,
  destructurePodcastData,
  ThemeContext,
} from "@USupport-components-library/utils";
import { mascotHappyPurple } from "@USupport-components-library/assets";

import "./information-portal.scss";

/**
 * InformationPortal
 *
 * Information Portal page
 *
 * @returns {JSX.Element}
 */
export const InformationPortal = () => {
  const { t, i18n } = useTranslation("information-portal");
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");

  const { isPodcastsActive, isVideosActive } = useContext(ThemeContext);

  if (
    (tab === "podcasts" && !isPodcastsActive) ||
    (tab === "videos" && !isVideosActive)
  ) {
    setSearchParams({ tab: "articles" });
  }

  const [contentTabs, setContentTabs] = useState([]);

  useEffect(() => {
    const initialTabs = [
      {
        label: "articles",
        value: "articles",
        isSelected: tab === "articles",
      },
    ];

    if (isVideosActive) {
      initialTabs.push({
        label: "videos",
        value: "videos",
        isSelected: tab === "videos",
      });
    }

    if (isPodcastsActive) {
      initialTabs.push({
        label: "podcasts",
        value: "podcasts",
        isSelected: tab === "podcasts",
      });
    }

    setContentTabs(initialTabs);
  }, [isPodcastsActive, isVideosActive]);

  const handleTabSelect = (index) => {
    const tabsCopy = [...contentTabs];
    tabsCopy.forEach((tab, i) => {
      tab.isSelected = i === index;
    });
    setContentTabs(tabsCopy);
    setSearchParams({ tab: tabsCopy[index].value });
  };

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  const contentRatingsQuery = useGetUserContentRatings();
  const { data: contentRatings } = contentRatingsQuery;

  //--------------------- Articles IDs ----------------------//
  const getArticlesIds = async () => {
    const articlesIds = await adminSvc.getArticles();
    return articlesIds;
  };

  const articleIdsQuery = useQuery(
    ["articleIds", currentCountry],
    getArticlesIds
  );

  //--------------------- Videos IDs ----------------------//
  const getVideosIds = async () => {
    const videosIds = await adminSvc.getVideos();
    return videosIds;
  };

  const videoIdsQuery = useQuery(["videoIds", currentCountry], getVideosIds);

  //--------------------- Podcasts IDs ----------------------//
  const getPodcastsIds = async () => {
    const podcastsIds = await adminSvc.getPodcasts();
    return podcastsIds;
  };

  const podcastIdsQuery = useQuery(
    ["podcastIds", currentCountry],
    getPodcastsIds
  );

  // Get the selected content type
  const selectedContentType =
    contentTabs.find((tab) => tab.isSelected)?.value || "articles";

  return (
    <Page classes="page__information-portal" showGoBackArrow={false}>
      <Grid classes="page__information-portal__banner">
        <GridItem
          xs={1}
          md={1}
          lg={1}
          classes="page__information-portal__mascot-item"
        >
          <img src={mascotHappyPurple} alt="Mascot" />
        </GridItem>
        <GridItem
          xs={3}
          md={7}
          lg={11}
          classes="page__information-portal__headings-item"
        >
          <h3>{t("heading")}</h3>
          <p className="subheading">{t("subheading")}</p>
        </GridItem>
      </Grid>

      <Block classes="page__information-portal__block">
        {contentTabs.length > 1 && (
          <Grid classes="page__information-portal__tabs-container">
            <GridItem md={8} lg={12}>
              <TabsUnderlined
                options={contentTabs.map((x) => ({
                  ...x,
                  label: t(x.label),
                }))}
                handleSelect={handleTabSelect}
                classes="page__information-portal__tabs"
              />
            </GridItem>
          </Grid>
        )}

        <Grid classes="page__information-portal__block__grid">
          <GridItem md={8} lg={12}>
            {selectedContentType === "articles" && (
              <>
                {articleIdsQuery.isLoading ? (
                  <Loading />
                ) : articleIdsQuery.data?.length === 0 ? (
                  <h4>{t("heading_no_language_results")}</h4>
                ) : (
                  <>
                    <ContentList
                      heading={t("heading_newest")}
                      sortBy="createdAt"
                      contentRatings={contentRatings}
                      contentIds={articleIdsQuery.data}
                      limit={2}
                      navigateToAllPath="/information-portal/articles"
                      contentType="article"
                      getContent={cmsSvc.getArticles}
                      destructureContentData={destructureArticleData}
                      getImage={(article) => article.imageMedium}
                      getRoute={(article) =>
                        `/information-portal/article/${article.id}`
                      }
                    />
                    <ContentList
                      heading={t("heading_popular")}
                      sortBy="read_count"
                      contentRatings={contentRatings}
                      contentIds={articleIdsQuery.data}
                      limit={2}
                      navigateToAllPath="/information-portal/articles"
                      contentType="article"
                      getContent={cmsSvc.getArticles}
                      destructureContentData={destructureArticleData}
                      getImage={(article) => article.imageMedium}
                      getRoute={(article) =>
                        `/information-portal/article/${article.id}`
                      }
                    />
                  </>
                )}
              </>
            )}

            {selectedContentType === "videos" && (
              <>
                {videoIdsQuery.isLoading ? (
                  <Loading />
                ) : videoIdsQuery.data?.length === 0 ? (
                  <h4>{t("heading_no_language_results")}</h4>
                ) : (
                  <>
                    <ContentList
                      heading={t("heading_newest_videos")}
                      sortBy="createdAt"
                      contentRatings={contentRatings}
                      contentIds={videoIdsQuery.data}
                      limit={2}
                      navigateToAllPath="/information-portal/videos"
                      contentType="video"
                      getContent={cmsSvc.getVideos}
                      destructureContentData={destructureVideoData}
                      getImage={(video) => video.image}
                      getRoute={(video) =>
                        `/information-portal/video/${video.id}`
                      }
                    />

                    <ContentList
                      heading={t("heading_popular_videos")}
                      sortBy="view_count"
                      contentRatings={contentRatings}
                      contentIds={videoIdsQuery.data}
                      limit={2}
                      navigateToAllPath="/information-portal/videos"
                      contentType="video"
                      getContent={cmsSvc.getVideos}
                      destructureContentData={destructureVideoData}
                      getImage={(video) => video.image}
                      getRoute={(video) =>
                        `/information-portal/video/${video.id}`
                      }
                    />
                  </>
                )}
              </>
            )}

            {selectedContentType === "podcasts" && (
              <>
                {podcastIdsQuery.isLoading ? (
                  <Loading />
                ) : podcastIdsQuery.data?.length === 0 ? (
                  <h4>{t("heading_no_language_results")}</h4>
                ) : (
                  <>
                    <ContentList
                      heading={t("heading_newest_podcasts")}
                      sortBy="createdAt"
                      contentRatings={contentRatings}
                      contentIds={podcastIdsQuery.data}
                      limit={2}
                      navigateToAllPath="/information-portal/podcasts"
                      contentType="podcast"
                      getContent={cmsSvc.getPodcasts}
                      destructureContentData={destructurePodcastData}
                      getImage={(podcast) => podcast.imageMedium}
                      getRoute={(podcast) =>
                        `/information-portal/podcast/${podcast.id}`
                      }
                    />

                    <ContentList
                      heading={t("heading_popular_podcasts")}
                      sortBy="view_count"
                      contentRatings={contentRatings}
                      contentIds={podcastIdsQuery.data}
                      limit={2}
                      navigateToAllPath="/information-portal/podcasts"
                      contentType="podcast"
                      getContent={cmsSvc.getPodcasts}
                      destructureContentData={destructurePodcastData}
                      getImage={(podcast) => podcast.imageMedium}
                      getRoute={(podcast) =>
                        `/information-portal/podcast/${podcast.id}`
                      }
                    />
                  </>
                )}
              </>
            )}
          </GridItem>

          <GridItem md={8} lg={12}>
            <GiveSuggestion />
          </GridItem>
        </Grid>
      </Block>
    </Page>
  );
};

const ContentList = ({
  heading,
  sortBy = "createdAt",
  contentRatings,
  contentIds,
  limit = 2,
  navigateToAllPath,
  contentType = "article", // or "video" or "podcast"
  getContent, // Function to fetch content
  destructureContentData, // Function to transform content data
  getImage, // Function to determine image
  getRoute, // Function to get navigation route
}) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation("information-portal");

  const fetchContent = async () => {
    let { data } = await getContent({
      limit,
      sortBy,
      sortOrder: "desc",
      locale: i18n.language,
      populate: true,
      ids: contentIds,
    });

    return data?.data?.map(destructureContentData) || [];
  };

  const {
    data: contentItems,
    isLoading,
    isFetched,
  } = useQuery(
    [`${contentType}-${sortBy}`, i18n.language, contentIds],
    fetchContent,
    {
      enabled: contentIds?.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  if (isLoading) return <Loading />;
  // if (isFetched && (!contentItems || contentItems.length === 0)) return null;

  const hasNoData = isFetched && (!contentItems || contentItems.length === 0);

  return (
    <Grid classes="page__information-portal__block__grid">
      <GridItem md={8} lg={12} classes="articles__articles-item">
        <Grid>
          <GridItem
            xs={2}
            md={4}
            lg={6}
            classes="page__information-portal__heading-item"
          >
            <h4>{heading}</h4>
          </GridItem>
          <GridItem
            xs={2}
            md={4}
            lg={6}
            classes="page__information-portal__view-more-item"
          >
            <p
              className="small-text view-all-button"
              onClick={() =>
                navigate(navigateToAllPath, {
                  state: { sort: sortBy },
                })
              }
            >
              {t("view_all")}
            </p>
          </GridItem>

          {hasNoData ? (
            <GridItem md={8} lg={12}>
              <p style={{ textAlign: "center", marginTop: "12px" }}>
                {t("no_results")}
              </p>
            </GridItem>
          ) : (
            contentItems.map((item, index) => {
              const isLikedByUser = contentRatings?.some(
                (rating) =>
                  rating.content_id === item.id &&
                  rating.content_type === contentType &&
                  rating.positive === true
              );
              const isDislikedByUser = contentRatings?.some(
                (rating) =>
                  rating.content_id === item.id &&
                  rating.content_type === contentType &&
                  rating.positive === false
              );

              return (
                <GridItem md={4} lg={6} key={index}>
                  <CardMedia
                    type="portrait"
                    size="lg"
                    style={{ gridColumn: "span 4" }}
                    title={item.title}
                    image={getImage(item)}
                    description={item.description}
                    labels={item.labels}
                    creator={item.creator}
                    readingTime={item.readingTime}
                    categoryName={item.categoryName}
                    contentType={contentType}
                    isLikedByUser={isLikedByUser}
                    isDislikedByUser={isDislikedByUser}
                    likes={item.likes}
                    dislikes={item.dislikes}
                    t={t}
                    onClick={() => navigate(getRoute(item))}
                  />
                </GridItem>
              );
            })
          )}
        </Grid>
      </GridItem>
    </Grid>
  );
};
