import React, { useState, useEffect, useContext, useMemo } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  InputSearch,
  Tabs,
  Loading,
  PodcastModal,
} from "@USupport-components-library/src";
import {
  destructurePodcastData,
  createArticleSlug,
  getLikesAndDislikesForContent,
  isLikedOrDislikedByUser,
  useWindowDimensions,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useDebounce, useGetUserContentEngagements } from "#hooks";
import { RootContext } from "#routes";

import "./podcasts.scss";

const getGridSpanForIndex = (index, pattern = [2, 3, 1]) => {
  const totalItemsInCycle = pattern.reduce((sum, count) => sum + count, 0);
  const cyclePosition = index % totalItemsInCycle;
  let currentPosition = 0;
  for (let i = 0; i < pattern.length; i++) {
    const itemsInThisRow = pattern[i];
    const columnsPerItem = 12 / itemsInThisRow;
    if (cyclePosition < currentPosition + itemsInThisRow) {
      return columnsPerItem;
    }
    currentPosition += itemsInThisRow;
  }
  return 4;
};

/**
 * Podcasts
 *
 * Podcasts block
 *
 * @param {Object} props
 * @param {boolean} props.showSearch - Whether to show internal search input
 * @param {boolean} props.showCategories - Whether to show categories
 * @param {string} props.sort - Sort option
 * @param {string} props.externalSearchValue - External search value from parent
 * @return {jsx}
 */
