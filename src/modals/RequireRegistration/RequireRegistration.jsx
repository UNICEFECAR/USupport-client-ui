import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { useCustomNavigate as useNavigate } from "#hooks";

import "./require-registration.scss";

/**
 * RequireRegistration
 *
 * The RequireRegistration modal
 *
 * @return {jsx}
 */
export const RequireRegistration = ({ isOpen, onClose }) => {
  const navigateTo = useNavigate();
  const { t } = useTranslation("modals", { keyPrefix: "require-registration" });

  const handleRegisterRedirection = () => {
    userSvc.logout();
    navigateTo("/dashboard");
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
