import React from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
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
  const { t } = useTranslation("pages", { keyPrefix: "reset-password-page" });
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/forgot-password");
  };
  return (
    <Page
      handleGoBack={handleGoBack}
      heading={t("heading")}
      classes="page__reset-password"
    >
      <ResetPasswordBlock />
    </Page>
  );
};
