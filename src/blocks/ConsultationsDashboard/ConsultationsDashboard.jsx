import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { useCustomNavigate as useNavigate } from "#hooks";
import { RootContext } from "#routes";

import {
  useWindowDimensions,
  ThemeContext,
} from "@USupport-components-library/utils";
import {
  Block,
  Loading,
  CustomCarousel,
  Consultation,
  VideoPlayer,
  NewButton,
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
  const { width } = useWindowDimensions();
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
      breakpoint: { max: 5000, min: 1366 }, // 5000 to make sure it's the last breakpoint
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
          <Consultation
            renderIn="client"
            consultation={consultation}
            handleJoinClick={openJoinConsultation}
            handleOpenEdit={openEditConsultation}
            handleAcceptConsultation={handleAcceptSuggestion}
            suggested={consultation.status === "suggested"}
            overview={false}
            t={t}
            toast={toast}
            classes="consultations-dashboard__consultation-container__consultation-card"
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
        {width < 768 ? (
          <p className="small-text view-all-button" onClick={handleViewAll}>
            {t("view_all")}
          </p>
        ) : (
          <h5 className="view-all-button" onClick={handleViewAll}>
            {t("view_all")}
          </h5>
        )}
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
        <></>
      ) : (
        <div className="consultations-dashboard__carousel-container">
          <CustomCarousel breakpointItems={breakpointsItem} speed={5000}>
            {renderConsultations()}
          </CustomCarousel>
        </div>
      )}
      <NewButton
        label={t("schedule_consultation_label")}
        type="gradient"
        size="lg"
        onClick={handleScheduleConsultation}
        iconName="calendar"
        classes="consultations-dashboard__schedule-consultation-button"
      />
    </Block>
  );
};
