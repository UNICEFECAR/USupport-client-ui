import React from 'react';

import { MoodTracker } from './MoodTracker';

export default {
  title: 'Client UI/blocks/MoodTracker',
  component: MoodTracker,
  argTypes: {},
};

const Template = (props) => <MoodTracker {...props} />;

export const Default = Template.bind({});
Default.args = {};
