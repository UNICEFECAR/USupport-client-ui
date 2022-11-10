import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Backdrop, InputPassword } from "@USupport-components-library/src";
import { validateProperty } from "@USupport-components-library/utils";
import { useError } from "@USupport-components-library/hooks";
import { clientSvc, userSvc } from "@USupport-components-library/services";
import Joi from "joi";

import "./delete-account.scss";
import { useEffect } from "react";

/**
 * DeleteAccount
 *
 * The DeleteAccount backdrop
 *
 * @return {jsx}
 */
export const DeleteAccount = ({ isOpen, onClose }) => {
  const { t } = useTranslation("delete-account");
  const navigate = useNavigate();

  const schema = Joi.object({
    password: Joi.string(),
  });

  const [data, setData] = useState({ password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const deleteAccount = async () => {
    const res = await clientSvc.deleteClientProfile(data.password);
    if (res.status === 200) {
      return true;
    }
  };
  const deleteAccountMutation = useMutation(deleteAccount, {
    onSuccess: () => {
      console.log("success");
      userSvc.logout();
      setIsSubmitting(false);
      navigate("/");
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
      setIsSubmitting(false);
    },
  });

  const handleChange = (value) => {
    setData({
      password: value,
    });
  };

  const handleBlur = () => {
    validateProperty("password", data.password, schema, setErrors);
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
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
      isCtaDisabled={isSubmitting}
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