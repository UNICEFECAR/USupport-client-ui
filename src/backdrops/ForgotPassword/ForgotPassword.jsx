import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Joi from "joi";

import { Backdrop, Input, Modal } from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { validate } from "@USupport-components-library/utils";

import { AuthenticationModalsLogo } from "../";

import "./forgot-password.scss";

/**
 * ForgotPassword
 *
 * ForgotPassword backdrop
 *
 * @returns {JSX.Element}
 */
export const ForgotPassword = ({ isOpen, handleGoBack }) => {
  const { t } = useTranslation("blocks", { keyPrefix: "forgot-password" });

  const [data, setData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("error_email_message")),
  });

  const handleResetPassword = async () => {
    setLoading(true);
    if ((await validate(data, schema, setErrors)) == null) {
      try {
        await userSvc.generateForgotPasswordLink(
          data.email.toLowerCase(),
          "client",
        );
        setIsModalOpen(true);
        setData({ email: "" });
      } catch (error) {
        console.log(error);
        setIsModalOpen(true);
      }
    }
    setLoading(false);
  };

  const canContinue = data.email === "";
  const closeModal = () => {
    setIsModalOpen(false);
    handleGoBack();
  };

  return (
    <>
      <Backdrop
        heading={t("heading_modal")}
        isOpen={isOpen}
        onClose={() => {}}
        handleGoBack={handleGoBack}
        hasGoBackArrow={true}
        hasCloseIcon={false}
        ctaLabel={t("reset_password_button_label")}
        ctaHandleClick={handleResetPassword}
        isCtaDisabled={canContinue}
        isCtaLoading={loading}
        errorMessage={errors.submit}
        topHeaderComponent={<AuthenticationModalsLogo />}
      >
        <div className="forgot-password-modal__content-container">
          <Input
            label={t("input_email_label")}
            value={data.email}
            placeholder={"user@mail.com"}
            onChange={(value) => setData({ email: value.currentTarget.value })}
            errorMessage={errors.email}
          />
        </div>
      </Backdrop>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        heading={t("modal_heading")}
        text={t("modal_text")}
        ctaLabel={t("go_back_to_login")}
        ctaHandleClick={closeModal}
      />
    </>
  );
};
