import React from 'react';

import { VideoRoom } from './VideoRoom';

export default {
  title: 'Client UI/blocks/VideoRoom',
  component: VideoRoom,
  argTypes: {},
};

const Template = (props) => <VideoRoom {...props} />;

export const Default = Template.bind({});
Default.args = {};
