import React, { useState } from "react";
import { Button } from "@USupport-components-library/src";

import { HowItWorksMyQA } from "./HowItWorksMyQA";

export default {
  title: "Client UI/modals/HowItWorksMyQA",
  component: HowItWorksMyQA,
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
      <Button label="Toggle HowItWorksMyQA" onClick={handleOpen} />
      <HowItWorksMyQA {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
