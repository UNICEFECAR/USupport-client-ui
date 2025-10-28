import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Modal } from "@USupport-components-library/src";

/**
 * LeaveConsultation
 *
 * Confirmation modal for leaving a consultation
 *
 * @return {jsx}
 */
export const LeaveConsultation = ({ isOpen, onCancel, onConfirm }) => {
  const { t } = useTranslation("modals", { keyPrefix: "leave-consultation" });

  const [errors] = useState({});

  return (
    <Modal
      heading={t("heading")}
      isOpen={isOpen}
      closeModal={onCancel}
      ctaLabel={t("confirm")}
      ctaColor="red"
      ctaHandleClick={onConfirm}
      secondaryCtaLabel={t("cancel")}
      secondaryCtaType="primary"
      secondaryCtaHandleClick={onCancel}
      errorMessage={errors.submit}
    />
  );
};
