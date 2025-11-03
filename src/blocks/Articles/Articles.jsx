import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  Grid,
  GridItem,
  Block,
  TabsUnderlined,
  InputSearch,
  Tabs,
  Loading,
  ArticlesGrid,
} from "@USupport-components-library/src";
import { createArticleSlug } from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import {
  useDebounce,
  useEventListener,
  useGetUserContentRatings,
  useRecommendedArticles,
} from "#hooks";
import { RootContext } from "#routes";

import "./articles.scss";

const PL_LANGUAGE_AGE_GROUP_IDS = {
  pl: 13,
  uk: 11,
};

/**
 * Articles
 *
 * Articles block
 *
 * @return {jsx}
 */
export const Articles = ({ showSearch, showCategories, sort }) => {
  const navigate = useNavigate();
  const { i18n, t } = useTranslation("blocks", { keyPrefix: "articles" });
  const { isTmpUser } = useContext(RootContext);

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

  // useEffect(() => {
  //   const country = localStorage.getItem("country");
  //   if (country === "PL") {
  //     setShowAgeGroups(false);
  //   }
  // }, []);

  const { data: contentRatings } = useGetUserContentRatings(!isTmpUser);

  const country = localStorage.getItem("country");
  const isPLCountry = country === "PL";
  const hardcodedAgeGroupId = isPLCountry
    ? PL_LANGUAGE_AGE_GROUP_IDS[usersLanguage]
    : null;
  const shouldUseHardcodedAgeGroup = typeof hardcodedAgeGroupId === "number";

  const getAgeGroups = async () => {
    if (shouldUseHardcodedAgeGroup) {
      const hardcodedAgeGroup = {
        label: "",
        id: hardcodedAgeGroupId,
        isSelected: true,
      };
      setSelectedAgeGroup(hardcodedAgeGroup);
      setAgeGroups([hardcodedAgeGroup]);
      setShowAgeGroups(false);
      return [hardcodedAgeGroup];
    }
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

  const ageGroupsQuery = useQuery(
    ["ageGroups", usersLanguage, hardcodedAgeGroupId],
    getAgeGroups,
    {
      enabled: showAgeGroups || shouldUseHardcodedAgeGroup,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      onSuccess: (data) => {
        setAgeGroups([...data]);
      },
    }
  );

  const handleAgeGroupOnPress = (index) => {
    const ageGroupsCopy = [...ageGroups];

    for (let i = 0; i < ageGroupsCopy.length; i++) {
      if (i === index) {
        if (!ageGroupsCopy[i].isSelected) {
          handleCategoryOnPress(0);
        }
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
      console.log(err);
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

  // -------------------- Guests ------------------------//

  const getArticlesIds = async () => {
    const articlesIds = await adminSvc.getArticles();

    return articlesIds;
  };

  const articleIdsQuery = useQuery(
    ["articleIds", currentCountry],
    getArticlesIds
  );

  const { data: articleCategoryIdsToShow } = useQuery(
    [
      "articles-category-ids",
      usersLanguage,
      selectedAgeGroup?.id,
      articleIdsQuery.data,
    ],
    () => {
      if (!selectedAgeGroup?.id) return [];
      return cmsSvc.getArticleCategoryIds(
        usersLanguage,
        selectedAgeGroup.id,
        articleIdsQuery.data?.length > 0 ? articleIdsQuery.data : undefined
      );
    },
    {
      enabled:
        !!selectedAgeGroup?.id &&
        !articleIdsQuery.isLoading &&
        !!articleIdsQuery.data?.length,
    }
  );

  const categoriesToShow = useMemo(() => {
    if (!categories || !articleCategoryIdsToShow) return [];

    return categories.filter(
      (category) =>
        articleCategoryIdsToShow.includes(category.id) ||
        category.value === "all"
    );
  }, [categories, articleCategoryIdsToShow]);

  const [hasMoreGuest, setHasMoreGuest] = useState(true);

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

  const [guestArticles, setArticles] = useState();
  const [numberOfArticles, setNumberOfArticles] = useState();
  const { isLoading: isGuestArticlesLoading, isFetched: isArticlesFetched } =
    useQuery(
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
    if (guestArticles) {
      setHasMoreGuest(numberOfArticles > guestArticles.length);
    }
  }, [guestArticles]);

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
      startFrom: guestArticles?.length,
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

  // -------------------- Normal clients ---------------//
  const availableCategories = useMemo(() => {
    return categoriesToShow.map((category) => category.id).filter((id) => !!id);
  }, [categoriesToShow]);

  const {
    articles,
    loading: isArticlesLoading,
    hasMore,
    loadMore,
    error,
    isReady,
    readArticleIds,
  } = useRecommendedArticles({
    limit: 16,
    ageGroupId: selectedAgeGroup?.id,
    enabled: isTmpUser
      ? false
      : selectedAgeGroup?.id && !ageGroupsQuery.isLoading,
    categoryIdFilter: selectedCategory?.id || null,
    searchValue: debouncedSearchValue,
    availableCategories,
  });

  const articlesToTransform = isTmpUser ? guestArticles : articles;

  // Transform articles data to match expected format and add user interaction data
  const transformedArticles = articlesToTransform?.map((article) => {
    // Get the base article data
    const baseArticle = article.data ? article.data : article;

    // Add user interaction data
    const isLikedByUser = contentRatings?.some(
      (rating) =>
        rating.content_id === baseArticle.id &&
        rating.content_type === "article" &&
        rating.positive === true
    );

    const isDislikedByUser = contentRatings?.some(
      (rating) =>
        rating.content_id === baseArticle.id &&
        rating.content_type === "article" &&
        rating.positive === false
    );

    return {
      ...baseArticle,
      isLikedByUser,
      isDislikedByUser,
      isRead: readArticleIds.includes(baseArticle.id),
    };
  });

  const handleArticleClick = (id, title) => {
    navigate(`/information-portal/article/${id}/${createArticleSlug(title)}`);
  };

  let areCategoriesAndAgeGroupsReady =
    categoriesToShow?.length > 1 && ageGroupsQuery?.data?.length > 0;

  return (
    <Block classes="articles">
      {ageGroups?.length > 0 && categories?.length > 0 && (
        <InfiniteScroll
          dataLength={transformedArticles?.length || 0}
          next={isTmpUser ? getMoreArticles : loadMore}
          hasMore={isTmpUser ? hasMoreGuest : hasMore}
          loader={<Loading />}
          // endMessage={} // Add end message here if required
        >
          <Grid classes="articles__main-grid">
            {showAgeGroups &&
              categoriesToShow?.length > 1 &&
              ageGroupsQuery?.data?.length > 0 && (
                <GridItem md={4} lg={6} classes="articles__age-groups-item">
                  {ageGroups && (
                    <div className="articles__age-groups-tabs__container">
                      <TabsUnderlined
                        options={ageGroups}
                        handleSelect={handleAgeGroupOnPress}
                        textType="h3"
                      />
                    </div>
                  )}
                </GridItem>
              )}
            {showSearch && areCategoriesAndAgeGroupsReady && (
              <GridItem md={4} lg={6} classes="articles__search-item">
                <InputSearch onChange={handleInputChange} value={searchValue} />
              </GridItem>
            )}

            {showCategories && areCategoriesAndAgeGroupsReady && (
              <GridItem md={8} lg={12} classes="articles__categories-item">
                {categoriesToShow && (
                  <Tabs
                    options={categoriesToShow}
                    handleSelect={handleCategoryOnPress}
                    t={t}
                  />
                )}
              </GridItem>
            )}

            {transformedArticles?.length > 0 &&
              areCategoriesAndAgeGroupsReady && (
                <ArticlesGrid
                  articles={transformedArticles}
                  onArticleClick={handleArticleClick}
                  t={t}
                  pattern={[2, 3, 1]}
                />
              )}

            {!transformedArticles?.length &&
              (isTmpUser ? isArticlesFetched : isReady) &&
              (isTmpUser ? !isGuestArticlesLoading : !isArticlesLoading) &&
              categoriesQuery?.data?.length > 0 &&
              ageGroupsQuery?.data?.length > 0 && (
                <GridItem md={8} lg={12} classes="articles__articles-item">
                  <div className="articles__no-results-container">
                    <p>{t("no_results")}</p>
                  </div>
                </GridItem>
              )}
          </Grid>
        </InfiniteScroll>
      )}

      {/* Only show loading on initial load when no articles exist */}
      {(isTmpUser ? isGuestArticlesLoading : isArticlesLoading) &&
        !transformedArticles?.length && <Loading />}

      {error && (
        <div className="articles__no-results-container">
          <h3>{t("could_not_load_content")}</h3>
          <p>{error.message}</p>
        </div>
      )}
    </Block>
  );
};
