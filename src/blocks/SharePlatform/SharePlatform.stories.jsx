import React from 'react';

import { SharePlatform } from './SharePlatform';

export default {
  title: 'Client UI/blocks/SharePlatform',
  component: SharePlatform,
  argTypes: {},
};

const Template = (props) => <SharePlatform {...props} />;

export const Default = Template.bind({});
Default.args = {};
