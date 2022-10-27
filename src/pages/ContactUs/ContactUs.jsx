import React from "react";
import { useTranslation } from "react-i18next";
import { RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/src/utils";
import { Page } from "../../blocks/Page";
import { ContactUs as ContactUsBlock } from "../../blocks/ContactUs";
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
  const { t } = useTranslation("contact-us-page");
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
    </Page>
  );
};
