import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useTranslation } from "react-i18next";
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
  Consultations,
  ProviderOverview,
  RegisterPreview,
  PrivacyPolicy,
  RegisterEmail,
  FAQ,
  UserDetails,
  ResetPassword,
} from "#pages";
import { CountryValidationRoute, ProtectedRoute } from "#routes";

// AOS imports
import "aos/dist/aos.css";
import AOS from "aos";

import "./App.scss";

// Create a react-query client
const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

function App() {
  const { i18n } = useTranslation();
  AOS.init({
    offset: 10,
    duration: 1000,
    easing: "ease-in-sine",
    delay: 300,
    anchorPlacement: "top-bottom",
    once: false,
  });

  useEffect(() => {
    const language = localStorage.getItem("language");
    if (language) {
      i18n.changeLanguage(language);
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Router basename="/client">
        <Routes>
          <Route
            path="/login"
            element={
              <CountryValidationRoute>
                <Login />
              </CountryValidationRoute>
            }
          />
          <Route
            path="/register-preview"
            element={
              <CountryValidationRoute>
                <RegisterPreview />
              </CountryValidationRoute>
            }
          />
          <Route
            path="/register"
            element={
              <CountryValidationRoute>
                <RegisterEmail />
              </CountryValidationRoute>
            }
          />
          <Route
            path="/register-anonymous"
            element={
              <CountryValidationRoute>
                <RegisterAnonymous />
              </CountryValidationRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <CountryValidationRoute>
                <ForgotPassword />
              </CountryValidationRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <CountryValidationRoute>
                <ResetPassword />
              </CountryValidationRoute>
            }
          />
          <Route
            path="/privacy-policy"
            element={
              <CountryValidationRoute>
                <PrivacyPolicy />
              </CountryValidationRoute>
            }
          />
          <Route
            path="/register/about-you"
            element={
              <ProtectedRoute>
                <RegisterAboutYou />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register/support"
            element={
              <ProtectedRoute>
                <RegisterSupport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/share-platform"
            element={
              <ProtectedRoute>
                <SharePlatform />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sos-center"
            element={
              <CountryValidationRoute>
                <SOSCenter />
              </CountryValidationRoute>
            }
          />
          <Route
            path="/platform-rating"
            element={
              <ProtectedRoute>
                <PlatformRating />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact-us"
            element={
              <ProtectedRoute>
                <ContactUs />
              </ProtectedRoute>
            }
          />
          <Route
            path="/select-provider"
            element={
              <ProtectedRoute>
                <SelectProvider />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/details"
            element={
              <ProtectedRoute>
                <UserDetails />
              </ProtectedRoute>
            }
          />

          <Route
            path="/notification-preferences"
            element={
              <ProtectedRoute>
                <NotificationPreferencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/information-portal"
            element={
              <ProtectedRoute>
                <InformationPortal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/articles"
            element={
              <ProtectedRoute>
                <Articles />
              </ProtectedRoute>
            }
          />
          <Route
            path="/article/:id"
            element={
              <ProtectedRoute>
                <ArticleInformation />
              </ProtectedRoute>
            }
          />

          <Route
            path="/faq"
            element={
              <ProtectedRoute>
                <FAQ />
              </ProtectedRoute>
            }
          />

          <Route
            path="/provider-overview"
            element={
              <ProtectedRoute>
                <ProviderOverview />
              </ProtectedRoute>
            }
          />
          <Route
            path="/consultations"
            element={
              <ProtectedRoute>
                <Consultations />
              </ProtectedRoute>
            }
          />

          <Route path="/" element={<Welcome />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialOpen />
    </QueryClientProvider>
  );
}

export default App;
