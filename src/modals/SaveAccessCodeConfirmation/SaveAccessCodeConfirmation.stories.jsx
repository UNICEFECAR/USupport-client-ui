import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { SaveAccessCodeConfirmation } from './SaveAccessCodeConfirmation';

export default {
  title: 'Client UI/modals/SaveAccessCodeConfirmation',
  component: SaveAccessCodeConfirmation,
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
      <Button label='Toggle SaveAccessCodeConfirmation' onClick={handleOpen} />
      <SaveAccessCodeConfirmation {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
