import React from 'react';

import { ArticleView } from './ArticleView';

export default {
  title: 'Website UI/blocks/ArticleView',
  component: ArticleView,
  argTypes: {},
};

const Template = (props) => <ArticleView {...props} />;

export const Default = Template.bind({});
Default.args = {};
