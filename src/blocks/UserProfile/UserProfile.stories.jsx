import React from 'react';

import { UserProfile } from './UserProfile';

export default {
  title: 'Client UI/blocks/UserProfile',
  component: UserProfile,
  argTypes: {},
};

const Template = (props) => <UserProfile {...props} />;

export const Default = Template.bind({});
Default.args = {};
