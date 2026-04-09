import React from "react";
import { useTranslation } from "react-i18next";

import { Modal, CustomCarousel } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

// English
import howItWorks1EN from "./assets/how-it-works-1-en.png";
import howItWorks2EN from "./assets/how-it-works-2-en.png";
import howItWorks3EN from "./assets/how-it-works-3-en.png";

import howItWorks1ENMobile from "./assets/how-it-works-1-en-mobile.png";
import howItWorks2ENMobile from "./assets/how-it-works-2-en-mobile.png";
import howItWorks3ENMobile from "./assets/how-it-works-3-en-mobile.png";

// Polish
import howItWorks1PL from "./assets/how-it-works-1-pl.png";
import howItWorks2PL from "./assets/how-it-works-2-pl.png";
import howItWorks3PL from "./assets/how-it-works-3-pl.png";

import howItWorks1PLMobile from "./assets/how-it-works-1-pl-mobile.png";
import howItWorks2PLMobile from "./assets/how-it-works-2-pl-mobile.png";
import howItWorks3PLMobile from "./assets/how-it-works-3-pl-mobile.png";

// Kazakh (kk)
import howItWorks1KZ from "./assets/how-it-works-1-kz.png";
import howItWorks2KZ from "./assets/how-it-works-2-kz.png";
import howItWorks3KZ from "./assets/how-it-works-3-kz.png";

import howItWorks1KZMobile from "./assets/how-it-works-1-kz-mobile.png";
import howItWorks2KZMobile from "./assets/how-it-works-2-kz-mobile.png";
import howItWorks3KZMobile from "./assets/how-it-works-3-kz-mobile.png";

// Ukrainian (uk)
import howItWorks1UK from "./assets/how-it-works-1-uk.png";
import howItWorks2UK from "./assets/how-it-works-2-uk.png";
import howItWorks3UK from "./assets/how-it-works-3-uk.png";

import howItWorks1UKMobile from "./assets/how-it-works-1-uk-mobile.png";
import howItWorks2UKMobile from "./assets/how-it-works-2-uk-mobile.png";
import howItWorks3UKMobile from "./assets/how-it-works-3-uk-mobile.png";

// Russian
import howItWorks1RU from "./assets/how-it-works-1-ru.png";
import howItWorks2RU from "./assets/how-it-works-2-ru.png";
import howItWorks3RU from "./assets/how-it-works-3-ru.png";

import howItWorks1RUMobile from "./assets/how-it-works-1-ru-mobile.png";
import howItWorks2RUMobile from "./assets/how-it-works-2-ru-mobile.png";
import howItWorks3RUMobile from "./assets/how-it-works-3-ru-mobile.png";

import "./how-it-works-my-qa.scss";

/**
 * HowItWorksMyQA
 *
 * The HowItWorksMyQA modal
 *
 * @return {jsx}
 */
export const HowItWorksMyQA = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation("modals", {
    keyPrefix: "how-it-works-my-qa",
  });
  const { width } = useWindowDimensions();

  const slides = [
    {
      en: {
        image: howItWorks1EN,
        imageMobile: howItWorks1ENMobile,
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
        imageMobile: howItWorks1UKMobile,
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
        image: howItWorks2EN,
        imageMobile: howItWorks2ENMobile,
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
        imageMobile: howItWorks2UKMobile,
      },
      ru: {
        image: howItWorks2RU,
        imageMobile: howItWorks2RUMobile,
      },
    },
    {
      text: t("subheading_3"),
      en: {
        image: howItWorks3EN,
        imageMobile: howItWorks3ENMobile,
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
        imageMobile: howItWorks3UKMobile,
      },
      ru: {
        image: howItWorks3RU,
        imageMobile: howItWorks3RUMobile,
      },
    },
  ];

  const renderSlides = () => {
    return slides.map((slide, index) => {
      const currentSlide = slide[i18n.language] || slide.en;
      return (
        <div key={index} className="how-it-works-my-qa__slide">
          <p className="text">{slide.text}</p>
          <img
            src={width > 768 ? currentSlide.image : currentSlide.imageMobile}
            alt=""
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
