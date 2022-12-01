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
  Articles,
  GiveSuggestion,
  SelectProvider,
  PlatformRating,
  SharePlatform,
  ForgotPassword,
  RegisterAnonymous,
  RegisterSupport,
  Consultations,
  ProviderOverview,
  RegisterPreview,
  RegisterEmail,
  PrivacyPolicy,
  FAQ,
  UserDetails,
  ResetPassword,
  CookiePolicy,
  TermsOfUse,
  ActivityHistory,
  ConsultationsDashboard,
  MoodTracker,
  MascotWelcomeHeader,
  ActivityLogDashboard,
  ArticlesDashboard,
  MoodTrackerHistory,
} from "#blocks/locales.js";

import {
  NotFoundPage,
  SOSCenterPage,
  Login as LoginPage,
  NotificationPreferences as NotificationPreferencesPage,
  ContactUs as ContactUsPage,
  RegisterAboutYou as RegisterAboutYouPage,
  UserProfile as UserProfilePage,
  ArticleInformation as ArticleInformationPage,
  Articles as ArticlesPage,
  InformationPortal as InformationPortalPage,
  SelectProvider as SelectProviderPage,
  PlatformRating as PlatformRatingPage,
  SharePlatform as SharePlatformPage,
  ForgotPassword as ForgotPasswordPage,
  RegisterAnonymous as RegisterAnonymousPage,
  RegisterSupport as RegisterSupportPage,
  Consultations as ConsultationsPage,
  ProviderOverview as ProviderOverviewPage,
  RegisterPreview as RegisterPreviewPage,
  PrivacyPolicy as PrivacyPolicyPage,
  RegisterEmail as RegisterEmailPage,
  FAQ as FAQPage,
  UserDetails as UserDetailsPage,
  ResetPassword as ResetPasswordPage,
  ActivityHistory as ActivityHistoryPage,
  CookiePolicy as CookiePolicyPage,
  TermsOfUse as TermsOfUsePage,
  MoodTracker as MoodTrackerPage,
  Dashboard as DashboardPage,
} from "#pages/locales.js";

import {
  FilterProviders,
  EditConsultation,
  CancelConsultation,
  ConfirmConsultation,
  SafetyFeedback,
  SelectConsultation,
  ChangePassword as ChangePasswordBackdrop,
  DeleteAccount,
  UploadPicture,
  DeleteProfilePicture,
} from "#backdrops/locales.js";

import { RequireRegistration } from "#modals/locales.js";

const resources = {
  en: {
    // Blocks
    page: Page.en,
    "provider-overview": ProviderOverview.en,
    "user-profile": UserProfile.en,
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
    consultations: Consultations.en,
    login: Login.en,
    welcome: Welcome.en,
    articles: Articles.en,
    "give-suggestion": GiveSuggestion.en,
    "register-preview": RegisterPreview.en,
    "register-email": RegisterEmail.en,
    "privacy-policy": PrivacyPolicy.en,
    faq: FAQ.en,
    "user-details": UserDetails.en,
    "reset-password": ResetPassword.en,
    "cookie-policy": CookiePolicy.en,
    "terms-of-use": TermsOfUse.en,
    "activity-history": ActivityHistory.en,
    "consultations-dashboard": ConsultationsDashboard.en,
    "mood-tracker": MoodTracker.en,
    "mascot-welcome-header": MascotWelcomeHeader.en,
    "activity-log-dashboard": ActivityLogDashboard.en,
    "articles-dashboard": ArticlesDashboard.en,
    "mood-tracker-history": MoodTrackerHistory.en,

    // Pages
    "provider-overview-page": ProviderOverviewPage.en,
    "user-profile-page": UserProfilePage.en,
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
    "consultations-page": ConsultationsPage.en,
    "login-page": LoginPage.en,
    "articles-page": ArticlesPage.en,
    "article-information": ArticleInformationPage.en,
    "information-portal": InformationPortalPage.en,
    "register-preview-page": RegisterPreviewPage.en,
    "register-email-page": RegisterEmailPage.en,
    "privacy-policy-page": PrivacyPolicyPage.en,
    "faq-page": FAQPage.en,
    "user-details-page": UserDetailsPage.en,
    "reset-password-page": ResetPasswordPage.en,
    "activity-history-page": ActivityHistoryPage.en,
    "cookie-policy-page": CookiePolicyPage.en,
    "terms-of-use-page": TermsOfUsePage.en,
    "mood-tracker-page": MoodTrackerPage.en,
    "dashboard-page": DashboardPage.en,

    //Backdrops
    "filter-providers": FilterProviders.en,
    "register-preview-page": RegisterPreviewPage.en,
    "privacy-policy": PrivacyPolicyPage.en,
    "confirm-consultation": ConfirmConsultation.en,
    "cancel-consultation": CancelConsultation.en,
    "edit-consultation": EditConsultation.en,
    "safety-feedback": SafetyFeedback.en,
    "select-consultation": SelectConsultation.en,
    "change-password-backdrop": ChangePasswordBackdrop.en,
    "delete-account": DeleteAccount.en,
    "upload-picture": UploadPicture.en,
    "delete-profile-picture": DeleteProfilePicture.en,

    //Modals
    "require-registration": RequireRegistration.en,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
