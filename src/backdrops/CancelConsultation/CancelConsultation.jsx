import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import {
  Backdrop,
  ConsultationInformation,
} from "@USupport-components-library/src";
import { useCancelConsultation } from "#hooks";

import { ONE_HOUR } from "@USupport-components-library/utils";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

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
  const queryClient = useQueryClient();
  const { t } = useTranslation("cancel-consultation");
  const [error, setError] = useState();

  const { providerName, timestamp, image } = consultation;

  const startDate = new Date(timestamp);
  const endDate = new Date(timestamp + ONE_HOUR);

  const onCancelSuccess = () => {
    queryClient.invalidateQueries(["all-consultations"]);
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
    cancelConsultationMutation.mutate(consultation.consultationId);
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
      <div className="cancel-consultation__content-container">
        <ConsultationInformation
          startDate={startDate}
          endDate={endDate}
          providerName={providerName}
          providerImage={image || "default"}
          classes="cancel-consultation__provider-consultation"
          t={t}
        />
      </div>
    </Backdrop>
  );
};
