import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Backdrop,
  ConsultationInformation,
} from "@USupport-components-library/src";
import { useCancelConsultation } from "@USupport-components-library/hooks";
import { toast } from "react-toastify";

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
  // consultation,
  provider,
}) => {
  const { t } = useTranslation("cancel-consultation");
  const [error, setError] = useState();

  // TODO: Get the actual consultation from props, or fetch it from the API
  const consultation = { startDate: new Date(), endDate: new Date() };
  const { startDate, endDate } = consultation;

  const onCancelSuccess = () => {
    onClose();
    toast(t("cancel_success"));
  };
  const onCancelError = (error) => {
    setError(error);
  };
  const cancelConsultationMutation = useCancelConsultation(
    onCancelSuccess,
    onCancelError
  );

  const handleCancelClick = () => {
    cancelConsultationMutation.mutate();
  };

  return (
    <Backdrop
      classes="cancel-consultation"
      title="CancelConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      ctaLabel={t("cancel_button_label")}
      ctaHandleClick={handleCancelClick}
      secondaryCtaLabel={t("keep_button_label")}
      secondaryCtaHandleClick={onClose}
      errorMessage={error}
    >
      <ConsultationInformation
        startDate={startDate}
        endDate={endDate}
        providerName={provider?.name}
        classes="cancel-consultation__provider-consultation"
      />
    </Backdrop>
  );
};
