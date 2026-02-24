import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  Loading,
  CardMedia,
} from "@USupport-components-library/src";
import {
  destructureArticleData,
  createArticleSlug,
  getLikesAndDislikesForContent,
} from "@USupport-components-library/utils";
import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import { useCustomNavigate as useNavigate, useEventListener } from "#hooks";

import "./most-read-articles.scss";

export const MostReadArticles = () => {
  const { i18n, t } = useTranslation("blocks", {
    keyPrefix: "most-read-articles",
  });
  const navigate = useNavigate();

  const [showBlock, setShowBlock] = useState(false);

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country"),
  );
  const shouldFetchIds = !!(currentCountry && currentCountry !== "global");

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  useEventListener("countryChanged", handler);

  //--------------------- Articles ----------------------//

  const getArticlesIds = async () => {
    const articlesIds = await adminSvc.getArticles();
    return articlesIds;
  };

  const articleIdsQuery = useQuery(
    ["articleIds", currentCountry, shouldFetchIds],
    getArticlesIds,
    {
      enabled: shouldFetchIds,
    },
  );

  //--------------------- Most Read Articles ----------------------//

  const getMostReadArticles = async () => {
    const queryParams = {
      limit: 1,
      sortBy: "read_count",
      sortOrder: "desc",
      locale: i18n.language,
      populate: true,
    };

    if (shouldFetchIds) {
      queryParams["ids"] = articleIdsQuery.data;
    } else {
      queryParams["global"] = true;
      queryParams["isForAdmin"] = true;
    }

    const { data } = await cmsSvc.getArticles(queryParams);
    const rawArticles = data.data || [];
    if (!rawArticles.length) return [];

    const ids = rawArticles.map((article) => article.id);
    const { likes, dislikes } = await getLikesAndDislikesForContent(
      ids,
      "article",
    );

    const processedArticles = rawArticles.map((article) => {
      const base = destructureArticleData(article);
      return {
        ...base,
        likes: likes.get(base.id) ?? base.likes ?? 0,
        dislikes: dislikes.get(base.id) ?? base.dislikes ?? 0,
      };
    });

    return processedArticles;
  };

  const mostReadArticlesQuery = useQuery(
    ["mostReadArticles", i18n.language, articleIdsQuery.data, shouldFetchIds],
    getMostReadArticles,
    {
      enabled: shouldFetchIds
        ? !articleIdsQuery.isLoading && articleIdsQuery.data?.length > 0
        : true,
      refetchOnWindowFocus: false,
      onSuccess: (data) => {
        setShowBlock(data.length > 0);
      },
    },
  );

  const handleRedirect = (id, title) => {
    navigate(`/information-portal/article/${id}/${createArticleSlug(title)}`);
  };

  return (
    <>
      {showBlock && (
        <Block classes="most-read-articles">
          <Grid classes="most-read-articles__main-grid">
            <GridItem md={8} lg={12}>
              <h2>{t("heading")}</h2>
            </GridItem>

            {mostReadArticlesQuery.isLoading ? (
              <GridItem
                md={8}
                lg={12}
                classes="most-read-articles__loading-item"
              >
                <Loading />
              </GridItem>
            ) : null}

            {!mostReadArticlesQuery.isLoading &&
              mostReadArticlesQuery.data?.length > 0 && (
                <GridItem
                  md={8}
                  lg={12}
                  classes="most-read-articles__main-article-item"
                  type="portrait"
                >
                  <CardMedia
                    size="lg"
                    type="landscape"
                    title={mostReadArticlesQuery.data[0].title}
                    image={mostReadArticlesQuery.data[0].imageMedium}
                    description={mostReadArticlesQuery.data[0].description}
                    labels={mostReadArticlesQuery.data[0].labels}
                    creator={mostReadArticlesQuery.data[0].creator}
                    readingTime={mostReadArticlesQuery.data[0].readingTime}
                    categoryName={mostReadArticlesQuery.data[0].categoryName}
                    likes={mostReadArticlesQuery.data[0].likes || 0}
                    dislikes={mostReadArticlesQuery.data[0].dislikes || 0}
                    t={t}
                    onClick={() =>
                      handleRedirect(
                        mostReadArticlesQuery.data[0].id,
                        mostReadArticlesQuery.data[0].title,
                      )
                    }
                  />
                </GridItem>
              )}
          </Grid>
        </Block>
      )}
    </>
  );
};
