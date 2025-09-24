import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

import { Modal } from "@USupport-components-library/src";
import { toast } from "react-toastify";

import { clientSvc } from "@USupport-components-library/services";
import { useError } from "#hooks";

/**
 * DeleteMoodTrackerHistory
 *
 * The DeleteMoodTrackerHistory modal
 *
 * @return {jsx}
 */
export const DeleteMoodTrackerHistory = ({ isOpen, onClose }) => {
  const { t } = useTranslation("modals", {
    keyPrefix: "delete-mood-tracker-history",
  });

  const [errors, setErrors] = useState({});

  const deleteMoodTrackHistory = async () => {
    const res = await clientSvc.deleteMoodTrackerHistory();
    return res;
  };

  const deleteMoodTrackHistoryMutation = useMutation(deleteMoodTrackHistory, {
    onSuccess: () => {
      toast({ message: t("success") });
      onClose();
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
  });

  const handleConfirm = () => {
    deleteMoodTrackHistoryMutation.mutate();
  };

  return (
    <Modal
      heading={t("heading")}
      text={t("subheading")}
      isOpen={isOpen}
      closeModal={onClose}
      ctaLabel={t("confirm")}
      ctaColor="red"
      ctaHandleClick={handleConfirm}
      secondaryCtaLabel={t("cancel")}
      secondaryCtaType="primary"
      secondaryCtaHandleClick={onClose}
      errorMessage={errors.submit}
      isCtaLoading={deleteMoodTrackHistoryMutation.isLoading}
    />
  );
};
