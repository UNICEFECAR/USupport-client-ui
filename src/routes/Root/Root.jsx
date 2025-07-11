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
  Videos,
  VideoInformation,
  PodcastInformation,
  Podcasts,
  JitsiRoom,
  Organizations,
  OrganizationOverview,
} from "#pages";
import { CountryValidationRoute, ProtectedRoute } from "#routes";
import { useGetClientData } from "#hooks";

const RootContext = React.createContext();

const LanguageLayout = () => {
  const { language } = useParams();
  const allLangs = ["en", "ru", "kk", "pl", "uk"];

  if (!allLangs.includes(language) || !language) {
    return <Navigate to="/client/en" />;
  }
  return (
    <Routes>
      <Route
        path="login"
        element={
          <CountryValidationRoute>
            <Login />
          </CountryValidationRoute>
        }
      />
      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="consultation"
        element={
          <ProtectedRoute>
            <JitsiRoom />
            {/* <Consultation /> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="notifications"
        element={
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        }
      />
      <Route
        path="register-preview"
        element={
          <CountryValidationRoute>
            <RegisterPreview />
          </CountryValidationRoute>
        }
      />
      <Route
        path="register"
        element={
          <CountryValidationRoute>
            <RegisterEmail />
          </CountryValidationRoute>
        }
      />
      <Route
        path="register-anonymous"
        element={
          <CountryValidationRoute>
            <RegisterAnonymous />
          </CountryValidationRoute>
        }
      />
      <Route
        path="forgot-password"
        element={
          <CountryValidationRoute>
            <ForgotPassword />
          </CountryValidationRoute>
        }
      />
      <Route
        path="mood-tracker"
        element={
          <ProtectedRoute>
            <MoodTrackHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="reset-password"
        element={
          <CountryValidationRoute>
            <ResetPassword />
          </CountryValidationRoute>
        }
      />
      <Route
        path="privacy-policy"
        element={
          <CountryValidationRoute>
            <PrivacyPolicy />
          </CountryValidationRoute>
        }
      />
      <Route path="cookie-policy" element={<CookiePolicy />} />
      <Route
        path="terms-of-use"
        element={
          <CountryValidationRoute>
            <TermsOfUse />
          </CountryValidationRoute>
        }
      />
      <Route
        path="register/about-you"
        element={
          <ProtectedRoute>
            <RegisterAboutYou />
          </ProtectedRoute>
        }
      />
      <Route
        path="register/support"
        element={
          <ProtectedRoute>
            <RegisterSupport />
          </ProtectedRoute>
        }
      />
      {/* <Route
    path="share-platform"
    element={
      <ProtectedRoute>
        <SharePlatform />
      </ProtectedRoute>
    }
  /> */}
      <Route
        path="sos-center"
        element={
          <CountryValidationRoute>
            <SOSCenter />
          </CountryValidationRoute>
        }
      />
      <Route
        path="platform-rating"
        element={
          <ProtectedRoute>
            <PlatformRating />
          </ProtectedRoute>
        }
      />
      <Route
        path="payment-history"
        element={
          <ProtectedRoute>
            <PaymentHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="contact-us"
        element={
          <ProtectedRoute>
            <ContactUs />
          </ProtectedRoute>
        }
      />
      <Route
        path="select-provider"
        element={
          <ProtectedRoute>
            <SelectProvider />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="details"
        element={
          <ProtectedRoute>
            <UserDetails />
          </ProtectedRoute>
        }
      />
      <Route
        path="activity-history"
        element={
          <ProtectedRoute>
            <ActivityHistory />
          </ProtectedRoute>
        }
      />
      <Route
        path="notification-preferences"
        element={
          <ProtectedRoute>
            <NotificationPreferencesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="information-portal"
        element={
          <ProtectedRoute>
            <InformationPortal />
          </ProtectedRoute>
        }
      />
      <Route
        path="information-portal/articles"
        element={
          <ProtectedRoute>
            <Articles />
          </ProtectedRoute>
        }
      />
      <Route
        path="information-portal/videos"
        element={
          <ProtectedRoute>
            <Videos />
          </ProtectedRoute>
        }
      />
      <Route
        path="information-portal/podcasts"
        element={
          <ProtectedRoute>
            <Podcasts />
          </ProtectedRoute>
        }
      />
      <Route
        path="information-portal/video/:id/:name"
        element={
          <ProtectedRoute>
            <VideoInformation />
          </ProtectedRoute>
        }
      />
      <Route
        path="information-portal/podcast/:id/:name"
        element={
          <ProtectedRoute>
            <PodcastInformation />
          </ProtectedRoute>
        }
      />
      <Route
        path="information-portal/article/:id/:name"
        element={
          <ProtectedRoute>
            <ArticleInformation />
          </ProtectedRoute>
        }
      />
      <Route
        path="faq"
        element={
          <ProtectedRoute>
            <FAQ />
          </ProtectedRoute>
        }
      />
      <Route
        path="provider-overview"
        element={
          <ProtectedRoute>
            <ProviderOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="consultations"
        element={
          <ProtectedRoute>
            <Consultations />
          </ProtectedRoute>
        }
      />
      <Route
        path="checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="payment-status/:consultationId"
        element={
          <ProtectedRoute>
            <PaymentStatus />
          </ProtectedRoute>
        }
      />
      <Route
        path="my-qa"
        element={
          <ProtectedRoute>
            <MyQA />
          </ProtectedRoute>
        }
      />
      <Route
        path="organizations"
        element={
          <ProtectedRoute>
            <Organizations />
          </ProtectedRoute>
        }
      />
      <Route
        path="organization-overview/:organizationId"
        element={
          <ProtectedRoute>
            <OrganizationOverview />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Welcome />} />
      <Route path="*" element={<NotFound />} />
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
          path="/client"
          element={<Navigate to={`/client/${language || "en"}`} replace />}
        />
        <Route path="/client/:language/*" element={<LanguageLayout />} />
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
