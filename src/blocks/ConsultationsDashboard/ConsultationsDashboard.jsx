import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { PageContext } from "../Page";

import {
  Block,
  Button,
  Loading,
  CustomCarousel,
  ConsultationBig,
} from "@USupport-components-library/src";

import "./consultations-dashboard.scss";

/**
 * ConsultationsDashboard
 *
 * ConsultationsDashboard block
 *
 * @return {jsx}
 */
export const ConsultationsDashboard = ({
  openJoinConsultation,
  openEditConsultation,
  handleAcceptSuggestion,
  handleSchedule,
  upcomingConsultations,
  isLoading,
}) => {
  const navigate = useNavigate();
  const { isTmpUser, handleRegistrationModalOpen } = useContext(PageContext);

  const { t } = useTranslation("consultations-dashboard");

  const breakpointsItem = {
    desktop: {
      breakpoint: { max: 5000, min: 1366 }, // 5000 is a hack to make sure it's the last breakpoint
      items: 3,
    },
    smallLaptop: {
      breakpoint: { max: 1366, min: 768 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 768, min: 375 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 375, min: 0 },
      items: 1,
    },
  };

  const renderConsultations = () => {
    return upcomingConsultations?.map((consultation) => {
      return (
        <ConsultationBig
          consultation={consultation}
          handleJoin={openJoinConsultation}
          handleChange={openEditConsultation}
          handleAcceptSuggestion={handleAcceptSuggestion}
          handleSchedule={handleSchedule}
          t={t}
          key={consultation.consultationId}
        />
      );
    });
  };

  const handleViewAll = () => {
    if (isTmpUser) {
      handleRegistrationModalOpen();
    } else {
      navigate("/consultations");
    }
  };

  const handleScheduleConsultation = () => {
    if (isTmpUser) {
      handleRegistrationModalOpen();
    } else {
      handleSchedule();
    }
  };

  return (
    <Block classes="consultations-dashboard">
      <div className="consultations-dashboard__heading">
        <h4>{t("heading")}</h4>
        <p className="small-text view-all-button" onClick={handleViewAll}>
          {t("view_all")}
        </p>
      </div>
      {isLoading ? (
        <Loading size="lg" />
      ) : !upcomingConsultations || upcomingConsultations.length === 0 ? (
        <div className="consultations-dashboard__button-container">
          <Button
            label={t("schedule_consultation_label")}
            type="secondary"
            size="lg"
            onClick={handleScheduleConsultation}
          />
        </div>
      ) : (
        <div className="consultations-dashboard__carousel-container">
          <CustomCarousel breakpointItems={breakpointsItem} speed={5000}>
            {renderConsultations()}
          </CustomCarousel>
        </div>
      )}
    </Block>
  );
};
