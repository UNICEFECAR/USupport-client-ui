import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Page, ArticleView } from "#blocks";
import { destructureArticleData } from "@USupport-components-library/utils";
import {
  Block,
  Grid,
  GridItem,
  CardMedia,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import "./article-information.scss";

export const ArticleInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { i18n, t } = useTranslation("article-information");

  const getArticlesIds = async () => {
    // Request articles ids from the master DB based for website platform
    const articlesIds = await adminSvc.getArticles();

    return articlesIds;
  };

  const articleIdsQuerry = useQuery(["articleIds"], getArticlesIds);

  const getArticleData = async () => {
    let articleIdToFetch = id;

    const { data } = await cmsSvc.getArticleById(
      articleIdToFetch,
      i18n.language
    );

    const finalData = destructureArticleData(data);
    return finalData;
  };

  const { data: articleData, isFetching: isFetchingArticleData } = useQuery(
    ["article", i18n.language, id],
    getArticleData,
    {
      enabled: !!id,
    }
  );

  const getSimilarArticles = async () => {
    let { data } = await cmsSvc.getArticles({
      limit: 3,
      categoryId: articleData.categoryId,
      locale: i18n.language,
      excludeId: articleData.id,
      populate: true,
      ids: articleIdsQuerry.data,
    });

    console.log(data);

    if (data.length === 0) {
      let { data: newest } = await cmsSvc.getArticles({
        limit: 3,
        sortBy: "createdAt", // Sort by created date
        sortOrder: "desc", // Sort in descending order
        locale: i18n.language,
        excludeId: articleData.id,
        populate: true,
        ids: articleIdsQuerry.data,
      });
      return newest.data;
    }
    return data.data;
  };

  const {
    data: moreArticles,
    isLoading: isMoreArticlesLoading,
    isFetched: isMoreArticlesFetched,
  } = useQuery(["more-articles", id, i18n.language], getSimilarArticles, {
    enabled:
      !isFetchingArticleData &&
      !articleIdsQuerry.isLoading &&
      articleIdsQuerry.data?.length > 0 &&
      articleData &&
      articleData.categoryId
        ? true
        : false,
  });

  const onArticleClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <Page classes="page__article-information" showGoBackArrow={false}>
      {articleData ? (
        <ArticleView articleData={articleData} />
      ) : (
        <Loading size="lg" />
      )}

      {!isMoreArticlesLoading && moreArticles.length > 0 && (
        <Block classes="page__article-information__more-articles">
          <Grid classes="page__article-information__more-articles__main-grid">
            <GridItem md={8} lg={12} classes="more-articles__heading-item">
              <h4>{t("heading")}</h4>
            </GridItem>
            {moreArticles.map((article, index) => {
              const articleData = destructureArticleData(article);

              return (
                <GridItem
                  classes="page__article-information__more-articles-card"
                  key={index}
                >
                  <CardMedia
                    type="portrait"
                    size="sm"
                    style={{ gridColumn: "span 4" }}
                    title={articleData.title}
                    image={articleData.imageMedium}
                    description={articleData.description}
                    labels={articleData.labels}
                    creator={articleData.creator}
                    readingTime={articleData.readingTime}
                    onClick={() => {
                      navigate(`/article/${articleData.id}`);
                      onArticleClick();
                    }}
                  />
                </GridItem>
              );
            })}
          </Grid>
        </Block>
      )}
      {!moreArticles && isMoreArticlesLoading && <Loading size="lg" />}
      {!moreArticles?.length &&
        !isMoreArticlesLoading &&
        isMoreArticlesFetched && (
          <h3 className="page__article-information__no-results">
            {t("no_results")}
          </h3>
        )}
    </Page>
  );
};
