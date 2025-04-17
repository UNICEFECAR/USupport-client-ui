import React from "react";
import { Navigate } from "react-router-dom";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useTranslation } from "react-i18next";
import { Page, ForgotPassword as ForgotPasswordBlock } from "#blocks";
import { RadialCircle, Loading } from "@USupport-components-library/src";
import { useIsLoggedIn } from "#hooks";

import "./forgot-password.scss";

/**
 * ForgotPassword
 *
 * ForgotPassword page
 *
 * @returns {JSX.Element}
 */
export const ForgotPassword = () => {
  const { t } = useTranslation("forgot-password-page");
  const { width } = useWindowDimensions();

  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true)
    return (
      <Navigate to={`/${localStorage.getItem("language")}/client/dashboard`} />
    );

  return (
    <Page
      classes="page__forgot-password"
      additionalPadding={false}
      heading={t("heading")}
    >
      <ForgotPasswordBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
