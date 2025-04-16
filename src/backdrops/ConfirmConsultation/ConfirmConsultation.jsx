import React, { useContext } from "react";
import { Backdrop } from "@USupport-components-library/src";
import { mascotHappyOrange } from "@USupport-components-library/assets";
import {
  getTimeAsString,
  getMonthName,
  ThemeContext,
} from "@USupport-components-library/utils";
import { useTranslation } from "react-i18next";

import "./confirm-consultation.scss";
import { useCustomNavigate as useNavigate } from "#hooks";

/**
 * ConfirmConsultation
 *
 * The ConfirmConsultation backdrop
 *
 * @return {jsx}
 */
export const ConfirmConsultation = ({ isOpen, onClose, consultation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("confirm-consultation");
  const { theme } = useContext(ThemeContext);

  const handleContinue = () => {
    onClose();
    navigate("/consultations");
  };

  const { startDate, endDate } = consultation;
  const getMonthNameString = (date) => {
    let monthName = t(getMonthName(date).toLowerCase());
    return monthName;
  };

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
        <h4
          className={[
            "confirm-consultation__content__heading",
            theme === "dark" && "confirm-consultation__content__heading--dark",
          ].join(" ")}
        >
          {t("heading")}
        </h4>
        <p className="text confirm-consultation__content__text">
          {t("text", {
            startDate: startDate.getDate(),
            month: getMonthNameString(startDate),
            year: startDate.getFullYear(),
            startTime: getTimeAsString(startDate),
            endTime: getTimeAsString(endDate),
          })}
        </p>
      </div>
    </Backdrop>
  );
};
