import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { MyQA } from "./MyQA";

export default {
  title: "Client UI/pages/MyQA",
  component: MyQA,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <MyQA {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
