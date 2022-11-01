import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Welcome } from "./Welcome";

export default {
  title: "Client UI/pages/Welcome",
  component: Welcome,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <Welcome {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
