import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Page } from "#blocks";
import {
  Podcasts as PodcastsBlock,
  InformationPortalHero,
  DownloadApp,
} from "#blocks";
import { useGetIsPodcastsAndVideosActive, useDebounce } from "#hooks";

import "./podcasts.scss";

/**
 * Podcasts
 *
 * Podcasts page
 *
 * @returns {JSX.Element}
 */
export const Podcasts = () => {
  const { t } = useTranslation("pages", { keyPrefix: "podcasts-page" });
  const { isPodcastsActive } = useGetIsPodcastsAndVideosActive();
  const location = useLocation();

  // Search state
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue);
  };

  const sort =
    location.state && location.state.sort ? location.state.sort : null;

  if (!isPodcastsActive) {
    return (
      <Navigate
        to={`/client/${localStorage.getItem(
          "language",
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page classes="page__podcasts" showGoBackArrow={false}>
      <InformationPortalHero
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        placeholder={t("search")}
        showGoBackArrow={true}
      />
      <PodcastsBlock
        showSearch={false}
        showCategories={true}
        sort={sort}
        externalSearchValue={debouncedSearchValue}
      />
      <DownloadApp />
    </Page>
  );
};
