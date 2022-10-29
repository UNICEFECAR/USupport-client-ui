import React from "react";
import { Page, ForgotPassword as ForgotPasswordBlock } from "#blocks";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

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

  return (
    <Page
      classes="page__forgot-password"
      showFooter={false}
      showEmergencyButton={false}
      showNavbar={false}
      additionalPadding={false}
      heading={t("heading")}
    >
      <ForgotPasswordBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
