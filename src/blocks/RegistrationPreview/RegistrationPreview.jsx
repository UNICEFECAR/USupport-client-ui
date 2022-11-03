import React from "react";
import {
  Block,
  Grid,
  GridItem,
  CustomCarousel,
  Button,
} from "@USupport-components-library/src";

import "./registration-preview.scss";

import { mascotHappyBlue } from "@USupport-components-library/assets";

/**
 * RegistrationPreview
 *
 * RegistrationPreviewBlock
 *
 * @return {jsx}
 */
export const RegistrationPreview = () => {
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
          className="registration-preview__grid__content-item__carousel-item"
        >
          <h3>{item.heading}</h3>
          <p className="registration-preview__grid__content-item__carousel-item__text">
            {item.text}
          </p>
        </div>
      );
    });
  };

  const handleRedirect = (redirectTo) => {
    if (redirectTo === "email") console.log("Register email");
    else if (redirectTo === "anonimously") console.log("Register anonimously");
    else "Continue as guest";
  };

  return (
    <Block classes="registration-preview">
      <Grid md={8} lg={12} classes="registration-preview__grid">
        <GridItem
          md={4}
          lg={6}
          classes="registration-preview__grid__mascot-item"
        >
          <img src={mascotHappyBlue} />
        </GridItem>
        <GridItem
          md={4}
          lg={6}
          classes="registration-preview__grid__content-item"
        >
          <div className="registration-preview__grid__content-item__carousel-container">
            <CustomCarousel>{renderCarouselItems()}</CustomCarousel>
          </div>
          <Button
            label="Register with email"
            size="lg"
            onClick={() => handleRedirect("email")}
          />
          <Button
            label="Register with email"
            size="lg"
            type="secondary"
            onClick={() => handleRedirect("anonimously")}
          />
          <Button
            label="Continue without registration"
            type="ghost"
            size="lg"
            onClick={() => handleRedirect("no-registration")}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
