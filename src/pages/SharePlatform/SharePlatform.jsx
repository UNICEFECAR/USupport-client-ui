import React from "react";
import { useTranslation } from "react-i18next";
import { Page, SharePlatform as SharePlatformBlock } from "#blocks";

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
