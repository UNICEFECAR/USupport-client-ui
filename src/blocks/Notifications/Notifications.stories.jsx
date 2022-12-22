import React from 'react';

import { Notifications } from './Notifications';

export default {
  title: 'Client UI/blocks/Notifications',
  component: Notifications,
  argTypes: {},
};

const Template = (props) => <Notifications {...props} />;

export const Default = Template.bind({});
Default.args = {};
