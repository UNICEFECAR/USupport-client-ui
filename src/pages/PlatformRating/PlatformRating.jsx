import React from "react";
import { Page, PlatformRating as PlatformRatingBlock } from "#blocks";
import { useTranslation } from "react-i18next";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle } from "@USupport-components-library/src";

import "./platform-rating.scss";

/**
 * PlatformRating
 *
 * PlatformRating page
 *
 * @returns {JSX.Element}
 */
export const PlatformRating = () => {
  const { t } = useTranslation("platform-rating-page");
  const { width } = useWindowDimensions();

  return (
    <Page
      classes="page__platform-rating"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <PlatformRatingBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
