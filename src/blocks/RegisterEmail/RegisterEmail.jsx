import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useError } from "@USupport-components-library/hooks";

import Joi from "joi";

import {
  Block,
  Error,
  Grid,
  GridItem,
  Icon,
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

  const countryAndLanguage = queryClient.getQueryData(["country-and-language"]);

  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_error")),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("email_error")),
    isPrivacyAndTermsSelected: Joi.boolean(),
  });

  const [data, setData] = useState({
    email: "",
    password: "",
    isPrivacyAndTermsSelected: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    let newData = { ...data };
    newData[field] = value;
    setData(newData);
  };

  const handleBlur = (field) => {
    validateProperty(field, data[field], schema, setErrors);
  };

  const register = async () => {
    // Send data to server
    return await userSvc.signUp({
      userType: "client",
      countryID: "0667451b-41b8-4131-bbff-f19782b36fd6", // TODO: Add the actual countryId
      password: data.password,
      clientData: {
        email: data.email,
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

      queryClient.setQueryData(["user-data"], userData);

      navigate("/register/about-you");
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleRegister = async () => {
    setIsSubmitting(true);
    if ((await validate(data, schema, setErrors)) === null) {
      console.log("Start mutation");
      registerMutation.mutate();
    } else {
      console.warn("Validation failed");
      setIsSubmitting(false);
    }
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
          />
          {errors.submit ? <Error message={errors.submit} /> : null}
          <Button
            size="lg"
            label={t("register_button")}
            onClick={handleRegister}
            type="primary"
            color="green"
            classes="register-email__grid__register-button"
            disabled={!data.isPrivacyAndTermsSelected || isSubmitting}
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
