import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { SelectConsultation } from './SelectConsultation';

export default {
  title: 'Client UI/backdrops/SelectConsultation',
  component: SelectConsultation,
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
      <Button label='Toggle SelectConsultation' onClick={handleOpen} />
      <SelectConsultation {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
