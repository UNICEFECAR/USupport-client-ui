import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { RegisterAboutYou } from "./RegisterAboutYou";

export default {
  title: "Client UI/pages/RegisterAboutYou",
  component: RegisterAboutYou,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <RegisterAboutYou {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
