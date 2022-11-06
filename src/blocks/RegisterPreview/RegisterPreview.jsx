import React from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  Grid,
  GridItem,
  CustomCarousel,
  Button,
} from "@USupport-components-library/src";

import "./register-preview.scss";

import { mascotHappyBlue } from "@USupport-components-library/assets";
import { useNavigate } from "react-router-dom";

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

  const carouselItems = [
    {
      heading: "What to expect from us",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim non amet, pellentesque accumsan, arcu. Eget augue eu dictum mi maecenas ut.",
    },
    {
      heading: "What to expect from us",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim non amet, pellentesque accumsan, arcu. Eget augue eu dictum mi maecenas ut.",
    },
    {
      heading: "What to expect from us",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Dignissim non amet, pellentesque accumsan, arcu. Eget augue eu dictum mi maecenas ut.",
    },
  ];

  const renderCarouselItems = () => {
    return carouselItems.map((item, index) => {
      return (
        <div
          key={index}
          className="register-preview__grid__content-item__carousel-item"
        >
          <h3>{item.heading}</h3>
          <p className="register-preview__grid__content-item__carousel-item__text">
            {item.text}
          </p>
        </div>
      );
    });
  };

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
      console.log("Navigate to dashboard...");
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
            <CustomCarousel>{renderCarouselItems()}</CustomCarousel>
          </div>
          <Button
            label={t("register_email")}
            size="lg"
            onClick={() => handleRedirect("email")}
          />
          <Button
            label={t("register_anonymously")}
            size="lg"
            type="secondary"
            onClick={() => handleRedirect("anonymously")}
          />
          <Button
            label={t("continue_as_guest")}
            type="ghost"
            size="lg"
            onClick={() => handleRedirect("guest")}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
