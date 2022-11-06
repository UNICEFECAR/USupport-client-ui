import React from "react";
import { Backdrop, ButtonSelector } from "@USupport-components-library/src";

import "./join-consultation.scss";

/**
 * JoinConsultation
 *
 * The JoinConsultation backdrop
 *
 * @return {jsx}
 */
export const JoinConsultation = ({ isOpen, onClose }) => {
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
      heading={"Choose how you want to communicate"}
      text={
        "Select the communication form which fits your needs the best and receive the help you want."
      }
    >
      <ButtonSelector
        label="Video/audio consulation"
        iconName="video"
        classes="join-consultation__button-selector"
        onClick={() => handleClick("video")}
      />
      <ButtonSelector
        label="Text consultation"
        iconName="comment"
        classes="join-consultation__button-selector"
        onClick={() => handleClick("chat")}
      />
    </Backdrop>
  );
};
