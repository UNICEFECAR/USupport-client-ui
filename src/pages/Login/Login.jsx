import React from "react";
import { Page } from "../../blocks/Page/Page";
import { Login as LoginBlock } from "../../blocks/Login/Login";
import { useWindowDimensions } from "@USupport-components-library/src/utils";
import { RadialCircle } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

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

  return (
    <Page
      classes="page__login"
      showFooter={false}
      showEmergencyButton={false}
      showNavbar={false}
      additionalPadding={false}
      heading={width >= 768 ? t("heading_1") : t("heading_2")}
    >
      <LoginBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
