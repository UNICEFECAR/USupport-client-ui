import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
  ActivityHistory,
  CookiePolicy,
  TermsOfUse,
  Dashboard,
  MoodTracker,
} from "#pages";
import { CountryValidationRoute, ProtectedRoute } from "#routes";
import { useGetClientData } from "#hooks";

export default function Root() {
  const token = localStorage.getItem("token");
  useGetClientData(!!token);

  return (
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
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
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
          path="/mood-tracker"
          element={
            <ProtectedRoute>
              <MoodTracker />
            </ProtectedRoute>
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
          path="/cookie-policy"
          element={
            <CountryValidationRoute>
              <CookiePolicy />
            </CountryValidationRoute>
          }
        />
        <Route
          path="/terms-of-use"
          element={
            <CountryValidationRoute>
              <TermsOfUse />
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
            <CountryValidationRoute>
              <SharePlatform />
            </CountryValidationRoute>
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
            <CountryValidationRoute>
              <PlatformRating />
            </CountryValidationRoute>
          }
        />
        <Route
          path="/contact-us"
          element={
            <CountryValidationRoute>
              <ContactUs />
            </CountryValidationRoute>
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
          path="/activity-history"
          element={
            <ProtectedRoute>
              <ActivityHistory />
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
            <CountryValidationRoute>
              <InformationPortal />
            </CountryValidationRoute>
          }
        />
        <Route
          path="/information-portal/articles"
          element={
            <CountryValidationRoute>
              <Articles />
            </CountryValidationRoute>
          }
        />
        <Route
          path="/information-portal/article/:id"
          element={
            <CountryValidationRoute>
              <ArticleInformation />
            </CountryValidationRoute>
          }
        />

        <Route
          path="/faq"
          element={
            <CountryValidationRoute>
              <FAQ />
            </CountryValidationRoute>
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
  );
}

export { Root };
