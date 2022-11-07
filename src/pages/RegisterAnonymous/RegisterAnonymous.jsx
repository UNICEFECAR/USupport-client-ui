import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Navigate } from "react-router-dom";
import { Page, RegisterAnonymous as RegisterAnonymousBlock } from "#blocks";
import { RadialCircle, Loading } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useIsLoggedIn } from "@USupport-components-library/hooks";

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
  if (isLoggedIn === true) return <Navigate to="/dashboard" />;

  return (
    <Page
      classes="page__register-anonymous"
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
