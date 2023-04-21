import React, { useState } from 'react';
import { Button } from '@USupport-components-library/src';

import { ScheduleConsultationGroup } from './ScheduleConsultationGroup';

export default {
  title: 'Client UI/backdrops/ScheduleConsultationGroup',
  component: ScheduleConsultationGroup,
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
      <Button label='Toggle ScheduleConsultationGroup' onClick={handleOpen} />
      <ScheduleConsultationGroup {...props} isOpen={isOpen} onClose={handleClose} />
    </>
  );
};

export const Default = Template.bind({});
Default.args = {};
