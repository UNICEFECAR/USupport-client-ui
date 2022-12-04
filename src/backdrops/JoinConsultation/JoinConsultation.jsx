import React from "react";
import { Backdrop, ButtonSelector } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./join-consultation.scss";

/**
 * JoinConsultation
 *
 * The JoinConsultation backdrop
 *
 * @return {jsx}
 */
export const JoinConsultation = ({ isOpen, onClose }) => {
  const { t } = useTranslation("join-consultation");
  const handleClick = (redirectTo) => {
    if (redirectTo === "video") {
      console.log("video");
    } else if (redirectTo === "chat") {
      console.log("chat");
    }

    onClose();
  };

  return (
    <Backdrop
      classes="join-consultation"
      title="JoinConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={"subheading"}
    >
      <ButtonSelector
        label={t("button_label_1")}
        iconName="video"
        classes="join-consultation__button-selector"
        onClick={() => handleClick("video")}
      />
      <ButtonSelector
        label={t("button_label_2")}
        iconName="comment"
        classes="join-consultation__button-selector"
        onClick={() => handleClick("chat")}
      />
    </Backdrop>
  );
};
