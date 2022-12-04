import React from "react";
import { useTranslation } from "react-i18next";
import { Page, MoodTrackerHistory } from "#blocks";

import "./mood-tracker.scss";

/**
 * MoodTracker
 *
 * MoodTracker page
 *
 * @returns {JSX.Element}
 */
export const MoodTracker = () => {
  const { t } = useTranslation("mood-tracker-page");

  return (
    <Page
      classes="page__mood-tracker"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <MoodTrackerHistory />
    </Page>
  );
};
