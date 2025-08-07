import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";

import { Modal } from "@USupport-components-library/src";
import { toast } from "react-toastify";

import { clientSvc } from "@USupport-components-library/services";
import { useError } from "#hooks";

/**
 * DeleteChatHistory
 *
 * The DeleteChatHistory modal
 *
 * @return {jsx}
 */
export const DeleteChatHistory = ({ isOpen, onClose }) => {
  const { t } = useTranslation("modals", { keyPrefix: "delete-chat-history" });

  const [errors, setErrors] = useState({});

  const deleteChat = async () => {
    const res = await clientSvc.deleteChatHistory();
    return res;
  };

  const deleteAccountMutation = useMutation(deleteChat, {
    onSuccess: () => {
      toast(t("success"));
      onClose();
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
  });

  const handleConfirm = () => {
    deleteAccountMutation.mutate();
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
    />
  );
};
