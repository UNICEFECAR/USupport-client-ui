import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { FilterProviders } from './FilterProviders';

export default {
  title: 'Client UI/backdrops/FilterProviders',
  component: FilterProviders,
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
      <Button label='Toggle FilterProviders' onClick={handleOpen} />
      <FilterProviders {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
