import React from "react";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";

import {
  Block,
  CircleIconButton,
  NewButton,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { mascotHappyPurpleFull } from "@USupport-components-library/assets";

import "./dashboard-hero.scss";

/**
 * DashboardHero
 *
 * DashboardHero block
 *
 * @return {jsx}
 */
export const DashboardHero = ({ handleOpenUserGuide }) => {
  const { t } = useTranslation("blocks", { keyPrefix: "dashboard-hero" });
  const { width } = useWindowDimensions();
  const queryClient = useQueryClient();

  const IS_RO = localStorage.getItem("country") === "RO";

  const clientData = queryClient.getQueryData(["client-data"]);
  const clientName = clientData
    ? clientData.name && clientData.surname
      ? `${clientData.name} ${clientData.surname}`
      : clientData.nickname || clientData.name || ""
    : "";

  const renderButton = () => {
    if (!IS_RO || !handleOpenUserGuide) return null;
    if (width <= 768) {
      return (
        <div>
          <CircleIconButton
            size="sm"
            color="purple"
            onClick={handleOpenUserGuide}
            iconName="read-book"
            iconColor="#fff"
            iconSize="sm"
          />
        </div>
      );
    } else {
      return (
        <NewButton
          size="sm"
          label={t("user_guide")}
          onClick={handleOpenUserGuide}
          iconName="read-book"
          iconColor="#fff"
        />
      );
    }
  };

  return (
    <Block classes="dashboard-hero">
      <div className="dashboard-hero__content">
        <div className="dashboard-hero__heading-row">
          <h1 className="dashboard-hero__heading">
            {t("heading")}
            {clientName && (
              <>
                ,{" "}
                <span className="dashboard-hero__heading__name">
                  {clientName}
                </span>
              </>
            )}
          </h1>
          {width <= 768 ? renderButton() : null}
        </div>
        <div className="dashboard-hero__mascot-container">
          <img
            className="dashboard-hero__mascot"
            src={mascotHappyPurpleFull}
            alt="Mascot"
          />
          {width > 768 ? renderButton() : null}
        </div>
      </div>
    </Block>
  );
};
