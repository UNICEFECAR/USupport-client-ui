import React, { useState, useEffect, useCallback } from "react";
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
} from "@USupport-components-library/src";
import { destructureArticleData } from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import { useEventListener } from "#hooks";

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

  const { t, i18n } = useTranslation("articles-dashboard");

  const [usersLanguage, setUsersLanguage] = useState(i18n.language);

  useEffect(() => {
    if (i18n.language !== usersLanguage) {
      setUsersLanguage(i18n.language);
    }
  }, [i18n.language]);

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

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

  const getArticlesIds = async () => {
    // Request articles ids from the master DB based for website platform
    const articlesIds = await adminSvc.getArticles();

    return articlesIds;
  };

  const articleIdsQuerry = useQuery(
    ["articleIds", currentCountry],
    getArticlesIds
  );

  //--------------------- Newest Article ----------------------//

  const getNewestArticle = async () => {
    let categoryId = "";
    if (selectedCategory?.value !== "all") {
      categoryId = selectedCategory.id;
    }

    let { data } = await cmsSvc.getArticles({
      limit: 2, // Only get the newest article
      sortBy: "createdAt", // Sort by created date
      categoryId: categoryId,
      sortOrder: "desc", // Sort in descending order
      locale: usersLanguage,
      populate: true,
      ids: articleIdsQuerry.data,
    });
    for (let i = 0; i < data.data.length; i++) {
      data.data[i] = destructureArticleData(data.data[i]);
    }

    return data.data;
  };

  const {
    data: newestArticles,
    isLoading: newestArticlesLoading,
    isFetched: isNewestArticlesFetched,
  } = useQuery(
    ["newestArticle", usersLanguage, selectedCategory, articleIdsQuerry.data],
    getNewestArticle,
    {
      onError: (error) => console.log(error),
      enabled:
        !articleIdsQuerry.isLoading &&
        articleIdsQuerry.data?.length > 0 &&
        !categoriesQuery.isLoading &&
        categoriesQuery.data?.length > 0 &&
        selectedCategory !== null,

      refetchOnWindowFocus: false,
    }
  );

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
                {newestArticlesLoading && (
                  <GridItem md={8} lg={12}>
                    <Loading />
                  </GridItem>
                )}

                {!newestArticlesLoading &&
                  newestArticles?.length > 0 &&
                  categories.length > 1 &&
                  newestArticles?.map((article, index) => {
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
                          title={article.title}
                          image={article.imageMedium}
                          description={article.description}
                          labels={article.labels}
                          creator={article.creator}
                          readingTime={article.readingTime}
                          categoryName={article.categoryName}
                          t={t}
                          onClick={() => {
                            navigate(
                              `/information-portal/article/${article.id}`
                            );
                          }}
                        />
                      </GridItem>
                    );
                  })}
              </Grid>
            </GridItem>
            {isNewestArticlesFetched && newestArticles?.length === 0 && (
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
