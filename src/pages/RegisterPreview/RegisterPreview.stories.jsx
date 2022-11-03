import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RegisterPreview } from "./RegisterPreview";

export default {
  title: "Client UI/pages/RegisterPreview",
  component: RegisterPreview,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <RegisterPreview {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
