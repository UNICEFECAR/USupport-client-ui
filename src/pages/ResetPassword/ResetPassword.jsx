import React from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { Page, ResetPassword as ResetPasswordBlock } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";

import "./reset-password.scss";

/**
 * ResetPassword
 *
 * Reset password screen
 *
 * @returns {JSX.Element}
 */
export const ResetPassword = () => {
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/forgot-password");
  };

  return (
    <Page
      handleGoBack={handleGoBack}
      classes="page__reset-password"
      additionalPadding={false}
      showEmergencyButton={false}
    >
      <RadialCircle color="purple" />
      <RadialCircle color="blue" />
      <ResetPasswordBlock />
    </Page>
  );
};
