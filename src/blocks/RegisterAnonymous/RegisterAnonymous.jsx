import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Joi from "joi";
import {
  AccessToken,
  Block,
  Button,
  Error,
  Grid,
  GridItem,
  Input,
  InputPassword,
  TermsAgreement,
} from "@USupport-components-library/src";
import {
  validate,
  validateProperty,
} from "@USupport-components-library/src/utils";
import { useError } from "#hooks";
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

  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_error")),
    nickname: Joi.string().label(t("nickname_error")),
    isPrivacyAndTermsSelected: Joi.boolean().invalid(false),
  });

  const [data, setData] = useState({
    password: "",
    nickname: "",
    isPrivacyAndTermsSelected: false,
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

      navigate("/register/support", {
        state: {
          hideGoBackArrow: false,
        },
      });
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
      setIsSubmitting(false);
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  const handleRegister = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      if ((await validate(data, schema, setErrors)) === null) {
        registerMutation.mutate(data);
      }
    }
  };

  const handleChange = (field, value) => {
    let newData = { ...data };
    newData[field] = value;
    setData(newData);
    // validateProperty("password", data.password, schema, setErrors);
  };

  const handleBlur = (field, value) => {
    validateProperty(field, value, schema, setErrors);
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  const canContinue =
    data.password && data.isPrivacyAndTermsSelected && data.nickname;

  return (
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
            />
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
              onChange={(e) => handleChange("password", e.currentTarget.value)}
              errorMessage={errors.password}
              onBlur={() => {
                handleBlur("password", data.password);
              }}
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
            <Button
              label={t("register_button_label")}
              size="lg"
              onClick={() => handleRegister()}
              disabled={!canContinue || isSubmitting}
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
  );
};
