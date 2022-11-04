import React from "react";
import {
  Backdrop,
  ConsultationInformation,
  Button,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./cancel-consultation.scss";

/**
 * CancelConsultation
 *
 * The CancelConsultation backdrop
 *
 * @return {jsx}
 */
export const CancelConsultation = ({
  isOpen,
  onClose,
  consultation,
  provider,
}) => {
  const { t } = useTranslation("cancel-consultation");

  const { startDate, endDate } = consultation;

  return (
    <Backdrop
      classes="cancel-consultation"
      title="CancelConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
    >
      <ConsultationInformation
        startDate={startDate}
        endDate={endDate}
        providerName={provider.name}
        classes="cancel-consultation__provider-consultation"
      />
      <div className="cancel-consultation__button-container">
        <Button label={t("cancel_button_label")} size="lg" web />
        <Button
          label={t("keep_button_label")}
          type="ghost"
          size="md"
          onClick={onClose}
        />
      </div>
    </Backdrop>
  );
};
