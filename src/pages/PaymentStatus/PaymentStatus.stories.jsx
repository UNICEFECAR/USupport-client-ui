import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { PaymentStatus } from "./PaymentStatus";

export default {
  title: "Client UI/pages/PaymentStatus",
  component: PaymentStatus,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <PaymentStatus {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
