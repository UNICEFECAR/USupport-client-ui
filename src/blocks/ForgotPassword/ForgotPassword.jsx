import React, { useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  Input,
  Button,
} from "@USupport-components-library/src";
import { validate } from "@USupport-components-library/utils";
import Joi from "joi";
import { useTranslation } from "react-i18next";

import "./forgot-password.scss";

/**
 * ForgotPassword
 *
 * ForgotPassword block
 *
 * @return {jsx}
 */
export const ForgotPassword = () => {
  const { t } = useTranslation("forgot-password");

  const [data, setData] = useState({ email: "" });

  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("error_email_message")),
  });

  const handleResetPassword = async () => {
    if ((await validate(data, schema, setErrors)) == null) {
      console.log("Reset password for email: " + data.email);
    }
  };

  const handleRegisterRedirect = () => {
    console.log("Register");
  };

  const canContinue = data.email === "";

  return (
    <Block classes="forgot-password">
      <Grid md={8} lg={12} classes="forgot-password__grid">
        <GridItem md={8} lg={12} classes="forgot-password__grid__content-item">
          <div className="forgot-password__grid__content-item__main-container">
            <Input
              label={t("input_email_label")}
              placeholder={"user@mail.com"}
              onChange={(value) =>
                setData({ email: value.currentTarget.value })
              }
              errorMessage={errors.email}
            />
            <Button
              label={t("reset_password_button_label")}
              size="lg"
              onClick={() => handleResetPassword()}
              disabled={canContinue}
            />
          </div>
          <Button
            type="ghost"
            label={t("register_redirect_button_label")}
            onClick={() => handleRegisterRedirect()}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
