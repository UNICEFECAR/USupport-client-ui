import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { ProviderOverview } from "./ProviderOverview";

export default {
  title: "Client UI/blocks/ProviderOverview",
  component: ProviderOverview,
  argTypes: {},
};
const queryClient = new QueryClient();
const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <ProviderOverview {...props} />
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
