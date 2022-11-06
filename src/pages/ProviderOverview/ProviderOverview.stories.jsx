import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ProviderOverview } from "./ProviderOverview";

export default {
  title: "Client UI/pages/ProviderOverview",
  component: ProviderOverview,
  argTypes: {},
};
const queryClient = new QueryClient();
const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <ProviderOverview {...props} />
    </Router>
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
