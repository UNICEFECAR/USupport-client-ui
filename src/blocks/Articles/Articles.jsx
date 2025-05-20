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
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import {
  useDebounce,
  useEventListener,
  useGetUserContentRatings,
} from "#hooks";

import "./articles.scss";

/**
 * Articles
 *
 * Articles block
 *
 * @return {jsx}
 */
export const Articles = ({
  showSearch,
  showCategories,
  // showAgeGroups = true,
  sort,
}) => {
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
  const getArticlesIds = async () => {
    const articlesIds = await adminSvc.getArticles();

    return articlesIds;
  };

  const articleIdsQuery = useQuery(
    ["articleIds", currentCountry],
    getArticlesIds
  );

  const [hasMore, setHasMore] = useState(true);

  const getArticlesData = async () => {
    const ageGroupId = ageGroupsQuery.data.find((x) => x.isSelected).id;

    let categoryId = "";
    if (selectedCategory.value !== "all") {
      categoryId = selectedCategory.id;
    }

    let { data } = await cmsSvc.getArticles({
      limit: 6,
      contains: debouncedSearchValue,
      ageGroupId,
      categoryId,
      // sortBy: sort ? sort : "createdAt",
      // sortOrder: sort ? "desc" : "desc",
      locale: usersLanguage,
      populate: true,
      ids: articleIdsQuery.data,
    });

    const articles = data.data;
    const numberOfArticles = data.meta.pagination.total;

    return { articles, numberOfArticles };
  };

  const [articles, setArticles] = useState();
  const [numberOfArticles, setNumberOfArticles] = useState();
  const {
    isLoading: isArticlesLoading,
    isFetching: isArticlesFetching,
    isFetched: isArticlesFetched,
    fetchStatus: articlesFetchStatus,
    data: articlesQueryData,
  } = useQuery(
    [
      "articles",
      debouncedSearchValue,
      selectedAgeGroup,
      selectedCategory,
      articleIdsQuery.data,
      usersLanguage,
    ],
    getArticlesData,
    {
      enabled:
        !articleIdsQuery.isLoading &&
        !ageGroupsQuery.isLoading &&
        !categoriesQuery.isLoading &&
        categoriesQuery.data?.length > 0 &&
        ageGroupsQuery.data?.length > 0 &&
        articleIdsQuery.data?.length > 0 &&
        selectedCategory !== null &&
        selectedAgeGroup !== null,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setArticles([...data.articles]);
        setNumberOfArticles(data.numberOfArticles);
      },
    }
  );

  useEffect(() => {
    if (articles) {
      setHasMore(numberOfArticles > articles.length);
    }
  }, [articles]);

  const getMoreArticles = async () => {
    let ageGroupId = "";
    if (ageGroups) {
      let selectedAgeGroup = ageGroups.find((o) => o.isSelected === true);
      ageGroupId = selectedAgeGroup.id;
    }

    let categoryId = null;
    if (categories) {
      let selectedCategory = categories.find((o) => o.isSelected === true);
      categoryId = selectedCategory.id;
    }

    const { data } = await cmsSvc.getArticles({
      startFrom: articles?.length,
      limit: 6,
      contains: searchValue,
      ageGroupId: ageGroupId,
      categoryId,
      locale: usersLanguage,
      sortBy: sort,
      sortOrder: sort ? "desc" : null,
      populate: true,
      ids: articleIdsQuery.data,
    });

    const newArticles = data.data;

    setArticles((prevArticles) => [...(prevArticles || []), ...newArticles]);
  };

  let areCategoriesAndAgeGroupsReady =
    categoriesQuery?.data?.length > 1 && ageGroupsQuery?.data?.length > 0;

  return (
    <Block classes="articles">
      {ageGroups?.length > 0 && categories?.length > 0 && (
        <InfiniteScroll
          dataLength={articles?.length || 0}
          next={getMoreArticles}
          hasMore={hasMore}
          loader={<Loading />}
          // endMessage={} // Add end message here if required
        >
          <Grid classes="articles__main-grid">
            {showAgeGroups &&
              categoriesQuery?.data?.length > 1 &&
              ageGroupsQuery?.data?.length > 0 && (
                <GridItem md={8} lg={8} classes="articles__age-groups-item">
                  {ageGroups && (
                    <TabsUnderlined
                      options={ageGroups}
                      handleSelect={handleAgeGroupOnPress}
                    />
                  )}
                </GridItem>
              )}
            {showSearch && areCategoriesAndAgeGroupsReady && (
              <GridItem
                md={8}
                lg={showAgeGroups ? 4 : 12}
                classes="articles__search-item"
              >
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
              {articles?.length > 0 &&
                areCategoriesAndAgeGroupsReady &&
                !isArticlesLoading &&
                !isArticlesFetching && (
                  <Grid>
                    {articles?.map((article, index) => {
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
                            image={articleData.imageMedium}
                            description={articleData.description}
                            labels={articleData.labels}
                            creator={articleData.creator}
                            readingTime={articleData.readingTime}
                            categoryName={articleData.categoryName}
                            isLikedByUser={isLikedByUser}
                            isDislikedByUser={isDislikedByUser}
                            likes={articleData.likes}
                            dislikes={articleData.dislikes}
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
              {!articles?.length &&
                !isArticlesLoading &&
                !isArticlesFetching &&
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

      {isArticlesFetching ||
      articleIdsQuery.isLoading ||
      articleIdsQuery.isFetching ? (
        <Loading />
      ) : null}

      {(articleIdsQuery.isFetched &&
        (isArticlesFetched || articlesFetchStatus === "idle") &&
        !articlesQueryData?.articles &&
        !articlesQueryData) ||
      ((isArticlesFetched || articlesFetchStatus === "idle") &&
        !articleIdsQuery.isFetching &&
        (!articlesQueryData ||
          !articlesQueryData.articles ||
          articlesQueryData.articles.length === 0)) ? (
        <div className="articles__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
        </div>
      ) : null}
    </Block>
  );
};
