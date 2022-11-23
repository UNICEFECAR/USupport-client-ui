import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Page, RegisterEmail as RegisterEmailBlock } from "#blocks";
import { Loading } from "@USupport-components-library/src";
import { useIsLoggedIn } from "#hooks";

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
  const isLoggedIn = useIsLoggedIn();

  const handleGoBack = () => {
    navigate("/register-preview");
  };

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true) return <Navigate to="/dashboard" />;

  return (
    <Page
      classes="page__register-email"
      heading={t("heading")}
      handleGoBack={handleGoBack}
    >
      <RegisterEmailBlock />
    </Page>
  );
};
