import React from "react";
import {
  Block,
  Input,
  Grid,
  GridItem,
  InputPassword,
  Button,
  ButtonOnlyIcon,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

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

  const [data, setData] = React.useState({
    email: "",
    password: "",
  });

  const handleChange = (field, value) => {
    const newData = { ...data };

    newData[field] = value;

    setData(newData);
  };

  const handleForgotPassowrd = () => {
    console.log("Forgot password");
  };

  const handleOAuthLogin = (platform) => {
    console.log("platform");
  };

  const handleOnLogin = () => {
    console.log("Login");
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
          <Button
            label={t("login_label")}
            size="lg"
            classes="login-button"
            onClick={() => handleOnLogin()}
            disabled={!data.email || !data.password}
          />
        </GridItem>
        <GridItem md={8} lg={12} classes="login__grid__content-item">
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
        </GridItem>
      </Grid>
    </Block>
  );
};
