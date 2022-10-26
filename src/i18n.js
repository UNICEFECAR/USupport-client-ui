import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import { Page, SosCenter, ContactUs } from "./blocks/locales.js";
import { ContactUs as ContactUsPage, NotFoundPage, SOSCenterPage } from "./pages/locales.js";

const resources = {
  en: {
    // Blocks
    page: Page.en,
    "sos-center": SosCenter.en,
    "contact-us-block": ContactUs.en,

    // Pages
    "not-found-page": NotFoundPage.en,
    "contact-us-page": ContactUsPage.en,
    "sos-center-page": SOSCenterPage.en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
