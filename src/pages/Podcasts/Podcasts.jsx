import React from "react";
import { useLocation } from "react-router-dom";
import { Page } from "#blocks";
import { Podcasts as PodcastsBlock } from "#blocks";
import { useTranslation } from "react-i18next";

import "./podcasts.scss";

/**
 * Podcasts
 *
 * Podcasts page
 *
 * @returns {JSX.Element}
 */
export const Podcasts = () => {
  const { t } = useTranslation("podcasts-page");
  const location = useLocation();

  const sort =
    location.state && location.state.sort ? location.state.sort : null;

  let heading = t("heading_default");
  let subheading = t("subheading_default");

  switch (sort) {
    case "createdAt":
      heading = t("heading_newest");
      subheading = t("subheading_newest");
      break;
    case "view_count":
      heading = t("heading_most_viewed");
      subheading = t("subheading_most_viewed");
      break;
    default:
      break;
  }

  return (
    <Page
      classes="page__podcasts"
      heading={heading}
      subheading={subheading}
      showGoBackArrow={showBackGoBackArrow}
    >
      <PodcastsBlock showSearch={true} showCategories={true} sort={sort} />
    </Page>
  );
};
