import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate } from "react-router-dom";

import { RadialCircle, Loading } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import { Page, RegisterAnonymous as RegisterAnonymousBlock } from "#blocks";
import { useCustomNavigate as useNavigate, useIsLoggedIn } from "#hooks";

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
  const isLoggedIn = useIsLoggedIn();

  const handleGoBack = () => {
    navigate("/register-preview");
  };

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true)
    return (
      <Navigate to={`/client/${localStorage.getItem("language")}/dashboard`} />
    );

  return (
    <Page
      classes="page__register-anonymous"
      additionalPadding={false}
      heading={t("heading")}
      handleGoBack={handleGoBack}
      subheading={t("subheading")}
      renderLanguageSelector={true}
      showEmergencyButton={false}
    >
      <RegisterAnonymousBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
