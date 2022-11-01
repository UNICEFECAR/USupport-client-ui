import React from 'react';

import { RegisterAnonymous } from './RegisterAnonymous';

export default {
  title: 'Client UI/blocks/RegisterAnonymous',
  component: RegisterAnonymous,
  argTypes: {},
};

const Template = (props) => <RegisterAnonymous {...props} />;

export const Default = Template.bind({});
Default.args = {};
