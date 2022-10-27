import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { NotificationPreferencesPage } from "./NotificationPreferences";

export default {
  title: "Website UI/pages/NotificationPreferences",
  component: NotificationPreferencesPage,
  argTypes: {},
};

const Template = (props) => (
  <Router>
    <NotificationPreferencesPage {...props} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
