import { useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Page } from "#blocks";
import { Podcasts as PodcastsBlock } from "#blocks";
import { useGetIsPodcastsAndVideosActive } from "#hooks";

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
  const { isPodcastsActive } = useGetIsPodcastsAndVideosActive();
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

  if (!isPodcastsActive) {
    return (
      <Navigate
        to={`/client/${localStorage.getItem(
          "language"
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page
      classes="page__podcasts"
      heading={heading}
      subheading={subheading}
      showGoBackArrow={true}
    >
      <PodcastsBlock showSearch={true} showCategories={true} sort={sort} />
    </Page>
  );
};
