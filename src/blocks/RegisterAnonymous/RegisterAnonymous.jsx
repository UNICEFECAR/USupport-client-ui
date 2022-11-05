import React, { useState } from "react";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import Joi from "joi";
import {
  Block,
  Error,
  Grid,
  GridItem,
  InputPassword,
  Button,
  Icon,
  TermsAgreement,
  Loading,
} from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import {
  validateProperty,
  validate,
} from "@USupport-components-library/src/utils";
import { useError } from "@USupport-components-library/hooks";

import "./register-anonymous.scss";

/**
 * RegisterAnonymous
 *
 * RegisterAnonymous block
 *
 * @return {jsx}
 */
export const RegisterAnonymous = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation("register-anonymous");

  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_error")),
    isPrivacyAndTermsSelected: Joi.boolean().invalid(false),
  });

  const [data, setData] = useState({
    password: "",
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
    return await userSvc.signUp({
      userType: "client",
      countryID: "0667451b-41b8-4131-bbff-f19782b36fd6", // TODO: Add the actual countryId
      password: data.password,
      clientData: {
        userAccessToken,
      },
    });
  };

  const registerMutation = useMutation(register, {
    onSuccess: (response) => {
      const { user: userData, token: tokenData } = response.data;
      const { token, expiresIn, refreshToken } = tokenData;

      localStorage.setItem("token", token);
      localStorage.setItem("token-expires-in", expiresIn);
      localStorage.setItem("refresh-token", refreshToken);

      queryClient.setQueryData(["user-data"], userData);

      // TODO: Navigate to Dashboard
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
    if (!isSubmitting) {
      setIsSubmitting(true);
      if ((await validate(data, schema, setErrors)) === null) {
        registerMutation.mutate(data);
      } else {
        console.warn("Failed vaidation");
      }
    }
  };

  const handleChange = (field, value) => {
    let newData = { ...data };
    newData[field] = value;
    setData(newData);
    validateProperty("password", data.password, schema, setErrors);
  };

  const handleBlur = () => {
    validateProperty("password", data.password, schema, setErrors);
  };

  // TODO: Show confirmation for copying ?
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code);
  };

  const canContinue = data.password && data.isPrivacyAndTermsSelected;

  return (
    <Block classes="register-anonymous">
      <Grid md={8} lg={12} classes="register-anonymous__grid">
        <GridItem
          md={8}
          lg={12}
          classes="register-anonymous__grid__content-item"
        >
          <div className="register-anonymous__grid__content-item__main-component">
            <p className="register-anonymous__grid__content-item__main-component__code-text  paragraph">
              {t("paragraph_1")}
            </p>
            <div className="register-anonymous__grid__content-item__main-component__anonymous-code-container">
              {userAccessTokenIsLoading ? (
                <Loading size="sm" />
              ) : (
                <h4>{userAccessToken}</h4>
              )}
              <Icon
                name="copy"
                color="#9749FA"
                classes="register-anonymous__grid__content-item__main-component__copy-icon"
                onClick={handleCopyToClipboard}
              />
            </div>
            <InputPassword
              label={t("password_label")}
              classes="register-anonymous__grid__content-item__main-component__input-password"
              value={data.password}
              onChange={(e) => handleChange("password", e.currentTarget.value)}
              errorMessage={errors.password}
              onBlur={() => {
                handleBlur();
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
            />
            <Button
              label={t("register_button_label")}
              size="lg"
              onClick={() => handleRegister()}
              disabled={!canContinue || isSubmitting}
            />
          </div>
          {errors.submit ? <Error message={errors.submit} /> : null}
        </GridItem>
      </Grid>
    </Block>
  );
};
