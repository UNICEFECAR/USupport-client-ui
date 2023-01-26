import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { MoodTrackMoreInformation } from './MoodTrackMoreInformation';

export default {
  title: 'Client UI/modals/MoodTrackMoreInformation',
  component: MoodTrackMoreInformation,
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
      <Button label='Toggle MoodTrackMoreInformation' onClick={handleOpen} />
      <MoodTrackMoreInformation {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
