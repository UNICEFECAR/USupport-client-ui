import React from 'react';

import { Login } from './Login';

export default {
  title: 'Website UI/blocks/Login',
  component: Login,
  argTypes: {},
};

const Template = (props) => <Login {...props} />;

export const Default = Template.bind({});
Default.args = {};
