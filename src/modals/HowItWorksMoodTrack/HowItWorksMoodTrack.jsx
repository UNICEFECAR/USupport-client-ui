import React from "react";
import { useTranslation } from "react-i18next";

import { useWindowDimensions } from "@USupport-components-library/utils";
import { Modal, CustomCarousel } from "@USupport-components-library/src";

// English
import image_1_en from "./assets/1 EN.png";
import image_2_en from "./assets/2 EN.png";
import image_3_en from "./assets/3 EN.png";
import image_4_en from "./assets/4 EN.png";
import image_5_en from "./assets/5 EN.png";

import image_1_en_mobile from "./assets/1 EN-mobile.png";
import image_2_en_mobile from "./assets/2 EN-mobile.png";
import image_3_en_mobile from "./assets/3 EN-mobile.png";
import image_4_en_mobile from "./assets/4 EN-mobile.png";
import image_5_en_mobile from "./assets/5 EN-mobile.png";

//Romanian
import image_1_ro from "./assets/1 RO.png";
import image_2_ro from "./assets/2 RO.png";
import image_3_ro from "./assets/3 RO.png";
import image_4_ro from "./assets/4 RO.png";
import image_5_ro from "./assets/5 RO.png";

import image_1_ro_mobile from "./assets/1 RO-mobile.png";
import image_2_ro_mobile from "./assets/2 RO-mobile.png";
import image_3_ro_mobile from "./assets/3 RO-mobile.png";
import image_4_ro_mobile from "./assets/4 RO-mobile.png";
import image_5_ro_mobile from "./assets/5 RO-mobile.png";

//Ukrainian
import image_1_uk from "./assets/1 UA.png";
import image_2_uk from "./assets/2 UA.png";
import image_3_uk from "./assets/3 UA.png";
import image_4_uk from "./assets/4 UA.png";
import image_5_uk from "./assets/5 UA.png";

import image_1_uk_mobile from "./assets/1 UA-mobile.png";
import image_2_uk_mobile from "./assets/2 UA-mobile.png";
import image_3_uk_mobile from "./assets/3 UA-mobile.png";
import image_4_uk_mobile from "./assets/4 UA-mobile.png";
import image_5_uk_mobile from "./assets/5 UA-mobile.png";

import "./how-it-works-mood-track.scss";

/**
 * HowItWorksMoodTrack
 *
 * The HowItWorksMoodTrack modal
 *
 * @return {jsx}
 */
export const HowItWorksMoodTrack = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation("modals", {
    keyPrefix: "how-it-works-mood-track",
  });
  const { width } = useWindowDimensions();

  const slides = [
    {
      text: t("subheading_1"),
      en: {
        image: image_1_en,
        mobile: image_1_en_mobile,
      },
      uk: {
        image: image_1_uk,
        mobile: image_1_uk_mobile,
      },
      ro: {
        image: image_1_ro,
        mobile: image_1_ro_mobile,
      },
    },
    {
      text: t("subheading_2"),
      en: {
        image: image_2_en,
        mobile: image_2_en_mobile,
      },
      uk: {
        image: image_2_uk,
        mobile: image_2_uk_mobile,
      },
      ro: {
        image: image_2_ro,
        mobile: image_2_ro_mobile,
      },
    },
    {
      text: t("subheading_3"),
      en: {
        image: image_3_en,
        mobile: image_3_en_mobile,
      },
      uk: {
        image: image_3_uk,
        mobile: image_3_uk_mobile,
      },
      ro: {
        image: image_3_ro,
        mobile: image_3_ro_mobile,
      },
    },
    {
      text: t("subheading_4"),
      en: {
        image: image_4_en,
        mobile: image_4_en_mobile,
      },
      uk: {
        image: image_4_uk,
        mobile: image_4_uk_mobile,
      },
      ro: {
        image: image_4_ro,
        mobile: image_4_ro_mobile,
      },
    },
    {
      text: t("subheading_5"),
      en: {
        image: image_5_en,
        mobile: image_5_en_mobile,
      },
      uk: {
        image: image_5_uk,
        mobile: image_5_uk_mobile,
      },
      ro: {
        image: image_5_ro,
        mobile: image_5_ro_mobile,
      },
    },
  ];

  const renderSlides = () => {
    return slides.map((slide, index) => {
      const currentSlide = slide[i18n.language] || slide.en;
      return (
        <div key={index} className="how-it-works-mood-track__slide">
          <p className="text">{slide.text}</p>
          <img src={width > 768 ? currentSlide.image : currentSlide.mobile} />
        </div>
      );
    });
  };

  return (
    <Modal
      classes="how-it-works-mood-track"
      heading={t("heading")}
      isOpen={isOpen}
      closeModal={onClose}
    >
      <CustomCarousel>{renderSlides()}</CustomCarousel>
    </Modal>
  );
};
