import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  Button,
  Loading,
} from "@USupport-components-library/src";

import { destructureArticleData } from "@USupport-components-library/utils";
import { Page, Articles } from "#blocks";
import { cmsSvc } from "@USupport-components-library/services";
import { useTranslation } from "react-i18next";

import "./information-portal.scss";

import { mascotHappyPurple } from "@USupport-components-library/assets";
import { GiveSuggestion } from "../../blocks/GiveSuggestion/GiveSuggestion";

/**
 * InformationPortal
 *
 * Information Portal page
 *
 * @returns {JSX.Element}
 */
export const InformationPortal = () => {
  const CMS_HOST = `${import.meta.env.VITE_CMS_HOST}`;

  const navigate = useNavigate();

  const { t, i18n } = useTranslation("information-portal");

  //--------------------- Newest Article ----------------------//
  const getNewestArticles = async () => {
    const res = await cmsSvc.getNewestArticles(2, i18n.language);
    let newestArticlesData = [];
    for (let i = 0; i < res.data.length; i++) {
      const article = res.data[i];
      newestArticlesData.push(destructureArticleData(CMS_HOST, article));
    }
    return newestArticlesData;
  };

  const {
    data: newestArticles,
    isLoading: newestArticlesLoading,
    isFetched: isNewestArticlesFetched,
  } = useQuery(["newestArticles"], getNewestArticles, {
    refetchOnWindowFocus: false,
    retry: false,
  });

  //--------------------- Most Read Articles ----------------------//
  const getMostReadArticles = async () => {
    const res = await cmsSvc.getMostReadArticles(2, i18n.language);
    if (!res.data) return null;

    let mostReadArticles = [];
    for (let i = 0; i < res.data.length; i++) {
      const article = res.data[i];
      mostReadArticles.push(destructureArticleData(CMS_HOST, article));
    }
    console.log(mostReadArticles, "mostread");
    return mostReadArticles;
  };

  const {
    data: mostReadArticles,
    isLoading: mostReadArticlesLoading,
    isFetched: isMostReadArticlesFetched,
  } = useQuery(["mostReadArticles"], getMostReadArticles, {
    refetchOnWindowFocus: false,
    // retry: false,
  });

  return (
    <Page classes="page__information-portal" showGoBackArrow={false}>
      <Grid classes="page__information-portal__banner">
        <GridItem
          xs={1}
          md={1}
          lg={1}
          classes="page__information-portal__mascot-item"
        >
          <img src={mascotHappyPurple} />
        </GridItem>
        <GridItem
          xs={3}
          md={7}
          lg={11}
          classes="page__information-portal__headings-item"
        >
          <h3>{t("heading")}</h3>
          <p className="subheading">{t("subheading")}</p>
        </GridItem>
      </Grid>

      <Block classes="page__information-portal__block">
        <Grid classes="page__information-portal__block__grid">
          <GridItem md={8} lg={12} classes="articles__articles-item">
            {isNewestArticlesFetched &&
            isMostReadArticlesFetched &&
            newestArticles.length === 0 &&
            mostReadArticles.length === 0 ? (
              <h4>{t("heading_no_language_results")}</h4>
            ) : null}

            {newestArticlesLoading ? <Loading /> : null}
            {!newestArticlesLoading && newestArticles.length > 0 ? (
              <Grid>
                <GridItem
                  xs={2}
                  md={4}
                  lg={6}
                  classes="page__information-portal__heading-item"
                >
                  <h4>{t("heading_newest")}</h4>
                </GridItem>
                <GridItem
                  xs={2}
                  md={4}
                  lg={6}
                  classes="page__information-portal__view-more-item"
                >
                  <Button
                    type="link"
                    color="purple"
                    label={t("view all")}
                    onClick={() =>
                      navigate("/articles", { state: { sort: "createdAt" } })
                    }
                  ></Button>
                </GridItem>
                {newestArticles?.map((article, index) => {
                  return (
                    <GridItem md={4} lg={6} key={index}>
                      <CardMedia
                        type="portrait"
                        size="lg"
                        style={{ gridColumn: "span 4" }}
                        title={article.title}
                        image={article.imageThumbnail}
                        description={article.description}
                        labels={article.labels}
                        creator={article.creator}
                        readingTime={article.readingTime}
                        onClick={() => {
                          navigate(`/article/${article.id}`);
                        }}
                      />
                    </GridItem>
                  );
                })}
              </Grid>
            ) : null}
          </GridItem>
        </Grid>

        <Grid classes="page__information-portal__block__grid">
          <GridItem md={8} lg={12} classes="articles__articles-item">
            {mostReadArticlesLoading ? <Loading /> : null}
            {!mostReadArticlesLoading && mostReadArticles.length > 0 ? (
              <Grid>
                <GridItem
                  xs={2}
                  md={4}
                  lg={6}
                  classes="page__information-portal__heading-item"
                >
                  <h4>{t("heading_popular")}</h4>
                </GridItem>
                <GridItem
                  xs={2}
                  md={4}
                  lg={6}
                  classes="page__information-portal__view-more-item"
                >
                  <Button
                    type="link"
                    color="purple"
                    label={t("view all")}
                    onClick={() =>
                      navigate("/articles", { state: { sort: "read_count" } })
                    }
                  ></Button>
                </GridItem>
                {mostReadArticles?.map((article, index) => {
                  return (
                    <GridItem md={4} lg={6} key={index}>
                      <CardMedia
                        type="portrait"
                        size="lg"
                        style={{ gridColumn: "span 4" }}
                        title={article.title}
                        image={article.imageThumbnail}
                        description={article.description}
                        labels={article.labels}
                        creator={article.creator}
                        readingTime={article.readingTime}
                        onClick={() => {
                          navigate(`/article/${article.id}`);
                        }}
                      />
                    </GridItem>
                  );
                })}
              </Grid>
            ) : null}
          </GridItem>
          <GridItem md={8} lg={12} classes="articles__articles-item">
            <GiveSuggestion />
          </GridItem>
        </Grid>
      </Block>
      {/* <Articles showSearch={false} showCategories={false} /> */}
    </Page>
  );
};
