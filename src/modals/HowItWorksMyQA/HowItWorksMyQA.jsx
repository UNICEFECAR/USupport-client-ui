import React from "react";
import { useTranslation } from "react-i18next";

import { Modal, CustomCarousel } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

// English
import howItWorks1 from "./assets/HowItWorks3.png";
import howItWorks2 from "./assets/HowItWorks2.png";
import howItWorks3 from "./assets/HowItWorks1.png";

import howItWorks1Mobile from "./assets/HowItWorks1Mobile.png";
import howItWorks2Mobile from "./assets/HowItWorks2Mobile.png";
import howItWorks3Mobile from "./assets/HowItWorks3Mobile.png";

//Polish
import howItWorks1PL from "./assets/HowItWorksPL1.png";
import howItWorks2PL from "./assets/HowItWorksPL2.png";
import howItWorks3PL from "./assets/HowItWorksPL3.png";

import howItWorks1PLMobile from "./assets/HowItWorks1PLMobile.png";
import howItWorks2PLMobile from "./assets/HowItWorks2PLMobile.png";
import howItWorks3PLMobile from "./assets/HowItWorks3PLMobile.png";

// Kazakh
import howItWorks1KZ from "./assets/howItWorksKZ1.png";
import howItWorks2KZ from "./assets/howItWorksKZ2.png";
import howItWorks3KZ from "./assets/howItWorksKZ3.png";

import howItWorks1KZMobile from "./assets/HowItWorks1KZMobile.png";
import howItWorks2KZMobile from "./assets/HowItWorks2KZMobile.png";
import howItWorks3KZMobile from "./assets/HowItWorks3KZMobile.png";

// Ukranian
import howItWorks1UK from "./assets/HowItWorksUK1.png";
import howItWorks2UK from "./assets/HowItWorksUK2.png";
import howItWorks3UK from "./assets/HowItWorksUK3.png";

import howItWorks1UAMobile from "./assets/HowItWorks1UAMobile.png";
import howItWorks2UAMobile from "./assets/HowItWorks2UAMobile.png";
import howItWorks3UAMobile from "./assets/HowItWorks3UAMobile.png";

// Russian
import howItWorks1RU from "./assets/HowItWorksRU1.png";
import howItWorks2RU from "./assets/HowItWorksRU2.png";
import howItWorks3RU from "./assets/HowItWorksRU3.png";

import howItWorks1RUMobile from "./assets/HowItWorks1RUMobile.png";
import howItWorks2RUMobile from "./assets/HowItWorks2RUMobile.png";
import howItWorks3RUMobile from "./assets/HowItWorks3RUMobile.png";

import "./how-it-works-my-qa.scss";

/**
 * HowItWorksMyQA
 *
 * The HowItWorksMyQA modal
 *
 * @return {jsx}
 */
export const HowItWorksMyQA = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation("how-it-works-my-qa");
  const { width } = useWindowDimensions();

  const slides = [
    {
      en: {
        image: howItWorks1,
        imageMobile: howItWorks1Mobile,
      },
      pl: {
        image: howItWorks1PL,
        imageMobile: howItWorks1PLMobile,
      },
      kk: {
        image: howItWorks1KZ,
        imageMobile: howItWorks1KZMobile,
      },
      uk: {
        image: howItWorks1UK,
        imageMobile: howItWorks1UAMobile,
      },
      ru: {
        image: howItWorks1RU,
        imageMobile: howItWorks1RUMobile,
      },
      text: t("subheading_1"),
    },
    {
      text: t("subheading_2"),
      en: {
        image: howItWorks2,
        imageMobile: howItWorks2Mobile,
      },
      pl: {
        image: howItWorks2PL,
        imageMobile: howItWorks2PLMobile,
      },
      kk: {
        image: howItWorks2KZ,
        imageMobile: howItWorks2KZMobile,
      },
      uk: {
        image: howItWorks2UK,
        imageMobile: howItWorks2UAMobile,
      },
      ru: {
        image: howItWorks2RU,
        imageMobile: howItWorks2RUMobile,
      },
    },
    {
      text: t("subheading_3"),
      en: {
        image: howItWorks3,
        imageMobile: howItWorks3Mobile,
      },
      pl: {
        image: howItWorks3PL,
        imageMobile: howItWorks3PLMobile,
      },
      kk: {
        image: howItWorks3KZ,
        imageMobile: howItWorks3KZMobile,
      },
      uk: {
        image: howItWorks3UK,
        imageMobile: howItWorks3UAMobile,
      },
      ru: {
        image: howItWorks3RU,
        imageMobile: howItWorks3RUMobile,
      },
    },
  ];

  const renderSlides = () => {
    return slides.map((slide, index) => {
      const currentSlide = slide[i18n.language];
      return (
        <div key={index} className="how-it-works-my-qa__slide">
          <p className="text">{slide.text}</p>
          <img
            src={width > 768 ? currentSlide.image : currentSlide.imageMobile}
          />
        </div>
      );
    });
  };

  return (
    <Modal
      classes="how-it-works-MyQA"
      heading={t("heading")}
      isOpen={isOpen}
      closeModal={onClose}
    >
      <CustomCarousel>{renderSlides()}</CustomCarousel>
    </Modal>
  );
};
