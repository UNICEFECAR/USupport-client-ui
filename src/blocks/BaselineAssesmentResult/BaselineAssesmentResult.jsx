import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Box,
  Grid,
  GridItem,
  ProgressBar,
  Loading,
  Icon,
} from "@USupport-components-library/src";
import { createArticleSlug } from "@USupport-components-library/utils";
import { CardMedia, Markdown } from "@USupport-components-library/src";

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
  const { t, i18n } = useTranslation("blocks", {
    keyPrefix: "baseline-assesment-result",
  });
  const language = i18n.language;
  const navigate = useNavigate();

  const { isFetching, data } = useGetAssessmentResult({
    ...result,
    language,
  });
  const renderIcon = (result) => {
    if (!result) return null;
    const color =
      result === "higher" ? "#eb5757" : result === "lower" ? "#7ec680" : "";
    const name =
      result === "higher" ? "arrow-up" : result === "lower" ? "arrow-down" : "";
    return <Icon color={color} name={name} />;
  };

  function generateKey(result) {
    const map = {
      higher: "inc",
      lower: "dec",
      equal: "same",
    };

    return [
      map[result.psychological],
      map[result.biological],
      map[result.social],
    ].join("_");
  }

  let resultText = "";
  if (result?.comparePrevious) {
    resultText = t(generateKey(result.comparePrevious));
  }

  return (
    <>
      <GridItem md={8} lg={12} classes="baseline-assesment-result">
        <h1>{t("assessment_completed")}</h1>
        <div className="baseline-assesment-result__stats">
          <ProgressBar progress={100} height="lg" showPercentage />
        </div>
      </GridItem>
      {result && (
        <GridItem md={8} lg={12}>
          <Grid classes="baseline-assesment-result__compare-grid">
            <GridItem md={8} lg={12}>
              {result?.comparePrevious && <h4>{resultText}</h4>}
            </GridItem>
            <GridItem md={8} lg={4}>
              <Box classes="baseline-assesment-result__compare-grid__item">
                <p>
                  {t("psychological")}: {result.psychologicalScore}
                </p>
                {renderIcon(result.comparePrevious?.psychological)}
              </Box>
            </GridItem>
            <GridItem md={8} lg={4}>
              <Box classes="baseline-assesment-result__compare-grid__item">
                <p>
                  {t("biological")}: {result.biologicalScore}
                </p>
                {renderIcon(result.comparePrevious?.biological)}
              </Box>
            </GridItem>
            <GridItem md={8} lg={4}>
              <Box classes="baseline-assesment-result__compare-grid__item">
                <p>
                  {t("social")}: {result.socialScore}
                </p>
                {renderIcon(result.comparePrevious?.social)}
              </Box>
            </GridItem>
          </Grid>
        </GridItem>
      )}

      {isFetching && (
        <GridItem md={8} lg={12}>
          <p>{t("loading_results")}</p>
          <Loading size="lg" />
        </GridItem>
      )}
      {data && (
        <>
          <GridItem md={8} lg={12} classes="baseline-assesment-result__summary">
            <h4>{data.summary}</h4>
          </GridItem>
          <p>Summary 2</p>
          <GridItem md={8} lg={12} classes="baseline-assesment-result__summary">
            <Markdown markDownText={data.summaryCK} className={"text"} />
          </GridItem>
        </>
      )}

      {data?.articles.length > 0 && (
        <GridItem md={8} lg={12} classes="baseline-assesment-result__articles">
          <h5>{t("recommended_articles")}</h5>
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
