import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import { Block } from "@USupport-components-library/src";

import "./dashboard-hero.scss";

/**
 * DashboardHero
 *
 * DashboardHero block
 *
 * @return {jsx}
 */
export const DashboardHero = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "dashboard-hero" });
  const queryClient = useQueryClient();

  const clientData = queryClient.getQueryData(["client-data"]);
  const clientName = clientData
    ? clientData.name && clientData.surname
      ? `${clientData.name} ${clientData.surname}`
      : clientData.nickname || clientData.name || ""
    : "";

  return (
    <Block classes="dashboard-hero">
      <h1 className="dashboard-hero__heading">
        {t("heading")}
        {clientName && (
          <>
            ,{" "}
            <span className="dashboard-hero__heading__name">{clientName}</span>
          </>
        )}
      </h1>
    </Block>
  );
};
