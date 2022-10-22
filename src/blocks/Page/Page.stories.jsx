import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { Page } from "./Page";

export default {
  title: "Website UI/blocks/Page",
  component: Page,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <Page {...props} />;
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
