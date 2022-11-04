import React from "react";
import { Page, RegisterPreview as RegisterPreviewBlock } from "#blocks";
import { Button } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./register-preview.scss";

/**
 * RegisterPreview
 *
 * RegisterPreview page
 *
 * @returns {JSX.Element}
 */
export const RegisterPreview = () => {
  const { t } = useTranslation("register-preview-page");

  const handleLoginRedirect = () => {
    console.log("Login redirect");
  };

  return (
    <Page
      classes="page__register-preview"
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
      <RegisterPreviewBlock />
    </Page>
  );
};
