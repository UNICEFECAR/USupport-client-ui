import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { QuestionDetails } from './QuestionDetails';

export default {
  title: 'Client UI/modals/QuestionDetails',
  component: QuestionDetails,
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
      <Button label='Toggle QuestionDetails' onClick={handleOpen} />
      <QuestionDetails {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
