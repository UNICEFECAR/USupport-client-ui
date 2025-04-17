import React, { useState, useCallback } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useQuery } from "@tanstack/react-query";
import {
  Grid,
  GridItem,
  Block,
  CardMedia,
  Loading,
} from "@USupport-components-library/src";

import { destructureArticleData } from "@USupport-components-library/utils";
import { Page, GiveSuggestion } from "#blocks";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";
import { useEventListener } from "#hooks";
import { useTranslation } from "react-i18next";

import "./information-portal.scss";

import { mascotHappyPurple } from "@USupport-components-library/assets";

/**
 * InformationPortal
 *
 * Information Portal page
 *
 * @returns {JSX.Element}
 */
export const InformationPortal = () => {
  const navigate = useNavigate();

  const { t, i18n } = useTranslation("information-portal");

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

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
    let { data } = await cmsSvc.getArticles({
      limit: 2, // Only get the newest article
      sortBy: "createdAt", // Sort by created date
      sortOrder: "desc", // Sort in descending order
      locale: i18n.language,
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
    ["newestArticle", i18n.language, articleIdsQuerry.data],
    getNewestArticle,
    {
      enabled: !articleIdsQuerry.isLoading && articleIdsQuerry.data?.length > 0,

      refetchOnWindowFocus: false,
    }
  );

  //--------------------- Most Read Articles ----------------------//

  const getMostReadArticles = async () => {
    let { data } = await cmsSvc.getArticles({
      limit: 2, // Only get the newest article
      sortBy: "read_count", // Sort by created date
      sortOrder: "desc", // Sort in descending order
      locale: i18n.language,
      populate: true,
      ids: articleIdsQuerry.data,
    });

    for (let i = 0; i < data.data.length; i++) {
      data.data[i] = destructureArticleData(data.data[i]);
    }
    return data.data;
  };

  const {
    data: mostReadArticles,
    isLoading: mostReadArticlesLoading,
    isFetched: isMostReadArticlesFetched,
  } = useQuery(
    ["mostReadArticles", i18n.language, articleIdsQuerry.data],
    getMostReadArticles,
    {
      enabled: !articleIdsQuerry.isLoading && articleIdsQuerry.data?.length > 0,

      refetchOnWindowFocus: false,
    }
  );

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
            newestArticles?.length === 0 &&
            mostReadArticles?.length === 0 ? (
              <h4>{t("heading_no_language_results")}</h4>
            ) : null}

            {newestArticlesLoading ? <Loading /> : null}
            {!newestArticlesLoading && newestArticles?.length > 0 ? (
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
                  <p
                    className="small-text view-all-button"
                    onClick={() =>
                      navigate("/information-portal/articles", {
                        state: { sort: "createdAt" },
                      })
                    }
                  >
                    {t("view_all")}
                  </p>
                </GridItem>
                {newestArticles?.map((article, index) => {
                  return (
                    <GridItem md={4} lg={6} key={index}>
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
                          navigate(`/information-portal/article/${article.id}`);
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
            {!mostReadArticlesLoading && mostReadArticles?.length > 0 ? (
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
                  <p
                    className="small-text view-all-button"
                    onClick={() =>
                      navigate("/information-portal/articles", {
                        state: { sort: "read_count" },
                      })
                    }
                  >
                    {t("view_all")}
                  </p>
                </GridItem>
                {mostReadArticles?.map((article, index) => {
                  return (
                    <GridItem md={4} lg={6} key={index}>
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
                          navigate(`/information-portal/article/${article.id}`);
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
