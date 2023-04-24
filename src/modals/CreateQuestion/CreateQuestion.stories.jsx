import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { CreateQuestion } from './CreateQuestion';

export default {
  title: 'Client UI/modals/CreateQuestion',
  component: CreateQuestion,
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
      <Button label='Toggle CreateQuestion' onClick={handleOpen} />
      <CreateQuestion {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
