import React, { useState, useEffect, useContext, useMemo } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
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
  destructurePodcastData,
  createArticleSlug,
  getLikesAndDislikesForContent,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useDebounce, useGetUserContentEngagements } from "#hooks";
import { RootContext } from "#routes";

import "./podcasts.scss";

/**
 * Podcasts
 *
 * Podcasts block
 *
 * @return {jsx}
 */
export const Podcasts = ({ showSearch, showCategories, sort }) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "videos" });

  const { isTmpUser } = useContext(RootContext);

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);
  const [podcastsLikes, setPodcastsLikes] = useState(new Map());
  const [podcastsDislikes, setPodcastsDislikes] = useState(new Map());

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

  //--------------------- Podcasts ----------------------//
  const getPodcastsIds = async () => {
    const podcastsIds = await adminSvc.getPodcasts();

    return podcastsIds;
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

  const getPodcastsData = async () => {
    let categoryId = "";
    if (selectedCategory && selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    let { data } = await cmsSvc.getPodcasts({
      limit: 50, // Get all podcasts instead of paginating
      contains: debouncedSearchValue,
      categoryId,
      sortBy: sort,
      sortOrder: sort ? "desc" : null,
      locale: usersLanguage,
      populate: true,
      ids: podcastIdsQuery.data,
    });

    const podcastsData = data.data || [];
    // Process podcasts with async destructurePodcastData
    const processedPodcasts = await Promise.all(
      podcastsData.map((podcast) => destructurePodcastData(podcast))
    );
    return processedPodcasts;
  };

  const {
    data: podcasts,
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

  useEffect(() => {
    async function getPodcastsRatings() {
      const podcastIds = podcasts.reduce((acc, podcast) => {
        if (
          !podcastsLikes.has(podcast.id) &&
          !podcastsDislikes.has(podcast.id)
        ) {
          acc.push(podcast.id);
        }
        return acc;
      }, []);

      if (!podcastIds.length) return;

      const { likes, dislikes } = await getLikesAndDislikesForContent(
        podcastIds,
        "podcast"
      );

      setPodcastsLikes((prevLikes) => {
        return new Map([...prevLikes, ...likes]);
      });
      setPodcastsDislikes((prevDislikes) => {
        return new Map([...prevDislikes, ...dislikes]);
      });
    }

    getPodcastsRatings();
  }, [podcasts, usersLanguage]);

  let areCategoriesReady = categoriesToShow?.length > 1;

  return (
    <Block classes="podcasts">
      <Grid classes="podcasts__main-grid">
        {showSearch && areCategoriesReady && (
          <GridItem md={8} lg={12} classes="podcasts__search-item">
            <InputSearch onChange={handleInputChange} value={searchValue} />
          </GridItem>
        )}

        {showCategories && areCategoriesReady && (
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

        <GridItem md={8} lg={12} classes="podcasts__podcasts-item">
          {podcasts?.length > 0 &&
            areCategoriesReady &&
            !isPodcastsLoading &&
            !isPodcastsFetching && (
              <Grid>
                {podcasts?.map((podcast, index) => {
                  const { isLiked, isDisliked } = isLikedOrDislikedByUser({
                    contentType: "podcast",
                    contentData: podcast,
                    userEngagements: contentEngagements,
                  });

                  // Podcast data is already processed in getPodcastsData
                  const podcastData = podcast;
                  return (
                    <GridItem lg={6} key={index}>
                      <CardMedia
                        type="portrait"
                        size="sm"
                        title={podcastData.title}
                        image={
                          podcastData.imageMedium || podcastData.imageSmall
                        }
                        description={podcastData.description}
                        labels={podcastData.labels}
                        creator={podcastData.creator}
                        categoryName={podcastData.categoryName}
                        contentType="podcasts"
                        likes={podcastsLikes.get(podcastData.id) || 0}
                        dislikes={podcastsDislikes.get(podcastData.id) || 0}
                        isLikedByUser={isLiked}
                        isDislikedByUser={isDisliked}
                        t={t}
                        onClick={() =>
                          navigate(
                            `/information-portal/podcast/${
                              podcastData.id
                            }/${createArticleSlug(podcastData.title)}`
                          )
                        }
                      />
                    </GridItem>
                  );
                })}
              </Grid>
            )}

          {!podcasts?.length &&
            !isPodcastsLoading &&
            !isPodcastsFetching &&
            isPodcastsFetched && (
              <h3 className="podcasts__no-results">{t("no_results")}</h3>
            )}

          {(isPodcastsLoading || isPodcastsFetching) && <Loading size="lg" />}
        </GridItem>
      </Grid>
    </Block>
  );
};
