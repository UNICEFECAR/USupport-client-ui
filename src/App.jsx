import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
  NotFound,
  SOSCenter,
  RegisterAboutYou,
  ContactUs,
  NotificationPreferencesPage,
  Login,
  Welcome,
  SharePlatform,
} from "#pages";

import "./App.scss";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

function App() {
  // TODO: add the country specific information about the SOS center
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

  AOS.init({
    offset: 10,
    duration: 1000,
    easing: "ease-in-sine",
    delay: 300,
    anchorPlacement: "top-bottom",
    once: false,
  });

  return (
    <Router>
      <Routes>
        <Route path="/share-platform" element={<SharePlatform />} />
        <Route path="/sos-center" element={<SOSCenter contacts={contacts} />} />
        <Route path="/register" element={<RegisterAboutYou />} />
        <Route path="/contact-us" element={<ContactUs />} />
        <Route
          path="/settings/notifications"
          element={<NotificationPreferencesPage />}
        />
        <Route path="/login" element={<Login />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
