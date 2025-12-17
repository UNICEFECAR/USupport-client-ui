import React from "react";
import { useTranslation } from "react-i18next";

import { useWindowDimensions } from "@USupport-components-library/utils";
import { Modal, CustomCarousel } from "@USupport-components-library/src";

// English
import image_1_en from "./assets/EN1.png";
import image_2_en from "./assets/EN2.png";
import image_3_en from "./assets/EN3.png";
import image_4_en from "./assets/EN4.png";
import image_5_en from "./assets/EN5.png";
import image_6_en from "./assets/EN6.png";
import image_7_en from "./assets/EN7.png";

import image_1_en_mobile from "./assets/EN1-mobile.png";
import image_2_en_mobile from "./assets/EN2-mobile.png";
import image_3_en_mobile from "./assets/EN3-mobile.png";
import image_4_en_mobile from "./assets/EN4-mobile.png";
import image_5_en_mobile from "./assets/EN5-mobile.png";
import image_6_en_mobile from "./assets/EN6-mobile.png";
import image_7_en_mobile from "./assets/EN7-mobile.png";

//Romanian
import image_1_ro from "./assets/RO1.png";
import image_2_ro from "./assets/RO2.png";
import image_3_ro from "./assets/RO3.png";
import image_4_ro from "./assets/RO4.png";
import image_5_ro from "./assets/RO5.png";
import image_6_ro from "./assets/RO6.png";
import image_7_ro from "./assets/RO7.png";

import image_1_ro_mobile from "./assets/RO1-mobile.png";
import image_2_ro_mobile from "./assets/RO2-mobile.png";
import image_3_ro_mobile from "./assets/RO3-mobile.png";
import image_4_ro_mobile from "./assets/RO4-mobile.png";
import image_5_ro_mobile from "./assets/RO5-mobile.png";
import image_6_ro_mobile from "./assets/RO6-mobile.png";
import image_7_ro_mobile from "./assets/RO7-mobile.png";

//Ukrainian
import image_1_uk from "./assets/UA1.png";
import image_2_uk from "./assets/UA2.png";
import image_3_uk from "./assets/UA3.png";
import image_4_uk from "./assets/UA4.png";
import image_5_uk from "./assets/UA5.png";
import image_6_uk from "./assets/UA6.png";
import image_7_uk from "./assets/UA7.png";

import image_1_uk_mobile from "./assets/UA1-mobile.png";
import image_2_uk_mobile from "./assets/UA2-mobile.png";
import image_3_uk_mobile from "./assets/UA3-mobile.png";
import image_4_uk_mobile from "./assets/UA4-mobile.png";
import image_5_uk_mobile from "./assets/UA5-mobile.png";
import image_6_uk_mobile from "./assets/UA6-mobile.png";
import image_7_uk_mobile from "./assets/UA7-mobile.png";

import "./how-it-works-ba.scss";

/**
 * HowItWorksBA
 *
 * The HowItWorksBA modal
 *
 * @return {jsx}
 */
export const HowItWorksBA = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation("modals", {
    keyPrefix: "how-it-works-ba",
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
    {
      text: t("subheading_6"),
      en: {
        image: image_6_en,
        mobile: image_6_en_mobile,
      },
      uk: {
        image: image_6_uk,
        mobile: image_6_uk_mobile,
      },
      ro: {
        image: image_6_ro,
        mobile: image_6_ro_mobile,
      },
    },
    {
      text: t("subheading_7"),
      en: {
        image: image_7_en,
        mobile: image_7_en_mobile,
      },
      uk: {
        image: image_7_uk,
        mobile: image_7_uk_mobile,
      },
      ro: {
        image: image_7_ro,
        mobile: image_7_ro_mobile,
      },
    },
  ];

  const renderSlides = () => {
    return slides.map((slide, index) => {
      const currentSlide = slide[i18n.language] || slide.en;
      return (
        <div key={index} className="how-it-works-ba__slide">
          <p className="text">{slide.text}</p>
          <img src={width > 768 ? currentSlide.image : currentSlide.mobile} />
        </div>
      );
    });
  };

  return (
    <Modal
      classes="how-it-works-ba"
      heading={t("heading")}
      isOpen={isOpen}
      closeModal={onClose}
    >
      <CustomCarousel>{renderSlides()}</CustomCarousel>
    </Modal>
  );
};
