import React from 'react';

import { MoodTrackHistory } from './MoodTrackHistory';

export default {
  title: 'Client UI/blocks/MoodTrackHistory',
  component: MoodTrackHistory,
  argTypes: {},
};

const Template = (props) => <MoodTrackHistory {...props} />;

export const Default = Template.bind({});
Default.args = {};
