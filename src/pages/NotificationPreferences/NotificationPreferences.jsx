import { TutorialVideo } from "@USupport-components-library/src";
import React, { useState } from "react";
import { useQueryClient, useQueries } from "@tanstack/react-query";
import { useGetIsUserGuidesActive } from "#hooks";
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
  const queryClient = useQueryClient();
  const isUserGuidesActive = useGetIsUserGuidesActive();
  const { t, i18n } = useTranslation("pages", {
    keyPrefix: "notification-preferences-page",
  });
  const language = i18n.language;
  const [nextTutorial, setNextTutorial] = useState(null);
  const tutorialQueries = useQueries({
    queries: TUTORIAL_KEYS.map((key) => ({
      queryKey: ["tutorial", "client", key, language],
      queryFn: () => cmsSvc.getTutorial(key, language, "client"),
      enabled: isUserGuidesActive && Boolean(language),
      retry: 1,
    })),
  });
  const availableKeys = isUserGuidesActive && tutorialQueries.every((query) => !query.isLoading)
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
          isEnabled={isUserGuidesActive}
          queryClient={queryClient}
          i18n={i18n}
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
