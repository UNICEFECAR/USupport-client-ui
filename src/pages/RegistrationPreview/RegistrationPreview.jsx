import React from "react";
import { Page, RegistrationPreview as RegistrationPreviewBlock } from "#blocks";
import { Button } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./registration-preview.scss";

/**
 * RegistrationPreview
 *
 * RegistrationPreview page
 *
 * @returns {JSX.Element}
 */
export const RegistrationPreview = () => {
  const { t } = useTranslation("register-preview-page");

  const handleLoginRedirect = () => {
    console.log("Login redirect");
  };

  return (
    <Page
      classes="page__registration-preview"
      showEmergencyButton={false}
      showFooter={false}
      showNavbar={false}
      additionalPadding={false}
      headingButton={
        <Button
          size="md"
          label="Login to the app"
          color="purple"
          web
          onClick={() => handleLoginRedirect()}
        />
      }
    >
      <RegistrationPreviewBlock />
    </Page>
  );
};
