import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { SafetyFeedback } from './SafetyFeedback';

export default {
  title: 'Client UI/backdrops/SafetyFeedback',
  component: SafetyFeedback,
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
      <Button label='Toggle SafetyFeedback' onClick={handleOpen} />
      <SafetyFeedback {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
