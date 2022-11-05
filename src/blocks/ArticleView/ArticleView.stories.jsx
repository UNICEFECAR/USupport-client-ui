import React from "react";

import { ArticleView } from "./ArticleView";

export default {
  title: "Client UI/blocks/ArticleView",
  component: ArticleView,
  argTypes: {},
};

const articleData = {
  title: "Article Title",
  creator: "Article Creator",
  readingTime: "5",
  body: "Article Body",
  labels: [
    {
      name: "Label 1",
    },

    {
      name: "Label 2",
    },
  ],
};

const Template = (props) => (
  <ArticleView articleData={articleData} {...props} />
);

export const Default = Template.bind({});
Default.args = {};
