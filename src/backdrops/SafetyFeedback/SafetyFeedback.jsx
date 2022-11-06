import React, { useState } from "react";
import {
  Backdrop,
  RadioButtonSelectorGroup,
  Textarea,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./safety-feedback.scss";

/**
 * SafetyFeedback
 *
 * The SafetyFeedback backdrop
 *
 * @return {jsx}
 */
export const SafetyFeedback = ({ isOpen, onClose }) => {
  const { t } = useTranslation("safety-feedback");

  const options = [
    { label: t("option_yes_label"), value: "yes" },
    { label: t("option_no_label"), value: "no" },
  ];
  const [selectedOption, setSelectedOption] = useState("");

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSendFeedback = () => {
    console.log(selectedOption + " " + feedbackMessage);

    onClose();
  };

  return (
    <Backdrop
      classes="safety-feedback"
      title="SafetyFeedback"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={t("subheading")}
      ctaLabel={t("cta_button_label")}
      ctaHandleClick={handleSendFeedback}
    >
      <div className="safety-feedback__content">
        <RadioButtonSelectorGroup
          name={"safety-feedback"}
          options={options}
          selected={selectedOption}
          setSelected={setSelectedOption}
        />
        {selectedOption === "no" && (
          <Textarea
            label={t("textarea_label")}
            placeholder={t("textarea_placeholder")}
            value={feedbackMessage}
            onChange={(value) => {
              setFeedbackMessage(value);
            }}
            classes="safety-feedback__content__textarea"
            size="md"
          />
        )}
      </div>
    </Backdrop>
  );
};
