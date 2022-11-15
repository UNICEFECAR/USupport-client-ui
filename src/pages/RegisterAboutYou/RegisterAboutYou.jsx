import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Page, RegisterAboutYou as RegisterAboutYouBlock } from "#blocks";
import { useWindowDimensions } from "@USupport-components-library/utils";
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
  const navigate = useNavigate();
  const { t } = useTranslation("register-about-you-page");
  const { width } = useWindowDimensions();

  const handleGoBack = () => {
    navigate("/register-support");
  };

  return (
    <Page
      classes="page__register-about-you"
      showFooter={false}
      showNavbar={false}
      additionalPadding={false}
      heading={width >= 768 ? t("heading_1") : t("heading_2")}
      handleGoBack={handleGoBack}
      showGoBackArrow={false}
    >
      <RegisterAboutYouBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
