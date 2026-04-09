import React from "react";
import { useTranslation } from "react-i18next";
import {
  Backdrop,
  ConsultationInformation,
  NewButton,
} from "@USupport-components-library/src";

import { ONE_HOUR } from "@USupport-components-library/utils";

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
  openCancelConsultation,
  openSelectConsultation,
}) => {
  // const consultation = { startDate: new Date(), endDate: new Date() };
  const { providerName, timestamp, image } = consultation;

  const imageUrl = image || "default";
  const startDate = new Date(timestamp);
  const endDate = new Date(timestamp + ONE_HOUR);
  const today = new Date().getTime();

  const { t } = useTranslation("backdrops", { keyPrefix: "edit-consultation" });

  const startsInLessThan24Hours = startDate - today < 24 * 60 * 60 * 1000;

  const handleCancelClick = () => {
    onClose();
    openCancelConsultation();
  };

  const handleEditClick = () => {
    onClose();
    openSelectConsultation();
  };

  return (
    <Backdrop
      classes="edit-consultation"
      title="EditConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
    >
      <div className="edit-consultation__content">
        <ConsultationInformation
          startDate={startDate}
          endDate={endDate}
          providerName={providerName}
          providerImage={imageUrl}
          classes="edit-consultation__provider-consultation"
          t={t}
        />
        <div className="edit-consultation__buttons">
          {!startsInLessThan24Hours && (
            <NewButton
              label={t("date_button_label")}
              size="lg"
              classes="edit-consultation__button"
              isFullWidth
              onClick={handleEditClick}
            />
          )}
          <NewButton
            label={t("cancel_button_label")}
            size="lg"
            type="outline"
            classes="edit-consultation__button"
            isFullWidth
            onClick={handleCancelClick}
          />
        </div>
      </div>
    </Backdrop>
  );
};
