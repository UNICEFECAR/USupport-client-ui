import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { CookiePolicy } from "./CookiePolicy";

export default {
  title: "Client UI/pages/CookiePolicy",
  component: CookiePolicy,
  argTypes: {},
};

const Template = (props) => (
  <QueryClientProvider client={queryClient}>
    <Router>
      <CookiePolicy {...props} />
    </Router>
  </QueryClientProvider>
);

export const Default = Template.bind({});
Default.args = {};
