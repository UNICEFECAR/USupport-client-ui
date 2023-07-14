import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";

import Joi from "joi";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

import {
  Block,
  Error,
  Grid,
  GridItem,
  Input,
  InputPassword,
  TermsAgreement,
  Button,
} from "@USupport-components-library/src";
import { validateProperty, validate } from "@USupport-components-library/utils";

import "./register-email.scss";

/**
 * RegisterEmail
 *
 * Register with email block
 *
 * @return {jsx}
 */
export const RegisterEmail = ({
  data,
  setData,
  submitError,
  handleSubmit,
  isMutating,
  handleCaptchaChange,
  showCaptcha,
}) => {
  const { t } = useTranslation("register-email");
  const navigate = useNavigate();

  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_error")),
    confirmPassword: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_match_error")),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("email_error")),
    nickname: Joi.string().label(t("nickname_error")),
    isPrivacyAndTermsSelected: Joi.boolean(),
    isAgeTermsSelected: Joi.boolean(),
  });

  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    if (
      field === "confirmPassword" &&
      value.length >= 8 &&
      data.password !== value
    ) {
      setErrors({ confirmPassword: t("password_match_error") });
    }
    if (
      field === "confirmPassword" &&
      value.length >= 8 &&
      data.password === value
    ) {
      setErrors({ confirmPassword: "" });
    }
    let newData = { ...data };
    newData[field] = value;
    setData(newData);
  };

  const handleBlur = (field) => {
    if (
      (field === "password" && data.confirmPassword.length >= 8) ||
      field === "confirmPassword"
    ) {
      if (data.password !== data.confirmPassword) {
        setErrors({ confirmPassword: t("password_match_error") });
        return;
      }
    }
    validateProperty(field, data[field], schema, setErrors);
  };

  const handleRegister = async () => {
    if (data.password !== data.confirmPassword) {
      setErrors({ confirmPassword: t("password_match_error") });
      return;
    }
    if ((await validate(data, schema, setErrors)) === null) {
      handleSubmit();
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const canContinue =
    data.password &&
    data.confirmPassword &&
    data.isPrivacyAndTermsSelected &&
    data.isAgeTermsSelected &&
    data.email &&
    data.nickname;

  return (
    <Block classes="register-email">
      <Grid classes="register-email__grid">
        <GridItem md={8} lg={12}>
          <Input
            label={t("email_label")}
            placeholder="user@mail.com"
            value={data.email}
            onChange={(e) => handleChange("email", e.currentTarget.value)}
            onBlur={() => handleBlur("email")}
            errorMessage={errors.email}
          />
          <Input
            label={t("nickname_label")}
            placeholder={t("nickname_placeholder")}
            value={data.nickname}
            onChange={(e) => handleChange("nickname", e.currentTarget.value)}
            onBlur={() => handleBlur("nickname")}
            errorMessage={errors.nickname}
          />
          <InputPassword
            classes="register-email__grid__password-input"
            label={t("password_label")}
            value={data.password}
            onChange={(e) => handleChange("password", e.currentTarget.value)}
            onBlur={() => handleBlur("password")}
            errorMessage={errors.password}
          />
          <InputPassword
            classes="register-email__grid__password-input"
            label={t("confirm_password_label")}
            value={data.confirmPassword}
            onChange={(e) =>
              handleChange("confirmPassword", e.currentTarget.value)
            }
            onBlur={() => handleBlur("confirmPassword")}
            errorMessage={errors.confirmPassword}
          />
          <TermsAgreement
            isChecked={data.isPrivacyAndTermsSelected}
            setIsChecked={(val) =>
              handleChange("isPrivacyAndTermsSelected", val)
            }
            textOne={t("terms_agreement_text_1")}
            textTwo={t("terms_agreement_text_2")}
            textThree={t("terms_agreement_text_3")}
            textFour={t("terms_agreement_text_4")}
            Link={Link}
          />
          <TermsAgreement
            isChecked={data.isAgeTermsSelected}
            setIsChecked={(val) => handleChange("isAgeTermsSelected", val)}
            textOne={t("age_terms_agreement_text_1")}
          />
          {showCaptcha && (
            <ReCAPTCHA
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleCaptchaChange}
              onExpired={() => handleCaptchaChange("expired")}
            />
          )}
          {errors.submit || submitError ? (
            <Error
              classes="register-email__grid__submit-error"
              message={errors.submit || submitError}
            />
          ) : null}
          <Button
            size="lg"
            label={t("register_button")}
            onClick={handleRegister}
            type="primary"
            color="green"
            classes="register-email__grid__register-button"
            disabled={!canContinue}
            loading={isMutating}
          />
          <Button
            label={t("login_button_label")}
            type="ghost"
            onClick={() => handleLoginRedirect()}
            classes="register-email__grid__login-button"
          />
          {/* <p className="register-email__grid__register-with">
            {t("paragraph")}
          </p>
          <div className="register-email__grid__social-icons">
            <Icon name="facebook-login" size="lg" />
            <Icon name="app-store" size="lg" color="#20809E" />
            <Icon name="google-login" size="lg" />
          </div> */}
        </GridItem>
      </Grid>
    </Block>
  );
};
