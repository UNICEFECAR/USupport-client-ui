import React from 'react';

import { MoodTrackerHistory } from './MoodTrackerHistory';

export default {
  title: 'Client UI/blocks/MoodTrackerHistory',
  component: MoodTrackerHistory,
  argTypes: {},
};

const Template = (props) => <MoodTrackerHistory {...props} />;

export const Default = Template.bind({});
Default.args = {};
