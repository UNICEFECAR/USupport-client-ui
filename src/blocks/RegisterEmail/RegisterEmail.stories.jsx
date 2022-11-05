import React from 'react';

import { RegisterEmail } from './RegisterEmail';

export default {
  title: 'Client UI/blocks/RegisterEmail',
  component: RegisterEmail,
  argTypes: {},
};

const Template = (props) => <RegisterEmail {...props} />;

export const Default = Template.bind({});
Default.args = {};
