import React from "react";
import {
  Page,
  MascotWelcomeHeader,
  MoodTracker,
  ConsultationsDashboard,
  ActivityLogDashboard,
  ArticlesDashboard,
} from "#blocks";

import "./dashboard.scss";

/**
 * Dashboard
 *
 * Dashboard page
 *
 * @returns {JSX.Element}
 */
export const Dashboard = () => {
  return (
    <Page
      classes="page__dashboard"
      showNavbar
      showFooter
      showEmergencyButton
      showGoBackArrow={false}
    >
      <MascotWelcomeHeader />
      <MoodTracker />
      <ArticlesDashboard />
      <ConsultationsDashboard />
      <ActivityLogDashboard />
    </Page>
  );
};
