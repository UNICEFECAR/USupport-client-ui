import React from "react";
import { useTranslation } from "react-i18next";

import { RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import { Page, ContactUs as ContactUsBlock, DownloadApp } from "#blocks";

import "./contact-us.scss";

/**
 * ContactUs
 *
 * Contact us page
 *
 * @returns {JSX.Element}
 */
export const ContactUs = () => {
  const { width } = useWindowDimensions();
  const { t } = useTranslation("pages", { keyPrefix: "contact-us-page" });
  return (
    <Page
      classes="page__contact-us"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      {width < 768 && (
        <RadialCircle
          classes="page__contact-us__radial-circle"
          color="purple"
        />
      )}
      <ContactUsBlock />
      <DownloadApp />
    </Page>
  );
};
