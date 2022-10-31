import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { Login } from "./Login";

export default {
  title: "Client UI/pages/Login",
  component: Login,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <Login {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
