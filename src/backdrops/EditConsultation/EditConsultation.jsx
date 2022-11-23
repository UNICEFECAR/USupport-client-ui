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
  // consultation,
  provider,
  openCancelConsultation,
  openSelectConsultation,
}) => {
  const consultation = { startDate: new Date(), endDate: new Date() };

  const { t } = useTranslation("edit-consultation");

  const handleCancelClick = () => {
    onClose();
    openCancelConsultation();
  };

  const handleEditClick = () => {
    onClose();
    openSelectConsultation();
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
        providerName={provider?.name}
        classes="edit-consultation__provider-consultation"
      />
      <ButtonSelector
        onClick={handleEditClick}
        iconName="calendar"
        label={t("date_button_label")}
        classes="edit-consultation__button"
      />
      <ButtonSelector
        onClick={handleCancelClick}
        iconName="close-x"
        label={t("cancel_button_label")}
        classes="edit-consultation__button"
      />
    </Backdrop>
  );
};
