import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { RequireDataAgreement } from './RequireDataAgreement';

export default {
  title: 'Client UI/modals/RequireDataAgreement',
  component: RequireDataAgreement,
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
      <Button label='Toggle RequireDataAgreement' onClick={handleOpen} />
      <RequireDataAgreement {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
