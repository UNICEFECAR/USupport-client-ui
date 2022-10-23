import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { NotFound } from "./NotFound";

export default {
  title: "Website UI/pages/NotFound",
  component: NotFound,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <NotFound {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
