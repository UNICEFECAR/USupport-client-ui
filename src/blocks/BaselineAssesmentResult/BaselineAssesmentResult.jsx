import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Grid,
  GridItem,
  ProgressBar,
  Loading,
} from "@USupport-components-library/src";
import { createArticleSlug } from "@USupport-components-library/utils";
import { CardMedia } from "@USupport-components-library/src";

import { useGetAssessmentResult } from "#hooks";

import "./baseline-assesment-result.scss";

/**
 * BaselineAssesmentResult
 *
 * Baseline assesment result summary
 *
 * @return {jsx}
 */
export const BaselineAssesmentResult = ({ result }) => {
  const { t } = useTranslation("blocks", {
    keyPrefix: "baseline-assesment-result",
  });
  const navigate = useNavigate();

  const { isLoading, data } = useGetAssessmentResult({
    ...result,
    language: "en",
  });

  return (
    <>
      <GridItem md={8} lg={12} classes="baseline-assesment-result">
        <h1>{t("assessment_completed")}</h1>
        <div className="baseline-assesment-result__stats">
          <ProgressBar progress={100} height="lg" showPercentage />
        </div>
      </GridItem>
      {isLoading && (
        <GridItem md={8} lg={12}>
          <p>{t("loading_results")}</p>
          <Loading size="lg" />
        </GridItem>
      )}
      {data && (
        <GridItem md={8} lg={12}>
          <p>{data.summary}</p>
        </GridItem>
      )}
      {data?.articles.length > 0 && (
        <GridItem md={8} lg={12} classes="baseline-assesment-result__articles">
          <h4>{t("recommended_articles")}</h4>
          <Grid classes="baseline-assesment-result__content-grid">
            {data.articles.map((articleData) => (
              <GridItem md={4} lg={4} key={articleData.id}>
                <CardMedia
                  type="portrait"
                  size="md"
                  title={articleData.title}
                  image={articleData.imageMedium || articleData.imageSmall}
                  description={articleData.description}
                  labels={articleData.labels}
                  creator={articleData.creator}
                  readingTime={articleData.readingTime}
                  categoryName={articleData.categoryName}
                  // isLikedByUser={isLikedByUser}
                  // isDislikedByUser={isDislikedByUser}
                  likes={articleData.likes}
                  dislikes={articleData.dislikes}
                  // isRead={readArticleIds.includes(articleData.id)}
                  t={t}
                  onClick={() => {
                    navigate(
                      `/information-portal/article/${
                        articleData.id
                      }/${createArticleSlug(articleData.title)}`
                    );
                  }}
                />
              </GridItem>
            ))}
          </Grid>
        </GridItem>
      )}

      {data?.videos.length > 0 && (
        <GridItem md={8} lg={12} classes="baseline-assesment-result__videos">
          <h4>{t("recommended_videos")}</h4>
          <Grid classes="baseline-assesment-result__content-grid">
            {data.videos.map((videoData) => (
              <GridItem md={4} lg={4} key={videoData.id}>
                <CardMedia
                  type="portrait"
                  size="md"
                  title={videoData.title}
                  image={videoData.imageMedium || videoData.imageSmall}
                  description={videoData.description}
                  labels={videoData.labels}
                  creator={videoData.creator}
                  readingTime={videoData.readingTime}
                  categoryName={videoData.categoryName}
                  // isLikedByUser={isLikedByUser}
                  // isDislikedByUser={isDislikedByUser}
                  likes={videoData.likes}
                  dislikes={videoData.dislikes}
                  // isRead={readArticleIds.includes(videoData.id)}
                  t={t}
                  onClick={() => {
                    navigate(
                      `/information-portal/video/${
                        videoData.id
                      }/${createArticleSlug(videoData.title)}`
                    );
                  }}
                />
              </GridItem>
            ))}
          </Grid>
        </GridItem>
      )}
      {data?.podcasts.length > 0 && (
        <GridItem md={8} lg={12} classes="baseline-assesment-result__podcasts">
          <h4>{t("recommended_podcasts")}</h4>
          <Grid classes="baseline-assesment-result__content-grid">
            {data.podcasts.map((podcastData) => (
              <GridItem md={4} lg={4} key={podcastData.id}>
                <CardMedia
                  type="portrait"
                  size="md"
                  title={podcastData.title}
                  image={podcastData.imageMedium || podcastData.imageSmall}
                  description={podcastData.description}
                  labels={podcastData.labels}
                  creator={podcastData.creator}
                  readingTime={podcastData.readingTime}
                  categoryName={podcastData.categoryName}
                  // isLikedByUser={isLikedByUser}
                  // isDislikedByUser={isDislikedByUser}
                  likes={podcastData.likes}
                  dislikes={podcastData.dislikes}
                  // isRead={readArticleIds.includes(podcastData.id)}
                  t={t}
                  onClick={() => {
                    navigate(
                      `/information-portal/podcast/${
                        podcastData.id
                      }/${createArticleSlug(podcastData.title)}`
                    );
                  }}
                />
              </GridItem>
            ))}
          </Grid>
        </GridItem>
      )}
    </>
  );
};
