import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Loading } from "@USupport-components-library/src";
import { userSvc } from "@USupport-components-library/services";

import { Page, RegisterEmail as RegisterEmailBlock } from "#blocks";
import { CodeVerification } from "#backdrops";
import { useIsLoggedIn, useError } from "#hooks";
import { useMutation } from "@tanstack/react-query";

import "./register-email.scss";

/**
 * RegisterEmail
 *
 * Register with email page
 *
 * @returns {JSX.Element}
 */
export const RegisterEmail = () => {
  const { t } = useTranslation("register-email-page");
  const navigate = useNavigate();
  const isLoggedIn = useIsLoggedIn();

  const [data, setData] = useState({
    email: "",
    nickname: "",
    password: "",
    isPrivacyAndTermsSelected: false,
    confirmPassword: "",
  });
  const SHOW_CAPTCHA = import.meta.env.MODE !== "development";
  const [isCodeVerificationOpen, setIsCodeVerificationOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [canRequestNewOTP, setCanRequestNewOTP] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [submitError, setSubmitError] = useState();
  const [shouldShowCodeVerification, setShouldShowCodeVerification] =
    useState(false);
  const [isCaptchaValid, setIsCaptchaValid] = useState(!SHOW_CAPTCHA);
  const intervalId = useRef();

  useEffect(() => {
    setShouldShowCodeVerification(false);
  }, [data]);

  const requestEmailOtp = useCallback(async () => {
    const countryID = localStorage.getItem("country_id");
    if (!countryID) {
      navigate("/");
      return;
    }
    if (seconds === 60 || !shouldShowCodeVerification) {
      setShouldShowCodeVerification(true);
      return await userSvc.requestEmailOTP(data.email.toLowerCase());
    } else {
      setIsCodeVerificationOpen(true);
    }
  });

  const requestEmailOTPMutation = useMutation(requestEmailOtp, {
    onSuccess: () => {
      setSeconds(60);
      setCanRequestNewOTP(false);
      disableOtpRequestFor60Seconds();
      setIsCodeVerificationOpen(true);
      setSubmitError(null);
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setSubmitError(errorMessage);
    },
  });

  const validateCaptcha = async (value) => {
    return await userSvc.validateCaptcha(value);
  };

  const validateCaptchaMutation = useMutation(validateCaptcha, {
    onSuccess: (response) => {
      if (response.status === 200) {
        setIsCaptchaValid(true);
      }
    },
    onError: () => {
      setIsCaptchaValid(false);
    },
  });

  const handleCaptchaChange = (value) => {
    if (value === "expired") {
      setIsCaptchaValid(false);
    } else if (value) {
      validateCaptchaMutation.mutate(value);
    }
  };

  const disableOtpRequestFor60Seconds = () => {
    setShowTimer(true);
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    const interval = setInterval(() => {
      setSeconds((sec) => {
        if (sec - 1 === 0) {
          clearInterval(interval);
          setShowTimer(false);
          setSeconds(60);
          setCanRequestNewOTP(true);
        }
        return sec - 1;
      });
    }, 1000);
    intervalId.current = interval;
  };

  const handleGoBack = () => {
    navigate("/register-preview");
  };

  if (isLoggedIn === "loading") return <Loading />;
  if (isLoggedIn === true) return <Navigate to="/dashboard" />;

  return (
    <Page
      classes="page__register-email"
      heading={t("heading")}
      handleGoBack={handleGoBack}
    >
      <RegisterEmailBlock
        data={data}
        setData={setData}
        setCodeVerificationOpen={setIsCodeVerificationOpen}
        handleSubmit={requestEmailOTPMutation.mutate}
        isMutating={
          requestEmailOTPMutation.isLoading || validateCaptchaMutation.isLoading
        }
        submitError={submitError}
        handleCaptchaChange={handleCaptchaChange}
        isSubmitEnabled={!!isCaptchaValid}
        showCaptcha={SHOW_CAPTCHA}
      />
      <CodeVerification
        data={data}
        isOpen={isCodeVerificationOpen}
        onClose={() => setIsCodeVerificationOpen(false)}
        requestOTP={requestEmailOTPMutation.mutate}
        canRequestNewEmail={canRequestNewOTP}
        resendTimer={seconds}
        showTimer={showTimer}
      />
    </Page>
  );
};
