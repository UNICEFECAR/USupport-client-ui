import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import * as en from "./locales/en.json";
import * as kk from "./locales/kk.json";
import * as pl from "./locales/pl.json";
import * as ru from "./locales/ru.json";
import * as uk from "./locales/uk.json";

const resources = {
  en,
  kk,
  pl,
  ru,
  uk,
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
