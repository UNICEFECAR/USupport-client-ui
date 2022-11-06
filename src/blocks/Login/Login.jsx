import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Block,
  Error,
  Input,
  Grid,
  GridItem,
  InputPassword,
  Button,
  // ButtonOnlyIcon,
} from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { useError } from "@USupport-components-library/hooks";

import "./login.scss";

/**
 * Login
 *
 * Login block
 *
 * @return {jsx}
 */
export const Login = () => {
  const { t } = useTranslation("login");
  const queryClient = useQueryClient();

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // TODO: Check if we have JWT token in local storage
    // and if so redirect to dashboard
  }, []);

  const login = async () => {
    return await userSvc.login({
      userType: "client",
      ...data,
    });
  };

  const loginMutation = useMutation(login, {
    onSuccess: (response) => {
      const { user: userData, token: tokenData } = response.data;
      const { token, expiresIn, refreshToken } = tokenData;

      localStorage.setItem("token", token);
      localStorage.setItem("token-expires-in", expiresIn);
      localStorage.setItem("refresh-token", refreshToken);

      queryClient.setQueryData(["user-data"], userData);
      console.log("Login success");
      setErrors({});
      // TODO: Navigate to the dashboard
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
    onSettled: (data, error) => {
      setIsSubmitting(false);
    },
  });

  const handleChange = (field, value) => {
    const newData = { ...data };

    newData[field] = value;

    setData(newData);
  };

  const handleLogin = () => {
    setIsSubmitting(true);
    loginMutation.mutate();
  };

  const handleForgotPassowrd = () => {
    console.log("Forgot password");
  };

  const handleOAuthLogin = (platform) => {
    console.log("platform");
  };

  const handleRegisterRedirect = () => {
    console.log("Register");
  };

  return (
    <Block classes="login">
      <Grid md={8} lg={12} classes="login__grid">
        <GridItem md={8} lg={12} classes="login__grid__inputs-item">
          <Input
            label={t("email_label")}
            onChange={(value) =>
              handleChange("email", value.currentTarget.value)
            }
            placeholder={t("email_placeholder")}
          />
          <InputPassword
            classes="login__grid__inputs-item__input--password"
            label={t("password_label")}
            onChange={(value) =>
              handleChange("password", value.currentTarget.value)
            }
            placeholder={t("password_placeholder")}
          />
          <Button
            type="ghost"
            color="purple"
            classes="login__grid__forgot-password"
            label={t("forgot_password_label")}
            onClick={() => handleForgotPassowrd()}
          />
          {errors.submit ? <Error message={errors.submit} /> : null}
          <Button
            label={t("login_label")}
            size="lg"
            classes="login-button"
            onClick={handleLogin}
            disabled={!data.email || !data.password || isSubmitting}
          />
        </GridItem>
        {/* <GridItem md={8} lg={12} classes="login__grid__content-item">
          <div>
            <p className="text">{t("paragraph")}</p>
            <div className="login__grid__content-item__buttons-container">
              <ButtonOnlyIcon
                onClick={() => handleOAuthLogin("facebook")}
                iconName="facebook-login"
                iconSize="lg"
              />
              <ButtonOnlyIcon
                onClick={() => handleOAuthLogin("apple")}
                iconName="app-store"
                iconSize="lg"
              />
              <ButtonOnlyIcon
                onClick={() => handleOAuthLogin("google")}
                iconName="google-login"
                iconSize="lg"
              />
            </div>
          </div>
          <Button
            type="ghost"
            label={t("register_button_label")}
            onClick={() => handleRegisterRedirect()}
          />
        </GridItem> */}
      </Grid>
    </Block>
  );
};
