import React from "react";
import { Backdrop } from "@USupport-components-library/src";
import { mascotHappyOrange } from "@USupport-components-library/assets";
import {
  getTimeAsString,
  getMonthName,
} from "@USupport-components-library/utils";
import { useTranslation } from "react-i18next";

import "./confirm-consultation.scss";

/**
 * ConfirmConsultation
 *
 * The ConfirmConsultation backdrop
 *
 * @return {jsx}
 */
export const ConfirmConsultation = ({ isOpen, onClose, consultation }) => {
  const { t } = useTranslation("confirm-consultation");

  const handleContinue = () => {
    onClose();
  };

  const { startDate, endDate } = consultation;

  return (
    <Backdrop
      classes="confirm-consultation"
      title="ConfirmConsultation"
      isOpen={isOpen}
      onClose={onClose}
      ctaLabel={t("ctaLabel")}
      ctaHandleClick={handleContinue}
    >
      <div className="confirm-consultation__content">
        <img
          src={mascotHappyOrange}
          className="confirm-consultation__content__mascot"
        />
        <h4 className="confirm-consultation__content__heading">
          {t("heading")}
        </h4>
        <p className="text confirm-consultation__content__text">
          {t("text", {
            startDate: startDate.getDate(),
            month: getMonthName(startDate),
            year: startDate.getFullYear(),
            startTime: getTimeAsString(startDate),
            endTime: getTimeAsString(endDate),
          })}
        </p>
      </div>
    </Backdrop>
  );
};
