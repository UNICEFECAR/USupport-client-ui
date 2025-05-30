import React, { useContext, useState } from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Block,
  Error,
  Input,
  Grid,
  GridItem,
  InputPassword,
  Button,
} from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { useError } from "#hooks";
import {
  getCountryFromTimezone,
  ThemeContext,
} from "@USupport-components-library/utils";
import {
  logoVerticalSvg,
  logoVerticalDarkSvg,
} from "@USupport-components-library/assets";

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
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);

  const [data, setData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const login = async () => {
    const usersCountry = getCountryFromTimezone();
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    const field = data.email.includes("@") ? "email" : "userAccessToken";
    const payload = {
      [field]: data.email,
      password: data.password,
      userType: "client",
      location: timezone + ", " + usersCountry,
    };
    return await userSvc.login(payload);
  };

  const loginMutation = useMutation(login, {
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

      window.dispatchEvent(new Event("login"));
      setErrors({});
      navigate("/dashboard");
      const language = localStorage.getItem("language");
      userSvc.changeLanguage(language).catch((err) => {
        console.log(err, "Error when changing language");
      });
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
  });

  const handleChange = (field, value) => {
    const newData = { ...data };

    newData[field] = value;

    setData(newData);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  const handleForgotPassowrd = () => {
    navigate("/forgot-password");
  };

  const handleRegisterRedirect = () => {
    navigate("/register-preview");
  };

  return (
    <Block classes="login">
      <Grid md={8} lg={12} classes="login__grid">
        <GridItem md={8} lg={12} classes="login__grid__inputs-item">
          <div className="login__grid__logo-item">
            <h2 className="welcome__grid__logo-item__heading">
              {t("heading")}
            </h2>
            <img
              src={theme === "dark" ? logoVerticalDarkSvg : logoVerticalSvg}
              alt="Logo"
              className="welcome__grid__logo-item__logo"
            />
            <h2 className="welcome__grid__logo-item__heading">{t("client")}</h2>
          </div>
        </GridItem>
        <GridItem md={8} lg={12} classes="login__grid__inputs-item">
          <form onSubmit={handleLogin}>
            <Input
              label={t("email_label")}
              onChange={(value) =>
                handleChange("email", value.currentTarget.value)
              }
              placeholder={t("email_placeholder")}
              value={data.email}
            />
            <InputPassword
              classes="login__grid__inputs-item__input--password"
              label={t("password_label")}
              onChange={(value) =>
                handleChange("password", value.currentTarget.value)
              }
              placeholder={t("password_placeholder")}
              value={data.password}
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
              disabled={!data.email || !data.password}
              loading={loginMutation.isLoading}
              isSubmit
            />
            <Button
              type="ghost"
              label={t("register_button_label")}
              onClick={() => handleRegisterRedirect()}
              classes="login__grid__register-button"
            />
          </form>
        </GridItem>
      </Grid>
    </Block>
  );
};