export const Podcasts = ({
  showSearch,
  showCategories,
  sort,
  externalSearchValue,
}) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "videos" });
  const { isTmpUser } = useContext(RootContext);
  const { width } = useWindowDimensions();
  const isNotDesktop = width < 1366;

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);
  const [podcastsLikes, setPodcastsLikes] = useState(new Map());
  const [podcastsDislikes, setPodcastsDislikes] = useState(new Map());
  const [podcastToPlay, setPodcastToPlay] = useState(null);

  const [podcasts, setPodcasts] = useState([]);
  const [numberOfPodcasts, setNumberOfPodcasts] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  const { data: contentEngagements } = useGetUserContentEngagements(!isTmpUser);

  //--------------------- Categories ----------------------//
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const getCategories = async () => {
    try {
      const res = await cmsSvc.getCategories(usersLanguage);
      let categoriesData = [
        { label: t("all"), value: "all", isSelected: true },
      ];
      res.data.map((category) =>
        categoriesData.push({
          label: category.attributes.name,
          value: category.attributes.name,
          id: category.id,
          isSelected: false,
        })
      );

      setSelectedCategory(categoriesData[0]);
      return categoriesData;
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const categoriesQuery = useQuery(
    ["podcasts-categories", usersLanguage],
    getCategories,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setCategories([...data]);
      },
    }
  );

  const handleCategoryOnPress = (index) => {
    const selectedCategoryFromFiltered = categoriesToShow[index];
    if (!selectedCategoryFromFiltered) return;

    const categoriesCopy = [...categories];
    for (let i = 0; i < categoriesCopy.length; i++) {
      categoriesCopy[i].isSelected =
        categoriesCopy[i].id === selectedCategoryFromFiltered.id;
    }
    setCategories(categoriesCopy);
    setSelectedCategory(selectedCategoryFromFiltered);
  };

  //--------------------- Search Input ----------------------//
  const [searchValue, setSearchValue] = useState("");
  const internalDebouncedSearchValue = useDebounce(searchValue, 500);

  const debouncedSearchValue =
    externalSearchValue !== undefined
      ? externalSearchValue
      : internalDebouncedSearchValue;

  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

  //--------------------- Podcast IDs ----------------------//
  const getPodcastsIds = async () => {
    return await adminSvc.getPodcasts();
  };

  const podcastIdsQuery = useQuery(["podcastIds"], getPodcastsIds);

  const { data: podcastCategoryIdsToShow } = useQuery(
    ["podcasts-category-ids", usersLanguage, podcastIdsQuery.data],
    () =>
      cmsSvc.getPodcastCategoryIds(
        usersLanguage,
        podcastIdsQuery.data?.length > 0 ? podcastIdsQuery.data : undefined
      ),
    {
      enabled: !!podcastIdsQuery.data?.length,
    }
  );

  const categoriesToShow = useMemo(() => {
    if (!categories || !podcastCategoryIdsToShow) return [];

    return categories.filter(
      (category) =>
        podcastCategoryIdsToShow.includes(category.id) ||
        category.value === "all"
    );
  }, [categories, podcastCategoryIdsToShow]);

  //--------------------- Newest Podcast ----------------------//
  const getNewestPodcast = async () => {
    const { data } = await cmsSvc.getPodcasts({
      limit: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
      locale: usersLanguage,
      populate: true,
      ids: podcastIdsQuery.data,
    });
    if (!data?.data?.[0]) return null;
    return await destructurePodcastData(data.data[0]);
  };

  const { data: newestPodcast, isLoading: isNewestPodcastLoading } = useQuery(
    ["newestPodcast", usersLanguage, podcastIdsQuery.data],
    getNewestPodcast,
    {
      enabled: !podcastIdsQuery.isLoading && podcastIdsQuery.data?.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  //--------------------- Podcasts List ----------------------//
  const getPodcastsData = async () => {
    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    const { data } = await cmsSvc.getPodcasts({
      limit: 6,
      contains: debouncedSearchValue,
      categoryId,
      sortBy: sort || undefined,
      sortOrder: sort ? "desc" : undefined,
      locale: usersLanguage,
      populate: true,
      ids: podcastIdsQuery.data,
    });

    const podcastsData = data.data || [];
    const total = data.meta?.pagination?.total || podcastsData.length;
    const processedPodcasts = await Promise.all(
      podcastsData.map((podcast) => destructurePodcastData(podcast))
    );
    setPodcasts(processedPodcasts);
    setNumberOfPodcasts(total);
    setHasMore(processedPodcasts.length < total);
    return processedPodcasts;
  };

  const {
    isLoading: isPodcastsLoading,
    isFetching: isPodcastsFetching,
    isFetched: isPodcastsFetched,
  } = useQuery(
    [
      "podcasts",
      debouncedSearchValue,
      selectedCategory,
      podcastIdsQuery.data,
      usersLanguage,
      sort,
    ],
    getPodcastsData,
    {
      enabled:
        !podcastIdsQuery.isLoading &&
        !categoriesQuery.isLoading &&
        categoriesQuery.data?.length > 0 &&
        podcastIdsQuery.data?.length > 0 &&
        selectedCategory !== null &&
        categoriesToShow?.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  const getMorePodcasts = async () => {
    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    const { data } = await cmsSvc.getPodcasts({
      startFrom: podcasts.length,
      limit: 6,
      contains: debouncedSearchValue,
      categoryId,
      sortBy: sort || undefined,
      sortOrder: sort ? "desc" : undefined,
      locale: usersLanguage,
      populate: true,
      ids: podcastIdsQuery.data,
    });

    const newData = data.data || [];
    const processedNewPodcasts = await Promise.all(
      newData.map((podcast) => destructurePodcastData(podcast))
    );
    const updatedLength = podcasts.length + processedNewPodcasts.length;
    setPodcasts((prev) => [...prev, ...processedNewPodcasts]);
    if (updatedLength >= numberOfPodcasts) {
      setHasMore(false);
    }
  };

  //--------------------- Likes & Dislikes ----------------------//
  useEffect(() => {
    async function getPodcastsRatings() {
      const allItems = [...(podcasts || [])];
      if (newestPodcast && !allItems.find((p) => p.id === newestPodcast.id)) {
        allItems.push(newestPodcast);
      }

      const podcastIds = allItems.reduce((acc, podcast) => {
        const id = podcast.id;
        if (!podcastsLikes.has(id) && !podcastsDislikes.has(id)) {
          acc.push(id);
        }
        return acc;
      }, []);

      if (!podcastIds.length) return;

      const { likes, dislikes } = await getLikesAndDislikesForContent(
        podcastIds,
        "podcast"
      );

      setPodcastsLikes((prev) => new Map([...prev, ...likes]));
      setPodcastsDislikes((prev) => new Map([...prev, ...dislikes]));
    }

    if (podcasts?.length || newestPodcast) {
      getPodcastsRatings();
    }
  }, [podcasts, newestPodcast, usersLanguage]);

  const handlePlay = (spotifyId, title) => {
    setPodcastToPlay({ spotifyId, title });
  };

  const areCategoriesReady = categoriesToShow?.length > 1;

  const hasPodcastsDifferentThanNewest =
    selectedCategory?.value !== "all"
      ? true
      : newestPodcast &&
        podcasts?.length > 0 &&
        podcasts.some((podcast) => podcast.id !== newestPodcast?.id);

  const newestPodcastLikeData = newestPodcast
    ? isLikedOrDislikedByUser({
        contentType: "podcast",
        contentData: newestPodcast,
        userEngagements: contentEngagements,
      })
    : { isLiked: false, isDisliked: false };

  return (
    <>
      {podcastToPlay && (
        <PodcastModal
          isOpen={!!podcastToPlay}
          onClose={() => setPodcastToPlay(null)}
          spotifyId={podcastToPlay.spotifyId}
          title={podcastToPlay.title}
          t={t}
        />
      )}

      <Block classes="podcasts">
        <Grid classes="podcasts__main-grid">
          {showSearch && areCategoriesReady && (
            <GridItem md={8} lg={12} classes="podcasts__search-item">
              <InputSearch onChange={handleInputChange} value={searchValue} />
            </GridItem>
          )}

          {(isNewestPodcastLoading || newestPodcast) && (
            <GridItem md={8} lg={12} classes="podcasts__most-important-item">
              {isNewestPodcastLoading ? (
                <Loading />
              ) : newestPodcast ? (
                <CardMedia
                  type={isNotDesktop ? "portrait" : "landscape"}
                  size="lg"
                  title={newestPodcast.title}
                  image={newestPodcast.imageMedium || newestPodcast.imageSmall}
                  description={newestPodcast.description}
                  labels={newestPodcast.labels}
                  creator={newestPodcast.creator}
                  categoryName={newestPodcast.categoryName}
                  contentType="podcasts"
                  showDescription={true}
                  isLikedByUser={newestPodcastLikeData.isLiked}
                  isDislikedByUser={newestPodcastLikeData.isDisliked}
                  likes={podcastsLikes.get(newestPodcast.id) || 0}
                  dislikes={podcastsDislikes.get(newestPodcast.id) || 0}
                  t={t}
                  onClick={() =>
                    navigate(
                      `/information-portal/podcast/${
                        newestPodcast.id
                      }/${createArticleSlug(newestPodcast.title)}`
                    )
                  }
                  handlePlay={() =>
                    handlePlay(newestPodcast.spotifyId, newestPodcast.title)
                  }
                />
              ) : null}
            </GridItem>
          )}

          {showCategories &&
            areCategoriesReady &&
            hasPodcastsDifferentThanNewest && (
              <GridItem md={8} lg={12} classes="podcasts__categories-item">
                {categoriesToShow && (
                  <Tabs
                    options={categoriesToShow}
                    handleSelect={handleCategoryOnPress}
                    t={t}
                  />
                )}
              </GridItem>
            )}

          {hasPodcastsDifferentThanNewest && (
            <GridItem md={8} lg={12} classes="podcasts__podcasts-item">
              <div style={{ position: "relative", minHeight: "20rem" }}>
                {isPodcastsFetching && podcasts?.length > 0 && (
                  <div className="podcasts__loader-overlay">
                    <Loading size="lg" />
                  </div>
                )}

                {podcasts?.length > 0 && !isPodcastsLoading && (
                  <InfiniteScroll
                    dataLength={podcasts.length}
                    next={getMorePodcasts}
                    hasMore={hasMore}
                    loader={<Loading size="lg" />}
                  >
                    <div className="podcasts__custom-grid">
                      {podcasts.map((podcast, index) => {
                        const gridSpan = getGridSpanForIndex(index, [2, 3, 1]);
                        const { isLiked, isDisliked } =
                          isLikedOrDislikedByUser({
                            contentType: "podcast",
                            contentData: podcast,
                            userEngagements: contentEngagements,
                          });

                        return (
                          <div
                            key={index}
                            className="podcasts__card-wrapper"
                            style={{ gridColumn: `span ${gridSpan}` }}
                          >
                            <CardMedia
                              type={
                                gridSpan === 12 && !isNotDesktop
                                  ? "landscape"
                                  : "portrait"
                              }
                              size={
                                gridSpan === 12 && !isNotDesktop ? "lg" : "sm"
                              }
                              title={podcast.title}
                              image={
                                podcast.imageMedium || podcast.imageSmall
                              }
                              description={podcast.description}
                              labels={podcast.labels}
                              creator={podcast.creator}
                              categoryName={podcast.categoryName}
                              contentType="podcasts"
                              isLikedByUser={isLiked}
                              isDislikedByUser={isDisliked}
                              likes={podcastsLikes.get(podcast.id) || 0}
                              dislikes={podcastsDislikes.get(podcast.id) || 0}
                              t={t}
                              onClick={() =>
                                navigate(
                                  `/information-portal/podcast/${
                                    podcast.id
                                  }/${createArticleSlug(podcast.title)}`
                                )
                              }
                              handlePlay={() =>
                                handlePlay(podcast.spotifyId, podcast.title)
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                )}

                {!podcasts?.length &&
                  !isPodcastsLoading &&
                  !isPodcastsFetching &&
                  isPodcastsFetched && (
                    <div className="podcasts__no-results-container">
                      <p>{t("no_results")}</p>
                    </div>
                  )}
              </div>
            </GridItem>
          )}
        </Grid>

        {(isPodcastsFetching ||
          podcastIdsQuery.isLoading ||
          podcastIdsQuery.isFetching) &&
        !podcasts?.length &&
        !newestPodcast ? (
          <Loading />
        ) : null}

        {podcastIdsQuery.isFetched &&
        isPodcastsFetched &&
        !podcasts?.length &&
        !newestPodcast &&
        !isPodcastsFetching ? (
          <div className="podcasts__no-results-container">
            <h3>{t("could_not_load_content")}</h3>
          </div>
        ) : null}
      </Block>
    </>
  );
};
