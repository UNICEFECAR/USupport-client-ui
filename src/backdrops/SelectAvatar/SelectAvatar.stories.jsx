import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { SelectAvatar } from './SelectAvatar';

export default {
  title: 'Client UI/backdrops/SelectAvatar',
  component: SelectAvatar,
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
      <Button label='Toggle SelectAvatar' onClick={handleOpen} />
      <SelectAvatar {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
