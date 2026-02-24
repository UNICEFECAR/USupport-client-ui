import React, { useContext, useMemo } from "react";
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
  Box,
  Loading,
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
  isLoggedIn,
}) => {
  const navigate = useNavigate();
  // const { width } = useWindowDimensions();
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

  // Generate dummy consultations for non-logged-in users
  const dummyConsultations = useMemo(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);

    const dayAfter = new Date(now);
    dayAfter.setDate(dayAfter.getDate() + 2);
    dayAfter.setHours(14, 0, 0, 0);

    const nextWeek = new Date(now);
    nextWeek.setDate(nextWeek.getDate() + 5);
    nextWeek.setHours(11, 0, 0, 0);

    return [
      {
        consultationId: "dummy-1",
        timestamp: tomorrow.getTime(),
        image: "default",
        status: "scheduled",
        providerName: t("dummy_provider_1") || "Dr. Smith",
        price: 0,
      },
      {
        consultationId: "dummy-2",
        timestamp: dayAfter.getTime(),
        image: "default",
        status: "scheduled",
        providerName: t("dummy_provider_2") || "Dr. Johnson",
        price: 0,
      },
      {
        consultationId: "dummy-3",
        timestamp: nextWeek.getTime(),
        image: "default",
        status: "scheduled",
        providerName: t("dummy_provider_3") || "Dr. Williams",
        price: 0,
      },
    ];
  }, [t]);

  const consultationsToShow =
    !isLoggedIn &&
    (!upcomingConsultations || upcomingConsultations.length === 0)
      ? dummyConsultations
      : upcomingConsultations;

  const renderConsultations = () => {
    return consultationsToShow?.slice(0, 1).map((consultation) => {
      return (
        <div
          key={consultation.consultationId}
          className="consultations-dashboard__box__content__part__consultation"
        >
          <Consultation
            renderIn="client"
            consultation={consultation}
            handleJoinClick={openJoinConsultation}
            handleOpenEdit={openEditConsultation}
            handleAcceptConsultation={handleAcceptSuggestion}
            suggested={consultation.status === "suggested"}
            overview={!isLoggedIn ? true : false}
            t={t}
            toast={toast}
            liquidGlass
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
      <Box
        classes={[
          "consultations-dashboard__box",
          !upcomingConsultations ||
            (upcomingConsultations.length === 0 &&
              "consultations-dashboard__box--no-consultations"),
        ]}
        liquidGlass
      >
        <div className="consultations-dashboard__box__content">
          {(isLoading ||
            !isLoggedIn ||
            (upcomingConsultations && upcomingConsultations.length > 0)) && (
            <div className={["consultations-dashboard__box__content__part"]}>
              <h3 className="">{t("heading")}</h3>
              {isLoading ? <Loading size="lg" /> : renderConsultations()}
            </div>
          )}
          <div
            className={[
              "consultations-dashboard__box__content__part",
              !upcomingConsultations ||
                (upcomingConsultations.length === 0 &&
                  "consultations-dashboard__box__content__part--no-consultations"),
            ].join(" ")}
          >
            <h3 className="">{t("heading_need_support")}</h3>
            <Box
              classes="consultations-dashboard__box__content__part__need-support-box"
              liquidGlass
            >
              <NewButton
                label={t("schedule_consultation_label")}
                onClick={handleScheduleConsultation}
                iconName="calendar"
                size="lg"
              />
              <NewButton
                label={t("explore_resources_label")}
                onClick={() => navigate("/information-portal")}
                size="lg"
                type="outline"
              />
            </Box>
          </div>
        </div>
      </Box>
      {/* <div className="consultations-dashboard__heading">
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
      ) : !consultationsToShow || consultationsToShow.length === 0 ? (
        <></>
      ) : (
        <div className="consultations-dashboard__scroll-container">
          {renderConsultations()}
        </div>
      )}
      <NewButton
        label={t("schedule_consultation_label")}
        type="gradient"
        size="lg"
        isFullWidth={true}
        onClick={handleScheduleConsultation}
        iconName="calendar"
        classes="consultations-dashboard__schedule-consultation-button"
      /> */}
    </Block>
  );
};
