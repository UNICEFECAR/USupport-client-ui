import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  InputPassword,
  Grid,
  GridItem,
  Button,
} from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { validate } from "@USupport-components-library/utils";
import { useError } from "@USupport-components-library/hooks";
import Joi from "joi";

import "./reset-password.scss";
import { Error } from "../../../USupport-components-library/src/components/errors/Error";
import { useNavigate } from "react-router-dom";

/**
 * ResetPassword
 *
 * Reset password block
 *
 * @return {jsx}
 */
export const ResetPassword = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("reset-password");

  const [isLoading, setIsLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const schema = Joi.object({
    password: Joi.string()
      .pattern(new RegExp("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}"))
      .label(t("password_error")),
  });

  const handleSubmit = async () => {
    setIsLoading(true);
    const token = new URLSearchParams(window.location.search).get("rp");
    if ((await validate({ password }, schema, setErrors)) === null) {
      try {
        const res = await userSvc.resetPassword(password, token);
        if (res.status === 200) {
          navigate("/login");
        }
      } catch (error) {
        const { message: errorMessage } = useError(error);
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
        <GridItem md={8} lg={12} classes="reset-password__grid__item">
          <InputPassword
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            placeholder={t("placeholder")}
            label={t("label")}
            errorMessage={errors.password}
          />
          {errors.submit ? <Error message={errors.submit} /> : null}
          <Button
            size="lg"
            label={t("submit")}
            type="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
