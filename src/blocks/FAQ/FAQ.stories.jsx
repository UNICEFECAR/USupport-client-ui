import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FAQ } from "./FAQ";

export default {
  title: "Client UI/blocks/FAQ",
  component: FAQ,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <FAQ {...props} />
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
