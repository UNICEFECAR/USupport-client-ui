import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PrivacyPolicy } from "./PrivacyPolicy";

export default {
  title: "Client UI/blocks/PrivacyPolicy",
  component: PrivacyPolicy,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <PrivacyPolicy {...props} />
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
