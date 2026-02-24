import React, { useState, useEffect, useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Page,
  DownloadApp,
  InformationPortalHero,
  MostReadArticles,
  Articles as ArticlesBlock,
  Videos as VideosBlock,
  Podcasts as PodcastsBlock,
} from "#blocks";
import { useDebounce, useCustomNavigate as useNavigate } from "#hooks";

import {
  Grid,
  GridItem,
  Block,
  Icon,
  TabsUnderlined,
} from "@USupport-components-library/src";

import {
  ThemeContext,
  useWindowDimensions,
} from "@USupport-components-library/utils";

import "./information-portal.scss";

/**
 * InformationPortal
 *
 * Information Portal page
 *
 * @returns {JSX.Element}
 */
export const InformationPortal = () => {
  const { t } = useTranslation("pages", {
    keyPrefix: "information-portal",
  });
  const { width } = useWindowDimensions();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab");
  const navigate = useNavigate();

  const { isPodcastsActive, isVideosActive } = useContext(ThemeContext);

  if (
    (tab === "podcasts" && !isPodcastsActive) ||
    (tab === "videos" && !isVideosActive)
  ) {
    setSearchParams({ tab: "articles" });
  }

  const [contentTabs, setContentTabs] = useState([]);

  useEffect(() => {
    const initialTabs = [
      {
        label: "articles",
        value: "articles",
        isSelected: tab === "articles" || !tab,
      },
    ];

    if (isVideosActive) {
      initialTabs.push({
        label: "videos",
        value: "videos",
        isSelected: tab === "videos",
      });
    }

    if (isPodcastsActive) {
      initialTabs.push({
        label: "podcasts",
        value: "podcasts",
        isSelected: tab === "podcasts",
      });
    }

    setContentTabs(initialTabs);
  }, [isPodcastsActive, isVideosActive]);

  const [searchValue, setSearchValue] = useState("");
  const debouncedSearchValue = useDebounce(searchValue, 500);

  const handleSearchChange = (newValue) => {
    setSearchValue(newValue);
  };

  const handleTabSelect = (index) => {
    const tabsCopy = [...contentTabs];
    tabsCopy.forEach((tab, i) => {
      tab.isSelected = i === index;
    });
    setContentTabs(tabsCopy);
    setSearchParams({ tab: tabsCopy[index].value });
    setSearchValue("");
  };

  const selectedContentType =
    contentTabs.find((tab) => tab.isSelected)?.value || "articles";

  return (
    <Page classes="page__information-portal" showGoBackArrow={false}>
      <InformationPortalHero
        showSearch={true}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        placeholder={t("search")}
      />

      {contentTabs.length > 1 && (
        <Block classes="page__information-portal__tabs-block">
          <div
            className="page__header__text-container__go-back"
            onClick={() => navigate(-1)}
          >
            <Icon name="arrow-chevron-back" size="md" color="#20809E" />
            <p>{t("go_back")}</p>
          </div>
          <Grid classes="page__information-portal__tabs-container">
            <GridItem md={8} lg={12}>
              <div className="page__information-portal__tabs-container__inner">
                <TabsUnderlined
                  options={contentTabs.map((x) => ({
                    ...x,
                    label: t(x.label),
                  }))}
                  handleSelect={handleTabSelect}
                  classes="page__information-portal__tabs"
                  textType={width < 768 ? "h3" : "h2"}
                />
              </div>
            </GridItem>
          </Grid>
        </Block>
      )}

      {selectedContentType === "articles" && (
        <>
          {!searchValue && <MostReadArticles />}
          <ArticlesBlock
            showSearch={false}
            showCategories={true}
            externalSearchValue={debouncedSearchValue}
          />
        </>
      )}

      {selectedContentType === "videos" && (
        <VideosBlock
          showSearch={false}
          showCategories={true}
          externalSearchValue={debouncedSearchValue}
        />
      )}

      {selectedContentType === "podcasts" && (
        <PodcastsBlock
          showSearch={false}
          showCategories={true}
          externalSearchValue={debouncedSearchValue}
        />
      )}

      <DownloadApp />
    </Page>
  );
};
