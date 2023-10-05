import React from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Page } from "#blocks/Page/Page";
import { RegisterSupport as RegisterSupportBlock } from "#blocks/RegisterSupport/RegisterSupport";
import { useWindowDimensions } from "@USupport-components-library/src/utils";
import { RadialCircle } from "@USupport-components-library/src";

import "./register-support.scss";

/**
 * RegisterSupport
 *
 * RegisterSupport page
 *
 * @returns {JSX.Element}
 */
export const RegisterSupport = () => {
  const location = useLocation();
  const showGoBackArrow = location?.state?.hideGoBackArrow ?? true;
  const isAnonymous = location?.state?.isAnonymous;
  const { t } = useTranslation("register-support-page");

  const { width } = useWindowDimensions();

  return (
    <Page
      classes="page__register-support"
      showFooter={false}
      showNavbar={false}
      additionalPadding={false}
      showGoBackArrow={showGoBackArrow}
      heading={width < 768 ? t("heading_1") : t("heading_2")}
    >
      <RegisterSupportBlock isAnonymous={isAnonymous} />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
