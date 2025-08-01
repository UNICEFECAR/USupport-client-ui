import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Joi from "joi";
import {
  AccessToken,
  Block,
  Button,
  Error,
  Grid,
  GridItem,
  Icon,
  Input,
  InputPassword,
  TermsAgreement,
} from "@USupport-components-library/src";
import {
  validate,
  validateProperty,
} from "@USupport-components-library/src/utils";
import { useError, useCustomNavigate as useNavigate } from "#hooks";
import { SaveAccessCodeConfirmation } from "#modals";
import { userSvc } from "@USupport-components-library/services";

import "./register-anonymous.scss";

/**
 * RegisterAnonymous
 *
 * RegisterAnonymous block
 *
 * @return {jsx}
 */
export const RegisterAnonymous = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("register-anonymous");
  const queryClient = useQueryClient();

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
      navigate("/");
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

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const canContinue =
    data.password &&
    data.confirmPassword &&
    data.isPrivacyAndTermsSelected &&
    // data.isAgeTermsSelected &&
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
      <SaveAccessCodeConfirmation
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        accessToken={userAccessToken}
        isLoading={userAccessTokenIsLoading}
        ctaHandleClick={handleRegister}
        showToast={() => toast(t("copy_success"))}
      />

      <Block classes="register-anonymous">
        <Grid md={8} lg={12} classes="register-anonymous__grid">
          <GridItem
            md={8}
            lg={12}
            classes="register-anonymous__grid__content-item"
          >
            <div className="register-anonymous__grid__content-item__main-component">
              <AccessToken
                accessToken={userAccessToken}
                isLoading={userAccessTokenIsLoading}
                accessTokenLabel={t("paragraph_1")}
                handleCopy={handleCopy}
              />

              <div className="register-anonymous__grid__content-item__main-component__copy-container">
                <Icon name="warning" size="md" />
                <p className="small-text">{t("copy_text")}</p>
              </div>

              <Input
                label={t("nickname_label")}
                placeholder={t("nickname_placeholder")}
                value={data.nickname}
                onChange={(e) => handleChange("nickname", e.target.value)}
                onBlur={(e) => handleBlur("nickname", e.target.value)}
                errorMessage={errors.nickname}
                classes="register-anonymous__grid__content-item__main-component__input"
              />
              <InputPassword
                label={t("password_label")}
                classes="register-anonymous__grid__content-item__main-component__input-password"
                value={data.password}
                onChange={(e) =>
                  handleChange("password", e.currentTarget.value)
                }
                errorMessage={errors.password}
                onBlur={() => {
                  handleBlur("password", data.password);
                }}
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
              <Button
                label={t("register_button_label")}
                size="lg"
                onClick={handleRegisterButtonClick}
                disabled={!canContinue}
                loading={registerMutation.isLoading}
              />

              <Button
                label={t("login_button_label")}
                type="ghost"
                onClick={() => handleLoginRedirect()}
                classes="register-anonymous__grid__login-button"
              />
            </div>
            {errors.submit ? <Error message={errors.submit} /> : null}
          </GridItem>
        </Grid>
      </Block>
    </>
  );
};
