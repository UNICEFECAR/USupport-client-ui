import React from 'react';

import { RegistrationPreview } from './RegistrationPreview';

export default {
  title: 'Client UI/blocks/RegistrationPreview',
  component: RegistrationPreview,
  argTypes: {},
};

const Template = (props) => <RegistrationPreview {...props} />;

export const Default = Template.bind({});
Default.args = {};
