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
  RegisterSupport,
} from "#blocks/locales.js";

import {
  NotFoundPage,
  SOSCenterPage,
  Login as LoginPage,
  NotificationPreferences as NotificationPreferencesPage,
  ContactUs as ContactUsPage,
  RegisterAboutYou as RegisterAboutYouPage,
  RegisterSupport as RegisterSupportPage,
} from "#pages/locales.js";

const resources = {
  en: {
    // Blocks
    page: Page.en,
    "sos-center": SosCenter.en,
    "register-about-you": RegisterAboutYou.en,
    "register-support": RegisterSupport.en,
    "contact-us-block": ContactUs.en,
    "notification-preferences": NotificationPreferences.en,
    login: Login.en,
    welcome: Welcome.en,

    // Pages
    "not-found-page": NotFoundPage.en,
    "contact-us-page": ContactUsPage.en,
    "sos-center-page": SOSCenterPage.en,
    "register-about-you-page": RegisterAboutYouPage.en,
    "register-support-page": RegisterSupportPage.en,
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
