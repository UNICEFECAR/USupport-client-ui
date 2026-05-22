import { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  Block,
  OrganizationDetails,
  Loading,
} from "@USupport-components-library/src";

import { constructShareUrl, ThemeContext } from "@USupport-components-library/utils";

import { useGetOrganizationById } from "#hooks";
import { ReportOrganization } from "#backdrops";

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
  const { t } = useTranslation("blocks", {
    keyPrefix: "organization-overview",
  });
  const { theme } = useContext(ThemeContext);
  const [isReportOpen, setIsReportOpen] = useState(false);

  const {
    data: organization,
    isLoading,
    isError,
  } = useGetOrganizationById(organizationId);

  const url = constructShareUrl({
    contentType: "organization",
    id: organizationId,
  });

  const handleCopyLink = () => {
    navigator?.clipboard?.writeText(url);
    toast(t("copy_link_success"));
  };

  return (
    <Block classes="organization-profile">
      {isError ? (
        <h5>{t("error_loading_data")}</h5>
      ) : isLoading ? (
        <Loading size="lg" />
      ) : (
        <OrganizationDetails
          organization={organization}
          t={t}
          handleCopyLink={handleCopyLink}
          onReportClick={() => setIsReportOpen(true)}
          iconColor={theme === "dark" || theme === "highContrast" ? "#ededed" : "#66768D"}
        />
      )}
      <ReportOrganization
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        organizationId={organizationId}
      />
    </Block>
  );
};
