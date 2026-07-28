import React, { useState, useEffect } from "react";

import {
  RegisterEmail,
  Welcome,
  Login,
  ForgotPassword,
  RegisterAnonymous,
} from "../";

/**
 * Authentication backdrop grouping all the authentication related backdrops
 *
 * @param {boolean} isOpen - Controls whether authentication modals should be shown
 * @param {"login"|null} initialView - Optional view to open first (e.g. login from /login redirect)
 *
 * @returns {jsx}
 */
export const Authentication = ({
  isOpen = false,
  onRequireRegisterAboutYou,
  initialView = null,
}) => {
  const startWithLogin = initialView === "login";
  const [isRegisterWithEmailModalOpen, setIsRegisterWithEmailModalOpen] =
    useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(startWithLogin);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [isRegisterAnonymousModalOpen, setIsRegisterAnonymousModalOpen] =
    useState(false);
  const [openWelcome, setOpenWelcome] = useState(null);

  // When isOpen becomes true, reset all states and show Welcome (or Login)
  useEffect(() => {
    if (isOpen) {
      setIsRegisterWithEmailModalOpen(false);
      setIsForgotPasswordModalOpen(false);
      setIsRegisterAnonymousModalOpen(false);
      if (initialView === "login") {
        setIsLoginModalOpen(true);
      } else {
        setIsLoginModalOpen(false);
        // Trigger the welcome modal to open
        if (openWelcome) {
          openWelcome();
        }
      }
    }
  }, [isOpen]);

  // Don't render anything if not open
  if (!isOpen) {
    return null;
  }

  return (
    <>
      <Welcome
        defaultOpen={!startWithLogin}
        onRegisterEmail={() => setIsRegisterWithEmailModalOpen(true)}
        onRegisterAnonymous={() => setIsRegisterAnonymousModalOpen(true)}
        onLogin={() => setIsLoginModalOpen(true)}
        onOpenRequest={setOpenWelcome}
      />
      {isRegisterWithEmailModalOpen && (
        <RegisterEmail
          isOpen={isRegisterWithEmailModalOpen}
          handleGoBack={() => {
            setIsRegisterWithEmailModalOpen(false);
            openWelcome?.();
          }}
          handleLogin={() => {
            setIsRegisterWithEmailModalOpen(false);
            setIsLoginModalOpen(true);
          }}
          onRegistrationSuccess={() => {
            setIsRegisterWithEmailModalOpen(false);
            onRequireRegisterAboutYou?.();
          }}
        />
      )}
      {isLoginModalOpen && (
        <Login
          isOpen={isLoginModalOpen}
          handleGoBack={() => {
            setIsLoginModalOpen(false);
            openWelcome?.();
          }}
          handleRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterWithEmailModalOpen(true);
          }}
          handleForgotPassword={() => {
            setIsLoginModalOpen(false);
            setIsForgotPasswordModalOpen(true);
          }}
        />
      )}
      {isForgotPasswordModalOpen && (
        <ForgotPassword
          isOpen={isForgotPasswordModalOpen}
          handleGoBack={() => {
            setIsForgotPasswordModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      )}
      {isRegisterAnonymousModalOpen && (
        <RegisterAnonymous
          isOpen={isRegisterAnonymousModalOpen}
          handleGoBack={() => {
            setIsRegisterAnonymousModalOpen(false);
            openWelcome?.();
          }}
          handleLoginRedirect={() => {
            setIsRegisterAnonymousModalOpen(false);
            setIsLoginModalOpen(true);
          }}
          handleRegisterRedirect={() => {
            setIsRegisterAnonymousModalOpen(false);
            setIsRegisterWithEmailModalOpen(true);
          }}
          handleWelcomeRedirect={() => {
            setIsRegisterAnonymousModalOpen(false);
            openWelcome?.();
          }}
          onRegistrationSuccess={() => {
            setIsRegisterAnonymousModalOpen(false);
            onRequireRegisterAboutYou?.();
          }}
        />
      )}
    </>
  );
};
