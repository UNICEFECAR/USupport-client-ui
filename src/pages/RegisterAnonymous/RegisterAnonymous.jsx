import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Page, RegisterAnonymous as RegisterAnonymousBlock } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import "./register-anonymous.scss";

/**
 * RegisterAnonymous
 *
 * RegisterAnonymous page
 *
 * @returns {JSX.Element}
 */
export const RegisterAnonymous = () => {
  const { t } = useTranslation("register-anonymous-page");
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/register-preview");
  };

  return (
    <Page
      classes="page__register-anonymous"
      showFooter={false}
      showNavbar={false}
      additionalPadding={false}
      heading={t("heading")}
      handleGoBack={handleGoBack}
      subheading={t("subheading")}
    >
      <RegisterAnonymousBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
