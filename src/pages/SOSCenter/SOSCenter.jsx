import React from "react";
import { Page, SOSCenter as SOSCenterBlock } from "#blocks";
import { useTranslation } from "react-i18next";

/**
 * SOSCenter page.
 *
 * @returns {JSX.Element}
 */
export const SOSCenter = () => {
  const { t } = useTranslation("pages", { keyPrefix: "sos-center-page" });
  return (
    <Page heading={t("heading")} subheading={t("subheading")}>
      <SOSCenterBlock />
    </Page>
  );
};
