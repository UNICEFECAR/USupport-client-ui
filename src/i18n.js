import i18n from "i18next";
import { initReactI18next } from "react-i18next";


import { Page, SosCenter, Welcome, Login, NotificationPreferences } from "./blocks/locales.js";
import { NotFoundPage, SOSCenterPage, Login as LoginPage, NotificationPreferences as NotificationPreferencesPage,} from "./pages/locales.js";

const resources = {
  en: {
    page: Page.en,
    "sos-center": SosCenter.en,
    "notification-preferences": NotificationPreferences.en,
    login: Login.en,
    welcome: Welcome.en,

    // Pages
    "not-found-page": NotFoundPage.en,
    "sos-center-page": SOSCenterPage.en,
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
