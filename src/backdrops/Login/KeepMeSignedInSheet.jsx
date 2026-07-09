import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import { Icon, Modal } from "@USupport-components-library/src";

import "./keep-me-signed-in-modal.scss";

/**
 * Confirmation modal shown when the user enables "Keep me signed in".
 */
export const KeepMeSignedInSheet = ({ isOpen, onCancel, onContinue }) => {
  const { t } = useTranslation("blocks", { keyPrefix: "login" });

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onCancel}
      hasCloseIcon={false}
      headingComponent={
        <div className="keep-me-signed-in-modal__heading">
          <div className="keep-me-signed-in-modal__icon-circle">
            <Icon name="circle-actions-success" size="lg" color="#9749fa" />
          </div>
          <h4 className="keep-me-signed-in-modal__title">
            {t("keep_me_signed_in_sheet_title")}
          </h4>
        </div>
      }
      text={t("keep_me_signed_in_sheet_body")}
      secondaryCtaLabel={t("keep_me_signed_in_sheet_cancel")}
      secondaryCtaHandleClick={onCancel}
      ctaLabel={t("keep_me_signed_in_sheet_continue")}
      ctaHandleClick={onContinue}
      classes="keep-me-signed-in-modal"
      overlayClasses="keep-me-signed-in-modal__overlay"
    />
  );
};

KeepMeSignedInSheet.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onContinue: PropTypes.func.isRequired,
};
