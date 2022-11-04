import React from "react";
import {
  Backdrop,
  ButtonSelector,
  Avatar,
  Icon,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { getDayOfTheWeek } from "@USupport-components-library/src/utils";

import "./edit-consultation.scss";

/**
 * EditConsultation
 *
 * The EditConsultation backdrop
 *
 * @return {jsx}
 */
export const EditConsultation = ({
  isOpen,
  onClose,
  consultation,
  provider,
}) => {
  const { t } = useTranslation("edit-consultation");

  const handleClick = () => {
    console.log("Button clicked");

    onClose();
  };

  const { startDate, endDate } = consultation;

  const dateText = startDate
    ? `${getDayOfTheWeek(startDate)}, ${
        startDate.getDate() < 10
          ? `0${startDate.getDate()}`
          : startDate.getDate()
      }.${
        startDate.getMonth() < 10
          ? `0${startDate.getMonth()}`
          : startDate.getMonth()
      }`
    : "";

  const timeText = startDate
    ? `${startDate.getHours()}:00 - ${endDate.getHours()}:00`
    : "";

  return (
    <Backdrop
      classes="edit-consultation"
      title="EditConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={t("subheading")}
    >
      <div className="edit-consultation__provider-container">
        <Avatar size="md" />
        <div className="edit-consultation__provider-container__content">
          <p className="text">{provider.name}</p>
          <div className="edit-consultation__provider-container__content__date-item">
            <Icon name="calendar" size="sm" color={"#66768D"} />
            <div className="edit-consultation__provider-container__content__date-item__text-container">
              <p className="small-text">{dateText}</p>
              <p className="small-text">{timeText}</p>
            </div>
          </div>
        </div>
      </div>
      <ButtonSelector
        onClick={() => handleClick()}
        iconName="person"
        label={t("specialist_button_label")}
        classes="edit-consultation__button"
      />
      <ButtonSelector
        onClick={() => handleClick()}
        iconName="calendar"
        label={t("date_button_label")}
        classes="edit-consultation__button"
      />
      <ButtonSelector
        onClick={() => handleClick()}
        iconName="close-x"
        label={t("cancel_button_label")}
        classes="edit-consultation__button"
      />
    </Backdrop>
  );
};
