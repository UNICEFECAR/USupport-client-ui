import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  NotFound,
  SOSCenter,
  RegisterAboutYou,
  ForgotPassword,
  ContactUs,
  NotificationPreferencesPage,
  Login,
  Welcome,
  InformationPortal,
  Articles,
  ArticleInformation,
  SelectProvider,
  PlatformRating,
  SharePlatform,
  RegisterAnonymous,
  RegisterSupport,
  RegisterPreview,
} from "#pages";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

import "./App.scss";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

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
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/register-preview" element={<RegisterPreview />} />
          <Route path="/share-platform" element={<SharePlatform />} />
          <Route
            path="/sos-center"
            element={<SOSCenter contacts={contacts} />}
          />
          <Route path="/register" element={<RegisterAboutYou />} />
          <Route path="/platform-rating" element={<PlatformRating />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/register-anonymous" element={<RegisterAnonymous />} />
          <Route path="/register-support" element={<RegisterSupport />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/select-provider" element={<SelectProvider />} />
          <Route
            path="/settings/notifications"
            element={<NotificationPreferencesPage />}
          />
          <Route path="/information-portal" element={<InformationPortal />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleInformation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
