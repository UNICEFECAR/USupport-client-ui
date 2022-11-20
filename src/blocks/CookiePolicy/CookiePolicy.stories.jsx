import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiePolicy } from "./CookiePolicy";

export default {
  title: "Client UI/blocks/CookiePolicy",
  component: CookiePolicy,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <CookiePolicy {...props} />
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
