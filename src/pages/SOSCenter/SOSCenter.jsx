import React from "react";
import { SOSCenter as SOSCenterBlock } from "../../blocks/SOSCenter/SOSCenter";
import { Page } from "../../blocks/Page/Page";
import { useTranslation } from "react-i18next";

/**
 * SOSCenter page.
 *
 * @returns {JSX.Element}
 */
export const SOSCenter = ({ contacts }) => {
  const { t } = useTranslation("sos-center-page");
  return (
    <Page heading={t("heading")} subheading={t("subheading")}>
      <SOSCenterBlock contacts={contacts} />
    </Page>
  );
};
