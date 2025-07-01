import React from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  OrganizationDetails,
  Loading,
} from "@USupport-components-library/src";

import { useGetOrganizationById } from "#hooks";

// const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./organization-overview.scss";

/**
 * OrganizationOverview
 *
 * OrganizationOverview block
 *
 * @return {jsx}
 */
export const OrganizationOverview = ({ organizationId }) => {
  const { t } = useTranslation("organization-overview");

  const {
    data: organization,
    isLoading,
    isError,
  } = useGetOrganizationById(organizationId);

  return (
    <Block classes="organization-profile">
      {isError ? (
        <h5>{t("error-loading-data")}</h5>
      ) : isLoading ? (
        <Loading size="lg" />
      ) : (
        <OrganizationDetails organization={organization} t={t} />
      )}
    </Block>
  );
};
