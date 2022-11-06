import React from "react";
import { Page, Welcome as WelcomeBlock } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";

import "./welcome.scss";

/**
 * Welcome
 *
 * Welcome page
 *
 * @returns {JSX.Element}
 */
export const Welcome = () => {
  return (
    <Page
      classes="page__welcome"
      showNavbar={false}
      showFooter={false}
      showGoBackArrow={false}
      additionalPadding={false}
    >
      <RadialCircle color="purple" />
      <RadialCircle color="blue" />
      <WelcomeBlock />
    </Page>
  );
};
