import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle } from "@USupport-components-library/src";

import { Page, RegisterAboutYou as RegisterAboutYouBlock } from "#blocks";
import { useCustomNavigate as useNavigate } from "#hooks";

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
  const location = useLocation();
  const isAnonymous = location?.state?.isAnonymous;
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
      showEmergencyButton={false}
    >
      <RegisterAboutYouBlock isAnonymous={isAnonymous} />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
