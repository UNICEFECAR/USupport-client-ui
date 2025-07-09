import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import {
  Grid,
  GridItem,
  Button,
  ConsultationDashboard,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { RootContext } from "#routes";

import "./mascot-welcome-header.scss";

import {
  mascotHappyPurple,
  mascotHappyPurpleFull,
} from "@USupport-components-library/assets";

/**
 * MascotWelcomeHeader
 *
 * MascotWelcomeHeader block used in Dashboard page
 *
 * @return {JSX.Element}
 */
export const MascotWelcomeHeader = ({
  classes,
  nextConsultation,
  handleJoin,
  handleEdit,
  handleSchedule,
  handleAcceptSuggestion,
  name,
}) => {
  const { isTmpUser, handleRegistrationModalOpen } = useContext(RootContext);
  const { t } = useTranslation("mascot-welcome-header");
  const { width } = useWindowDimensions();
  const IS_RO = localStorage.getItem("country") === "RO";

  return (
    <div className={["mascot-welcome-header", classNames(classes)].join(" ")}>
      <Grid classes="mascot-welcome-header__banner">
        <GridItem
          xs={1}
          md={3}
          lg={6}
          classes="mascot-welcome-header__mascot-item"
        >
          <img
            className="mascot-welcome-header__mascot-item__mascot"
            src={width > 768 ? mascotHappyPurpleFull : mascotHappyPurple}
          />
        </GridItem>
        <GridItem
          xs={3}
          md={5}
          lg={6}
          classes="mascot-welcome-header__headings-item"
        >
          {isTmpUser ? (
            <>
              <p className="text heading">{t("no_registration_heading")}</p>
              <p className="small-text subheading">
                {t("no_registration_subheading")}
              </p>
              <Button
                label={t("create_account_button")}
                color="purple"
                size="md"
                onClick={handleRegistrationModalOpen}
              />
            </>
          ) : (
            <>
              <h4 className="mascot-welcome-header__heading">
                {t("welcome", { name })}
              </h4>
              {!IS_RO && (
                <p className="text mascot-welcome-header__subheading">
                  {t("next_consultation")}
                </p>
              )}
              {IS_RO ? (
                <div className="mascot-welcome-header__map-container">
                  <div className="mascot-welcome-header__map-container__overlay">
                    <Button
                      size="sm"
                      label={t("explore_button_label")}
                      color="purple"
                      onClick={() => {
                        console.log("clicked");
                      }}
                    />
                  </div>
                </div>
              ) : (
                <ConsultationDashboard
                  consultation={nextConsultation}
                  classes="mascot-welcome-header__headings-item__consultation-card"
                  handleJoin={handleJoin}
                  handleEdit={handleEdit}
                  handleSchedule={handleSchedule}
                  handleAcceptSuggestion={handleAcceptSuggestion}
                  t={t}
                />
              )}
            </>
          )}
        </GridItem>
      </Grid>
    </div>
  );
};
