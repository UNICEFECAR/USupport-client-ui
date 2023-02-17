import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { userSvc } from "@USupport-components-library/services";

import {
  ActivityHistory,
  ArticleInformation,
  Articles,
  Consultation,
  Consultations,
  ContactUs,
  CookiePolicy,
  Dashboard,
  FAQ,
  ForgotPassword,
  InformationPortal,
  Login,
  MoodTracker,
  NotFound,
  NotificationPreferencesPage,
  PlatformRating,
  PrivacyPolicy,
  ProviderOverview,
  RegisterAboutYou,
  RegisterAnonymous,
  RegisterEmail,
  RegisterPreview,
  RegisterSupport,
  ResetPassword,
  SelectProvider,
  SharePlatform,
  SOSCenter,
  TermsOfUse,
  UserDetails,
  UserProfile,
  Welcome,
  Notifications,
  PaymentHistory,
  Checkout,
  PaymentStatus,
  MoodTrackHistory,
} from "#pages";
import { CountryValidationRoute, ProtectedRoute } from "#routes";
import { useGetClientData, useCheckHasUnreadNotifications } from "#hooks";

export default function Root() {
  const token = localStorage.getItem("token");
  const isTmpUser = userSvc.getUserID() === "tmp-user";
  const enabled = token && !isTmpUser;
  useGetClientData(!!enabled);
  useCheckHasUnreadNotifications(!!enabled);

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
          path="/consultation"
          element={
            <ProtectedRoute>
              <Consultation />
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
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
              <MoodTrackHistory />
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
          path="/payment-history"
          element={
            <CountryValidationRoute>
              <PaymentHistory />
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
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/payment-status/:consultationId"
          element={
            <ProtectedRoute>
              <PaymentStatus />
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
