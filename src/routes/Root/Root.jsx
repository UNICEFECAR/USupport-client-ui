import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

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
  // JitsiRoom,
} from "#pages";
import { CountryValidationRoute, ProtectedRoute } from "#routes";
import { useGetClientData } from "#hooks";

const RootContext = React.createContext();

const LanguageLayout = () => {
  const { language } = useParams();

  const allLangs = ["en", "ru", "kk", "pl", "uk"];

  if (!allLangs.includes(language) || !language) {
    return <Navigate to="/en/client" />;
  }
  return (
    <Routes>
      {/* <Route path="/client/jitsi" element={<JitsiRoom />} /> */}
      <Route
        path="/client/login"
        element={
          <CountryValidationRoute>
            <Login />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/consultation"
        element={
          <ProtectedRoute>
            <Consultation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/register-preview"
        element={
          <CountryValidationRoute>
            <RegisterPreview />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/register"
        element={
          <CountryValidationRoute>
            <RegisterEmail />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/register-anonymous"
        element={
          <CountryValidationRoute>
            <RegisterAnonymous />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/forgot-password"
        element={
          <CountryValidationRoute>
            <ForgotPassword />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/mood-tracker"
        element={
          <ProtectedRoute>
            <MoodTrackHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/reset-password"
        element={
          <CountryValidationRoute>
            <ResetPassword />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/privacy-policy"
        element={
          <CountryValidationRoute>
            <PrivacyPolicy />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/cookie-policy"
        element={
          <CountryValidationRoute>
            <CookiePolicy />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/terms-of-use"
        element={
          <CountryValidationRoute>
            <TermsOfUse />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/register/about-you"
        element={
          <ProtectedRoute>
            <RegisterAboutYou />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/register/support"
        element={
          <ProtectedRoute>
            <RegisterSupport />
          </ProtectedRoute>
        }
      />
      {/* <Route
    path="/client/share-platform"
    element={
      <ProtectedRoute>
        <SharePlatform />
      </ProtectedRoute>
    }
  /> */}
      <Route
        path="/client/sos-center"
        element={
          <CountryValidationRoute>
            <SOSCenter />
          </CountryValidationRoute>
        }
      />
      <Route
        path="/client/platform-rating"
        element={
          <ProtectedRoute>
            <PlatformRating />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/payment-history"
        element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/contact-us"
        element={
          <ProtectedRoute>
            <ContactUs />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/select-provider"
        element={
          <ProtectedRoute>
            <SelectProvider />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/details"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/activity-history"
        element={
          <ProtectedRoute>
            <ActivityHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/notification-preferences"
        element={
          <ProtectedRoute>
            <NotificationPreferencesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/information-portal"
        element={
          <ProtectedRoute>
            <InformationPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/information-portal/articles"
        element={
          <ProtectedRoute>
            <Articles />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/information-portal/article/:id"
        element={
          <ProtectedRoute>
            <ArticleInformation />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/faq"
        element={
          <ProtectedRoute>
            <FAQ />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/provider-overview"
        element={
          <ProtectedRoute>
            <ProviderOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/consultations"
        element={
          <ProtectedRoute>
            <Consultations />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/payment-status/:consultationId"
        element={
          <ProtectedRoute>
            <PaymentStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="/client/my-qa"
        element={
          <ProtectedRoute>
            <MyQA />
          </ProtectedRoute>
        }
      />
      <Route path="/client/" element={<Welcome />} />
      <Route path="/client/*" element={<NotFound />} />
    </Routes>
  );
};

export default function Root() {
  const { t } = useTranslation("root");

  const language = localStorage.getItem("language");
  const token = localStorage.getItem("token");
  const isTmpUser = userSvc.getUserID() === "tmp-user";

  const [country, setCountry] = useState(
    localStorage.getItem("country") || null
  );
  const [loggedIn, setLoggedIn] = useState(!!token);
  const [activeCoupon, setActiveCoupon] = useState();
  const [isRegistrationModalOpan, setIsRegistrationModalOpen] = useState(false);
  const [hasAddedPlatformAccess, setHasAddedPlatformAccess] = useState(false);

  const handler = useCallback(() => {
    const country = localStorage.getItem("country");
    if (country) {
      setCountry(country);
    }
  }, []);

  useEventListener("countryChanged", handler);

  const enabled = token && !isTmpUser && loggedIn;
  useGetClientData(!!enabled);

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

  useQuery({
    queryKey: ["addPlatformAccess", loggedIn, country],
    queryFn: async () => {
      await userSvc.addPlatformAccess("client");
      setHasAddedPlatformAccess(true);
      return true;
    },
    staleTime: Infinity,
    enabled: !!country && !hasAddedPlatformAccess,
  });

  const location = useLocation();
  const [hideIdleTimer, setHideIdleTimer] = useState(false);

  const previousLocation = useRef();
  const leaveConsultationFn = useRef(null);

  // If the user is in a consultation and navigates to a different page through
  // some of the tabs we have to make sure that he will be disconnected from the consultation
  // This is done by placing the leaveConsultationFn ref in the RootContext so it can be accessible everywhere
  // and then setting it to the "leaveConsultation" function in the "Consultation" page
  useEffect(() => {
    const currentUrl = location.pathname;
    if (
      previousLocation.current === "/consultation" &&
      currentUrl !== "/consultation"
    ) {
      if (leaveConsultationFn.current) {
        leaveConsultationFn.current();
      }
    }

    previousLocation.current = currentUrl;

    if (currentUrl === "/consultation") {
      setHideIdleTimer(true);
    } else if (hideIdleTimer) {
      setHideIdleTimer(false);
    }
  }, [location]);

  return (
    <RootContext.Provider
      value={{
        isTmpUser,
        handleRegistrationModalOpen,
        activeCoupon,
        setActiveCoupon,
        leaveConsultationFn,
      }}
    >
      {loggedIn && !hideIdleTimer && (
        <IdleTimer
          t={t}
          setLoggedIn={setLoggedIn}
          leaveConsultation={leaveConsultationFn.current}
          NavigateComponent={Navigate}
        />
      )}

      <Routes>
        <Route
          path="/:language"
          element={<Navigate to={`/${language}/client`} replace />}
        />
        <Route path=":language/*" element={<LanguageLayout />} />
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
