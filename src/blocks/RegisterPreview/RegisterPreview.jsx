import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useMutation } from "@tanstack/react-query";
import {
  Block,
  Button,
  CustomCarousel,
  Error as ErrorComponent,
  Grid,
  GridItem,
} from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";
import { mascotHappyBlue } from "@USupport-components-library/assets";

import { useError, useCustomNavigate as useNavigate } from "#hooks";

import "./register-preview.scss";

/**
 * RegisterPreview
 *
 * RegisterPreviewBlock
 *
 * @return {jsx}
 */
export const RegisterPreview = () => {
  const { t } = useTranslation("register-preview");
  const navigate = useNavigate();
  const [error, setErrror] = useState();

  const carouselItems = [
    {
      heading: "heading_1",
      text: "text_1",
    },
    {
      heading: "heading_2",
      text: "text_2",
    },
    {
      heading: "heading_3",
      text: "text_3",
    },
  ];

  const renderCarouselItems = () => {
    return carouselItems.map((item, index) => {
      return (
        <div
          key={index}
          className="register-preview__grid__content-item__carousel-item"
        >
          <h3>{t(item.heading)}</h3>
          <p className="register-preview__grid__content-item__carousel-item__text">
            {t(item.text)}
          </p>
        </div>
      );
    });
  };

  const tmpLogin = async () => {
    const res = await userSvc.tmpLogin();
    return res.data;
  };

  const tmpLoginMutation = useMutation(tmpLogin, {
    onSuccess: (data) => {
      const { token, expiresIn, refreshToken } = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("expires-in", expiresIn);
      localStorage.setItem("refresh-token", refreshToken);

      window.dispatchEvent(new Event("login"));
      navigate("/dashboard");
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrror(errorMessage);
    },
  });

  const handleRedirect = (redirectTo) => {
    if (redirectTo === "email") {
      navigate("/register", {
        state: {
          flow: "email",
        },
      });
    } else if (redirectTo === "anonymously") {
      navigate("/register-anonymous", {
        state: {
          flow: "anonymous",
        },
      });
    } else {
      tmpLoginMutation.mutate();
    }
  };

  return (
    <Block classes="register-preview">
      <Grid md={8} lg={12} classes="register-preview__grid">
        <GridItem md={4} lg={6} classes="register-preview__grid__mascot-item">
          <img src={mascotHappyBlue} />
        </GridItem>
        <GridItem md={4} lg={6} classes="register-preview__grid__content-item">
          <div className="register-preview__grid__content-item__carousel-container">
            <CustomCarousel speed={6000}>
              {renderCarouselItems()}
            </CustomCarousel>
          </div>
          <div className="register-preview__grid__content-item__btns-container">
            <Button
              size="lg"
              label={t("login")}
              color="purple"
              onClick={() => navigate("/login")}
            />
            <Button
              label={t("register_anonymously")}
              size="lg"
              onClick={() => handleRedirect("anonymously")}
            />
            <Button
              label={t("register_email")}
              size="lg"
              type="ghost"
              onClick={() => handleRedirect("email")}
            />
            <Button
              label={t("continue_as_guest")}
              type="ghost"
              size="lg"
              onClick={() => handleRedirect("guest")}
            />
          </div>
          {error ? <ErrorComponent message={error} /> : null}
        </GridItem>
      </Grid>
    </Block>
  );
};
