import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { FilterQuestions } from './FilterQuestions';

export default {
  title: 'Client UI/backdrops/FilterQuestions',
  component: FilterQuestions,
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
      <Button label='Toggle FilterQuestions' onClick={handleOpen} />
      <FilterQuestions {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
