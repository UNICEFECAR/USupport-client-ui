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
  UserProfile,
} from "#blocks/locales.js";

import {
  NotFoundPage,
  SOSCenterPage,
  Login as LoginPage,
  NotificationPreferences as NotificationPreferencesPage,
  ContactUs as ContactUsPage,
  RegisterAboutYou as RegisterAboutYouPage,
  UserProfile as UserProfilePage,
} from "#pages/locales.js";

const resources = {
  en: {
    // Blocks
    page: Page.en,
    "user-profile": UserProfile.en,
    "sos-center": SosCenter.en,
    "register-about-you": RegisterAboutYou.en,
    "contact-us-block": ContactUs.en,
    "notification-preferences": NotificationPreferences.en,
    login: Login.en,
    welcome: Welcome.en,

    // Pages
    "user-profile-page": UserProfilePage.en,
    "not-found-page": NotFoundPage.en,
    "contact-us-page": ContactUsPage.en,
    "sos-center-page": SOSCenterPage.en,
    "register-about-you-page": RegisterAboutYouPage.en,
    "notification-preferences-page": NotificationPreferencesPage.en,
    "login-page": LoginPage.en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
