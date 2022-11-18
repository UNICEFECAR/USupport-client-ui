import React from "react";
import { Page, TermsOfUse as TermsOfUseBlock } from "#blocks";
import { useTranslation } from "react-i18next";

/**
 * TermsOfUse
 *
 * TermsOfUse Page
 *
 * @returns {JSX.Element}
 */
export const TermsOfUse = () => {
  const { t } = useTranslation("terms-of-use-page");
  return (
    <Page classes="page__terms-of-use" heading={t("heading")}>
      <TermsOfUseBlock />
    </Page>
  );
};
