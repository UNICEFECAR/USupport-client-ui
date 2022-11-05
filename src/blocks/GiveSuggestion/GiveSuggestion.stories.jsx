import React from 'react';

import { GiveSuggestion } from './GiveSuggestion';

export default {
  title: 'Client UI/blocks/GiveSuggestion',
  component: GiveSuggestion,
  argTypes: {},
};

const Template = (props) => <GiveSuggestion {...props} />;

export const Default = Template.bind({});
Default.args = {};
