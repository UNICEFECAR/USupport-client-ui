import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { RequireRegistration } from './RequireRegistration';

export default {
  title: 'Client UI/modals/RequireRegistration',
  component: RequireRegistration,
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
      <Button label='Toggle RequireRegistration' onClick={handleOpen} />
      <RequireRegistration {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
