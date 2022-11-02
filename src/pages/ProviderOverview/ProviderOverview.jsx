import React from "react";
import { Page, ProviderOverview as ProviderOverviewBlock } from "#blocks";
import { useTranslation } from "react-i18next";
import { Button } from "@USupport-components-library/src";

import "./provider-overview.scss";

/**
 * ProviderOverview
 *
 * ProviderOverview page
 *
 * @returns {JSX.Element}
 */
export const ProviderOverview = () => {
  const { t } = useTranslation("provider-overview-page");

  const handleSchedule = () => {
    console.log("schedule");
  };

  return (
    <Page
      classes="page__provider-overview"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <ProviderOverviewBlock />
      <div className="page__provider-overview__button-container">
        <Button
          label={t("button_label")}
          size="lg"
          onClick={() => handleSchedule()}
        />
      </div>
    </Page>
  );
};
