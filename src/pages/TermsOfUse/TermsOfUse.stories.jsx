import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router } from "react-router-dom";
import { TermsOfUse } from "./TermsOfUse";

export default {
  title: "Client UI/pages/TermsOfUse",
  component: TermsOfUse,
  argTypes: {},
};

// Create a react-query client
const queryClient = new QueryClient();

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <TermsOfUse {...props} />
    </Router>
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
