import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Page, RegisterEmail as RegisterEmailBlock } from "#blocks";

import "./register-email.scss";

/**
 * RegisterEmail
 *
 * Register with email page
 *
 * @returns {JSX.Element}
 */
export const RegisterEmail = () => {
  const { t } = useTranslation("register-email-page");
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate("/register-preview");
  };

  return (
    <Page
      showNavbar={false}
      showFooter={false}
      classes="page__register-email"
      heading={t("heading")}
      handleGoBack={handleGoBack}
    >
      <RegisterEmailBlock />
    </Page>
  );
};
