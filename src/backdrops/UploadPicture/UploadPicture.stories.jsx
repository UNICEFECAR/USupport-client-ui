import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { UploadPicture } from './UploadPicture';

export default {
  title: 'Client UI/backdrops/UploadPicture',
  component: UploadPicture,
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
      <Button label='Toggle UploadPicture' onClick={handleOpen} />
      <UploadPicture {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
