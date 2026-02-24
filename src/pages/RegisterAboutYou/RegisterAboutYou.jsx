import React from "react";
import { useLocation } from "react-router-dom";

import { RegisterAboutYou as RegisterAboutYouBackdrop } from "#backdrops";
import { useCustomNavigate as useNavigateCustom } from "#hooks";

/**
 * RegisterAboutYou
 *
 * RegisterAboutYou page - now renders as a modal backdrop
 *
 * @returns {JSX.Element}
 */
export const RegisterAboutYou = () => {
  const navigate = useNavigateCustom();
  const location = useLocation();
  const isAnonymous = location?.state?.isAnonymous;

  const handleGoBack = () => {
    navigate("/register-support");
  };

  const handleSuccess = () => {
    navigate("/dashboard");
  };

  return (
    <RegisterAboutYouBackdrop
      isOpen={true}
      isAnonymous={isAnonymous}
      handleGoBack={handleGoBack}
      onSuccess={handleSuccess}
    />
  );
};
