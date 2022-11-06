import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Page, RegisterPreview as RegisterPreviewBlock } from "#blocks";
import { Button } from "@USupport-components-library/src";

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
  const navigate = useNavigate();

  const handleLoginRedirection = () => {
    navigate("/login");
  };

  return (
    <Page
      classes="page__register-preview"
      showFooter={false}
      showNavbar={false}
      additionalPadding={false}
      headingButton={
        <Button
          size="md"
          label={t("login")}
          color="purple"
          web
          onClick={handleLoginRedirection}
        />
      }
    >
      <RegisterPreviewBlock />
    </Page>
  );
};
