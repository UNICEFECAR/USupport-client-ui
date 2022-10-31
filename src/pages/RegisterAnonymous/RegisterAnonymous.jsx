import React from "react";
import { Page, RegisterAnonymous as RegisterAnonymousBlock } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useTranslation } from "react-i18next";

import "./register-anonymous.scss";

/**
 * RegisterAnonymous
 *
 * RegisterAnonymous page
 *
 * @returns {JSX.Element}
 */
export const RegisterAnonymous = () => {
  const { t } = useTranslation("register-anonymous-page");

  const { width } = useWindowDimensions();

  return (
    <Page
      classes="page__register-anonymous"
      showFooter={false}
      showEmergencyButton={false}
      showNavbar={false}
      additionalPadding={false}
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <RegisterAnonymousBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
