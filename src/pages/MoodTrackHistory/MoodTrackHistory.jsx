import React from "react";
import { useTranslation } from "react-i18next";

import { Page, MoodTrackHistory as MoodTrackHistoryBlock } from "#blocks";

import "./mood-track-history.scss";

/**
 * MoodTrackHistory
 *
 * Mood track history page
 *
 * @returns {JSX.Element}
 */
export const MoodTrackHistory = () => {
  const { t } = useTranslation("mood-track-history-page");
  return (
    <Page classes="page__mood-track-history" heading={t("heading")}>
      <MoodTrackHistoryBlock />
    </Page>
  );
};
