import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import {
  Page,
  SosCenter,
  Welcome,
  Login,
  NotificationPreferences,
  ContactUs,
  RegisterAboutYou,
  SharePlatform,
  ForgotPassword,
  RegisterAnonymous,
  RegisterSupport,
} from "#blocks/locales.js";

import {
  NotFoundPage,
  SOSCenterPage,
  Login as LoginPage,
  NotificationPreferences as NotificationPreferencesPage,
  ContactUs as ContactUsPage,
  RegisterAboutYou as RegisterAboutYouPage,
  SharePlatform as SharePlatformPage,
  ForgotPassword as ForgotPasswordPage,
  RegisterAnonymous as RegisterAnonymousPage,
  RegisterSupport as RegisterSupportPage,
} from "#pages/locales.js";

const resources = {
  en: {
    // Blocks
    page: Page.en,
    "sos-center": SosCenter.en,
    "register-about-you": RegisterAboutYou.en,
    "register-anonymous": RegisterAnonymous.en,
    "register-support": RegisterSupport.en,
    "contact-us-block": ContactUs.en,
    "notification-preferences": NotificationPreferences.en,
    "share-platform": SharePlatform.en,
    "forgot-password": ForgotPassword.en,
    login: Login.en,
    welcome: Welcome.en,

    // Pages
    "not-found-page": NotFoundPage.en,
    "contact-us-page": ContactUsPage.en,
    "sos-center-page": SOSCenterPage.en,
    "register-about-you-page": RegisterAboutYouPage.en,
    "share-platform-page": SharePlatformPage.en,
    "register-anonymous-page": RegisterAnonymousPage.en,
    "register-support-page": RegisterSupportPage.en,
    "notification-preferences-page": NotificationPreferencesPage.en,
    "forgot-password-page": ForgotPasswordPage.en,
    "login-page": LoginPage.en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
