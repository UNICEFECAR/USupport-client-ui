import React from 'react';

import { UserDetails } from './UserDetails';

export default {
  title: 'Client UI/blocks/UserDetails',
  component: UserDetails,
  argTypes: {},
};

const Template = (props) => <UserDetails {...props} />;

export const Default = Template.bind({});
Default.args = {};
