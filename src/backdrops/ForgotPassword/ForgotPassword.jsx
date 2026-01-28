import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import Joi from "joi";

import { Backdrop, Input, Modal } from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { validate, ThemeContext } from "@USupport-components-library/utils";
import {
  logoVerticalSvg,
  logoVerticalDarkSvg,
  logoVerticalRomaniaPng,
} from "@USupport-components-library/assets";

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
  const { theme } = useContext(ThemeContext);
  const IS_RO = localStorage.getItem("country") === "RO";

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
        handleGoBack={handleGoBack}
        hasGoBackArrow={true}
        hasCloseIcon={false}
        ctaLabel={t("reset_password_button_label")}
        ctaHandleClick={handleResetPassword}
        isCtaDisabled={canContinue}
        isCtaLoading={loading}
        errorMessage={errors.submit}
      >
        <div className="forgot-password-modal__content-container">
          <img
            src={
              IS_RO
                ? logoVerticalRomaniaPng
                : theme !== "light"
                  ? logoVerticalDarkSvg
                  : logoVerticalSvg
            }
            alt="Logo"
            className="welcome-modal__content-container__logo"
          />
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
