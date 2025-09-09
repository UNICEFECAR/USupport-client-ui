import { useState, useEffect } from "react";
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
} from "@USupport-components-library/src";
import {
  destructureArticleData,
  createArticleSlug,
} from "@USupport-components-library/utils";
import { cmsSvc } from "@USupport-components-library/services";

import { useGetUserContentRatings, useRecommendedArticles } from "#hooks";

import "./articles-dashboard.scss";

/**
 * ArticlesDashboard
 *
 * ArticlesDashboard Block
 *
 * @return {jsx}
 */
export const ArticlesDashboard = () => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation("blocks", {
    keyPrefix: "articles-dashboard",
  });

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  //--------------------- Categories ----------------------//
  const [categories, setCategories] = useState();
  const [selectedCategory, setSelectedCategory] = useState();

  const { data: contentRatings } = useGetUserContentRatings();

  //--------------------- Age Groups ----------------------//
  const [ageGroups, setAgeGroups] = useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState();

  const getAgeGroups = async () => {
    try {
      const res = await cmsSvc.getAgeGroups(usersLanguage);
      console.log(res.data);
      const ageGroupsData = res.data.map((age, index) => ({
        label: age.attributes.name,
        id: age.id,
        isSelected: index === 1 ? true : false,
      }));
      setSelectedAgeGroup(ageGroupsData[1]);
      return ageGroupsData;
    } catch {}
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

  useQuery(["articles-categories", usersLanguage], getCategories, {
    refetchOnWindowFocus: false,
    onSuccess: (data) => {
      setCategories([...data]);
    },
  });

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
    limit: 6, // Only show 2 articles
    ageGroupId: selectedAgeGroup?.id,
    enabled: selectedAgeGroup?.id && !ageGroupsQuery.isLoading,
    categoryIdFilter: selectedCategory?.id || null,
    sortFilter: "read_count",
  });

  // Transform articles data to match expected format
  const transformedArticles = articles?.slice(0, 2)?.map((article) => {
    // If article already has direct properties, use them, otherwise use article.data
    return article.data ? article.data : article;
  });

  console.log("readArticleIds", readArticleIds);

  return (
    <>
      {categories?.length > 1 && (
        <Block classes="articles-dashboard">
          <Grid classes="articles-dashboard__block__grid">
            <GridItem
              xs={2}
              md={4}
              lg={6}
              classes="articles-dashboard__heading-item"
            >
              <h4>{t("heading")}</h4>
            </GridItem>

            <GridItem
              xs={2}
              md={4}
              lg={6}
              classes="articles-dashboard__view-more-item"
            >
              <p
                className="small-text view-all-button"
                onClick={() => navigate("/information-portal/articles")}
              >
                {t("view_all")}
              </p>
            </GridItem>
            <GridItem
              md={8}
              lg={12}
              classes="articles-dashboard__age-group-item"
            >
              <TabsUnderlined
                options={ageGroups}
                handleSelect={handleAgeGroupOnPress}
              />
            </GridItem>
            <GridItem
              md={8}
              lg={12}
              classes="articles-dashboard__articles-item"
            >
              <Grid>
                <GridItem
                  md={8}
                  lg={12}
                  classes="articles-dashboard__categories-item"
                >
                  {categories?.length > 1 && (
                    <Tabs
                      options={categories}
                      handleSelect={handleCategoryOnPress}
                      t={t}
                    />
                  )}
                </GridItem>
                {isArticlesLoading && (
                  <GridItem md={8} lg={12}>
                    <Loading />
                  </GridItem>
                )}

                {!isArticlesLoading &&
                  transformedArticles?.length > 0 &&
                  categories.length > 1 &&
                  transformedArticles?.map((article, index) => {
                    const articleData = destructureArticleData(article);
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
                          isRead={readArticleIds.includes(article.id)}
                          t={t}
                          onClick={() => {
                            navigate(
                              `/information-portal/article/${
                                article.id
                              }/${createArticleSlug(article.attributes.title)}`
                            );
                          }}
                        />
                      </GridItem>
                    );
                  })}
              </Grid>
            </GridItem>
            {isReady && transformedArticles?.length === 0 && (
              <GridItem md={8} lg={12} classes="articles-dashboard__no_results">
                <h4>{t("heading_no_results")}</h4>{" "}
              </GridItem>
            )}
          </Grid>
        </Block>
      )}
    </>
  );
};
