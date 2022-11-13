import React, { useState } from "react";
import { Button } from "@USupport-components-library/src";

import { ConfirmConsultation } from "./ConfirmConsultation";
import { Consultation } from "../../../USupport-components-library/src/components/cards/Consultation/Consultation";

export default {
  title: "Client UI/backdrops/ConfirmConsultation",
  component: ConfirmConsultation,
  argTypes: {},
};

const Template = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const today = new Date();
  const consultation = {
    startDate: new Date(),
    endDate: new Date(new Date(today.getTime() + 30 * 60000)),
  };

  return (
    <>
      <Button label="Toggle ConfirmConsultation" onClick={handleOpen} />
      <ConfirmConsultation
        consultation={consultation}
        {...props}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
