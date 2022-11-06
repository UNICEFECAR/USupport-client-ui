import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SOSCenter } from "./SOSCenter";

export default {
  title: "Client UI/blocks/SOSCenter",
  component: SOSCenter,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = () => (
  <QueryClientProvider client={queryClient}>
    <SOSCenter contacts={contacts} />
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
