import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";
import { RootContext } from "#routes";
import { ThemeContext } from "@USupport-components-library/utils";

import {
  Block,
  Button,
  Loading,
  CustomCarousel,
  ConsultationBig,
  VideoPlayer,
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
  const { isTmpUser, handleRegistrationModalOpen } = useContext(RootContext);
  const { cookieState, setCookieState } = useContext(ThemeContext);

  const { t } = useTranslation("blocks", {
    keyPrefix: "consultations-dashboard",
  });

  // Get country and language from localStorage
  const country = localStorage.getItem("country");
  const language = localStorage.getItem("language");

  // Check if video should be displayed (KZ country, kk or ru language, and no consultations)
  const shouldShowVideo =
    country === "KZ" &&
    (language === "kk" || language === "ru") &&
    (!upcomingConsultations || upcomingConsultations.length === 0);

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
        <div
          className="consultations-dashboard__consultation-container"
          key={consultation.consultationId}
        >
          <ConsultationBig
            consultation={consultation}
            handleJoin={openJoinConsultation}
            handleChange={openEditConsultation}
            handleAcceptSuggestion={handleAcceptSuggestion}
            handleSchedule={handleSchedule}
            t={t}
          />
        </div>
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
      {shouldShowVideo && (
        <div className="consultations-dashboard__video-container">
          <VideoPlayer
            url={
              language === "kk"
                ? "https://youtu.be/UvC8GaOb0SY"
                : "https://youtu.be/RlRj_-HeH0s"
            }
            title="Consultation Information Video"
            cookieState={cookieState}
            setCookieState={setCookieState}
            t={t}
          />
        </div>
      )}
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
