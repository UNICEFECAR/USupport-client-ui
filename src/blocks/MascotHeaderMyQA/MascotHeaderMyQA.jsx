import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";

import { Grid, GridItem, Button } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import "./mascot-header-my-qa.scss";

import {
  mascotHappyPurple,
  mascotHappyPurpleFull,
} from "@USupport-components-library/assets";

/**
 * MascotHeaderMyQA
 *
 * MascotHeader used in MyQA page
 *
 * @return {jsx}
 */
export const MascotHeaderMyQA = ({ classes, handleSeeHowItWorksClick }) => {
  const { t } = useTranslation("mascot-header-MyQA");
  const { width } = useWindowDimensions();

  return (
    <div className={["mascot-header-my-qa", classNames(classes)].join(" ")}>
      <Grid classes="mascot-header-my-qa__banner">
        <GridItem
          xs={1}
          md={2}
          lg={2}
          classes="mascot-header-my-qa__mascot-item"
        >
          <img
            className="mascot-header-my-qa__mascot-item__mascot"
            src={width > 768 ? mascotHappyPurpleFull : mascotHappyPurple}
          />
        </GridItem>
        <GridItem
          xs={3}
          md={6}
          lg={10}
          classes="mascot-header-my-qa__headings-item"
        >
          <Grid>
            <GridItem xs={4} md={6} lg={8}>
              <h4 className="heading">{t("heading")}</h4>
              <p className="text subheading heading">
                {t("subheading_its")} <b>{t("subheading_anonymous")}</b>!{" "}
                {t("subheading_text1")} <b>{t("subheading_not")}</b>{" "}
                {t("subheading_text2")}
              </p>
            </GridItem>
            <GridItem xs={4} md={2} lg={4}>
              <Button
                label={"See how it works"}
                type="secondary"
                classes="mascot-header-my-qa__headings-item__button"
                onClick={() => handleSeeHowItWorksClick()}
              />
            </GridItem>
          </Grid>
        </GridItem>
      </Grid>
    </div>
  );
};
