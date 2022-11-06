import React from "react";
import { Page, PrivacyPolicy as PrivacyPolicyBlock } from "#blocks";
import { useTranslation } from "react-i18next";

/**
 * PrivacyPolicy
 *
 * Privacy Policy page
 *
 * @returns {JSX.Element}
 */
export const PrivacyPolicy = () => {
  const { i18n, t } = useTranslation("privacy-policy-page");

  return (
    <Page classes="page__privacy-policy" heading={t("heading")}>
      <PrivacyPolicyBlock />
    </Page>
  );
};
