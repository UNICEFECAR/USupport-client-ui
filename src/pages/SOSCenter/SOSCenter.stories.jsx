import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SOSCenter } from "./SOSCenter";

export default {
  title: "Client UI/pages/SOSCenter",
  component: SOSCenter,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = () => (
  <QueryClientProvider client={queryClient}>
    {" "}
    <Router>
      <SOSCenter />
    </Router>
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
