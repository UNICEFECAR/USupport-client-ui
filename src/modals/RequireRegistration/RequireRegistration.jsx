import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@USupport-components-library/src";

import "./require-registration.scss";

/**
 * RequireRegistration
 *
 * The RequireRegistration modal
 *
 * @return {jsx}
 */
export const RequireRegistration = ({ handleContinue, isOpen, onClose }) => {
  const { t } = useTranslation("require-registration");

  return (
    <Modal
      classes="require-registration"
      heading={t("heading")}
      text={t("text")}
      ctaLabel={t("button")}
      ctaHandleClick={handleContinue}
      isOpen={isOpen}
      closeModal={onClose}
    />
  );
};
