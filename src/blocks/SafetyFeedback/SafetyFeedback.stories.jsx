import React from 'react';

import { SafetyFeedback } from './SafetyFeedback';

export default {
  title: 'Client UI/blocks/SafetyFeedback',
  component: SafetyFeedback,
  argTypes: {},
};

const Template = (props) => <SafetyFeedback {...props} />;

export const Default = Template.bind({});
Default.args = {};
