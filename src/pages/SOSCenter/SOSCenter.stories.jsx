import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { SOSCenter } from "./SOSCenter";

export default {
  title: "Website UI/pages/SOSCenter",
  component: SOSCenter,
  argTypes: {},
};

const contacts = [
  {
    title: "Emergency center 1",
    text: "In this emergency center you will receive help and information about what you exactly need.",
    phone: "+7 888 888 888",
  },
  {
    title: "Emergency center 2",
    text: "In this emergency center you will receive help and information about what you exactly need.",
    link: "https://staging.7digit.io",
  },
  {
    title: "Emergency center 3",
    text: "In this emergency center you will receive help and information about what you exactly need.",
    link: "https://staging.7digit.io",
  },
  {
    title: "Emergency center 4",
    text: "In this emergency center you will receive help and information about what you exactly need.",
    link: "https://staging.7digit.io",
  },
];

const Template = () => (
  <Router>
    <SOSCenter contacts={contacts} />
  </Router>
);

export const Default = Template.bind({});
Default.args = {};
