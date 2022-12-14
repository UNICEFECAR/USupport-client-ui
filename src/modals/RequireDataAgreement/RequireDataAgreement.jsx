import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import { Modal, Toggle } from "@USupport-components-library/src";
import { clientSvc } from "@USupport-components-library/services";

import "./require-data-agreement.scss";

/**
 * RequireDataAgreement
 *
 * The RequireDataAgreement modal
 *
 * @return {jsx}
 */
export const RequireDataAgreement = ({
  isOpen,
  onClose,
  onSuccess = () => {},
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("require-data-agreement");

  const updateDataProcessing = async () => {
    await clientSvc.changeDataProcessingAgreement(true);
    return true;
  };
  const updateDataProcessingMutation = useMutation(updateDataProcessing, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client-data"] });
      onSuccess();
      onClose();
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      toast(errorMessage, { type: "error" });
    },
  });

  const handleGivePermission = () => {
    updateDataProcessingMutation.mutate();
  };

  return (
    <Modal
      classes="require-data-agreement"
      heading={t("heading")}
      text={t("text")}
      isOpen={isOpen}
      closeModal={onClose}
      ctaLabel={t("give_permission")}
      ctaHandleClick={handleGivePermission}
      secondaryCtaLabel={t("cancel")}
      secondaryCtaHandleClick={onClose}
      secondaryCtaType="secondary"
    />
  );
};
