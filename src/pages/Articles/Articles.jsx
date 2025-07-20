import React from "react";
import { useLocation } from "react-router-dom";
import { Page, Articles as ArticlesBlock } from "#blocks";
import { useTranslation } from "react-i18next";

/**
 * Articles
 *
 * Articles page
 *
 * @returns {JSX.Element}
 */
export const Articles = () => {
  const { t } = useTranslation("articles-page");
  const location = useLocation();

  const sort =
    location.state && location.state.sort ? location.state.sort : null;

  let heading = t("heading_default");
  let subheading = t("subheading_default");
  let showBackGoBackArrow = false;

  switch (sort) {
    case "createdAt":
      heading = t("heading_newest");
      subheading = t("subheading_newest");
      showBackGoBackArrow = true;
      break;
    case "read_count":
      heading = t("heading_most_read");
      subheading = t("subheading_most_read");
      showBackGoBackArrow = true;
      break;

    default:
      break;
  }

  return (
    <Page
      classes="page__articles"
      // heading={heading}
      // subheading={subheading}
      showGoBackArrow={showBackGoBackArrow}
    >
      <ArticlesBlock showSearch={true} showCategories={true} sort={sort} />
    </Page>
  );
};
