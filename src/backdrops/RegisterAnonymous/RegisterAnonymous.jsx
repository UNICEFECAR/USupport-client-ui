import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Joi from "joi";

import {
  AccessToken,
  Icon,
  Input,
  InputPassword,
  TermsAgreement,
  Backdrop,
} from "@USupport-components-library/src";
import { validate, validateProperty } from "@USupport-components-library/utils";
import { userSvc } from "@USupport-components-library/services";

import { useError, useCustomNavigate as useNavigate } from "#hooks";
import { SaveAccessCodeConfirmation } from "#modals";
import { AuthenticationModalsLogo } from "../";

import "./register-anonymous.scss";

/**
 * RegisterAnonymous
 *
 * RegisterAnonymous modal
 *
 * @returns {JSX.Element}
 */
export const RegisterAnonymous = ({
  isOpen,
  handleGoBack,
  handleLoginRedirect,
  handleWelcomeRedirect,
}) => {
  const { t } = useTranslation("blocks", { keyPrefix: "register-anonymous" });
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const countriesData = queryClient.getQueryData(["countries"]);

  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_error")),
    confirmPassword: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_match_error")),
    nickname: Joi.string().label(t("nickname_error")),
    isPrivacyAndTermsSelected: Joi.boolean().invalid(false),
    isAgeTermsSelected: Joi.boolean().invalid(false),
  });

  const [data, setData] = useState({
    password: "",
    nickname: "",
    isPrivacyAndTermsSelected: false,
    isAgeTermsSelected: false,
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

  const country = localStorage.getItem("country");
  const selectedCountry = countriesData?.find((c) => c.value === country);
  const minAge = selectedCountry?.minAge;

  // On page load send a request to the server
  // to generate a user acces token
  const fetchUserAccessToken = async () => {
    try {
      const res = await userSvc.generateClientAccesToken();
      return res.data.userAccessToken;
    } catch (err) {
      const { message: errorMessage } = useError(err);
      setErrors({ submit: errorMessage });
    }
  };

  const { data: userAccessToken, isLoading: userAccessTokenIsLoading } =
    useQuery(["access-token"], fetchUserAccessToken, {
      cacheTime: 0,
    });

  const register = async () => {
    const countryID = localStorage.getItem("country_id");
    if (!countryID) {
      handleWelcomeRedirect();
    }
    return await userSvc.signUp({
      userType: "client",
      countryID,
      password: data.password,
      clientData: {
        userAccessToken,
        nickname: data.nickname,
      },
    });
  };

  const registerMutation = useMutation(register, {
    onSuccess: (response) => {
      const { token: tokenData } = response.data;
      const { token, expiresIn, refreshToken } = tokenData;

      localStorage.setItem("token", token);
      localStorage.setItem("token-expires-in", expiresIn);
      localStorage.setItem("refresh-token", refreshToken);

      window.dispatchEvent(new Event("login"));
      window.dispatchEvent(new Event("token-changed"));
      navigate("/register/about-you", {
        state: {
          isAnonymous: true,
        },
      });
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
  });

  const handleRegister = async () => {
    setIsConfirmationModalOpen(false);
    if ((await validate(data, schema, setErrors)) === null) {
      registerMutation.mutate(data);
    }
  };

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

  const handleBlur = (field, value) => {
    if (
      (field === "password" && data.confirmPassword.length >= 8) ||
      field === "confirmPassword"
    ) {
      if (data.password !== data.confirmPassword) {
        setErrors({ confirmPassword: t("password_match_error") });
        return;
      }
    }
    validateProperty(field, value, schema, setErrors);
  };

  const canContinue =
    data.password &&
    data.confirmPassword &&
    data.isPrivacyAndTermsSelected &&
    data.isAgeTermsSelected &&
    data.nickname;

  const handleRegisterButtonClick = () => {
    if (data.password !== data.confirmPassword) {
      setErrors({ confirmPassword: t("password_match_error") });
      return;
    }
    if (hasCopied) {
      handleRegister();
    } else {
      setIsConfirmationModalOpen(true);
    }
  };

  const handleCopy = () => {
    setHasCopied(true);
    toast(t("copy_success"));
  };

  return (
    <>
      <Backdrop
        heading={t("heading")}
        isOpen={isOpen}
        onClose={() => {}}
        handleGoBack={handleGoBack}
        hasGoBackArrow={true}
        hasCloseIcon={false}
        errorMessage={errors.submit}
        ctaLabel={t("register_button_label")}
        ctaHandleClick={handleRegisterButtonClick}
        isCtaDisabled={!canContinue}
        isCtaLoading={registerMutation.isLoading}
        thirdCtaLabel={t("login_button_label")}
        thirdCtaHandleClick={() => handleLoginRedirect()}
      >
        <AuthenticationModalsLogo />
        <form
          className="register-anonymous-modal__content-container"
          onSubmit={(e) => {
            e.preventDefault();
            handleRegisterButtonClick();
          }}
        >
          <AccessToken
            accessToken={userAccessToken}
            isLoading={userAccessTokenIsLoading}
            accessTokenLabel={t("paragraph_1")}
            handleCopy={handleCopy}
            name="username"
            autoComplete="username"
          />

          <div className="register-anonymous__grid__content-item__main-component__copy-container">
            <Icon name="warning" size="md" />
            <p className="small-text">{t("copy_text")}</p>
          </div>

          <Input
            label={t("nickname_label")}
            autoComplete="off"
            placeholder={t("nickname_placeholder")}
            value={data.nickname}
            onChange={(e) => handleChange("nickname", e.target.value)}
            onBlur={(e) => handleBlur("nickname", e.target.value)}
            errorMessage={errors.nickname}
          />
          <InputPassword
            label={t("password_label")}
            value={data.password}
            name="new-password"
            autoComplete="new-password"
            onChange={(e) => handleChange("password", e.currentTarget.value)}
            errorMessage={errors.password}
            onBlur={() => {
              handleBlur("password", data.password);
            }}
          />
          <InputPassword
            label={t("confirm_password_label")}
            value={data.confirmPassword}
            name="new-password-confirm"
            autoComplete="new-password"
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
        </form>
      </Backdrop>
      <SaveAccessCodeConfirmation
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        accessToken={userAccessToken}
        isLoading={userAccessTokenIsLoading}
        ctaHandleClick={handleRegister}
        showToast={() => toast(t("copy_success"))}
      />
    </>
  );
};
