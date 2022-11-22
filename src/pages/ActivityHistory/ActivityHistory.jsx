import React from "react";
import { Page, ActivityHistory as ActivityHistoryBlock } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";
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
  const { width } = useWindowDimensions();

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
      showGoBackArrow={false}
    >
      <ActivityHistoryBlock />
      {width < 768 && (
        <RadialCircle classes="page__activity-history__radial-circle" />
      )}
    </Page>
  );
};
