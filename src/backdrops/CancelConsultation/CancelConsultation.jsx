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

import "./cancel-consultation.scss";

/**
 * CancelConsultation
 *
 * The CancelConsultation backdrop
 *
 * @return {jsx}
 */
export const CancelConsultation = ({ isOpen, onClose, consultation }) => {
  const queryClient = useQueryClient();
  const currencySymbol = localStorage.getItem("currency_symbol");

  const { t } = useTranslation("cancel-consultation");
  const [error, setError] = useState();

  const { providerName, timestamp, image } = consultation;

  const startDate = new Date(timestamp);
  const endDate = new Date(timestamp + ONE_HOUR);

  const isConsultationLessThan24HoursBefore =
    new Date().getTime() + 24 * ONE_HOUR >= startDate.getTime();

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
    cancelConsultationMutation.mutate({
      consultationId: consultation.consultationId,
      price: consultation.price,
      shouldRefund:
        isConsultationLessThan24HoursBefore || consultation.campaignId
          ? false
          : true,
    });
  };

  return (
    <Backdrop
      classes="cancel-consultation"
      title="CancelConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={
        isConsultationLessThan24HoursBefore
          ? t("paid_heading", { price: consultation.price, currencySymbol })
          : t("heading")
      }
      text={isConsultationLessThan24HoursBefore && t("paid_cancel_subheading")}
      ctaLabel={t("cancel_button_label")}
      ctaHandleClick={handleCancelClick}
      isCtaDisabled={cancelConsultationMutation.isLoading}
      showLoadingIfDisabled
      ctaColor={isConsultationLessThan24HoursBefore ? "red" : "green"}
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
          t={t}
        />
        <div
          className={[
            "cancel-consultation__price-badge",
            (!consultation.price || consultation.campaignId) &&
              "cancel-consultation__price-badge--free",
          ].join(" ")}
        >
          <p className="small-text">
            {consultation.campaignId
              ? t("coupon")
              : consultation.price
              ? `${consultation.price}${currencySymbol}`
              : t("free")}
          </p>
        </div>
      </div>
    </Backdrop>
  );
};
