import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";

import {
  Block,
  Grid,
  GridItem,
  Icon,
  Label,
  Markdown,
  Like,
  Loading,
} from "@USupport-components-library/src";
import { useAddContentRating } from "#hooks";
// import { ShareModal } from "#modals";

import { cmsSvc, userSvc } from "@USupport-components-library/services";

import {
  constructShareUrl,
  ThemeContext,
} from "@USupport-components-library/utils";

import "./article-view.scss";

/**
 * ArticleView
 *
 * ArticleView block
 *
 * @return {jsx}
 */
export const ArticleView = ({ articleData, t }) => {
  const queryClient = useQueryClient();
  const creator = articleData.creator ? articleData.creator : null;
  const [contentRating, setContentRating] = React.useState(
    articleData.contentRating
  );
  // const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const { theme } = useContext(ThemeContext);

  const url = constructShareUrl({
    contentType: "article",
    id: articleData.id,
  });

  useEffect(() => {
    setContentRating(articleData.contentRating);
  }, [articleData.contentRating]);

  const onMutate = (data) => {
    const prevData = JSON.parse(JSON.stringify(contentRating));

    const likes = prevData.likes;
    const dislikes = prevData.dislikes;
    const isLikedByUser = prevData.isLikedByUser;
    const isDislikedByUser = prevData.isDislikedByUser;

    const newData = { ...contentRating };

    if (isLikedByUser && data.positive === null) {
      newData.likes = likes - 1;
      newData.isLikedByUser = false;

      cmsSvc.addRating({
        id: articleData.id,
        action: "remove-like",
        contentType: "article",
      });
    }
    if (isDislikedByUser && data.positive === null) {
      newData.dislikes = dislikes - 1;
      newData.isDislikedByUser = false;
      cmsSvc.addRating({
        id: articleData.id,
        action: "remove-dislike",
        contentType: "article",
      });
    }

    if (data.positive === true) {
      newData.likes = likes + 1;
      newData.isLikedByUser = true;
      cmsSvc.addRating({
        id: articleData.id,
        action: "add-like",
        contentType: "article",
      });
      if (isDislikedByUser) {
        newData.dislikes = dislikes - 1;
        newData.isDislikedByUser = false;
        cmsSvc.addRating({
          id: articleData.id,
          action: "remove-dislike",
          contentType: "article",
        });
      }
    }

    if (data.positive === false) {
      newData.dislikes = dislikes + 1;
      newData.isDislikedByUser = true;
      cmsSvc.addRating({
        id: articleData.id,
        action: "add-dislike",
        contentType: "article",
      });
      if (isLikedByUser) {
        newData.likes = likes - 1;
        newData.isLikedByUser = false;
        cmsSvc.addRating({
          id: articleData.id,
          action: "remove-like",
          contentType: "article",
        });
      }
    }

    setContentRating(newData);

    return () => {
      setContentRating(prevData);
    };
  };

  const onError = (error, rollback) => {
    rollback();
    toast.error(error);
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["userContentRatings"] });
  };

  const addContentRatingMutation = useAddContentRating(
    onMutate,
    onError,
    onSuccess
  );

  const handleAddRating = (action) => {
    addContentRatingMutation({
      contentId: articleData.id,
      positive:
        action === "like"
          ? true
          : action === "remove-like" || action === "remove-dislike"
          ? null
          : false,
      contentType: "article",
    });
  };

  const handleExportToPdf = async () => {
    try {
      setIsExportingPdf(true);
      // Get CMS API URL where the article can be accessed with nested image data
      const apiUrl = `${import.meta.env.VITE_CMS_API_URL}/articles/${
        articleData.id
      }?locale=${language}&populate=creator,category,labels,thumbnail.formats,image`;

      // Make the fetch call
      const response = await userSvc.generatePdf({
        contentUrl: apiUrl,
        contentType: "article",
        title: articleData.title,
        // Add image URL info to help server locate it
        imageUrl: articleData.imageMedium || articleData.image,
      });

      if (response.status !== 200) {
        throw new Error(`Error generating PDF: ${response.statusText}`);
      }

      // Get the PDF blob
      const blob = response.data;

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob);

      // Create download link
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `${articleData.title.replace(/\s+/g, "_")}.pdf`
      );

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error(t("export_failed"));
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
  };

  return (
    <Block classes="article-view">
      <Grid classes="article-view__main-grid">
        <GridItem md={8} lg={12} classes="article-view__title-item">
          <div className="article-view__title-row">
            <h3>{articleData.title}</h3>
          </div>
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__category-item">
          <div className="article-view__details-item__category">
            <p className="small-text ">{articleData.categoryName}</p>
          </div>
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__details-item">
          {creator && <p className={"small-text"}>{t("by", { creator })}</p>}

          <Icon
            color={theme === "dark" ? "#ffffff" : "#66768d"}
            name={"time"}
            size="sm"
          />
          <p className={"small-text"}>
            {" "}
            {articleData.readingTime} {t("min_read")}
          </p>

          <div
            onClick={handleExportToPdf}
            className="article-view__details-item__download"
          >
            {isExportingPdf ? (
              <Loading padding="0px" size="sm" />
            ) : (
              <Icon
                color={theme === "dark" ? "#ffffff" : "#66768d"}
                name="download"
                size="sm"
              />
            )}
          </div>
          <div
            onClick={handleCopyLink}
            className="article-view__details-item__download"
          >
            <Icon
              color={theme === "dark" ? "#ffffff" : "#66768d"}
              name="share"
              size="sm"
            />
          </div>
        </GridItem>

        <GridItem xs={3} md={6} lg={8} classes="article-view__labels-item">
          {articleData.labels.map((label, index) => {
            return (
              <Label
                classes={"article-view__label"}
                text={label.name}
                key={index}
              />
            );
          })}
        </GridItem>

        <GridItem xs={1} md={2} lg={4} classes="article-view__like-item">
          <Like
            renderInClient
            handleClick={handleAddRating}
            likes={contentRating?.likes || 0}
            isLiked={contentRating?.isLikedByUser || false}
            dislikes={contentRating?.dislikes || 0}
            isDisliked={contentRating?.isDislikedByUser || false}
            answerId={articleData.id}
          />
        </GridItem>

        <GridItem md={8} lg={12}>
          <img
            className="article-view__image-item"
            src={
              articleData.imageMedium
                ? articleData.imageMedium
                : "https://picsum.photos/300/400"
            }
            alt=""
          />
        </GridItem>

        <GridItem md={8} lg={12} classes="article-view__body-item">
          <Markdown markDownText={articleData.body} className={"text"} />
        </GridItem>
      </Grid>

      {/* <ShareModal
        isOpen={isShareModalOpen}
        onClose={handleCloseShareModal}
        contentUrl={url}
        title={articleData.title}
        successText={t("share_success")}
        copyText={t("copy_link")}
        shareTitle={t("share_title")}
      /> */}
    </Block>
  );
};

ArticleView.propTypes = {
  /**
   * Article data
   * */
  articleData: propTypes.shape({
    title: propTypes.string,
    creator: propTypes.string,
    readingTime: propTypes.string,
    body: propTypes.string,
    labels: propTypes.arrayOf(
      propTypes.shape({
        name: propTypes.string,
      })
    ),
  }).isRequired,
};

ArticleView.defaultProps = {
  articleData: {
    labels: [],
    title: "",
    creator: "",
    readingTime: 0,
    body: "",
  },
};
