import React from "react";
import { Navigate } from "react-router-dom";
import { Page, Welcome as WelcomeBlock } from "#blocks";
import { RadialCircle, Loading } from "@USupport-components-library/src";
import { useIsLoggedIn } from "#hooks";

import "./welcome.scss";

/**
 * Welcome
 *
 * Welcome page
 *
 * @returns {JSX.Element}
 */
export const Welcome = () => {
  const isLoggedIn = useIsLoggedIn();

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true) return <Navigate to="/dashboard" />;

  return (
    <Page
      classes="page__welcome"
      showGoBackArrow={false}
      additionalPadding={false}
      showEmergencyButton={false}
    >
      <RadialCircle color="purple" />
      <RadialCircle color="blue" />
      <WelcomeBlock />
    </Page>
  );
};
