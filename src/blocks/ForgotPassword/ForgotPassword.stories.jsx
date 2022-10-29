import React from 'react';

import { ForgotPassword } from './ForgotPassword';

export default {
  title: 'Client UI/blocks/ForgotPassword',
  component: ForgotPassword,
  argTypes: {},
};

const Template = (props) => <ForgotPassword {...props} />;

export const Default = Template.bind({});
Default.args = {};
