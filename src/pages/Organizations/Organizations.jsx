import React from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import {
  Organizations as OrganizationsBlock,
  Page,
  GiveSuggestion,
} from "#blocks";

import "./organizations.scss";

/**
 * Organizations
 *
 * Organizations page
 *
 * @returns {JSX.Element}
 */
export const Organizations = () => {
  const { t } = useTranslation("pages", { keyPrefix: "organizations-page" });
  const location = useLocation();

  return (
    <Page classes="page__organizations" heading={t("heading")}>
      <OrganizationsBlock
        personalizeFromAssessment={location.state?.personalizeFromAssessment}
      />
      <GiveSuggestion type="organizations" />
    </Page>
  );
};
