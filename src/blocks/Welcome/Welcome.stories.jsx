import React from "react";

import { Welcome } from "./Welcome";

export default {
  title: "Client UI/blocks/Welcome",
  component: Welcome,
  argTypes: {},
};

const Template = (props) => <Welcome {...props} />;

export const Default = Template.bind({});
Default.args = {};
