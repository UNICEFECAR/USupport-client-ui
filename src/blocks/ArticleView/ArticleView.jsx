import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import propTypes from "prop-types";

import {
  Block,
  Icon,
  Label,
  Markdown,
  Like,
  Loading,
} from "@USupport-components-library/src";
import {
  useAddContentRating,
  useAddContentEngagement,
  useRemoveContentEngagement,
} from "#hooks";
import {
  createArticleSlug,
  constructShareUrl,
} from "@USupport-components-library/utils";

import { cmsSvc, userSvc } from "@USupport-components-library/services";

import { ThemeContext } from "@USupport-components-library/utils";

import "./article-view.scss";

/**
 * ArticleView
 *
 * ArticleView block
 *
 * @return {jsx}
 */
export const ArticleView = ({ articleData, t, language, isTmpUser }) => {
  const queryClient = useQueryClient();
  const creator = articleData.creator ? articleData.creator : null;

  // const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [ratings, setRatings] = useState({
    likes: articleData.likes || 0,
    dislikes: articleData.dislikes || 0,
    isLikedByUser: articleData.contentRating?.isLikedByUser || false,
    isDislikedByUser: articleData.contentRating?.isDislikedByUser || false,
  });
  const [hasUpdatedUrl, setHasUpdatedUrl] = useState(false);
  const [isShared, setIsShare] = useState(false);
  const { theme } = useContext(ThemeContext);

  const url = constructShareUrl({
    contentType: "article",
    id: articleData.id,
    name: articleData.title,
  });

  useEffect(() => {
    setHasUpdatedUrl(false);
  }, [language]);

  useEffect(() => {
    if (articleData?.title && !hasUpdatedUrl) {
      const currentSlug = createArticleSlug(articleData.title);
      const urlSlug = articleData.name;

      if (currentSlug !== urlSlug) {
        const newUrl = `/client/${language}/information-portal/article/${articleData.id}/${currentSlug}`;

        // Just replace the URL in browser history without navigation
        window.history.replaceState(null, "", newUrl);
        setHasUpdatedUrl(true);
      }
    }
  }, [language]);

  const onMutate = (data) => {
    const prevData = JSON.parse(JSON.stringify(ratings));

    const likes = prevData.likes;
    const dislikes = prevData.dislikes;
    const isLikedByUser = prevData.isLikedByUser;
    const isDislikedByUser = prevData.isDislikedByUser;

    const newData = { ...ratings };

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

    setRatings(newData);

    return () => {
      setRatings(prevData);
    };
  };

  const onError = (error, rollback) => {
    rollback();
    toast.error(error);
  };

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["userContentRatings"] });
    queryClient.invalidateQueries({ queryKey: ["userContentEngagements"] });
  };

  const addContentRatingMutation = useAddContentRating(
    onMutate,
    onError,
    onSuccess,
  );

  const addContentEngagementMutation = useAddContentEngagement();
  const removeContentEngagementMutation = useRemoveContentEngagement();

  // Track view when article is loaded using useQuery
  useQuery(
    ["article-view-tracking", articleData.id],
    async () => {
      addContentEngagementMutation({
        contentId: articleData.id,
        contentType: "article",
        action: "view",
      });
      return true;
    },
    {
      enabled: !!articleData?.id && !isTmpUser,
    },
  );

  const handleAddRating = (action) => {
    if (isTmpUser) return;

    const isRemovingReaction =
      action === "remove-like" || action === "remove-dislike";

    // Track engagement
    if (isRemovingReaction) {
      // Remove like/dislike from engagement tracking
      removeContentEngagementMutation({
        contentId: articleData.id,
        contentType: "article",
      });
    } else {
      // Add like/dislike to engagement tracking
      addContentEngagementMutation({
        contentId: articleData.id,
        contentType: "article",
        action: action === "like" ? "like" : "dislike",
      });
    }

    // Update rating in the rating system
    addContentRatingMutation({
      contentId: articleData.id,
      positive: action === "like" ? true : isRemovingReaction ? null : false,
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
        `${articleData.title.replace(/\s+/g, "_")}.pdf`,
      );

      // Trigger download
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      // Track download engagement
      if (!isTmpUser) {
        addContentEngagementMutation({
          contentId: articleData.id,
          contentType: "article",
          action: "download",
        });
      }
    } catch (error) {
      console.log(error);
      toast.error(t("export_failed"));
    } finally {
      setIsExportingPdf(false);
      // Increment the download count for the article
      cmsSvc.addArticleDownloadCount(articleData.id);
    }
  };

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("share_success"));
    if (!isShared) {
      cmsSvc.addArticleShareCount(articleData.id).then(() => {
        setIsShare(true);
      });
    } // Track share engagement
    if (!isTmpUser) {
      addContentEngagementMutation({
        contentId: articleData.id,
        contentType: "article",
        action: "share",
      });
    }
  };

  return (
    <Block classes="article-view">
      <div className="article-view__content">
        {/* Title */}
        <h2 className="article-view__title">{articleData.title}</h2>

        {/* Author & meta row */}
        <div className="article-view__meta">
          {articleData.categoryName && (
            <div className="article-view__category-badge">
              <p className="small-text">{articleData.categoryName}</p>
            </div>
          )}
          {creator && (
            <p className="text article-view__creator">{t("by", { creator })}</p>
          )}
          <div className="article-view__meta-dot" />
          <Icon color={"#ba7446"} name={"time"} size="sm" />
          <p className="text">
            {articleData.readingTime} {t("min_read")}
          </p>
        </div>

        {/* Labels */}
        {articleData.labels.length > 0 && (
          <div className="article-view__labels">
            {articleData.labels.map((label, index) => (
              <Label
                classes="article-view__label"
                text={label.name}
                key={index}
              />
            ))}
          </div>
        )}

        {/* Separator */}
        <div className="article-view__separator" />

        {/* Action bar */}
        <div className="article-view__actions">
          <div className="article-view__actions-left">
            <Like
              renderInClient
              handleClick={handleAddRating}
              likes={ratings.likes || 0}
              isLiked={ratings.isLikedByUser || false}
              dislikes={ratings.dislikes || 0}
              isDisliked={ratings.isDislikedByUser || false}
              answerId={articleData.id}
              isTmpUser={isTmpUser}
            />
          </div>
          <div className="article-view__actions-right">
            <div
              onClick={handleExportToPdf}
              className="article-view__action-btn"
            >
              {isExportingPdf ? (
                <Loading padding="0px" size="sm" />
              ) : (
                <Icon
                  color={theme === "light" ? "#66768d" : "#ffffff"}
                  name="download"
                />
              )}
            </div>
            <div onClick={handleCopyLink} className="article-view__action-btn">
              <Icon
                color={theme === "light" ? "#66768d" : "#ffffff"}
                name="share"
              />
            </div>
          </div>
        </div>

        {/* Separator */}
        <div className="article-view__separator" />

        {/* Hero image */}
        <img
          className="article-view__image"
          src={
            articleData.imageMedium
              ? articleData.imageMedium
              : "https://picsum.photos/300/400"
          }
          alt={articleData.title}
        />

        {/* Article body */}
        <div className="article-view__body">
          <Markdown
            markDownText={articleData.bodyCK || articleData.body}
            className={"text"}
          />
        </div>
      </div>
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
      }),
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
