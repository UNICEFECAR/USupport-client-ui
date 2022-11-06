import React from "react";
import { useTranslation } from "react-i18next";
import {
  Backdrop,
  ButtonSelector,
  ConsultationInformation,
} from "@USupport-components-library/src";

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

  return (
    <Backdrop
      classes="edit-consultation"
      title="EditConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={t("subheading")}
    >
      <ConsultationInformation
        startDate={startDate}
        endDate={endDate}
        providerName={provider.name}
        classes="edit-consultation__provider-consultation"
      />
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
