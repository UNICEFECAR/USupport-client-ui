import React from "react";
import { useTranslation } from "react-i18next";
import { Page, ResetPassword as ResetPasswordBlock } from "#blocks";

import "./reset-password.scss";

/**
 * ResetPassword
 *
 * Reset password screen
 *
 * @returns {JSX.Element}
 */
export const ResetPassword = () => {
  const { t } = useTranslation("reset-password-page");
  return (
    <Page heading={t("heading")} classes="page__reset-password">
      <ResetPasswordBlock />
    </Page>
  );
};
