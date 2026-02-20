import React from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { Page, Login as LoginBlock } from "#blocks";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle, Loading } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useIsLoggedIn } from "#hooks";

import "./login.scss";

/**
 * Login
 *
 * Login page
 *
 * @returns {JSX.Element}
 */
export const Login = () => {
  const { t } = useTranslation("pages", { keyPrefix: "login-page" });
  const { width } = useWindowDimensions();
  const [searchParams] = useSearchParams();
  const nextPath = searchParams.get("next");

  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true) {
    const redirectTo =
      nextPath && nextPath.startsWith("/client/")
        ? nextPath
        : `/client/${localStorage.getItem("language")}/dashboard`;
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <Page
      classes="page__login"
      additionalPadding={false}
      heading={width >= 768 ? t("heading_1") : t("heading_2")}
      renderLanguageSelector={true}
    >
      <LoginBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
