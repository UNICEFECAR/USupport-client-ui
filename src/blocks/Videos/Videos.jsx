import { useState, useEffect, useContext, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  InputSearch,
  Tabs,
  Loading,
} from "@USupport-components-library/src";
import {
  destructureVideoData,
  createArticleSlug,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import {
  useCustomNavigate as useNavigate,
  useDebounce,
  useGetUserContentRatings,
} from "#hooks";
import { RootContext } from "#routes";

import "./videos.scss";

/**
 * Videos
 *
 * Videos block
 *
 * @return {jsx}
 */
export const Videos = ({ showSearch, showCategories, sort }) => {
  const navigate = useNavigate();
  const { isTmpUser } = useContext(RootContext);

  const { i18n, t } = useTranslation("blocks", { keyPrefix: "videos" });
  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  const { data: contentRatings } = useGetUserContentRatings(!isTmpUser);

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

    // Update all categories to set the selected one
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
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

  //--------------------- Videos ----------------------//
  const getVideosIds = async () => {
    const videosIds = await adminSvc.getVideos();
    return videosIds;
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

  const getVideosData = async () => {
    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    let { data } = await cmsSvc.getVideos({
      limit: 50, // Get all videos instead of paginating
      contains: debouncedSearchValue,
      categoryId,
      sortBy: sort,
      sortOrder: sort ? "desc" : null,
      locale: usersLanguage,
      populate: true,
      ids: videoIdsQuery.data,
    });

    return data.data || [];
  };

  const {
    data: videos,
    isLoading: isVideosLoading,
    isFetching: isVideosFetching,
    isFetched: isVideosFetched,
    fetchStatus: videosFetchStatus,
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

  let areCategoriesReady = categoriesToShow?.length > 1;

  return (
    <Block classes="videos">
      <Grid classes="videos__main-grid">
        {showSearch && areCategoriesReady && (
          <GridItem md={8} lg={12} classes="videos__search-item">
            <InputSearch onChange={handleInputChange} value={searchValue} />
          </GridItem>
        )}

        {showCategories && areCategoriesReady && (
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

        <GridItem md={8} lg={12} classes="videos__videos-item">
          {videos?.length > 0 &&
            areCategoriesReady &&
            !isVideosLoading &&
            !isVideosFetching && (
              <Grid>
                {videos?.map((video, index) => {
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
                    <GridItem lg={6} key={index}>
                      <CardMedia
                        type="portrait"
                        size="lg"
                        style={{ gridColumn: "span 4" }}
                        title={videoData.title}
                        image={videoData.imageMedium || videoData.imageSmall}
                        description={videoData.description}
                        labels={videoData.labels}
                        categoryName={videoData.categoryName}
                        contentType="videos"
                        isLikedByUser={isLikedByUser}
                        isDislikedByUser={isDislikedByUser}
                        likes={videoData.likes}
                        dislikes={videoData.dislikes}
                        t={t}
                        onClick={() => {
                          navigate(
                            `/information-portal/video/${
                              videoData.id
                            }/${createArticleSlug(videoData.title)}`
                          );
                        }}
                      />
                    </GridItem>
                  );
                })}
              </Grid>
            )}
          {!videos?.length &&
            !isVideosLoading &&
            !isVideosFetching &&
            categoriesQuery?.data?.length > 0 && (
              <div className="videos__no-results-container">
                <p>{t("no_results")}</p>
              </div>
            )}
        </GridItem>
      </Grid>

      {isVideosFetching ||
      videoIdsQuery.isLoading ||
      videoIdsQuery.isFetching ? (
        <Loading />
      ) : null}

      {videoIdsQuery.isFetched &&
      (isVideosFetched || videosFetchStatus === "idle") &&
      !videos ? (
        <div className="videos__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
        </div>
      ) : null}
    </Block>
  );
};
