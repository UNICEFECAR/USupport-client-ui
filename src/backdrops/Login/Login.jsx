import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useError } from "#hooks";

import {
  Backdrop,
  Input,
  InputPassword,
  Button,
} from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { getCountryFromTimezone } from "@USupport-components-library/utils";
import { AuthenticationModalsLogo } from "../";

import "./login.scss";

/**
 * Login
 *
 * Login backdrop
 *
 * @returns {JSX.Element}
 */
export const Login = ({
  isOpen,
  handleGoBack,
  handleRegister,
  handleForgotPassword,
}) => {
  const { t } = useTranslation("blocks", { keyPrefix: "login" });
  const queryClient = useQueryClient();

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
        userSvc.transformUserData(userData),
      );

      window.dispatchEvent(new Event("login"));
      window.dispatchEvent(new Event("token-changed"));
      setErrors({});
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

  return (
    <Backdrop
      heading={t("heading")}
      isOpen={isOpen}
      onClose={() => {}}
      hasGoBackArrow={true}
      handleGoBack={handleGoBack}
      thirdCtaLabel={t("register_button_label")}
      thirdCtaHandleClick={handleRegister}
      ctaLabel={t("login_label")}
      ctaHandleClick={handleLogin}
      isCtaDisabled={!data.email || !data.password}
      isCtaLoading={loginMutation.isLoading}
      errorMessage={errors.submit}
      hasCloseIcon={false}
    >
      <form onSubmit={handleLogin} className="login-modal__content-form">
        <AuthenticationModalsLogo />
        <Input
          label={t("email_label")}
          name="username"
          autoComplete="username"
          onChange={(value) => handleChange("email", value.currentTarget.value)}
          placeholder={t("email_placeholder")}
          value={data.email}
        />
        <InputPassword
          label={t("password_label")}
          name="current-password"
          autoComplete="current-password"
          onChange={(value) =>
            handleChange("password", value.currentTarget.value)
          }
          placeholder={t("password_placeholder")}
          value={data.password}
        />
        <Button
          type="ghost"
          color="purple"
          classes="login-modal__content-form__forgot-password"
          label={t("forgot_password_label")}
          onClick={() => handleForgotPassword()}
        />
        <button
          type="submit"
          className="login-modal__content-form__submit-button"
          aria-hidden="true"
          disabled={!data.email || !data.password}
        />
      </form>
    </Backdrop>
  );
};
