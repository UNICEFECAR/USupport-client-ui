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
      ctaLabel={t("cancel_button_label")}
      ctaHandleClick={() => console.log("cancel")}
      secondaryCtaLabel={t("keep_button_label")}
      secondaryCtaHandleClick={onClose}
    >
      <ConsultationInformation
        startDate={startDate}
        endDate={endDate}
        providerName={provider.name}
        classes="cancel-consultation__provider-consultation"
      />
    </Backdrop>
  );
};
