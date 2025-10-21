import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

import { ButtonWithIcon, Button } from "@USupport-components-library/src";
import {
  Page,
  MoodTrackHistory as MoodTrackHistoryBlock,
  GiveSuggestion,
} from "#blocks";
import { RootContext } from "#routes";
import { MoodTrackReport } from "#backdrops";
import { HowItWorksMoodTrack } from "#modals";

import "./mood-track-history.scss";

/**
 * MoodTrackHistory
 *
 * Mood track history page
 *
 * @returns {JSX.Element}
 */
export const MoodTrackHistory = () => {
  const { t } = useTranslation("pages", { keyPrefix: "mood-tracker-page" });
  const { isTmpUser } = useContext(RootContext);
  const country = localStorage.getItem("country");

  const [isHowItWorksMoodTrackOpen, setIsHowItWorksMoodTrackOpen] =
    useState(false);

  const IS_RO = country === "RO";

  const [isReportOpen, setIsReportOpen] = useState(false);

  if (isTmpUser)
    return (
      <Navigate to={`/client/${localStorage.getItem("language")}/dashboard`} />
    );

  return (
    <Page
      classes="page__mood-track-history"
      heading={t("heading")}
      subheading={t("subheading")}
      headingButton={
        IS_RO ? (
          <div className="page__mood-track-history__heading-button-container">
            <Button
              label={t("how_it_works")}
              size="sm"
              type="secondary"
              color="purple"
              onClick={() => setIsHowItWorksMoodTrackOpen(true)}
            />
            <ButtonWithIcon
              label={t("export_report")}
              iconName="document"
              iconColor="#ffffff"
              size="sm"
              circleSize="sm"
              color="purple"
              onClick={() => setIsReportOpen(true)}
            />
          </div>
        ) : undefined
      }
    >
      {IS_RO && (
        <HowItWorksMoodTrack
          isOpen={isHowItWorksMoodTrackOpen}
          onClose={() => setIsHowItWorksMoodTrackOpen(false)}
        />
      )}
      <MoodTrackReport
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
      <MoodTrackHistoryBlock />
      <GiveSuggestion type="mood-tracker" />
    </Page>
  );
};
