import React from "react";
import { AccessToken, Modal, Icon } from "@USupport-components-library/src";

import "./save-access-code-confirmation.scss";
import { useTranslation } from "react-i18next";

/**
 * SaveAccessCodeConfirmation
 *
 * The SaveAccessCodeConfirmation modal
 *
 * @return {jsx}
 */
export const SaveAccessCodeConfirmation = ({
  isOpen,
  onClose,
  accessToken,
  isLoading,
  ctaHandleClick,
}) => {
  const { t } = useTranslation("save-access-code-confirmation");
  return (
    <Modal
      classes="save-access-code-confirmation"
      heading={t("heading")}
      isOpen={isOpen}
      onClose={onClose}
      ctaLabel={t("button")}
      ctaHandleClick={ctaHandleClick}
    >
      <AccessToken accessToken={accessToken} isLoading={isLoading} />
      <div className="save-access-code-confirmation__container">
        <Icon name="warning" size="md" />
        <p className="text">{t("text")}</p>
      </div>
    </Modal>
  );
};
