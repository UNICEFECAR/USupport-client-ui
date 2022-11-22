import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TermsOfUse } from "./TermsOfUse";

export default {
  title: "Client UI/blocks/TermsOfUse",
  component: TermsOfUse,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <TermsOfUse {...props} />
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
