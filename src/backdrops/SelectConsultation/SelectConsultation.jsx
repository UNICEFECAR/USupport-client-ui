import React, { useState } from "react";
import {
  Backdrop,
  Header,
  RadioButtonSelectorGroup,
  Button,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import "./select-consultation.scss";

/**
 * SelectConsultation
 *
 * The SelectConsultation backdrop
 *
 * @return {jsx}
 */
export const SelectConsultation = ({
  isOpen,
  onClose,
  edit = false,
  handleConfirmConsultation,
}) => {
  const { t } = useTranslation("select-consultation");

  const [freeSlots, setFreeSlots] = useState([
    "10:30 - 11:30",
    "15:30 - 16:30",
    "16:30 - 17:30",
  ]);
  const [selectedSlot, setSelectedSlot] = useState("");

  //Refactor, to take the free slots from the backend
  const handleDayChange = (day) => {
    setFreeSlots(["10:30 - 11:30", "15:30 - 16:30", "16:30 - 17:30"]);
  };

  const renderFreeSlots = () => {
    const options = freeSlots.map((slot) => {
      return { label: slot, value: slot };
    });
    return (
      <RadioButtonSelectorGroup
        options={options}
        name="free-slots"
        selected={selectedSlot}
        setSelected={setSelectedSlot}
        classes="select-consultation__radio-button-selector-group"
      />
    );
  };

  const handleSave = () => {
    handleConfirmConsultation();
    onClose();
  };

  return (
    <Backdrop
      classes="select-consultation"
      title="SelectConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={edit === true ? t("heading_edit") : t("heading_new")}
      text={edit === true ? t("subheading_edit") : t("subheading_new")}
      ctaLabel={t("cta_button_label")}
      ctaHandleClick={handleSave}
    >
      <div className="select-consultation__content-container">
        <Header handleDayChange={handleDayChange} />
        {renderFreeSlots()}
      </div>
    </Backdrop>
  );
};
