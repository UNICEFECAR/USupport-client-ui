import React from "react";

import { PaymentStatus } from "./PaymentStatus";

export default {
  title: "Client UI/blocks/PaymentStatus",
  component: PaymentStatus,
  argTypes: {},
};

const Template = (props) => <PaymentStatus {...props} />;

export const Default = Template.bind({});
Default.args = {};
