import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

import { Page, MoodTrackHistory as MoodTrackHistoryBlock } from "#blocks";
import { RootContext } from "#routes";

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
  const { isTmpUser } = useContext(RootContext);
  if (isTmpUser)
    return (
      <Navigate to={`/client/${localStorage.getItem("language")}/dashboard`} />
    );

  return (
    <Page classes="page__mood-track-history" heading={t("heading")}>
      <MoodTrackHistoryBlock />
    </Page>
  );
};
