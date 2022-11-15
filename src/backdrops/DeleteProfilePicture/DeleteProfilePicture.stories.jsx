import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { DeleteProfilePicture } from './DeleteProfilePicture';

export default {
  title: 'Client UI/backdrops/DeleteProfilePicture',
  component: DeleteProfilePicture,
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
      <Button label='Toggle DeleteProfilePicture' onClick={handleOpen} />
      <DeleteProfilePicture {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
