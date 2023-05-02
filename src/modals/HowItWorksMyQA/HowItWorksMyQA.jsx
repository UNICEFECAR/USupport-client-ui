import React from "react";
import { useTranslation } from "react-i18next";

import { Modal, CustomCarousel } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import howItWorks1 from "./assets/HowItWorks1.png";
import howItWorks2 from "./assets/HowItWorks2.png";
import howItWorks3 from "./assets/HowItWorks3.png";
import howItWorks1Mobile from "./assets/HowItWorks1Mobile.png";
import howItWorks2Mobile from "./assets/HowItWorks2Mobile.png";
import howItWorks3Mobile from "./assets/HowItWorks3Mobile.png";

import "./how-it-works-my-qa.scss";

/**
 * HowItWorksMyQA
 *
 * The HowItWorksMyQA modal
 *
 * @return {jsx}
 */
export const HowItWorksMyQA = ({ isOpen, onClose }) => {
  const { t } = useTranslation("how-it-works-my-qa");
  const { width } = useWindowDimensions();

  const slides = [
    {
      image: howItWorks3,
      imageMobile: howItWorks2Mobile,
      text: t("subheading_1"),
    },
    {
      image: howItWorks2,
      imageMobile: howItWorks1Mobile,
      text: t("subheading_2"),
    },
    {
      image: howItWorks1,
      imageMobile: howItWorks3Mobile,
      text: t("subheading_3"),
    },
  ];

  const renderSlides = () => {
    return slides.map((slide, index) => {
      return (
        <div key={index} className="how-it-works-my-qa__slide">
          <p className="text">{slide.text}</p>
          <img src={width > 768 ? slide.image : slide.imageMobile} />
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
