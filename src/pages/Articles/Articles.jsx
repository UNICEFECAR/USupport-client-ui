import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  InformationPortalHero,
  Page,
  Articles as ArticlesBlock,
  DownloadApp,
} from "#blocks";
import { useDebounce } from "#hooks";

/**
 * Articles
 *
 * Articles page
 *
 * @returns {JSX.Element}
 */
export const Articles = () => {
  const { t } = useTranslation("pages", { keyPrefix: "articles-page" });
  const location = useLocation();

  // Search state
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue);
  };

  const sort =
    location.state && location.state.sort ? location.state.sort : null;

  return (
    <Page classes="page__articles" showGoBackArrow={false}>
      <InformationPortalHero
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        placeholder={t("search")}
        showGoBackArrow={true}
      />
      <ArticlesBlock
        showSearch={false}
        showCategories={true}
        sort={sort}
        externalSearchValue={debouncedSearchValue}
      />
      <DownloadApp />
    </Page>
  );
};
