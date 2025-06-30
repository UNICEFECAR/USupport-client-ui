import React, { useState, useEffect, useCallback } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  TabsUnderlined,
  InputSearch,
  Tabs,
  Loading,
} from "@USupport-components-library/src";
import { destructureArticleData } from "@USupport-components-library/utils";
import { cmsSvc } from "@USupport-components-library/services";
import {
  useDebounce,
  useEventListener,
  useGetUserContentRatings,
  useRecommendedArticles,
} from "#hooks";

import "./articles.scss";

/**
 * Articles
 *
 * Articles block
 *
 * @return {jsx}
 */
export const Articles = ({ showSearch, showCategories, sort }) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("articles");

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  //--------------------- Age Groups ----------------------//
  const [ageGroups, setAgeGroups] = useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState();
  const [showAgeGroups, setShowAgeGroups] = useState(true);

  useEffect(() => {
    const country = localStorage.getItem("country");
    if (country === "PL") {
      setShowAgeGroups(false);
    }
  }, []);

  const { data: contentRatings } = useGetUserContentRatings();

  const getAgeGroups = async () => {
    try {
      const res = await cmsSvc.getAgeGroups(usersLanguage);
      const ageGroupsData = res.data.map((age, index) => ({
        label: age.attributes.name,
        id: age.id,
        isSelected: index === 0 ? true : false,
      }));
      setSelectedAgeGroup(ageGroupsData[0]);
      return ageGroupsData;
    } catch (err) {
      console.log(err);
    }
  };

  const ageGroupsQuery = useQuery(["ageGroups", usersLanguage], getAgeGroups, {
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    onSuccess: (data) => {
      setAgeGroups([...data]);
    },
  });

  const handleAgeGroupOnPress = (index) => {
    const ageGroupsCopy = [...ageGroups];

    for (let i = 0; i < ageGroupsCopy.length; i++) {
      if (i === index) {
        ageGroupsCopy[i].isSelected = true;
        setSelectedAgeGroup(ageGroupsCopy[i]);
      } else {
        ageGroupsCopy[i].isSelected = false;
      }
    }

    setAgeGroups(ageGroupsCopy);
  };

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
      console.log9err;
    }
  };

  const categoriesQuery = useQuery(
    ["articles-categories", usersLanguage],
    getCategories,
    {
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setCategories([...data]);
      },
    }
  );

  const handleCategoryOnPress = (index) => {
    const categoriesCopy = [...categories];

    for (let i = 0; i < categoriesCopy.length; i++) {
      if (i === index) {
        categoriesCopy[i].isSelected = true;
        setSelectedCategory(categoriesCopy[i]);
      } else {
        categoriesCopy[i].isSelected = false;
      }
    }
    setCategories(categoriesCopy);
  };

  //--------------------- Search Input ----------------------//
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleInputChange = (newValue) => {
    setSearchValue(newValue);
  };

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    const country = localStorage.getItem("country");
    if (country !== currentCountry) {
      setCurrentCountry(country);
    }
    setShowAgeGroups(country !== "PL");
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- Articles ----------------------//
  const {
    articles,
    loading: isArticlesLoading,
    hasMore,
    totalCount,
    categoriesData,
    remainingArticlesCount,
    readArticlesCount,
    categoryArticlesCount,
    loadMore,
    error,
    isReady,
    fetchingCategories,
    fetchingRemaining,
    hasMoreRemaining,
    hasMoreRead,
    readArticleIds,
  } = useRecommendedArticles({
    limit: 16,
    ageGroupId: selectedAgeGroup?.id,
    enabled: selectedAgeGroup?.id && !ageGroupsQuery.isLoading,
    categoryIdFilter: selectedCategory?.id || null,
    searchValue: debouncedSearchValue,
  });

  // Transform articles data to match expected format
  const transformedArticles = articles?.map((article) => {
    // If article already has direct properties, use them, otherwise use article.data
    return article.data ? article.data : article;
  });

  let areCategoriesAndAgeGroupsReady =
    categoriesQuery?.data?.length > 1 && ageGroupsQuery?.data?.length > 0;
  return (
    <Block classes="articles">
      {ageGroups?.length > 0 && categories?.length > 0 && (
        <InfiniteScroll
          dataLength={transformedArticles?.length || 0}
          next={loadMore}
          hasMore={hasMore}
          loader={<Loading />}
          // endMessage={} // Add end message here if required
        >
          <Grid classes="articles__main-grid">
            {showAgeGroups &&
              categoriesQuery?.data?.length > 1 &&
              ageGroupsQuery?.data?.length > 0 && (
                <GridItem md={8} lg={12} classes="articles__age-groups-item">
                  {ageGroups && (
                    <TabsUnderlined
                      options={ageGroups}
                      handleSelect={handleAgeGroupOnPress}
                    />
                  )}
                </GridItem>
              )}
            {showSearch && areCategoriesAndAgeGroupsReady && (
              <GridItem md={8} lg={12} classes="articles__search-item">
                <InputSearch onChange={handleInputChange} value={searchValue} />
              </GridItem>
            )}

            {showCategories && areCategoriesAndAgeGroupsReady && (
              <GridItem md={8} lg={12} classes="articles__categories-item">
                {categories && (
                  <Tabs
                    options={categories}
                    handleSelect={handleCategoryOnPress}
                    t={t}
                  />
                )}
              </GridItem>
            )}

            <GridItem md={8} lg={12} classes="articles__articles-item">
              {transformedArticles?.length > 0 &&
                areCategoriesAndAgeGroupsReady && (
                  <Grid>
                    {transformedArticles?.map((article, index) => {
                      const isLikedByUser = contentRatings?.some(
                        (rating) =>
                          rating.content_id === article.id &&
                          rating.content_type === "article" &&
                          rating.positive === true
                      );
                      const isDislikedByUser = contentRatings?.some(
                        (rating) =>
                          rating.content_id === article.id &&
                          rating.content_type === "article" &&
                          rating.positive === false
                      );
                      const articleData = destructureArticleData(article);
                      return (
                        <GridItem lg={6} key={index}>
                          <CardMedia
                            type="portrait"
                            size="lg"
                            style={{ gridColumn: "span 4" }}
                            title={articleData.title}
                            image={
                              articleData.imageMedium || articleData.imageSmall
                            }
                            description={articleData.description}
                            labels={articleData.labels}
                            creator={articleData.creator}
                            readingTime={articleData.readingTime}
                            categoryName={articleData.categoryName}
                            isLikedByUser={isLikedByUser}
                            isDislikedByUser={isDislikedByUser}
                            likes={articleData.likes}
                            dislikes={articleData.dislikes}
                            isRead={readArticleIds.includes(articleData.id)}
                            t={t}
                            onClick={() => {
                              navigate(
                                `/information-portal/article/${articleData.id}`
                              );
                            }}
                          />
                        </GridItem>
                      );
                    })}
                  </Grid>
                )}
              {!transformedArticles?.length &&
                isReady &&
                !isArticlesLoading &&
                categoriesQuery?.data?.length > 0 &&
                ageGroupsQuery?.data?.length > 0 && (
                  <div className="articles__no-results-container">
                    <p>{t("no_results")}</p>
                  </div>
                )}
            </GridItem>
          </Grid>
        </InfiniteScroll>
      )}

      {/* Only show loading on initial load when no articles exist */}
      {isArticlesLoading && !transformedArticles?.length && <Loading />}

      {error && (
        <div className="articles__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
          <p>{error.message}</p>
        </div>
      )}
    </Block>
  );
};
