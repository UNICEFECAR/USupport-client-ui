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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("error_email_message")),
  });

  const handleResetPassword = async () => {
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
  };

  const canContinue = data.email === "";
  const closeModal = () => setIsModalOpen(false);
  return (
    <Block classes="forgot-password">
      <Grid md={8} lg={12} classes="forgot-password__grid">
        <GridItem md={8} lg={12} classes="forgot-password__grid__content-item">
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
            />
          </div>
        </GridItem>
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
