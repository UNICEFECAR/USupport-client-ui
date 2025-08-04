import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  Grid,
  GridItem,
  Input,
  Button,
  Modal,
  Error,
} from "@USupport-components-library/src";
import { validate } from "@USupport-components-library/utils";
import { userSvc } from "@USupport-components-library/services";
import Joi from "joi";
import { logoVerticalSvg } from "@USupport-components-library/assets";

import "./forgot-password.scss";

/**
 * ForgotPassword
 *
 * ForgotPassword block
 *
 * @return {jsx}
 */
export const ForgotPassword = () => {
  const { t } = useTranslation("blocks", { keyPrefix: "forgot-password" });

  const [data, setData] = useState({ email: "" });
  const [errors, setErrors] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("error_email_message")),
  });

  const handleResetPassword = async () => {
    setLoading(true);
    if ((await validate(data, schema, setErrors)) == null) {
      try {
        await userSvc.generateForgotPasswordLink(
          data.email.toLowerCase(),
          "client"
        );
        setIsModalOpen(true);
      } catch (error) {
        setIsModalOpen(true);
      }
    }
    setLoading(false);
  };

  const canContinue = data.email === "";
  const closeModal = () => setIsModalOpen(false);
  return (
    <Block classes="forgot-password">
      <Grid md={8} lg={12} classes="forgot-password__grid">
        <GridItem md={8} lg={12} classes="forgot-password__grid__content-item">
          <div>
            <h2 className="welcome__grid__logo-item__heading">
              {t("heading")}
            </h2>
            <img
              src={logoVerticalSvg}
              alt="Logo"
              className="welcome__grid__logo-item__logo"
            />
            <h2 className="welcome__grid__logo-item__heading">{t("client")}</h2>
          </div>
          <div className="forgot-password__grid__content-item__main-container">
            <Input
              label={t("input_email_label")}
              value={data.email}
              placeholder={"user@mail.com"}
              onChange={(value) =>
                setData({ email: value.currentTarget.value })
              }
              errorMessage={errors.email}
            />
            {errors.submit ? <Error message={errors.submit} /> : null}
            <Button
              label={t("reset_password_button_label")}
              size="lg"
              onClick={() => handleResetPassword()}
              disabled={canContinue}
              loading={loading}
            />
          </div>
        </GridItem>
        <GridItem
          md={8}
          lg={12}
          classes="forgot-password__grid__content-item"
        ></GridItem>
      </Grid>
      <Modal
        isOpen={isModalOpen}
        closeModal={closeModal}
        heading={t("modal_heading")}
        text={t("modal_text")}
      />
    </Block>
  );
};
