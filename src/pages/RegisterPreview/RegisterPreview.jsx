import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Navigate } from "react-router-dom";
import { Page, RegisterPreview as RegisterPreviewBlock } from "#blocks";
import { Button, Loading } from "@USupport-components-library/src";
import { useIsLoggedIn } from "#hooks";

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
  const isLoggedIn = useIsLoggedIn();

  const handleLoginRedirection = () => {
    navigate("/login");
  };

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true) return <Navigate to="/dashboard" />;

  return (
    <Page
      classes="page__register-preview"
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
