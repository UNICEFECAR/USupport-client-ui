import React from "react";
import { Navigate } from "react-router-dom";
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
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true)
    return (
      <Navigate to={`/client/${localStorage.getItem("language")}/dashboard`} />
    );

  return (
    <Page
      classes="page__register-preview"
      additionalPadding={false}
      showHeadingButtonInline
    >
      <RegisterPreviewBlock />
    </Page>
  );
};
