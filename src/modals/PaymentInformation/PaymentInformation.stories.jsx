import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { PaymentInformation } from './PaymentInformation';

export default {
  title: 'Client UI/modals/PaymentInformation',
  component: PaymentInformation,
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
      <Button label='Toggle PaymentInformation' onClick={handleOpen} />
      <PaymentInformation {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
