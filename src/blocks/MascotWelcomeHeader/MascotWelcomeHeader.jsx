import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import classNames from "classnames";
import { toast } from "react-toastify";

import {
  Grid,
  GridItem,
  Button,
  CircleIconButton,
  ButtonWithIcon,
  ConsultationDashboard,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useCustomNavigate as useNavigate } from "#hooks";
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
  handleOpenUserGuide,
}) => {
  const navigate = useNavigate();
  const { isTmpUser, handleRegistrationModalOpen } = useContext(RootContext);
  const { t } = useTranslation("blocks", {
    keyPrefix: "mascot-welcome-header",
  });
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
            alt="Mascot"
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
            <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px"}}>
              <h4 className="mascot-welcome-header__heading">
                {t("welcome", { name })}
              </h4>
              {
                width < 768 ? (
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
                ) : (
                <ButtonWithIcon
                        size="sm"
                        label={t("user_guide")}
                        color="purple"
                        onClick={handleOpenUserGuide}
                        iconName="read-book"
                        iconColor="#fff"
                        iconSize="sm"
                      />) }
                      </div>
              {!IS_RO && (
                <p className="text mascot-welcome-header__subheading">
                  {t("next_consultation")}
                </p>
              )}
              {IS_RO ? (
                <div className="mascot-welcome-header__map-container">
                  <div className="mascot-welcome-header__map-container__overlay">
                    <div className="mascot-welcome-header__map-container__overlay__button">
                      <ButtonWithIcon
                        size="sm"
                        label={t("explore_button_label")}
                        color="purple"
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
              ) : (
                <ConsultationDashboard
                  consultation={nextConsultation}
                  classes="mascot-welcome-header__headings-item__consultation-card"
                  handleJoin={handleJoin}
                  handleEdit={handleEdit}
                  handleSchedule={handleSchedule}
                  handleAcceptSuggestion={handleAcceptSuggestion}
                  t={t}
                  toast={toast}
                />
              )}
            </>
          )}
        </GridItem>
      </Grid>
    </div>
  );
};
