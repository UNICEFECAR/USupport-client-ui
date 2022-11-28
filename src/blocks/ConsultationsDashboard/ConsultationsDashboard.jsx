import React from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  Button,
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
export const ConsultationsDashboard = () => {
  const { t } = useTranslation("consultations-dashboard");

  const consultations = [
    // {
    //   consultation: {
    //     providerName: "Joanna Doe",
    //     timestamp: 1669496673000,
    //   },
    // },
    // {
    //   consultation: {
    //     providerName: "Joanna Doe",
    //     timestamp: 1714921200000,
    //   },
    // },
    // {
    //   consultation: {
    //     providerName: "Joanna Doe",
    //     timestamp: 1714921200000,
    //   },
    // },
    // {
    //   consultation: {
    //     providerName: "Joanna Doe",
    //     timestamp: 1714921200000,
    //   },
    // },
  ];

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
    return consultations.map((consultation, index) => {
      return <ConsultationBig consultation={consultation} />;
    });
  };

  const handleViewAll = () => {
    console.log("View all");
  };

  const handleScheduleConsultation = () => {
    console.log("Schedule consultation");
  };

  return (
    <Block classes="consultations-dashboard">
      <div className="consultations-dashboard__heading">
        <h4>{t("heading")}</h4>
        <p className="small-text view-all-button" onClick={handleViewAll}>
          {t("view_all")}
        </p>
      </div>
      {!consultations.length > 0 ? (
        <div className="consultations-dashboard__button-container">
          <Button
            label={t("schedule_consultation_label")}
            type="secondary"
            size="lg"
            onClick={handleScheduleConsultation()}
          />
        </div>
      ) : (
        <div className="consultations-dashboard__carousel-container">
          <CustomCarousel breakpointItems={breakpointsItem}>
            {renderConsultations()}
          </CustomCarousel>
        </div>
      )}
    </Block>
  );
};
