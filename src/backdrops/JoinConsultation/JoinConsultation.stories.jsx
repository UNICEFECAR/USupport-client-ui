import React, { useState } from "react";
import { Button } from "@USupport-components-library/src";

import { JoinConsultation } from "./JoinConsultation";

export default {
  title: "Client UI/backdrops/JoinConsultation",
  component: JoinConsultation,
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

  return (
    <>
      <Button label="Toggle JoinConsultation" onClick={handleOpen} />
      <JoinConsultation {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
