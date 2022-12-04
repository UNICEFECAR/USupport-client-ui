import React from "react";
import { useTranslation } from "react-i18next";
import { Block, ClientActivityLog } from "@USupport-components-library/src";

import "./activity-log-dashboard.scss";

/**
 * ActivityLogDashboard
 *
 * ActivityLogDashboard
 *
 * @return {jsx}
 */
export const ActivityLogDashboard = () => {
  const { t } = useTranslation("activity-log-dashboard");

  const handleViewAll = () => {
    console.log("View all");
  };

  return (
    <Block classes="activity-log-dashboard">
      <div className="activity-log-dashboard__heading">
        <h4>{t("heading")}</h4>
        <p className="small-text view-all-button" onClick={handleViewAll}>
          {t("view_all")}
        </p>
      </div>
      <div className="activity-log-dashboard__activity-log-container">
        <ClientActivityLog />
      </div>
    </Block>
  );
};
