import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { CodeVerification } from './CodeVerification';

export default {
  title: 'Client UI/backdrops/CodeVerification',
  component: CodeVerification,
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
      <Button label='Toggle CodeVerification' onClick={handleOpen} />
      <CodeVerification {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
