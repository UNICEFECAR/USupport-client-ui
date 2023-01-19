import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { Payment } from './Payment';

export default {
  title: 'Client UI/modals/Payment',
  component: Payment,
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
      <Button label='Toggle Payment' onClick={handleOpen} />
      <Payment {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
