import React from "react";
import { Page, RegisterAboutYou as RegisterAboutYouBlock } from "#blocks";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useTranslation } from "react-i18next";
import { RadialCircle } from "@USupport-components-library/src";

import "./register-about-you.scss";

/**
 * RegisterAboutYou
 *
 * RegisterAboutYou page
 *
 * @returns {JSX.Element}
 */
export const RegisterAboutYou = () => {
  const { t } = useTranslation("register-about-you-page");

  const { width } = useWindowDimensions();

  return (
    <Page
      classes="page__register-about-you"
      showFooter={false}
      showEmergencyButton={false}
      showNavbar={false}
      additionalPadding={false}
      heading={width >= 768 ? t("heading_1") : t("heading_2")}
    >
      <RegisterAboutYouBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
