import React from 'react';

import { PlatformRating } from './PlatformRating';

export default {
  title: 'Client UI/blocks/PlatformRating',
  component: PlatformRating,
  argTypes: {},
};

const Template = (props) => <PlatformRating {...props} />;

export const Default = Template.bind({});
Default.args = {};
