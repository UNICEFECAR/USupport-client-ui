import React from 'react';

import { ActivityLogDashboard } from './ActivityLogDashboard';

export default {
  title: 'Client UI/blocks/ActivityLogDashboard',
  component: ActivityLogDashboard,
  argTypes: {},
};

const Template = (props) => <ActivityLogDashboard {...props} />;

export const Default = Template.bind({});
Default.args = {};
