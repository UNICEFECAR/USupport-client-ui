import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import ReCAPTCHA from "react-google-recaptcha";
import Joi from "joi";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { useError } from "#hooks";

import {
  Backdrop,
  Input,
  InputPassword,
  TermsAgreement,
  Error,
} from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { validateProperty } from "@USupport-components-library/utils";

import { CodeVerification } from "../";

import "./register-email.scss";

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
const SHOW_CAPTCHA = import.meta.env.MODE !== "development";

/**
 * RegisterEmail
 *
 * Register with email backdrop
 *
 * @returns {jsx}
 */
export const RegisterEmail = ({ isOpen, handleGoBack, handleLogin }) => {
  const { t } = useTranslation("blocks", { keyPrefix: "register-email" });
  const queryClient = useQueryClient();

  const [data, setData] = useState({
    email: "",
    nickname: "",
    password: "",
    isPrivacyAndTermsSelected: false,
    isAgeTermsSelected: false,
    confirmPassword: "",
  });
  const [isCodeVerificationOpen, setIsCodeVerificationOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [canRequestNewOTP, setCanRequestNewOTP] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [submitError, setSubmitError] = useState();
  const [shouldShowCodeVerification, setShouldShowCodeVerification] =
    useState(false);
  const [errors, setErrors] = useState({});
  const [isCaptchaValid, setIsCaptchaValid] = useState(!SHOW_CAPTCHA);
  const intervalId = useRef();

  const countriesData = queryClient.getQueryData(["countries"]);

  const country = localStorage.getItem("country");
  const selectedCountry = countriesData?.find((c) => c.value === country);
  const minAge = selectedCountry?.minAge;

  useEffect(() => {
    setShouldShowCodeVerification(false);
  }, [data]);

  const requestEmailOtp = useCallback(async () => {
    const countryID = localStorage.getItem("country_id");
    if (!countryID) {
      // navigate("/");
      return;
    }
    if (seconds === 60 || !shouldShowCodeVerification) {
      setShouldShowCodeVerification(true);
      return await userSvc.requestEmailOTP(data.email.toLowerCase());
    } else {
      setIsCodeVerificationOpen(true);
    }
  });

  const requestEmailOTPMutation = useMutation(requestEmailOtp, {
    onSuccess: () => {
      setSeconds(60);
      setCanRequestNewOTP(false);
      disableOtpRequestFor60Seconds();
      setIsCodeVerificationOpen(true);
      setSubmitError(null);
    },
    onError: (error) => {
      console.log(error, "error");
      const { message: errorMessage } = useError(error);
      setSubmitError(errorMessage);
    },
  });

  const validateCaptcha = async (value) => {
    return await userSvc.validateCaptcha(value);
  };

  const validateCaptchaMutation = useMutation(validateCaptcha, {
    onSuccess: (response) => {
      if (response.status === 200) {
        setIsCaptchaValid(true);
      }
    },
    onError: () => {
      setIsCaptchaValid(false);
    },
  });

  const handleCaptchaChange = (value) => {
    if (value === "expired") {
      setIsCaptchaValid(false);
    } else if (value) {
      validateCaptchaMutation.mutate(value);
    }
  };

  const disableOtpRequestFor60Seconds = () => {
    setShowTimer(true);
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const interval = setInterval(() => {
      setSeconds((sec) => {
        if (sec - 1 === 0) {
          clearInterval(interval);
          setShowTimer(false);
          setSeconds(60);
          setCanRequestNewOTP(true);
        }
        return sec - 1;
      });
    }, 1000);
    intervalId.current = interval;
  };

  // const handleGoBack = () => {
  //   navigate("/register-preview");
  // };

  // if (isLoggedIn === "loading") return <Loading />;
  // if (isLoggedIn === true)
  //   return (
  //     <Navigate to={`/client/${localStorage.getItem("language")}/dashboard`} />
  //   );

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

  const canContinue =
    data.password &&
    data.confirmPassword &&
    data.isPrivacyAndTermsSelected &&
    data.isAgeTermsSelected &&
    data.email &&
    data.nickname &&
    isCaptchaValid;

  return (
    <>
      <Backdrop
        isOpen={isOpen}
        onClose={() => {}} // No-op to prevent closing via overlay click
        hasGoBackArrow={true}
        handleGoBack={handleGoBack}
        hasCloseIcon={false}
        heading={t("heading")}
        ctaLabel={t("register_button")}
        ctaHandleClick={requestEmailOTPMutation.mutate}
        isCtaDisabled={!canContinue}
        isCtaLoading={requestEmailOTPMutation.isLoading}
        thirdCtaLabel={t("login_button_label")}
        thirdCtaHandleClick={handleLogin}
      >
        <div className="register-email-modal__content-container">
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
            textOne={t("age_terms_agreement_text_1", { age: minAge })}
          />
          {SHOW_CAPTCHA && (
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
        </div>
      </Backdrop>
      <CodeVerification
        data={data}
        isOpen={isCodeVerificationOpen}
        onClose={() => setIsCodeVerificationOpen(false)}
        requestOTP={requestEmailOTPMutation.mutate}
        canRequestNewEmail={canRequestNewOTP}
        resendTimer={seconds}
        showTimer={showTimer}
      />
    </>
  );
};
