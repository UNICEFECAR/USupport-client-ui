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
 *
 * @returns {jsx}
 */
export const Authentication = ({ isOpen = false }) => {
  const [isRegisterWithEmailModalOpen, setIsRegisterWithEmailModalOpen] =
    useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);
  const [isRegisterAnonymousModalOpen, setIsRegisterAnonymousModalOpen] =
    useState(false);
  const [openWelcome, setOpenWelcome] = useState(null);

  // When isOpen becomes true, reset all states and show Welcome
  useEffect(() => {
    if (isOpen) {
      setIsRegisterWithEmailModalOpen(false);
      setIsLoginModalOpen(false);
      setIsForgotPasswordModalOpen(false);
      setIsRegisterAnonymousModalOpen(false);
      // Trigger the welcome modal to open
      if (openWelcome) {
        openWelcome();
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
        onRegisterEmail={() => setIsRegisterWithEmailModalOpen(true)}
        onRegisterAnonymous={() => setIsRegisterAnonymousModalOpen(true)}
        onLogin={() => setIsLoginModalOpen(true)}
        onOpenRequest={setOpenWelcome}
      />
      <RegisterEmail
        isOpen={isRegisterWithEmailModalOpen}
        handleGoBack={() => {
          setIsRegisterWithEmailModalOpen(false);
          openWelcome?.();
        }}
        handleLogin={() => {
          console.log("handleLogin");
          setIsRegisterWithEmailModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
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
      <ForgotPassword
        isOpen={isForgotPasswordModalOpen}
        handleGoBack={() => {
          setIsForgotPasswordModalOpen(false);
          setIsLoginModalOpen(true);
        }}
      />
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
      />
    </>
  );
};
