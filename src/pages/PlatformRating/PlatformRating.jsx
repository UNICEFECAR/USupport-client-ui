import React from "react";
import { useTranslation } from "react-i18next";

import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle } from "@USupport-components-library/src";

import {
  Page,
  PlatformRating as PlatformRatingBlock,
  DownloadApp,
} from "#blocks";

import "./platform-rating.scss";

/**
 * PlatformRating
 *
 * PlatformRating page
 *
 * @returns {JSX.Element}
 */
export const PlatformRating = () => {
  const { t } = useTranslation("pages", { keyPrefix: "platform-rating-page" });
  const { width } = useWindowDimensions();

  return (
    <Page
      classes="page__platform-rating"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <PlatformRatingBlock />
      {width < 768 && <RadialCircle color="purple" />}
      <DownloadApp />
    </Page>
  );
};
