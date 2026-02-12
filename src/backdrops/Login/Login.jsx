import React, { useContext, useState } from "react";
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
import {
  getCountryFromTimezone,
  ThemeContext,
} from "@USupport-components-library/utils";
import {
  logoVerticalSvg,
  logoVerticalDarkSvg,
  logoVerticalRomaniaPng,
} from "@USupport-components-library/assets";

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

  const { theme } = useContext(ThemeContext);
  const IS_RO = localStorage.getItem("country") === "RO";

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
      <div className="login-modal__content-container">
        <img
          src={
            IS_RO
              ? logoVerticalRomaniaPng
              : theme !== "light"
                ? logoVerticalDarkSvg
                : logoVerticalSvg
          }
          alt="Logo"
          className="welcome-modal__content-container__logo"
        />
        <form onSubmit={handleLogin}>
          <Input
            label={t("email_label")}
            name="username"
            autoComplete="username"
            onChange={(value) =>
              handleChange("email", value.currentTarget.value)
            }
            placeholder={t("email_placeholder")}
            value={data.email}
          />
          <InputPassword
            classes="login__grid__inputs-item__input--password"
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
            classes="login__grid__forgot-password"
            label={t("forgot_password_label")}
            onClick={() => handleForgotPassword()}
          />
        </form>
      </div>
    </Backdrop>
  );
};
