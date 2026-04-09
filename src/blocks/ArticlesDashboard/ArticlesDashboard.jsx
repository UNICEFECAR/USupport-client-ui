import React, { useState, useEffect, useContext, useMemo } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  Loading,
  Tabs,
  TabsUnderlined,
  NewButton,
} from "@USupport-components-library/src";
import {
  destructureArticleData,
  createArticleSlug,
  getLikesAndDislikesForContent,
  isLikedOrDislikedByUser,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import { useGetUserContentEngagements, useRecommendedArticles } from "#hooks";
import { RootContext } from "#routes";

import "./articles-dashboard.scss";

const PL_LANGUAGE_AGE_GROUP_IDS = {
  pl: 13,
  uk: 11,
};

/**
 * ArticlesDashboard
 *
 * ArticlesDashboard Block
 *
 * @return {jsx}
 */
export const ArticlesDashboard = () => {
  const navigate = useNavigate();

  const { isTmpUser } = useContext(RootContext);
  const country = localStorage.getItem("country");

  // const showAgreGroups = true;
  const showAgreGroups = country !== "PL";

  const { t, i18n } = useTranslation("blocks", {
    keyPrefix: "articles-dashboard",
  });

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);
  const [articlesLikes, setArticlesLikes] = useState(new Map());
  const [articlesDislikes, setArticlesDislikes] = useState(new Map());
  const [articleIdsForRatings, setArticleIdsForRatings] = useState([]);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  //--------------------- Categories ----------------------//
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const { data: contentEngagements } = useGetUserContentEngagements(!isTmpUser);

  //--------------------- Age Groups ----------------------//
  const [ageGroups, setAgeGroups] = useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState();

  const selectedAgeGroupId = selectedAgeGroup?.id;

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
      return [hardcodedAgeGroup];
    }

    try {
      const res = await cmsSvc.getAgeGroups(usersLanguage);
      const ageGroupsData = res.data.map((age, index) => ({
        label: age.attributes.name,
        id: age.id,
        isSelected: index === 1 ? true : false,
      }));
      setSelectedAgeGroup(ageGroupsData[1]);
      return ageGroupsData;
    } catch {
      console.log("Error when calling getAgeGroups");
    }
  };

  const ageGroupsQuery = useQuery(
    ["ageGroups", usersLanguage, hardcodedAgeGroupId],
    getAgeGroups,
    {
      enabled: showAgreGroups || shouldUseHardcodedAgeGroup,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      onSuccess: (data) => {
        setAgeGroups([...data]);
      },
    },
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
        }),
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
    },
  );

  //--------------------- Articles ----------------------//

  useQuery({
    queryKey: ["articles-ratings", usersLanguage, articleIdsForRatings],
    queryFn: async () => {
      const { likes, dislikes } = await getLikesAndDislikesForContent(
        articleIdsForRatings,
        "article",
      );

      setArticlesLikes(likes);
      setArticlesDislikes(dislikes);

      return true;
    },
    enabled: articleIdsForRatings.length > 0,
  });

  const getArticlesIds = async () => {
    // Request articles ids from the master DB based for website platform
    const articlesIds = await adminSvc.getArticles();
    if (usersLanguage === "en") {
      setArticleIdsForRatings(articlesIds);
    }
    console.log(articlesIds, "articlesIds");
    return articlesIds;
  };

  const articleIdsQuerry = useQuery(
    ["articleIds", selectedAgeGroupId],
    getArticlesIds,
  );

  const { data: articleCategoryIdsToShow } = useQuery(
    [
      "articles-category-ids",
      usersLanguage,
      articleIdsQuerry.data,
      selectedAgeGroupId,
    ],
    () =>
      cmsSvc.getArticleCategoryIds(
        usersLanguage,
        selectedAgeGroupId,
        articleIdsQuerry.data,
      ),
    {
      enabled: !!articleIdsQuerry.data,
    },
  );

  const categoriesToShow = useMemo(() => {
    if (
      !categories ||
      !articleCategoryIdsToShow ||
      !articleIdsQuerry.data?.length
    )
      return [
        {
          label: t("all"),
          value: "all",
          isSelected: true,
        },
      ];

    const filtered = categories.filter(
      (category) =>
        articleCategoryIdsToShow.includes(category.id) ||
        category.value === "all",
    );

    return filtered;
  }, [categories, articleCategoryIdsToShow, articleIdsQuerry.data]);

  const handleCategoryOnPress = (index) => {
    const categoriesCopy = [...categories];

    const clicked = categoriesToShow[index];

    for (let i = 0; i < categoriesCopy.length; i++) {
      const cat = categoriesCopy[i];
      if (cat.id === clicked.id) {
        cat.isSelected = true;
        setSelectedCategory(cat);
      } else {
        cat.isSelected = false;
      }
    }
    setCategories(categoriesCopy);
  };

  //--------------------- Newest Article ----------------------//

  const getNewestArticle = async () => {
    let categoryId = "";
    if (selectedCategory?.value !== "all") {
      categoryId = selectedCategory.id;
    }

    const requestParams = {
      limit: 2, // Only get the newest article
      sortBy: "createdAt", // Sort by created date
      sortOrder: "desc", // Sort in descending order
      locale: usersLanguage,
      populate: true,
      ids: articleIdsQuerry.data,
    };

    if (categoryId) {
      requestParams.categoryId = categoryId;
    }

    if (shouldUseHardcodedAgeGroup) {
      requestParams.ageGroupId = hardcodedAgeGroupId;
    } else if (showAgreGroups && selectedAgeGroupId) {
      requestParams.ageGroupId = selectedAgeGroupId;
    }

    let { data } = await cmsSvc.getArticles(requestParams);
    for (let i = 0; i < data.data.length; i++) {
      data.data[i] = destructureArticleData(data.data[i]);
    }
    const ids = data.data.map((article) => article.id);
    setArticleIdsForRatings((prev) => [...prev, ...ids]);
    return data.data;
  };

  const {
    data: newestArticles,
    isLoading: newestArticlesLoading,
    isFetched: isNewestArticlesFetched,
  } = useQuery(
    [
      "newestArticle",
      usersLanguage,
      selectedCategory,
      selectedAgeGroup?.id,
      articleIdsQuerry.data,
    ],
    getNewestArticle,
    {
      onError: (error) => console.log(error),
      enabled:
        !articleIdsQuerry.isLoading &&
        articleIdsQuerry.data?.length > 0 &&
        !categoriesQuery.isLoading &&
        categoriesQuery.data?.length > 0 &&
        (isTmpUser || shouldUseHardcodedAgeGroup),

      refetchOnWindowFocus: false,
    },
  );

  const availableCategories = useMemo(() => {
    return categoriesToShow.map((category) => category.id).filter((id) => !!id);
  }, [categoriesToShow]);

  const {
    articles,
    loading: isArticlesLoading,
    isReady,
    readArticleIds,
  } = useRecommendedArticles({
    limit: 2, // Only show 2 articles
    ageGroupId: selectedAgeGroup?.id,
    enabled: isTmpUser
      ? false
      : selectedAgeGroup?.id && !ageGroupsQuery.isLoading,
    categoryIdFilter: selectedCategory?.id || null,
    sortFilter: "read_count",
    availableCategories,
  });

  useEffect(() => {
    if (usersLanguage !== "en") {
      const articleIds = articles.map((article) => {
        const articleData = article.data ? article.data : article;
        return articleData.id;
      });
      if (articleIds.length > 0) {
        setArticleIdsForRatings((prev) => [...prev, ...articleIds]);
      }
    }
  }, [usersLanguage, articles]);

  const articlesToTransform = isTmpUser ? newestArticles : articles;

  // Transform articles data to match expected format
  const transformedArticles = articlesToTransform
    ?.slice(0, 2)
    ?.map((article) => {
      // If article already has direct properties, use them, otherwise use article.data
      return article.data ? article.data : article;
    });

  const showLoading = isTmpUser ? newestArticlesLoading : isArticlesLoading;

  // Loading states
  const isInitialLoading =
    ageGroupsQuery.isLoading ||
    categoriesQuery.isLoading ||
    articleIdsQuerry.isLoading;
  const isContentLoading = showLoading;
  const isAnyLoading = isInitialLoading || isContentLoading;

  // Data availability
  const hasCategoriesData = categoriesToShow?.length >= 1;
  const hasAgeGroupsData = ageGroups?.length > 0;
  const hasArticlesData = transformedArticles?.length > 0;
  const hasIdsData = articleIdsQuerry.data?.length > 0;

  // UI conditions
  const shouldShowDashboard = hasCategoriesData;
  const shouldShowAgeGroups = showAgreGroups && hasAgeGroupsData;
  const shouldShowNoResults =
    (isReady || isNewestArticlesFetched) && !hasArticlesData;
  const shouldShowArticles =
    hasArticlesData && hasCategoriesData && !isContentLoading;

  // Render helpers
  const renderHeading = () => (
    <GridItem xs={2} md={4} lg={6} classes="articles-dashboard__heading-item">
      <h1>{t("heading")}</h1>
    </GridItem>
  );

  const renderAgeGroups = () =>
    shouldShowAgeGroups && (
      <GridItem md={8} lg={12} classes="articles-dashboard__age-group-item">
        <TabsUnderlined
          options={ageGroups}
          handleSelect={handleAgeGroupOnPress}
        />
      </GridItem>
    );

  const renderCategories = () => (
    <GridItem md={8} lg={12} classes="articles-dashboard__categories-item">
      {hasCategoriesData && (
        <Tabs
          options={categoriesToShow}
          handleSelect={handleCategoryOnPress}
          t={t}
        />
      )}
    </GridItem>
  );

  const renderLoading = () =>
    isContentLoading && (
      <GridItem md={8} lg={12}>
        <Loading />
      </GridItem>
    );

  const renderArticles = () =>
    transformedArticles?.map((article, index) => {
      const articleData = article.attributes
        ? destructureArticleData(article)
        : article;

      const { isLiked, isDisliked } = isLikedOrDislikedByUser({
        contentType: "article",
        contentData: articleData,
        userEngagements: contentEngagements,
      });

      return (
        <GridItem
          md={4}
          lg={6}
          key={index}
          classes="articles-dashboard__article-item"
        >
          <CardMedia
            type="portrait"
            size="lg"
            style={{ gridColumn: "span 4" }}
            title={articleData.title}
            image={
              articleData.imageMedium ||
              articleData.imageThumbnail ||
              articleData.imageSmall
            }
            description={articleData.description}
            labels={articleData.labels}
            creator={articleData.creator}
            readingTime={articleData.readingTime}
            categoryName={articleData.categoryName}
            isLikedByUser={isLiked}
            isDislikedByUser={isDisliked}
            likes={articlesLikes.get(article.id) || 0}
            dislikes={articlesDislikes.get(article.id) || 0}
            isRead={readArticleIds.includes(article.id)}
            t={t}
            onClick={() => {
              navigate(
                `/information-portal/article/${article.id}/${createArticleSlug(
                  article.attributes.title,
                )}`,
              );
            }}
            classes="articles-dashboard__article-item__card-media"
            isWhiteBackground={true}
          />
        </GridItem>
      );
    });

  const renderNoResults = () =>
    shouldShowNoResults && (
      <GridItem md={8} lg={12} classes="articles-dashboard__no_results">
        <h4>{t("heading_no_results")}</h4>{" "}
      </GridItem>
    );

  return (
    <>
      {shouldShowDashboard && (
        <Block classes="articles-dashboard">
          <Grid classes="articles-dashboard__block__grid">
            {renderHeading()}
            {/* {renderAgeGroups()} */}
            <GridItem
              md={8}
              lg={12}
              classes="articles-dashboard__articles-item"
            >
              <Grid>
                {/* {renderCategories()} */}
                {renderLoading()}
                {renderArticles()}
                <GridItem
                  md={8}
                  lg={12}
                  classes="articles-dashboard__show-more-item"
                >
                  <NewButton
                    size="lg"
                    classes="articles-dashboard__show-more-button"
                    onClick={() => navigate("/information-portal/articles")}
                  >
                    {t("show_more")}
                  </NewButton>
                </GridItem>
              </Grid>
            </GridItem>
            {renderNoResults()}
          </Grid>
        </Block>
      )}
    </>
  );
};
