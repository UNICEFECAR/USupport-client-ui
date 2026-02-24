import React, { useContext } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  useCustomNavigate as useNavigate,
  useGetUserContentEngagements,
} from "#hooks";
import { Page, ArticleView } from "#blocks";
import { RootContext } from "#routes";

import {
  destructureArticleData,
  createArticleSlug,
  isLikedOrDislikedByUser,
  getLikesAndDislikesForContent,
} from "@USupport-components-library/utils";
import { Block, CardMedia, Loading } from "@USupport-components-library/src";

import {
  userSvc,
  cmsSvc,
  adminSvc,
  clientSvc,
} from "@USupport-components-library/services";

import "./article-information.scss";

export const ArticleInformation = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { isTmpUser } = useContext(RootContext);

  const { i18n, t } = useTranslation("pages", {
    keyPrefix: "article-information",
  });

  const getArticlesIds = async () => {
    // Request articles ids from the master DB based for website platform
    const articlesIds = await adminSvc.getArticles();

    return articlesIds;
  };

  const { data: userContentEngagements } =
    useGetUserContentEngagements(!isTmpUser);
  const {
    data: articleContentEngagements,
    isLoading: isArticleContentEngagementsLoading,
  } = useQuery(["articleContentEngagements", id], async () => {
    const { data } = await userSvc.getContentEngagementsById({
      contentType: "article",
      ids: [id],
    });

    const { likes, dislikes } = data.reduce(
      (acc, engagement) => {
        if (engagement.action === "like") {
          acc.likes += 1;
        } else if (engagement.action === "dislike") {
          acc.dislikes += 1;
        }
        return acc;
      },
      { likes: 0, dislikes: 0 },
    );
    return { likes, dislikes };
  });

  const getArticleData = async () => {
    let articleIdToFetch = id;

    const { data } = await cmsSvc.getArticleById(
      articleIdToFetch,
      i18n.language,
    );
    const finalData = destructureArticleData(data);
    return finalData;
  };

  const {
    data: articleData,
    isFetching: isFetchingArticleData,
    isFetched,
  } = useQuery(["article", i18n.language, id], getArticleData, {
    enabled: !!id,
    onSuccess: (data) => {
      // Add category interaction when article is successfully fetched
      if (data && data.categoryId && !isTmpUser) {
        clientSvc
          .addClientCategoryInteraction({
            categoryId: data.categoryId,
            articleId: data.id,
            tagIds: data.labels.map((label) => label.id),
          })
          .catch((error) => {
            console.error("Failed to track category interaction:", error);
          });
      }
    },
  });

  const articleIdsQuerry = useQuery(["articleIds"], getArticlesIds);

  const getSimilarArticles = async () => {
    try {
      let readArticleIds = [];
      let categoryInteractions = [];
      if (!isTmpUser) {
        const { data } = await clientSvc.getCategoryInteractions();
        categoryInteractions = data;
        readArticleIds = [
          ...categoryInteractions.map((x) => Number(x.article_id)),
          Number(id),
        ];
      }

      const articles = [];

      if (articleData?.categoryId) {
        const currentCategoryResult =
          await cmsSvc.getRecommendedArticlesForCategory({
            categoryId: articleData.categoryId,
            categoryWeight: 1,
            page: 1,
            limit: 3,
            language: i18n.language,
            excludeIds: readArticleIds,
            countryArticleIds: articleIdsQuerry.data,
            tagIds: articleData.labels.map((label) => label.id),
            ageGroupId: articleData.ageGroupId,
          });

        if (
          currentCategoryResult.success &&
          currentCategoryResult.data?.length > 0
        ) {
          articles.push(...currentCategoryResult.data);
        }
        if (articles.length >= 3) {
          const ids = articles.map((article) => article.id);
          const { likes, dislikes } = await getLikesAndDislikesForContent(
            ids,
            "article",
          );
          return articles.map((article) => ({
            ...article,
            likes: likes.get(article.id),
            dislikes: dislikes.get(article.id),
          }));
        }

        if (categoryInteractions?.length > 0) {
          const categoryInteractionMap = new Map();
          categoryInteractions.forEach((interaction) => {
            const {
              category_id: categoryId,
              count,
              tag_ids: tagIds,
            } = interaction;
            if (categoryId !== articleData.categoryId) {
              if (categoryInteractionMap.has(categoryId)) {
                categoryInteractionMap.set(categoryId, {
                  count: categoryInteractionMap.get(categoryId).count + count,
                  tagIds: [
                    ...categoryInteractionMap.get(categoryId).tagIds,
                    ...tagIds,
                  ],
                });
              } else {
                categoryInteractionMap.set(categoryId, {
                  count: count,
                  tagIds: tagIds,
                });
              }
            }
          });

          const sortedCategories = Array.from(categoryInteractionMap.entries())
            .map(([categoryId, data]) => ({
              categoryId,
              categoryWeight: data.count,
              tagIds: data.tagIds,
            }))
            .sort((a, b) => b.categoryWeight - a.categoryWeight);

          for (const category of sortedCategories) {
            const result = await cmsSvc.getRecommendedArticlesForCategory({
              categoryId: category.categoryId,
              categoryWeight: category.categoryWeight,
              page: 1,
              limit: 3 - articles.length,
              language: i18n.language,
              excludeIds: readArticleIds,
              countryArticleIds: articleIdsQuerry.data,
              tagIds: category.tagIds,
              ageGroupId: articleData.ageGroupId,
            });

            if (result.success && result.data?.length > 0) {
              articles.push(...result.data);
              readArticleIds.push(...result.data.map((x) => x.id));
              if (articles.length >= 3) {
                return articles;
              }
            }
          }
        }
      }

      if (articles.length < 3) {
        const { data: newest } = await cmsSvc.getArticles({
          limit: 3 - articles.length,
          sortBy: "createdAt",
          sortOrder: "desc",
          locale: i18n.language,
          excludeIds: readArticleIds,
          populate: true,
          ids: articleIdsQuerry.data,
          ...(articleData?.ageGroupId && {
            ageGroupId: articleData.ageGroupId,
          }),
        });
        if (newest?.data?.length > 0) {
          articles.push(...newest.data);
        }
      }

      if (articles.length === 0) return [];

      const articleIds = articles.map((article) => article.id);
      const { likes, dislikes } = await getLikesAndDislikesForContent(
        articleIds,
        "article",
      );

      return articles.map((article) => ({
        ...article,
        likes: likes?.get(article.id),
        dislikes: dislikes?.get(article.id),
      }));
    } catch (error) {
      console.error("Error fetching similar articles:", error);
      return [];
    }
  };

  const {
    data: moreArticles,
    isLoading: isMoreArticlesLoading,
    isFetched: isMoreArticlesFetched,
    isFetching: isMoreArticlesFetching,
  } = useQuery(["more-articles", id, i18n.language], getSimilarArticles, {
    enabled:
      !isFetchingArticleData &&
      !articleIdsQuerry.isLoading &&
      articleIdsQuerry.data?.length > 0 &&
      !!articleData,
  });

  const onArticleClick = () => {
    window.scrollTo(0, 0);
  };

  const { isLiked, isDisliked } = isLikedOrDislikedByUser({
    contentType: "article",
    contentData: articleData,
    userEngagements: userContentEngagements,
  });

  const isLoading = isFetchingArticleData || isArticleContentEngagementsLoading;

  const renderSidebar = () => {
    if (!isMoreArticlesLoading && moreArticles?.length > 0) {
      return (
        <aside className="page__article-information__sidebar">
          <h4 className="page__article-information__sidebar__heading">
            {t("heading")}
          </h4>
          {moreArticles.map((article, index) => {
            const { isLiked, isDisliked } = isLikedOrDislikedByUser({
              contentType: "article",
              contentData: article,
              userEngagements: userContentEngagements,
            });
            const articleData = destructureArticleData(
              article.data ? article.data : article,
            );

            return (
              <CardMedia
                key={index}
                type="portrait"
                size="sm"
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
                likes={articleData.likes}
                dislikes={articleData.dislikes}
                isLikedByUser={isLiked}
                isDislikedByUser={isDisliked}
                t={t}
                onClick={() => {
                  navigate(
                    `/information-portal/article/${
                      articleData.id
                    }/${createArticleSlug(articleData.title)}`,
                  );
                  onArticleClick();
                }}
              />
            );
          })}
        </aside>
      );
    }

    if (!moreArticles && isMoreArticlesLoading && isMoreArticlesFetching) {
      return (
        <aside className="page__article-information__sidebar">
          <Loading size="lg" />
        </aside>
      );
    }

    return null;
  };

  return (
    <Page classes="page__article-information">
      <Block classes="page__article-information__block">
        <div className="page__article-information__layout">
          <div className="page__article-information__main">
            {articleData && !isLoading ? (
              <ArticleView
                articleData={{
                  ...articleData,
                  likes: articleContentEngagements?.likes || 0,
                  dislikes: articleContentEngagements?.dislikes || 0,
                  contentRating: {
                    isLikedByUser: isLiked,
                    isDislikedByUser: isDisliked,
                  },
                }}
                t={t}
                language={i18n.language}
                navigate={navigate}
                isTmpUser={isTmpUser}
              />
            ) : isFetched && !isLoading ? (
              <h3 className="page__article-information__no-results">
                {t("not_found")}
              </h3>
            ) : (
              <Loading size="lg" />
            )}
          </div>
          {renderSidebar()}
        </div>

        {!moreArticles?.length &&
          !isMoreArticlesLoading &&
          isMoreArticlesFetched && (
            <h3 className="page__article-information__no-results">
              {t("no_results")}
            </h3>
          )}
      </Block>
    </Page>
  );
};
