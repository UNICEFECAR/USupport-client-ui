import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ActivityHistory } from "./ActivityHistory";

export default {
  title: "Client UI/pages/ActivityHistory",
  component: ActivityHistory,
  argTypes: {},
};

const queryClient = new QueryClient();

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <ActivityHistory {...props} />
    </Router>
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
