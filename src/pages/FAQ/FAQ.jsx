import React from "react";
import { Page, FAQ as FAQBlock } from "#blocks";
import { useTranslation } from "react-i18next";

/**
 * FAQ
 *
 * FAQ page
 *
 * @returns {JSX.Element}
 */
export const FAQ = () => {
  const { t } = useTranslation("pages", { keyPrefix: "faq-page" });

  return (
    <Page
      classes="page__faq"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <FAQBlock />
    </Page>
  );
};
