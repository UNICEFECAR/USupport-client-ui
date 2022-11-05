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
  Articles,
  GiveSuggestion,
  SelectProvider,
  PlatformRating,
  SharePlatform,
  ForgotPassword,
  RegisterAnonymous,
  RegisterSupport,
  RegisterPreview,
  RegisterEmail,
} from "#blocks/locales.js";

import {
  NotFoundPage,
  SOSCenterPage,
  Login as LoginPage,
  NotificationPreferences as NotificationPreferencesPage,
  ContactUs as ContactUsPage,
  RegisterAboutYou as RegisterAboutYouPage,
  ArticleInformation as ArticleInformationPage,
  Articles as ArticlesPage,
  InformationPortal as InformationPortalPage,
  SelectProvider as SelectProviderPage,
  PlatformRating as PlatformRatingPage,
  SharePlatform as SharePlatformPage,
  ForgotPassword as ForgotPasswordPage,
  RegisterAnonymous as RegisterAnonymousPage,
  RegisterSupport as RegisterSupportPage,
  RegisterPreview as RegisterPreviewPage,
  PrivacyPolicy as PrivacyPolicyPage,
  RegisterEmail as RegisterEmailPage,
  FAQ as FAQPage,
} from "#pages/locales.js";

import { FilterProviders } from "#backdrops/locales.js";

const resources = {
  en: {
    // Blocks
    page: Page.en,
    "sos-center": SosCenter.en,
    "register-about-you": RegisterAboutYou.en,
    "register-anonymous": RegisterAnonymous.en,
    "register-support": RegisterSupport.en,
    "contact-us-block": ContactUs.en,
    "select-provider": SelectProvider.en,
    "notification-preferences": NotificationPreferences.en,
    "platform-rating": PlatformRating.en,
    "share-platform": SharePlatform.en,
    "forgot-password": ForgotPassword.en,
    login: Login.en,
    welcome: Welcome.en,
    articles: Articles.en,
    "give-suggestion": GiveSuggestion.en,
    "register-preview": RegisterPreview.en,
    "register-email": RegisterEmail.en,

    // Pages
    "not-found-page": NotFoundPage.en,
    "contact-us-page": ContactUsPage.en,
    "sos-center-page": SOSCenterPage.en,
    "select-provider-page": SelectProviderPage.en,
    "register-about-you-page": RegisterAboutYouPage.en,
    "platform-rating-page": PlatformRatingPage.en,
    "share-platform-page": SharePlatformPage.en,
    "register-anonymous-page": RegisterAnonymousPage.en,
    "register-support-page": RegisterSupportPage.en,
    "notification-preferences-page": NotificationPreferencesPage.en,
    "forgot-password-page": ForgotPasswordPage.en,
    "login-page": LoginPage.en,
    "articles-page": ArticlesPage.en,
    "article-information": ArticleInformationPage.en,
    "information-portal": InformationPortalPage.en,

    //Backdrops
    "filter-providers": FilterProviders.en,
    "register-preview-page": RegisterPreviewPage.en,
    "privacy-policy-page": PrivacyPolicyPage.en,
    "register-email-page": RegisterEmailPage.en,
    "faq-page": FAQPage.en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
