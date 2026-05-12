import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { InformationPortalHero, Page, DownloadApp } from "#blocks";
import { Videos as VideosBlock } from "#blocks";

import { useGetIsPodcastsAndVideosActive, useDebounce } from "#hooks";

import "./videos.scss";

/**
 * Videos
 *
 * Videos page
 *
 * @returns {JSX.Element}
 */
export const Videos = () => {
  const { t } = useTranslation("pages", { keyPrefix: "videos-page" });
  const location = useLocation();
  const { isVideosActive } = useGetIsPodcastsAndVideosActive();

  // Search state
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue);
  };

  const sort =
    location.state && location.state.sort ? location.state.sort : null;

  if (!isVideosActive) {
    return (
      <Navigate
        to={`/client/${localStorage.getItem(
          "language",
        )}/information-portal?tab=articles`}
      />
    );
  }

  return (
    <Page classes="page__videos" showGoBackArrow={false}>
      <InformationPortalHero
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        placeholder={t("search")}
        showGoBackArrow={true}
      />
      <VideosBlock
        showSearch={false}
        showCategories={true}
        sort={sort}
        externalSearchValue={debouncedSearchValue}
      />
      <DownloadApp />
    </Page>
  );
};
