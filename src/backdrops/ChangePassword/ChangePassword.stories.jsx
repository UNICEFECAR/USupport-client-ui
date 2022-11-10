import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { ChangePassword } from './ChangePassword';

export default {
  title: 'Client UI/backdrops/ChangePassword',
  component: ChangePassword,
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
      <Button label='Toggle ChangePassword' onClick={handleOpen} />
      <ChangePassword {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
