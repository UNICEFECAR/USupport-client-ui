import React from "react";
import { useTranslation } from "react-i18next";
import { Modal } from "@USupport-components-library/src";

import "./app-update-modal.scss";

/**
 * AppUpdateModal
 *
 * Asks the user to refresh once a newer version of the platform is deployed
 *
 * @param {boolean} isOpen
 * @param {function} onRefresh - reloads the app
 * @param {function} onLater - closes the modal, it is shown again later
 *
 * @return {jsx}
 */
export const AppUpdateModal = ({ isOpen, onRefresh, onLater }) => {
  const { t } = useTranslation("blocks", { keyPrefix: "app-update-modal" });

  return (
    <Modal
      isOpen={isOpen}
      closeModal={onLater}
      heading={t("heading")}
      text={t("text")}
      ctaLabel={t("refresh")}
      ctaHandleClick={onRefresh}
      secondaryCtaLabel={t("later")}
      secondaryCtaHandleClick={onLater}
      classes="app-update-modal"
    />
  );
};
