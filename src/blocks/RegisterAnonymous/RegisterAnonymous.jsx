import React, { useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  InputPassword,
  Button,
  Icon,
  CheckBox,
} from "@USupport-components-library/src";
import Joi from "joi";
import { validateProperty } from "@USupport-components-library/src/utils";
import { useTranslation } from "react-i18next";

import "./register-anonymous.scss";

/**
 * RegisterAnonymous
 *
 * RegisterAnonymous block
 *
 * @return {jsx}
 */
export const RegisterAnonymous = () => {
  const { t } = useTranslation("register-anonymous");

  const [code] = useState("#11524888");

  const [data, setData] = useState({
    password: "",
    isPrivacyAndTermsSelected: false,
  });

  //TODO: Refactor validation
  const schema = Joi.object({
    password: Joi.string().min(5).max(30).required().label(t("password_error")),
    isPrivacyAndTermsSelected: Joi.boolean().invalid(false),
  });

  const [errors, setErrors] = useState({});

  const handleRegister = () => {
    console.log("Register");
  };

  const handleLoginRedirect = () => {
    console.log("Login redirect");
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
              <h4>{code}</h4>
              <Icon
                name="copy"
                color="#9749FA"
                classes="register-anonymous__grid__content-item__main-component__copy-icon"
                onClick={handleCopyToClipboard}
              />
            </div>
            <InputPassword
              label={t("password_label")}
              value={data.password}
              onChange={(e) => handleChange("password", e.currentTarget.value)}
              errorMessage={errors.password}
              onBlur={() => {
                handleBlur();
              }}
            />
            <div className="register-anonymous__grid__content-item__main-component__privacy_policy_container">
              <CheckBox
                isChecked={data.isPrivacyAndTermsSelected}
                setIsChecked={(value) => {
                  handleChange("isPrivacyAndTermsSelected", value);
                }}
              />
              <p className="text">
                {t("paragraph_2")}{" "}
                <a className="privacy-policy-link" href="#">
                  {t("privacy_policy")}
                </a>{" "}
                {t("paragraph_3")} <br />
                <a className="privacy-policy-link" href="#">
                  {t("terms_of_use")}
                </a>
              </p>
            </div>
            <Button
              label={t("register_button_label")}
              size="lg"
              onClick={() => handleRegister()}
              disabled={!canContinue}
            />
          </div>
          <Button
            type="ghost"
            label={t("redirect_login_button_label")}
            onClick={() => handleLoginRedirect()}
            classes="register-anonymous__redirect-button"
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
