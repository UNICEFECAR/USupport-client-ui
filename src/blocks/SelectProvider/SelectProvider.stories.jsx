import React from 'react';

import { SelectProvider } from './SelectProvider';

export default {
  title: 'Client UI/blocks/SelectProvider',
  component: SelectProvider,
  argTypes: {},
};

const Template = (props) => <SelectProvider {...props} />;

export const Default = Template.bind({});
Default.args = {};
