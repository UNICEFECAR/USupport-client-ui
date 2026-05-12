import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import {
  Box,
  Grid,
  GridItem,
  ProgressBar,
  Loading,
  Icon,
  NewButton,
} from "@USupport-components-library/src";
import { createArticleSlug } from "@USupport-components-library/utils";
import { CardMedia, Markdown } from "@USupport-components-library/src";

import {
  useCustomNavigate as useNavigate,
  useGetAssessmentResult,
} from "#hooks";

import { logoVerticalRomaniaPng } from "@USupport-components-library/assets";

import "./baseline-assesment-result.scss";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

/**
 * BaselineAssesmentResult
 *
 * Baseline assesment result summary
 *
 * @return {jsx}
 */
export const BaselineAssesmentResult = ({ result, assessmentDate }) => {
  const { t, i18n } = useTranslation("blocks", {
    keyPrefix: "baseline-assesment-result",
  });
  const language = i18n.language;
  const navigate = useNavigate();
  const pdfRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [exportLogoDataUrl, setExportLogoDataUrl] = useState(null);

  const { isFetching, data } = useGetAssessmentResult({
    ...result,
    language,
  });

  // Use the same Romania auth-screen logo variant.
  // Keep it bundled (local) to avoid CORS issues during PDF generation.
  const IS_RO = localStorage.getItem("country") === "RO";
  const logoUrl = IS_RO
    ? logoVerticalRomaniaPng
    : `${AMAZON_S3_BUCKET}/logo-horizontal`;

  const loadImageAsDataUrl = async (url) => {
    const res = await fetch(url, { mode: "cors", cache: "force-cache" });
    if (!res.ok) throw new Error(`Failed to load image: ${res.status}`);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const formattedDate = useMemo(() => {
    if (!assessmentDate) return "";
    const d = new Date(assessmentDate);
    if (Number.isNaN(d.getTime())) return "";
    try {
      return new Intl.DateTimeFormat(language, {
        year: "numeric",
        month: "long",
        day: "2-digit",
      }).format(d);
    } catch {
      return d.toLocaleDateString();
    }
  }, [assessmentDate, language]);

  const handleDownloadPdf = async () => {
    if (!pdfRef.current || isDownloading) return;
    setIsDownloading(true);
    try {
      // Inline logo to avoid CORS-tainted canvas in html2canvas/html2pdf
      try {
        const dataUrl = await loadImageAsDataUrl(logoUrl);
        setExportLogoDataUrl(dataUrl);
      } catch {
        setExportLogoDataUrl(null);
      }

      const html2pdfModule = await import("html2pdf.js");
      const html2pdf = html2pdfModule?.default || html2pdfModule;

      const safeDate = formattedDate
        ? formattedDate.replaceAll("/", "-").replaceAll(" ", "_")
        : "date-unknown";
      const filename = `baseline-assessment-result_${safeDate}.pdf`;

      await html2pdf()
        .set({
          margin: [14, 14, 14, 14],
          filename,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
          pagebreak: { mode: ["css", "legacy"] },
        })
        .from(pdfRef.current)
        .save();
    } finally {
      setIsDownloading(false);
      setExportLogoDataUrl(null);
    }
  };

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
    <GridItem md={8} lg={12}>
      <Grid>
        <GridItem md={8} lg={12} classes="baseline-assesment-result">
          <h1>{t("assessment_completed")}</h1>
          {formattedDate && (
            <p className="baseline-assesment-result__date">
              {t("date", { defaultValue: "Date" })}: {formattedDate}
            </p>
          )}
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
              <GridItem md={8} lg={12}>
                <div className="baseline-assesment-result__compare-grid__stats-container">
                  <Box classes="baseline-assesment-result__compare-grid__stats-container__item">
                    <p>
                      {t("psychological")}: {result.psychologicalScore}
                    </p>
                    {renderIcon(result.comparePrevious?.psychological)}
                  </Box>
                  <Box classes="baseline-assesment-result__compare-grid__stats-container__item">
                    <p>
                      {t("biological")}: {result.biologicalScore}
                    </p>
                    {renderIcon(result.comparePrevious?.biological)}
                  </Box>
                  <Box classes="baseline-assesment-result__compare-grid__stats-container__item">
                    <p>
                      {t("social")}: {result.socialScore}
                    </p>
                    {renderIcon(result.comparePrevious?.social)}
                  </Box>
                </div>
              </GridItem>
            </Grid>
          </GridItem>
        )}

        <GridItem md={8} lg={12} classes="baseline-assesment-result__download">
          <NewButton
            onClick={handleDownloadPdf}
            size="lg"
            variant="outline"
            loading={isDownloading}
            disabled={isDownloading || isFetching}
          >
            {t("download_pdf", { defaultValue: "Download results (PDF)" })}
          </NewButton>
        </GridItem>

        {isFetching && (
          <GridItem md={8} lg={12}>
            <p>{t("loading_results")}</p>
            <Loading size="lg" />
          </GridItem>
        )}
        {data && (
          <>
            <GridItem
              md={8}
              lg={12}
              classes="baseline-assesment-result__summary"
            >
              <h4 className="baseline-assesment-result__summary__heading">
                {t("summary_heading")}
              </h4>
              <Markdown markDownText={data.summaryCK} className={"text"} />
              <NewButton
                onClick={() =>
                  navigate("/organizations", {
                    state: { personalizeFromAssessment: true },
                  })
                }
                size="lg"
                color="purple"
                classes="baseline-assesment-result__summary__interactive-map-button"
              >
                {t("organizations")}
              </NewButton>
            </GridItem>
          </>
        )}

        {data?.articles.length > 0 && (
          <GridItem
            md={8}
            lg={12}
            classes="baseline-assesment-result__articles"
          >
            <h4>{t("recommended_articles")}</h4>
            <Grid classes="baseline-assesment-result__content-grid">
              {data.articles.map((articleData) => (
                <GridItem md={4} lg={4} key={articleData.id}>
                  <CardMedia
                    type="portrait"
                    size="lg"
                    contentType="articles"
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
                        }/${createArticleSlug(articleData.title)}`,
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
                    size="lg"
                    contentType="videos"
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
                        }/${createArticleSlug(videoData.title)}`,
                      );
                    }}
                  />
                </GridItem>
              ))}
            </Grid>
          </GridItem>
        )}
        {data?.podcasts.length > 0 && (
          <GridItem
            md={8}
            lg={12}
            classes="baseline-assesment-result__podcasts"
          >
            <h4>{t("recommended_podcasts")}</h4>
            <Grid classes="baseline-assesment-result__content-grid">
              {data.podcasts.map((podcastData) => (
                <GridItem md={4} lg={4} key={podcastData.id}>
                  <CardMedia
                    type="portrait"
                    size="lg"
                    contentType="podcasts"
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
                        }/${createArticleSlug(podcastData.title)}`,
                      );
                    }}
                  />
                </GridItem>
              ))}
            </Grid>
          </GridItem>
        )}

        {/* Hidden export template for PDF */}
        <div className="baseline-assesment-result__pdf" aria-hidden="true">
          <div className="baseline-assesment-result__pdf__page" ref={pdfRef}>
            <div className="baseline-assesment-result__pdf__header">
              <div>
                <div className="baseline-assesment-result__pdf__title">
                  {t("assessment_completed")}
                </div>
                {formattedDate && (
                  <div className="baseline-assesment-result__pdf__meta">
                    {t("date", { defaultValue: "Date" })}: {formattedDate}
                  </div>
                )}
              </div>
              <img
                className="baseline-assesment-result__pdf__logo"
                src={exportLogoDataUrl || logoUrl}
                alt="USupport"
                crossOrigin="anonymous"
              />
            </div>

            {result && (
              <div className="baseline-assesment-result__pdf__section">
                <div className="baseline-assesment-result__pdf__sectionTitle">
                  {t("summary_heading")}
                </div>
                {result?.comparePrevious && (
                  <div className="baseline-assesment-result__pdf__subtitle">
                    {resultText}
                  </div>
                )}
                <div className="baseline-assesment-result__pdf__stats">
                  <div className="baseline-assesment-result__pdf__stat">
                    <div className="baseline-assesment-result__pdf__statLabel">
                      {t("psychological")}
                    </div>
                    <div className="baseline-assesment-result__pdf__statValue">
                      {result.psychologicalScore}
                    </div>
                  </div>
                  <div className="baseline-assesment-result__pdf__stat">
                    <div className="baseline-assesment-result__pdf__statLabel">
                      {t("biological")}
                    </div>
                    <div className="baseline-assesment-result__pdf__statValue">
                      {result.biologicalScore}
                    </div>
                  </div>
                  <div className="baseline-assesment-result__pdf__stat">
                    <div className="baseline-assesment-result__pdf__statLabel">
                      {t("social")}
                    </div>
                    <div className="baseline-assesment-result__pdf__statValue">
                      {result.socialScore}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {data?.summaryCK && (
              <div className="baseline-assesment-result__pdf__section">
                <div className="baseline-assesment-result__pdf__sectionTitle">
                  {t("summary_heading")}
                </div>
                <div className="baseline-assesment-result__pdf__markdown">
                  <Markdown markDownText={data.summaryCK} className={"text"} />
                </div>
              </div>
            )}

            {!!data?.articles?.length && (
              <div className="baseline-assesment-result__pdf__section">
                <div className="baseline-assesment-result__pdf__sectionTitle">
                  {t("recommended_articles")}
                </div>
                <ul className="baseline-assesment-result__pdf__list">
                  {data.articles.slice(0, 10).map((a) => (
                    <li
                      key={a.id}
                      className="baseline-assesment-result__pdf__li"
                    >
                      <span className="baseline-assesment-result__pdf__liTitle">
                        {a.title}
                      </span>
                      {a.creator ? (
                        <span className="baseline-assesment-result__pdf__liMeta">
                          {" "}
                          — {a.creator}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!data?.videos?.length && (
              <div className="baseline-assesment-result__pdf__section">
                <div className="baseline-assesment-result__pdf__sectionTitle">
                  {t("recommended_videos")}
                </div>
                <ul className="baseline-assesment-result__pdf__list">
                  {data.videos.slice(0, 10).map((v) => (
                    <li
                      key={v.id}
                      className="baseline-assesment-result__pdf__li"
                    >
                      <span className="baseline-assesment-result__pdf__liTitle">
                        {v.title}
                      </span>
                      {v.creator ? (
                        <span className="baseline-assesment-result__pdf__liMeta">
                          {" "}
                          — {v.creator}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!!data?.podcasts?.length && (
              <div className="baseline-assesment-result__pdf__section">
                <div className="baseline-assesment-result__pdf__sectionTitle">
                  {t("recommended_podcasts")}
                </div>
                <ul className="baseline-assesment-result__pdf__list">
                  {data.podcasts.slice(0, 10).map((p) => (
                    <li
                      key={p.id}
                      className="baseline-assesment-result__pdf__li"
                    >
                      <span className="baseline-assesment-result__pdf__liTitle">
                        {p.title}
                      </span>
                      {p.creator ? (
                        <span className="baseline-assesment-result__pdf__liMeta">
                          {" "}
                          — {p.creator}
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="baseline-assesment-result__pdf__footer">
              {t("download_pdf_footer", {
                defaultValue: "Generated by USupport client app",
              })}
            </div>
          </div>
        </div>
      </Grid>
    </GridItem>
  );
};
