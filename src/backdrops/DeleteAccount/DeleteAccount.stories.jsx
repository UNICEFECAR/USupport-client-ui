import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { DeleteAccount } from './DeleteAccount';

export default {
  title: 'Client UI/backdrops/DeleteAccount',
  component: DeleteAccount,
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
      <Button label='Toggle DeleteAccount' onClick={handleOpen} />
      <DeleteAccount {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
