import React from "react";
import { useTranslation } from "react-i18next";

import { Organizations as OrganizationsBlock, Page } from "#blocks";

import "./organizations.scss";

/**
 * Organizations
 *
 * Organizations page
 *
 * @returns {JSX.Element}
 */
export const Organizations = () => {
  const { t } = useTranslation("organizations-page");

  return (
    <Page classes="page__organizations" heading={t("heading")}>
      <OrganizationsBlock />
    </Page>
  );
};
