import React from "react";
import { Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Page,
  OrganizationOverview as OrganizationOverviewBlock,
} from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";

import "./organization-overview.scss";

/**
 * OrganizationOverview
 *
 * OrganizationOverview page
 *
 * @returns {JSX.Element}
 */
export const OrganizationOverview = () => {
  const { t } = useTranslation("organization-overview-page");
  const { organizationId } = useParams();

  if (!organizationId) {
    return (
      <Navigate
        to={`/client/${localStorage.getItem("language")}/organizations`}
      />
    );
  }

  return (
    <Page
      classes="page__organization-overview"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <RadialCircle
        color="purple"
        classes="page__organization-overview__radial-circle"
      />
      {organizationId && (
        <OrganizationOverviewBlock organizationId={organizationId} />
      )}
    </Page>
  );
};
