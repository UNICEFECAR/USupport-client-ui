import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate, useError } from "#hooks";
import {
  Block,
  InputPassword,
  Grid,
  GridItem,
  NewButton,
  Error,
} from "@USupport-components-library/src";
import {
  logoVerticalSvg,
  logoVerticalDarkSvg,
  logoVerticalRomaniaPng,
} from "@USupport-components-library/assets";
import { userSvc } from "@USupport-components-library/services";
import { ThemeContext, validate } from "@USupport-components-library/utils";
import Joi from "joi";

const WEBSITE_URL = `${import.meta.env.VITE_WEBSITE_URL}`;

import "./reset-password.scss";

/**
 * ResetPassword
 *
 * Reset password block
 *
 * @return {jsx}
 */
export const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("blocks", { keyPrefix: "reset-password" });
  const { t: tLogin } = useTranslation("blocks", { keyPrefix: "login" });
  const { theme } = useContext(ThemeContext);
  const IS_RO = localStorage.getItem("country") === "RO";

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [showLink, setShowLink] = useState(false);

  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_error")),
  });

  const handlePasswordChange = (value) => {
    setPassword(value);
    if (confirmPassword.length >= 8) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value === confirmPassword ? "" : t("password_match_error"),
      }));
    }
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    if (value.length >= 8) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: password === value ? "" : t("password_match_error"),
      }));
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsLoading(true);
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: t("password_match_error") });
      setIsLoading(false);
      return;
    }
    const token = new URLSearchParams(window.location.search).get("rp");
    if ((await validate({ password }, schema, setErrors)) === null) {
      try {
        const res = await userSvc.resetPassword(password, token);
        if (res.status === 200) {
          navigate("/dashboard");
        }
      } catch (error) {
        const { message: errorMessage } = useError(error);
        if (error.response.status === 409) {
          setShowLink(`${WEBSITE_URL}/client/forgot-password`);
        }
        setErrors({ submit: errorMessage });
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  return (
    <Block classes="reset-password">
      <Grid md={8} lg={12} classes="reset-password__grid">
        <GridItem md={8} lg={12} classes="reset-password__grid__logo-item">
          <h2 className="reset-password__grid__logo-item__heading">
            {tLogin("heading")}
          </h2>
          <img
            src={
              IS_RO
                ? logoVerticalRomaniaPng
                : theme !== "light"
                  ? logoVerticalDarkSvg
                  : logoVerticalSvg
            }
            alt="Logo"
            className="reset-password__grid__logo-item__logo"
          />
          <h2 className="reset-password__grid__logo-item__heading">
            {tLogin("client")}
          </h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="reset-password__grid__content-item">
          <form onSubmit={handleSubmit}>
            <InputPassword
              value={password}
              onChange={(e) => handlePasswordChange(e.currentTarget.value)}
              placeholder={t("placeholder")}
              label={t("label")}
              errorMessage={errors.password}
            />
            <InputPassword
              classes="reset-password__grid__content-item__input--confirm"
              value={confirmPassword}
              onChange={(e) =>
                handleConfirmPasswordChange(e.currentTarget.value)
              }
              placeholder={t("confirm_placeholder")}
              label={t("confirm_label")}
              errorMessage={errors.confirmPassword}
            />
            {errors.submit ? <Error message={errors.submit} /> : null}
            {showLink && (
              <a className="reset-password__link" href={showLink}>
                {showLink}
              </a>
            )}
            <NewButton
              label={t("submit")}
              size="lg"
              isFullWidth
              disabled={!password || !confirmPassword}
              loading={isLoading}
            />
          </form>
        </GridItem>
      </Grid>
    </Block>
  );
};
