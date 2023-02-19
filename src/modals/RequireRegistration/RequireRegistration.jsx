import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@USupport-components-library/src";

import "./require-registration.scss";
import { useNavigate } from "react-router-dom";

/**
 * RequireRegistration
 *
 * The RequireRegistration modal
 *
 * @return {jsx}
 */
export const RequireRegistration = ({ isOpen, onClose }) => {
  const navigateTo = useNavigate();
  const { t } = useTranslation("require-registration");

  const handleRegisterRedirection = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh-token");
    localStorage.removeItem("expires-in");
    navigateTo("/register-preview");
    onClose();
  };

  return (
    <Modal
      classes="require-registration"
      heading={t("heading")}
      text={t("text")}
      ctaLabel={t("button")}
      ctaHandleClick={handleRegisterRedirection}
      isOpen={isOpen}
      closeModal={onClose}
    />
  );
};
