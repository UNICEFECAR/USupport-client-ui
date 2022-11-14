import React from "react";
import { useTranslation } from "react-i18next";
import { Page, ActivityHistory as ActivityHistoryBlock } from "#blocks";
import { Button, RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import "./activity-history.scss";

/**
 * ActivityHistory
 *
 * ActivityHistory page
 *
 * @returns {JSX.Element}
 */
export const ActivityHistory = () => {
  const { t } = useTranslation("activity-history-page");
  const { width } = useWindowDimensions();

  const handleSchedule = () => {
    console.log("Schedule");
  };

  const handleGoBack = () => {
    console.log("Go back");
  };

  return (
    <Page
      classes="page__activity-history"
      showEmergencyButton={false}
      handleGoBack={handleGoBack}
      showFooter={width < 768 ? false : true}
      showNavbar={width < 768 ? false : true}
      additionalPadding={width < 768 ? false : true}
    >
      <ActivityHistoryBlock />
      <div className="page__activity-history__button-container">
        <Button label={t("button_label")} size="lg" onClick={handleSchedule} />
      </div>
      {width < 768 && (
        <RadialCircle classes="page__activity-history__radial-circle" />
      )}
    </Page>
  );
};
