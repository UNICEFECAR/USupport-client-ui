import React from "react";
import { Page, SharePlatform as SharePlatformBlock } from "#blocks";
import { useTranslation } from "react-i18next";

import "./share-platform.scss";

/**
 * SharePlatform
 *
 * SharePlatform page
 *
 * @returns {JSX.Element}
 */
export const SharePlatform = () => {
  const { t } = useTranslation("share-platform-page");

  return (
    <Page
      classes="page__share-platform"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <SharePlatformBlock />
    </Page>
  );
};
