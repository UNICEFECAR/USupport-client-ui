import React from "react";
import { useTranslation } from "react-i18next";

import { Box, Block, NewButton } from "@USupport-components-library/src";
import { useCustomNavigate as useNavigate } from "#hooks";

import "./find-support-near-you.scss";
/**
 * FindSupportNearYou
 *
 * FindSupportNearYou block
 *
 * @returns {JSX.Element}
 */
export const FindSupportNearYou = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("blocks", {
    keyPrefix: "find-support-near-you",
  });

  return (
    <Block classes="find-support-near-you">
      <div className="mood-tracker__heading">
        <h4>{t("heading")}</h4>
      </div>
      <Box classes="find-support-near-you__box">
        <div className="find-support-near-you__map-container">
          <div className="find-support-near-you__map-container__overlay">
            <div className="find-support-near-you__map-container__overlay__button">
              <NewButton
                size="sm"
                label={t("explore_button_label")}
                onClick={() => {
                  navigate("/organizations");
                }}
                iconName="search"
                iconColor="#fff"
                iconSize="sm"
              />
            </div>
          </div>
        </div>
      </Box>
    </Block>
  );
};
