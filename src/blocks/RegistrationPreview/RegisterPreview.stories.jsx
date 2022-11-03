import React from "react";

import { RegisterPreview } from "./RegisterPreview";

export default {
  title: "Client UI/blocks/RegisterPreview",
  component: RegisterPreview,
  argTypes: {},
};

const Template = (props) => <RegisterPreview {...props} />;

export const Default = Template.bind({});
Default.args = {};
