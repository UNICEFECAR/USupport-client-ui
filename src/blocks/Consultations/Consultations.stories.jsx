import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { Consultations } from "./Consultations";

export default {
  title: "Client UI/blocks/Consultations",
  component: Consultations,
  argTypes: {},
};
const queryClient = new QueryClient();
const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <Consultations {...props} />
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
