import React, { useState } from "react";
import {
  AccessToken,
  Modal,
  Icon,
  CheckBox,
} from "@USupport-components-library/src";

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
  showToast,
}) => {
  const { t } = useTranslation("save-access-code-confirmation");
  const [hasAgreed, setHasAgreed] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const handleCopy = () => {
    setShouldAnimate(false);
    setHasCopied(true);
    showToast();
  };

  const handleCheckboxClick = () => {
    setHasAgreed(!hasAgreed);
    if (!hasAgreed && !hasCopied) {
      setShouldAnimate(true);
    } else if (hasAgreed) {
      setShouldAnimate(false);
    }
  };

  return (
    <Modal
      classes="save-access-code-confirmation"
      heading={t("heading")}
      isOpen={isOpen}
      closeModal={onClose}
      ctaLabel={t("button")}
      ctaHandleClick={ctaHandleClick}
      isCtaDisabled={!hasAgreed || !hasCopied}
    >
      <AccessToken
        accessToken={accessToken}
        isLoading={isLoading}
        handleCopy={handleCopy}
        activateAnimation={shouldAnimate}
        copyLabel={t("click_to_copy")}
        showInstructions
      />
      <div className="save-access-code-confirmation__container">
        <Icon name="warning" size="md" />
        <p className="text">{t("text")}</p>
      </div>
      <div className="save-access-code-confirmation__checkbox-container">
        <CheckBox isChecked={hasAgreed} setIsChecked={handleCheckboxClick} />
        <p onClick={handleCheckboxClick} className="text">
          {t("warning")}
        </p>
      </div>
    </Modal>
  );
};
