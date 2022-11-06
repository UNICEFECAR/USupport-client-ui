import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  NotFound,
  SOSCenter,
  RegisterAboutYou,
  ForgotPassword,
  ContactUs,
  NotificationPreferencesPage,
  Login,
  Welcome,
  UserProfile,
  InformationPortal,
  Articles,
  ArticleInformation,
  SelectProvider,
  PlatformRating,
  SharePlatform,
  RegisterAnonymous,
  RegisterSupport,
  RegisterPreview,
  PrivacyPolicy,
  RegisterEmail,
  FAQ,
} from "#pages";
// import { ProtectedRoute } from "./routes/ProtectedRoute";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

import "./App.scss";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
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
      <Router basename="/client">
        <Routes>
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/register-preview" element={<RegisterPreview />} />
          <Route path="/register" element={<RegisterEmail />} />
          <Route path="/register/about-you" element={<RegisterAboutYou />} />
          <Route path="/register-anonymous" element={<RegisterAnonymous />} />
          <Route path="/register-support" element={<RegisterSupport />} />

          <Route path="/share-platform" element={<SharePlatform />} />
          <Route path="/sos-center" element={<SOSCenter />} />
          <Route path="/platform-rating" element={<PlatformRating />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/select-provider" element={<SelectProvider />} />
          <Route
            path="/settings/notifications"
            element={<NotificationPreferencesPage />}
          />
          <Route path="/information-portal" element={<InformationPortal />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/article/:id" element={<ArticleInformation />} />
          <Route path="/login" element={<Login />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialOpen />
    </QueryClientProvider>
  );
}

export default App;
