import React, { useState } from "react";
import { Button } from "@USupport-components-library/src";

import { EditConsultation } from "./EditConsultation";

export default {
  title: "Client UI/backdrops/EditConsultation",
  component: EditConsultation,
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

  const consultation = {
    startDate: new Date("06.06.2023 18:00"),
    endDate: new Date("06.06.2023 19:00"),
  };

  const provider = { name: "Dr. Joanna Doe", image: "" };

  return (
    <>
      <Button label="Toggle EditConsultation" onClick={handleOpen} />
      <EditConsultation
        consultation={consultation}
        provider={provider}
        {...props}
        isOpen={isOpen}
        onClose={handleClose}
      />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
