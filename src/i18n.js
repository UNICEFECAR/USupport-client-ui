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
  Notifications,
  SafetyFeedback as SafetyFeedbackBlock,
  CheckoutForm as CheckoutFormBlock,
  PaymentHistory as PaymentHistoryBlock,
  PaymentStatus as PaymentStatusBlock,
  MoodTrackHistory,
  MascotHeaderMyQA,
  MyQA,
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
  Consultation as ConsultationPage,
  PaymentHistory as PaymentHistoryPage,
  Checkout as CheckoutPage,
  PaymentStatus as PaymentStatusPage,
  MoodTrackHistory as MoodTrackHistoryPage,
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
  DeleteProfilePicture,
  JoinConsultation,
  SelectAvatar,
  FilterQuestions,
} from "#backdrops/locales.js";

import {
  RequireRegistration,
  RequireDataAgreement,
  SaveAccessCodeConfirmation,
  PaymentInformation,
  MoodTrackMoreInformation,
  CreateQuestion,
  HowItWorksMyQA,
  QuestionDetails,
} from "#modals/locales.js";

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
    notifications: Notifications.en,
    "safety-feedback-block": SafetyFeedbackBlock.en,
    "checkout-form": CheckoutFormBlock.en,
    "payment-history-block": PaymentHistoryBlock.en,
    "payment-status-block": PaymentStatusBlock.en,
    "mood-track-history": MoodTrackHistory.en,
    "mascot-header-MyQA": MascotHeaderMyQA.en,
    "my-qa": MyQA.en,

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
    "consultation-page": ConsultationPage.en,
    "payment-history-page": PaymentHistoryPage.en,
    "checkout-page": CheckoutPage.en,
    "payment-status-page": PaymentStatusPage.en,
    "mood-track-history-page": MoodTrackHistoryPage.en,

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
    "delete-profile-picture": DeleteProfilePicture.en,
    "join-consultation": JoinConsultation.en,
    "select-avatar": SelectAvatar.en,
    "filter-questions": FilterQuestions.en,

    //Modals
    "require-registration": RequireRegistration.en,
    "require-data-agreement": RequireDataAgreement.en,
    "save-access-code-confirmation": SaveAccessCodeConfirmation.en,
    "payment-information": PaymentInformation.en,
    "mood-track-more-information": MoodTrackMoreInformation.en,
    "create-question": CreateQuestion.en,
    "how-it-works-my-qa": HowItWorksMyQA.en,
    "question-details": QuestionDetails.en,
  },
  ru: {
    // Blocks
    page: Page.ru,
    "provider-overview": ProviderOverview.ru,
    "user-profile": UserProfile.ru,
    "sos-center": SosCenter.ru,
    "register-about-you": RegisterAboutYou.ru,
    "register-anonymous": RegisterAnonymous.ru,
    "register-support": RegisterSupport.ru,
    "contact-us-block": ContactUs.ru,
    "select-provider": SelectProvider.ru,
    "notification-preferences": NotificationPreferences.ru,
    "platform-rating": PlatformRating.ru,
    "share-platform": SharePlatform.ru,
    "forgot-password": ForgotPassword.ru,
    consultations: Consultations.ru,
    login: Login.ru,
    welcome: Welcome.ru,
    articles: Articles.ru,
    "give-suggestion": GiveSuggestion.ru,
    "register-preview": RegisterPreview.ru,
    "register-email": RegisterEmail.ru,
    "privacy-policy": PrivacyPolicy.ru,
    faq: FAQ.ru,
    "user-details": UserDetails.ru,
    "reset-password": ResetPassword.ru,
    "cookie-policy": CookiePolicy.ru,
    "terms-of-use": TermsOfUse.ru,
    "activity-history": ActivityHistory.ru,
    "consultations-dashboard": ConsultationsDashboard.ru,
    "mood-tracker": MoodTracker.ru,
    "mascot-welcome-header": MascotWelcomeHeader.ru,
    "activity-log-dashboard": ActivityLogDashboard.ru,
    "articles-dashboard": ArticlesDashboard.ru,
    "mood-tracker-history": MoodTrackerHistory.ru,
    notifications: Notifications.ru,
    "safety-feedback-block": SafetyFeedbackBlock.ru,
    "checkout-form": CheckoutFormBlock.ru,
    "payment-history-block": PaymentHistoryBlock.ru,
    "payment-status-block": PaymentStatusBlock.ru,
    "mood-track-history": MoodTrackHistory.ru,
    "mascot-header-MyQA": MascotHeaderMyQA.ru,
    "my-qa": MyQA.ru,

    // Pages
    "provider-overview-page": ProviderOverviewPage.ru,
    "user-profile-page": UserProfilePage.ru,
    "not-found-page": NotFoundPage.ru,
    "contact-us-page": ContactUsPage.ru,
    "sos-center-page": SOSCenterPage.ru,
    "select-provider-page": SelectProviderPage.ru,
    "register-about-you-page": RegisterAboutYouPage.ru,
    "platform-rating-page": PlatformRatingPage.ru,
    "share-platform-page": SharePlatformPage.ru,
    "register-anonymous-page": RegisterAnonymousPage.ru,
    "register-support-page": RegisterSupportPage.ru,
    "notification-preferences-page": NotificationPreferencesPage.ru,
    "forgot-password-page": ForgotPasswordPage.ru,
    "consultations-page": ConsultationsPage.ru,
    "login-page": LoginPage.ru,
    "articles-page": ArticlesPage.ru,
    "article-information": ArticleInformationPage.ru,
    "information-portal": InformationPortalPage.ru,
    "register-preview-page": RegisterPreviewPage.ru,
    "register-email-page": RegisterEmailPage.ru,
    "privacy-policy-page": PrivacyPolicyPage.ru,
    "faq-page": FAQPage.ru,
    "user-details-page": UserDetailsPage.ru,
    "reset-password-page": ResetPasswordPage.ru,
    "activity-history-page": ActivityHistoryPage.ru,
    "cookie-policy-page": CookiePolicyPage.ru,
    "terms-of-use-page": TermsOfUsePage.ru,
    "mood-tracker-page": MoodTrackerPage.ru,
    "dashboard-page": DashboardPage.ru,
    "consultation-page": ConsultationPage.ru,
    "payment-history-page": PaymentHistoryPage.ru,
    "checkout-page": CheckoutPage.ru,
    "payment-status-page": PaymentStatusPage.ru,
    "mood-track-history-page": MoodTrackHistoryPage.ru,

    //Backdrops
    "filter-providers": FilterProviders.ru,
    "register-preview-page": RegisterPreviewPage.ru,
    "privacy-policy": PrivacyPolicyPage.ru,
    "confirm-consultation": ConfirmConsultation.ru,
    "cancel-consultation": CancelConsultation.ru,
    "edit-consultation": EditConsultation.ru,
    "safety-feedback": SafetyFeedback.ru,
    "select-consultation": SelectConsultation.ru,
    "change-password-backdrop": ChangePasswordBackdrop.ru,
    "delete-account": DeleteAccount.ru,
    "delete-profile-picture": DeleteProfilePicture.ru,
    "join-consultation": JoinConsultation.ru,
    "select-avatar": SelectAvatar.ru,
    "filter-questions": FilterQuestions.ru,

    //Modals
    "require-registration": RequireRegistration.ru,
    "require-data-agreement": RequireDataAgreement.ru,
    "save-access-code-confirmation": SaveAccessCodeConfirmation.ru,
    "payment-information": PaymentInformation.ru,
    "mood-track-more-information": MoodTrackMoreInformation.ru,
    "create-question": CreateQuestion.ru,
    "how-it-works-my-qa": HowItWorksMyQA.ru,
    "question-details": QuestionDetails.ru,
  },
  kk: {
    // Blocks
    page: Page.kk,
    "provider-overview": ProviderOverview.kk,
    "user-profile": UserProfile.kk,
    "sos-center": SosCenter.kk,
    "register-about-you": RegisterAboutYou.kk,
    "register-anonymous": RegisterAnonymous.kk,
    "register-support": RegisterSupport.kk,
    "contact-us-block": ContactUs.kk,
    "select-provider": SelectProvider.kk,
    "notification-preferences": NotificationPreferences.kk,
    "platform-rating": PlatformRating.kk,
    "share-platform": SharePlatform.kk,
    "forgot-password": ForgotPassword.kk,
    consultations: Consultations.kk,
    login: Login.kk,
    welcome: Welcome.kk,
    articles: Articles.kk,
    "give-suggestion": GiveSuggestion.kk,
    "register-preview": RegisterPreview.kk,
    "register-email": RegisterEmail.kk,
    "privacy-policy": PrivacyPolicy.kk,
    faq: FAQ.kk,
    "user-details": UserDetails.kk,
    "reset-password": ResetPassword.kk,
    "cookie-policy": CookiePolicy.kk,
    "terms-of-use": TermsOfUse.kk,
    "activity-history": ActivityHistory.kk,
    "consultations-dashboard": ConsultationsDashboard.kk,
    "mood-tracker": MoodTracker.kk,
    "mascot-welcome-header": MascotWelcomeHeader.kk,
    "activity-log-dashboard": ActivityLogDashboard.kk,
    "articles-dashboard": ArticlesDashboard.kk,
    "mood-tracker-history": MoodTrackerHistory.kk,
    notifications: Notifications.kk,
    "safety-feedback-block": SafetyFeedbackBlock.kk,
    "checkout-form": CheckoutFormBlock.kk,
    "payment-history-block": PaymentHistoryBlock.kk,
    "payment-status-block": PaymentStatusBlock.kk,
    "mood-track-history": MoodTrackHistory.kk,
    "mascot-header-MyQA": MascotHeaderMyQA.kk,
    "my-qa": MyQA.kk,

    // Pages
    "provider-overview-page": ProviderOverviewPage.kk,
    "user-profile-page": UserProfilePage.kk,
    "not-found-page": NotFoundPage.kk,
    "contact-us-page": ContactUsPage.kk,
    "sos-center-page": SOSCenterPage.kk,
    "select-provider-page": SelectProviderPage.kk,
    "register-about-you-page": RegisterAboutYouPage.kk,
    "platform-rating-page": PlatformRatingPage.kk,
    "share-platform-page": SharePlatformPage.kk,
    "register-anonymous-page": RegisterAnonymousPage.kk,
    "register-support-page": RegisterSupportPage.kk,
    "notification-preferences-page": NotificationPreferencesPage.kk,
    "forgot-password-page": ForgotPasswordPage.kk,
    "consultations-page": ConsultationsPage.kk,
    "login-page": LoginPage.kk,
    "articles-page": ArticlesPage.kk,
    "article-information": ArticleInformationPage.kk,
    "information-portal": InformationPortalPage.kk,
    "register-preview-page": RegisterPreviewPage.kk,
    "register-email-page": RegisterEmailPage.kk,
    "privacy-policy-page": PrivacyPolicyPage.kk,
    "faq-page": FAQPage.kk,
    "user-details-page": UserDetailsPage.kk,
    "reset-password-page": ResetPasswordPage.kk,
    "activity-history-page": ActivityHistoryPage.kk,
    "cookie-policy-page": CookiePolicyPage.kk,
    "terms-of-use-page": TermsOfUsePage.kk,
    "mood-tracker-page": MoodTrackerPage.kk,
    "dashboard-page": DashboardPage.kk,
    "consultation-page": ConsultationPage.kk,
    "payment-history-page": PaymentHistoryPage.kk,
    "checkout-page": CheckoutPage.kk,
    "payment-status-page": PaymentStatusPage.kk,
    "mood-track-history-page": MoodTrackHistoryPage.kk,

    //Backdrops
    "filter-providers": FilterProviders.kk,
    "register-preview-page": RegisterPreviewPage.kk,
    "privacy-policy": PrivacyPolicyPage.kk,
    "confirm-consultation": ConfirmConsultation.kk,
    "cancel-consultation": CancelConsultation.kk,
    "edit-consultation": EditConsultation.kk,
    "safety-feedback": SafetyFeedback.kk,
    "select-consultation": SelectConsultation.kk,
    "change-password-backdrop": ChangePasswordBackdrop.kk,
    "delete-account": DeleteAccount.kk,
    "delete-profile-picture": DeleteProfilePicture.kk,
    "join-consultation": JoinConsultation.kk,
    "select-avatar": SelectAvatar.kk,
    "filter-questions": FilterQuestions.kk,

    //Modals
    "require-registration": RequireRegistration.kk,
    "require-data-agreement": RequireDataAgreement.kk,
    "save-access-code-confirmation": SaveAccessCodeConfirmation.kk,
    "payment-information": PaymentInformation.kk,
    "mood-track-more-information": MoodTrackMoreInformation.kk,
    "create-question": CreateQuestion.kk,
    "how-it-works-my-qa": HowItWorksMyQA.kk,
    "question-details": QuestionDetails.kk,
  },
};

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: "en",
  lng: "en",
});

export default i18n;
