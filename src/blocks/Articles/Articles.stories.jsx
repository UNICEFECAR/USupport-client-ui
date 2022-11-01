import React from 'react';

import { Articles } from './Articles';

export default {
  title: 'Website UI/blocks/Articles',
  component: Articles,
  argTypes: {},
};

const Template = (props) => <Articles {...props} />;

export const Default = Template.bind({});
Default.args = {};
