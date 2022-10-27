import React from 'react';

import { NotificationPreferences } from './NotificationPreferences';

export default {
  title: 'Website UI/blocks/NotificationPreferences',
  component: NotificationPreferences,
  argTypes: {},
};

const Template = (props) => <NotificationPreferences {...props} />;

export const Default = Template.bind({});
Default.args = {};
