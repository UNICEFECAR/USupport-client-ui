import React from "react";
import { Page } from "../../blocks/Page/Page";
import { RegisterSupport as RegisterSupportBlock } from "../../blocks/RegisterSupport/RegisterSupport";
import { useWindowDimensions } from "@USupport-components-library/src/utils";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation("register-support-page");

  const { width } = useWindowDimensions();

  return (
    <Page
      classes="page__register-support"
      showFooter={false}
      showEmergencyButton={false}
      showNavbar={false}
      additionalPadding={false}
      heading={width < 768 ? t("heading_1") : t("heading_2")}
    >
      <RegisterSupportBlock />
      {width < 768 && <RadialCircle color="purple" />}
    </Page>
  );
};
