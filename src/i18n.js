import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import * as hy from './locales/hy.json';
import * as en from './locales/en.json';
import * as kk from './locales/kk.json';
import * as pl from './locales/pl.json';
import * as ro from './locales/ro.json';
import * as ru from './locales/ru.json';
import * as uk from './locales/uk.json';

const resources = {
  hy,
  en,
  kk,
  pl,
  ro,
  ru,
  uk,
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  lng: 'en',
});

export default i18n;
