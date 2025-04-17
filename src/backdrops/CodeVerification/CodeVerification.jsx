import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

import { useError } from "#hooks";

import {
  Backdrop,
  ButtonWithIcon,
  Button,
  Error,
  PinInput,
} from "@USupport-components-library/src";

import { userSvc } from "@USupport-components-library/services";

import "./code-verification.scss";

/**
 * CodeVerification
 *
 * The CodeVerification backdrop
 *
 * @return {jsx}
 */
export const CodeVerification = ({
  isOpen,
  onClose,
  data,
  requestOTP,
  resendTimer,
  showTimer,
  canRequestNewEmail,
  isMutating,
}) => {
  const { t } = useTranslation("code-verification");
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [isCodeHidden, setIsCodeHidden] = useState(true);
  const [errors, setErrors] = useState({});

  const [code, setCode] = useState("");

  const register = async () => {
    const countryID = localStorage.getItem("country_id");
    if (!countryID) {
      navigate("/");
      return;
    }
    // Send data to server
    return await userSvc.signUp({
      userType: "client",
      countryID,
      password: data.password,
      clientData: {
        email: data.email.toLowerCase(),
        nickname: data.nickname,
        code,
      },
    });
  };

  const registerMutation = useMutation(register, {
    // If the mutation succeeds, get the data returned
    // from the server, and put it in the cache
    onSuccess: (response) => {
      const { user: userData, token: tokenData } = response.data;
      const { token, expiresIn, refreshToken } = tokenData;

      localStorage.setItem("token", token);
      localStorage.setItem("token-expires-in", expiresIn);
      localStorage.setItem("refresh-token", refreshToken);

      queryClient.setQueryData(
        ["client-data"],
        userSvc.transformUserData(userData)
      );

      window.dispatchEvent(new Event("login"));
      navigate("/register/about-you");
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setErrors({ submit: errorMessage });
    },
  });

  const handleCodeChange = (value) => {
    setCode(value);
  };

  const handleSend = (e) => {
    e?.preventDefault();
    registerMutation.mutate();
  };

  return (
    <Backdrop
      classes="code-verification"
      title="CodeVerification"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={t("subheading")}
    >
      <form onSubmit={handleSend}>
        <div className="code-verification__content">
          <PinInput
            length={4}
            secret={isCodeHidden}
            onChange={handleCodeChange}
          />
          <ButtonWithIcon
            classes="code-verification__view-code-button"
            type="ghost"
            color="purple"
            iconName={isCodeHidden ? "view" : "hide"}
            iconColor="#9749FA"
            label={
              isCodeHidden
                ? t("button_with_icon_label_view")
                : t("button_with_icon_label_hide")
            }
            onClick={() => setIsCodeHidden(!isCodeHidden)}
          />
          <Button
            label={t("send_button_label")}
            size="lg"
            classes="code-verification__send-button"
            disabled={code.length === 4 ? false : true}
            onClick={handleSend}
            loading={registerMutation.isLoading}
            isSubmit
          />
          {errors.submit && <Error message={errors.submit} />}
          <div className="code-verification__resend-code-container">
            <p className="small-text">{t("didnt_get_code")}</p>

            <Button
              disabled={!canRequestNewEmail || isMutating}
              label={t("resend_code_button_label")}
              type="link"
              classes="code-verification__resend-code-container__button"
              onClick={requestOTP}
            />
            <p className="small-text">
              {showTimer ? t("seconds", { seconds: resendTimer }) : ""}
            </p>
          </div>
        </div>
      </form>
    </Backdrop>
  );
};
