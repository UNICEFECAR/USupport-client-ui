import React from "react";
import { Navigate } from "react-router-dom";
import { Page, Login as LoginBlock } from "#blocks";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle, Loading } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useIsLoggedIn } from "@USupport-components-library/hooks";

import "./login.scss";

/**
 * Login
 *
 * Login page
 *
 * @returns {JSX.Element}
 */
export const Login = () => {
  const { t } = useTranslation("login-page");
  const { width } = useWindowDimensions();

  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true) return <Navigate to="/dashboard" />;

  return (
    <Page
      classes="page__login"
      additionalPadding={false}
      heading={width >= 768 ? t("heading_1") : t("heading_2")}
    >
      <LoginBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
