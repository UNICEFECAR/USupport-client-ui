import React, { useState, useCallback } from "react";
import {
  // BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import { userSvc } from "@USupport-components-library/services";
import { IdleTimer } from "@USupport-components-library/src";

import { RequireRegistration } from "#modals";
import { useEventListener } from "#hooks";

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
  MyQA,
} from "#pages";
import { CountryValidationRoute, ProtectedRoute } from "#routes";
import { useGetClientData } from "#hooks";

const RootContext = React.createContext();

export default function Root() {
  const { t } = useTranslation("root");

  const token = localStorage.getItem("token");
  const isTmpUser = userSvc.getUserID() === "tmp-user";
  const enabled = token && !isTmpUser;
  useGetClientData(!!enabled);

  const [loggedIn, setLoggedIn] = useState(!!token);

  const [activeCoupon, setActiveCoupon] = useState();

  const [isRegistrationModalOpan, setIsRegistrationModalOpen] = useState(false);

  const handleRegistrationModalClose = () => setIsRegistrationModalOpen(false);
  const handleRegistrationModalOpen = () => setIsRegistrationModalOpen(true);

  const logoutHandler = useCallback(() => {
    setLoggedIn(false);
  }, []);

  useEventListener("logout", logoutHandler);

  const loginHandler = useCallback(() => {
    setLoggedIn(true);
  }, []);

  useEventListener("login", loginHandler);

  return (
    <RootContext.Provider
      value={{
        isTmpUser,
        handleRegistrationModalOpen,
        activeCoupon,
        setActiveCoupon,
      }}
    >
      {loggedIn && (
        <IdleTimer
          t={t}
          setLoggedIn={setLoggedIn}
          NavigateComponent={Navigate}
        />
      )}

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
        {/* <Route
          path="/share-platform"
          element={
            <ProtectedRoute>
              <SharePlatform />
            </ProtectedRoute>
          }
        /> */}
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
          path="/payment-history"
          element={
            <ProtectedRoute>
              <PaymentHistory />
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
            <ProtectedRoute>
              <InformationPortal />
            </ProtectedRoute>
          }
        />
        <Route
          path="/information-portal/articles"
          element={
            <ProtectedRoute>
              <Articles />
            </ProtectedRoute>
          }
        />
        <Route
          path="/information-portal/article/:id"
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
        <Route
          path="/my-qa"
          element={
            <ProtectedRoute>
              <MyQA />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Welcome />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <RequireRegistration
        isOpen={isRegistrationModalOpan}
        onClose={handleRegistrationModalClose}
      />
    </RootContext.Provider>
  );
}

export { Root, RootContext };
