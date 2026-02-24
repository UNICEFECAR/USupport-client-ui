import { useState, useEffect, useContext, useMemo } from "react";
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
  VideoModal,
} from "@USupport-components-library/src";
import {
  destructureVideoData,
  createArticleSlug,
  getLikesAndDislikesForContent,
  isLikedOrDislikedByUser,
  useWindowDimensions,
  ThemeContext,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import {
  useCustomNavigate as useNavigate,
  useDebounce,
  useGetUserContentEngagements,
} from "#hooks";
import { RootContext } from "#routes";

import "./videos.scss";

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
 * Videos
 *
 * Videos block
 *
 * @param {Object} props
 * @param {boolean} props.showSearch - Whether to show internal search input
 * @param {boolean} props.showCategories - Whether to show categories
 * @param {string} props.sort - Sort option
 * @param {string} props.externalSearchValue - External search value from parent
 * @return {jsx}
 */
export const Videos = ({
  showSearch,
  showCategories,
  sort,
  externalSearchValue,
}) => {
  const navigate = useNavigate();
  const { isTmpUser } = useContext(RootContext);
  const { width } = useWindowDimensions();
  const { cookieState, setCookieState } = useContext(ThemeContext);
  const isNotDesktop = width < 1366;

  const { i18n, t } = useTranslation("blocks", { keyPrefix: "videos" });
  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  const [videosLikes, setVideosLikes] = useState(new Map());
  const [videosDislikes, setVideosDislikes] = useState(new Map());
  const [videoToPlayUrl, setVideoToPlayUrl] = useState(null);

  const [videos, setVideos] = useState([]);
  const [numberOfVideos, setNumberOfVideos] = useState(0);
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
    ["videos-categories", usersLanguage],
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

  //--------------------- Video IDs ----------------------//
  const getVideosIds = async () => {
    return await adminSvc.getVideos();
  };

  const videoIdsQuery = useQuery(["videoIds"], getVideosIds);

  const { data: videoCategoryIdsToShow } = useQuery(
    ["videos-category-ids", usersLanguage, videoIdsQuery.data],
    () =>
      cmsSvc.getVideoCategoryIds(
        usersLanguage,
        videoIdsQuery.data?.length > 0 ? videoIdsQuery.data : undefined
      ),
    {
      enabled: !!videoIdsQuery.data?.length,
    }
  );

  const categoriesToShow = useMemo(() => {
    if (!categories || !videoCategoryIdsToShow) return [];

    return categories.filter(
      (category) =>
        videoCategoryIdsToShow.includes(category.id) || category.value === "all"
    );
  }, [categories, videoCategoryIdsToShow]);

  //--------------------- Newest Video ----------------------//
  const getNewestVideo = async () => {
    const { data } = await cmsSvc.getVideos({
      limit: 1,
      sortBy: "createdAt",
      sortOrder: "desc",
      locale: usersLanguage,
      populate: true,
      ids: videoIdsQuery.data,
    });
    if (!data?.data?.[0]) return null;
    return destructureVideoData(data.data[0]);
  };

  const { data: newestVideo, isLoading: isNewestVideoLoading } = useQuery(
    ["newestVideo", usersLanguage, videoIdsQuery.data],
    getNewestVideo,
    {
      enabled: !videoIdsQuery.isLoading && videoIdsQuery.data?.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  //--------------------- Videos List ----------------------//
  const getVideosData = async () => {
    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    const { data } = await cmsSvc.getVideos({
      limit: 6,
      contains: debouncedSearchValue,
      categoryId,
      sortBy: sort || undefined,
      sortOrder: sort ? "desc" : undefined,
      locale: usersLanguage,
      populate: true,
      ids: videoIdsQuery.data,
    });

    const videoData = data.data || [];
    const total = data.meta?.pagination?.total || videoData.length;
    setVideos(videoData);
    setNumberOfVideos(total);
    setHasMore(videoData.length < total);
    return videoData;
  };

  const {
    isLoading: isVideosLoading,
    isFetching: isVideosFetching,
    isFetched: isVideosFetched,
  } = useQuery(
    [
      "videos",
      debouncedSearchValue,
      selectedCategory,
      videoIdsQuery.data,
      usersLanguage,
      sort,
    ],
    getVideosData,
    {
      enabled:
        !videoIdsQuery.isLoading &&
        !categoriesQuery.isLoading &&
        categoriesQuery.data?.length > 0 &&
        videoIdsQuery.data?.length > 0 &&
        selectedCategory !== null &&
        categoriesToShow?.length > 0,
      refetchOnWindowFocus: false,
    }
  );

  const getMoreVideos = async () => {
    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    const { data } = await cmsSvc.getVideos({
      startFrom: videos.length,
      limit: 6,
      contains: debouncedSearchValue,
      categoryId,
      sortBy: sort || undefined,
      sortOrder: sort ? "desc" : undefined,
      locale: usersLanguage,
      populate: true,
      ids: videoIdsQuery.data,
    });

    const newVideos = data.data || [];
    const updatedLength = videos.length + newVideos.length;
    setVideos((prev) => [...prev, ...newVideos]);
    if (updatedLength >= numberOfVideos) {
      setHasMore(false);
    }
  };

  //--------------------- Likes & Dislikes ----------------------//
  useEffect(() => {
    async function getVideosRatings() {
      const allItems = [...(videos || [])];
      if (newestVideo && !allItems.find((v) => v.id === newestVideo.id)) {
        allItems.push(newestVideo);
      }

      const videoIds = allItems.reduce((acc, video) => {
        const id = video.id;
        if (!videosLikes.has(id) && !videosDislikes.has(id)) {
          acc.push(id);
        }
        return acc;
      }, []);

      if (!videoIds.length) return;

      const { likes, dislikes } = await getLikesAndDislikesForContent(
        videoIds,
        "video"
      );

      setVideosLikes((prev) => new Map([...prev, ...likes]));
      setVideosDislikes((prev) => new Map([...prev, ...dislikes]));
    }

    if (videos?.length || newestVideo) {
      getVideosRatings();
    }
  }, [videos, newestVideo, usersLanguage]);

  const handlePlay = (url) => {
    setVideoToPlayUrl(url);
  };

  const areCategoriesReady = categoriesToShow?.length > 1;

  const hasVideosDifferentThanNewest =
    selectedCategory?.value !== "all"
      ? true
      : newestVideo &&
        videos?.length > 0 &&
        videos.some((video) => video.id !== newestVideo?.id);

  const newestVideoLikeData = newestVideo
    ? isLikedOrDislikedByUser({
        contentType: "video",
        contentData: newestVideo,
        userEngagements: contentEngagements,
      })
    : { isLiked: false, isDisliked: false };

  return (
    <>
      {videoToPlayUrl && (
        <VideoModal
          isOpen={!!videoToPlayUrl}
          onClose={() => setVideoToPlayUrl(null)}
          videoUrl={videoToPlayUrl}
          cookieState={cookieState}
          setCookieState={setCookieState}
          t={t}
        />
      )}

      <Block classes="videos">
        <Grid classes="videos__main-grid">
          {showSearch && areCategoriesReady && (
            <GridItem md={8} lg={12} classes="videos__search-item">
              <InputSearch onChange={handleInputChange} value={searchValue} />
            </GridItem>
          )}

          {(isNewestVideoLoading || newestVideo) && (
            <GridItem md={8} lg={12} classes="videos__most-important-item">
              {isNewestVideoLoading ? (
                <Loading />
              ) : newestVideo ? (
                <CardMedia
                  type={isNotDesktop ? "portrait" : "landscape"}
                  size="lg"
                  title={newestVideo.title}
                  image={
                    newestVideo.image ||
                    newestVideo.imageMedium ||
                    newestVideo.imageSmall
                  }
                  description={newestVideo.description}
                  labels={newestVideo.labels}
                  creator={newestVideo.creator}
                  categoryName={newestVideo.categoryName}
                  contentType="videos"
                  showDescription={true}
                  isLikedByUser={newestVideoLikeData.isLiked}
                  isDislikedByUser={newestVideoLikeData.isDisliked}
                  likes={videosLikes.get(newestVideo.id) || 0}
                  dislikes={videosDislikes.get(newestVideo.id) || 0}
                  t={t}
                  onClick={() =>
                    navigate(
                      `/information-portal/video/${
                        newestVideo.id
                      }/${createArticleSlug(newestVideo.title)}`
                    )
                  }
                  handlePlay={() =>
                    handlePlay(newestVideo.originalUrl || newestVideo.url)
                  }
                />
              ) : null}
            </GridItem>
          )}

          {showCategories &&
            areCategoriesReady &&
            hasVideosDifferentThanNewest && (
              <GridItem md={8} lg={12} classes="videos__categories-item">
                {categoriesToShow && (
                  <Tabs
                    options={categoriesToShow}
                    handleSelect={handleCategoryOnPress}
                    t={t}
                  />
                )}
              </GridItem>
            )}

          {hasVideosDifferentThanNewest && (
            <GridItem md={8} lg={12} classes="videos__videos-item">
              <div style={{ position: "relative", minHeight: "20rem" }}>
                {isVideosFetching && videos?.length > 0 && (
                  <div className="videos__loader-overlay">
                    <Loading size="lg" />
                  </div>
                )}

                {videos?.length > 0 && !isVideosLoading && (
                  <InfiniteScroll
                    dataLength={videos.length}
                    next={getMoreVideos}
                    hasMore={hasMore}
                    loader={<Loading size="lg" />}
                  >
                    <div className="videos__custom-grid">
                      {videos.map((video, index) => {
                        const videoData = destructureVideoData(video);
                        const gridSpan = getGridSpanForIndex(index, [2, 3, 1]);
                        const { isLiked, isDisliked } =
                          isLikedOrDislikedByUser({
                            contentType: "video",
                            contentData: video,
                            userEngagements: contentEngagements,
                          });

                        return (
                          <div
                            key={index}
                            className="videos__card-wrapper"
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
                              title={videoData.title}
                              image={
                                videoData.image ||
                                videoData.imageMedium ||
                                videoData.imageSmall
                              }
                              description={videoData.description}
                              labels={videoData.labels}
                              categoryName={videoData.categoryName}
                              contentType="videos"
                              isLikedByUser={isLiked}
                              isDislikedByUser={isDisliked}
                              likes={videosLikes.get(videoData.id) || 0}
                              dislikes={videosDislikes.get(videoData.id) || 0}
                              t={t}
                              onClick={() =>
                                navigate(
                                  `/information-portal/video/${
                                    videoData.id
                                  }/${createArticleSlug(videoData.title)}`
                                )
                              }
                              handlePlay={() =>
                                handlePlay(
                                  videoData.originalUrl || videoData.url
                                )
                              }
                            />
                          </div>
                        );
                      })}
                    </div>
                  </InfiniteScroll>
                )}

                {!videos?.length &&
                  !isVideosLoading &&
                  !isVideosFetching &&
                  isVideosFetched && (
                    <div className="videos__no-results-container">
                      <p>{t("no_results")}</p>
                    </div>
                  )}
              </div>
            </GridItem>
          )}
        </Grid>

        {(isVideosFetching ||
          videoIdsQuery.isLoading ||
          videoIdsQuery.isFetching) &&
        !videos?.length &&
        !newestVideo ? (
          <Loading />
        ) : null}

        {videoIdsQuery.isFetched &&
        isVideosFetched &&
        !videos?.length &&
        !newestVideo &&
        !isVideosFetching ? (
          <div className="videos__no-results-container">
            <h3>{t("could_not_load_content")}</h3>
          </div>
        ) : null}
      </Block>
    </>
  );
};
