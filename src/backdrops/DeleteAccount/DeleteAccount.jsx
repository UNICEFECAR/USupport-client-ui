import React, { useState } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { Backdrop, InputPassword } from "@USupport-components-library/src";
import { useError } from "#hooks";
import { clientSvc, userSvc } from "@USupport-components-library/services";

import "./delete-account.scss";

/**
 * DeleteAccount
 *
 * The DeleteAccount backdrop
 *
 * @return {jsx}
 */
export const DeleteAccount = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const { t } = useTranslation("backdrops", { keyPrefix: "delete-account" });

  const [data, setData] = useState({ password: "" });
  const [errors, setErrors] = useState({});

  const deleteAccount = async () => {
    const res = await clientSvc.deleteClientProfile(data.password);
    if (res.status === 200) {
      return true;
    }
  };
  const deleteAccountMutation = useMutation(deleteAccount, {
    onSuccess: () => {
      userSvc.logout();

      navigate("/");
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
  });

  const handleChange = (value) => {
    setData({
      password: value,
    });
  };

  const handleSubmit = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <Backdrop
      classes="delete-account"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={t("text")}
      ctaLabel={t("delete_account_button")}
      ctaHandleClick={handleSubmit}
      isCtaDisabled={deleteAccountMutation.isLoading}
      secondaryCtaLabel={t("cancel_button")}
      secondaryCtaHandleClick={onClose}
      secondaryCtaType="secondary"
      errorMessage={errors.submit}
    >
      <InputPassword
        value={data.password}
        onChange={(e) => handleChange(e.currentTarget.value)}
      />
    </Backdrop>
  );
};
