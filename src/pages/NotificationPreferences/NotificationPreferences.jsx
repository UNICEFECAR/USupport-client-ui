import React from "react";
import { Page, NotificationPreferences, DownloadApp } from "#blocks";
import { useTranslation } from "react-i18next";

import "./notification-preferences.scss";

/**
 * NotificationPreferences
 *
 * Notification preferences page
 *
 * @returns {JSX.Element}
 */
export const NotificationPreferencesPage = () => {
  const { t } = useTranslation("pages", {
    keyPrefix: "notification-preferences-page",
  });
  return (
    <Page
      heading={t("heading")}
      subheading={t("subheading")}
      classes="page__notification-preferences"
    >
      <NotificationPreferences />
      <DownloadApp />
    </Page>
  );
};
