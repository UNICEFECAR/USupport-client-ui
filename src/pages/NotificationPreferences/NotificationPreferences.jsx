import React from "react";
import { Page } from "../../blocks/Page/Page";
import { NotificationPreferences } from "../../blocks/NotificationPreferences";
import "./notification-preferences.scss";
import { useTranslation } from "react-i18next";

/**
 * NotificationPreferences
 *
 * Notification preferences page
 *
 * @returns {JSX.Element}
 */
export const NotificationPreferencesPage = () => {
  const { t } = useTranslation("notification-preferences-page");
  return (
    <Page
      heading={t("heading")}
      subheading={t("subheading")}
      classes="page__notification-preferences"
    >
      <NotificationPreferences />
    </Page>
  );
};
