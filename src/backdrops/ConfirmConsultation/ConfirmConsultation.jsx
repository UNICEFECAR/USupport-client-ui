import React, { useContext } from "react";
import classNames from "classnames";
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
import { Icon } from "@USupport-components-library/src/components/icons";
import { Avatar } from "@USupport-components-library/src";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

/**
 * ConfirmConsultation
 *
 * The ConfirmConsultation backdrop
 *
 * @return {jsx}
 */
export const ConfirmConsultation = ({ isOpen, onClose, consultation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("backdrops", {
    keyPrefix: "confirm-consultation",
  });
  const { theme } = useContext(ThemeContext);

  const handleContinue = () => {
    onClose();
    navigate("/consultations");
  };

  const {
    startDate,
    endDate,
    providerName,
    providerImage,
    providerSpecializations,
  } = consultation;

  const getMonthNameString = (date) => {
    let monthName = t(getMonthName(date).toLowerCase());
    return monthName;
  };

  const dateText =
    startDate &&
    t("dateText", {
      startDate: startDate.getDate(),
      month: getMonthNameString(startDate),
      year: startDate.getFullYear(),
    });

  const timeRangeText =
    startDate &&
    endDate &&
    t("timeText", {
      startTime: getTimeAsString(startDate),
      endTime: getTimeAsString(endDate),
    });

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
        <h3 className="confirm-consultation__heading">{t("heading")}</h3>
        <p className="text confirm-consultation__subheading">
          {providerName
            ? t("subheading", { providerName })
            : t("subheading_no_name")}
        </p>
        <div
          className={classNames(
            "confirm-consultation__card",
            theme === "dark" && "confirm-consultation__card--dark",
            theme === "highContrast" && "confirm-consultation__card--hc",
          )}
        >
          <div className="confirm-consultation__card__heading">
            <p className="confirm-consultation__card__heading-text">
              {t("appointmentDetailsHeading")}
            </p>
          </div>

          {(providerName || providerImage) && (
            <div className="confirm-consultation__card__provider">
              <Avatar
                size="sm"
                image={
                  providerImage
                    ? `${AMAZON_S3_BUCKET}/${providerImage}`
                    : undefined
                }
              />
              <div className="confirm-consultation__card__provider__info">
                {providerName && (
                  <p className="text confirm-consultation__card__provider__name">
                    {providerName}
                  </p>
                )}
                {providerSpecializations?.length > 0 && (
                  <p className="text confirm-consultation__card__provider__specializations">
                    {providerSpecializations
                      .map((specialization) => t(specialization))
                      .join(", ")}
                  </p>
                )}
              </div>
            </div>
          )}

          {(dateText || timeRangeText) && (
            <div className="confirm-consultation__card__details">
              {dateText && (
                <div className="confirm-consultation__card__details-row">
                  <Icon
                    name="calendar"
                    size="md"
                    color={theme === "dark" ? "#c1d7e0" : "#66768D"}
                  />
                  <p className="text confirm-consultation__card__details-text">
                    {dateText}
                  </p>
                </div>
              )}
              {timeRangeText && (
                <div className="confirm-consultation__card__details-row">
                  <Icon
                    name="time"
                    size="md"
                    color={theme === "dark" ? "#c1d7e0" : "#66768D"}
                  />
                  <p className="text confirm-consultation__card__details-text">
                    {timeRangeText}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="confirm-consultation__info">
          <p className="text confirm-consultation__info-text">
            {t("reminderText")}
          </p>
        </div>
      </div>
    </Backdrop>
  );
};
