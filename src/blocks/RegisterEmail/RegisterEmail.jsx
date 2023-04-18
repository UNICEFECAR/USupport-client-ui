import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useError } from "#hooks";

import Joi from "joi";

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
import { userSvc } from "@USupport-components-library/services";

import "./register-email.scss";

/**
 * RegisterEmail
 *
 * Register with email block
 *
 * @return {jsx}
 */
export const RegisterEmail = () => {
  const { t } = useTranslation("register-email");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_error")),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("email_error")),
    nickname: Joi.string().label(t("nickname_error")),
    isPrivacyAndTermsSelected: Joi.boolean(),
  });

  const [data, setData] = useState({
    email: "",
    nickname: "",
    password: "",
    isPrivacyAndTermsSelected: false,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    let newData = { ...data };
    newData[field] = value;
    setData(newData);
  };

  const handleBlur = (field) => {
    validateProperty(field, data[field], schema, setErrors);
  };

  const register = async () => {
    const countryID = localStorage.getItem("country_id");
    if (!countryID) {
      navigate("/");
      return;
    }
    // Send data to server
    return await userSvc.signUp({
      userType: "client",
      countryID,
      password: data.password,
      clientData: {
        email: data.email.toLowerCase(),
        nickname: data.nickname,
      },
    });
  };

  const registerMutation = useMutation(register, {
    // If the mutation succeeds, get the data returned
    // from the server, and put it in the cache
    onSuccess: (response) => {
      const { user: userData, token: tokenData } = response.data;
      const { token, expiresIn, refreshToken } = tokenData;

      localStorage.setItem("token", token);
      localStorage.setItem("token-expires-in", expiresIn);
      localStorage.setItem("refresh-token", refreshToken);

      queryClient.setQueryData(
        ["client-data"],
        userSvc.transformUserData(userData)
      );

      navigate("/register/about-you");
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
  });

  const handleRegister = async () => {
    if ((await validate(data, schema, setErrors)) === null) {
      registerMutation.mutate();
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

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
          {errors.submit ? <Error message={errors.submit} /> : null}
          <Button
            size="lg"
            label={t("register_button")}
            onClick={handleRegister}
            type="primary"
            color="green"
            classes="register-email__grid__register-button"
            disabled={!data.isPrivacyAndTermsSelected}
            loading={registerMutation.isLoading}
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
