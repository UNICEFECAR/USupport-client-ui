import React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Page, RegisterPreview as RegisterPreviewBlock } from "#blocks";
import { Loading } from "@USupport-components-library/src";
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
      showHeadingButtonInline
      showEmergencyButton={false}
    >
      <RegisterPreviewBlock handleLoginRedirection={handleLoginRedirection} />
    </Page>
  );
};
