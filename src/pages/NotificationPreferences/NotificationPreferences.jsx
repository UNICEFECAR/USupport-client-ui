import { TutorialVideo } from "../../components/TutorialVideo";
import React, { useState } from "react";
import { useQueries } from "@tanstack/react-query";
import { Page, NotificationPreferences, DownloadApp } from "#blocks";
import { useTranslation } from "react-i18next";

import { cmsSvc } from "@USupport-components-library/services";

import "./notification-preferences.scss";

const TUTORIAL_KEYS = ["notifications", "display-and-language"];

/**
 * NotificationPreferences
 *
 * Notification preferences page
 *
 * @returns {JSX.Element}
 */
export const NotificationPreferencesPage = () => {
  const { t, i18n } = useTranslation("pages", {
    keyPrefix: "notification-preferences-page",
  });
  const language = i18n.language;
  const isArmenia = localStorage.getItem("country") === "AM";
  const [nextTutorial, setNextTutorial] = useState(null);
  const tutorialQueries = useQueries({
    queries: TUTORIAL_KEYS.map((key) => ({
      queryKey: ["tutorial", "client", key, language],
      queryFn: () => cmsSvc.getTutorial(key, language, "client"),
      enabled: isArmenia && Boolean(language),
      retry: 1,
    })),
  });
  const availableKeys = isArmenia && tutorialQueries.every((query) => !query.isLoading)
    ? TUTORIAL_KEYS.filter((key, index) => {
      const { data, isError } = tutorialQueries[index];
      const video = data?.video;
      return !isError && data?.key === key && data?.locale === language &&
        data?.platform === "client" && video?.hls_url &&
        (!video.status || video.status === "ready");
    })
    : [];
  const preferredKey = nextTutorial?.language === language
    ? nextTutorial.key : TUTORIAL_KEYS[0];
  const selectedKey = availableKeys.includes(preferredKey) ? preferredKey : availableKeys[0];

  return (
    <Page
      goBackContent={selectedKey && (
        <TutorialVideo
          tutorialKey={selectedKey}
          language={language}
          onClose={() => setNextTutorial({
            language,
            key: availableKeys[(availableKeys.indexOf(selectedKey) + 1) % availableKeys.length],
          })}
        />
      )}
      heading={t("heading")}
      subheading={t("subheading")}
      classes="page__notification-preferences"
    >
      <NotificationPreferences />
      <DownloadApp />
    </Page>
  );
};
