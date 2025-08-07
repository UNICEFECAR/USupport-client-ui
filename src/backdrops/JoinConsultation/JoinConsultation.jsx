import React from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useCustomNavigate as useNavigate } from "#hooks";

import { Backdrop, ButtonSelector } from "@USupport-components-library/src";
import {
  messageSvc,
  videoSvc,
  providerSvc,
} from "@USupport-components-library/services";

import "./join-consultation.scss";

/**
 * JoinConsultation
 *
 * The JoinConsultation backdrop
 *
 * @return {jsx}
 */
export const JoinConsultation = ({ isOpen, onClose, consultation }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("backdrops", { keyPrefix: "join-consultation" });

  const handleClick = async (redirectTo) => {
    const sytemMessage = {
      type: "system",
      content: "client_joined",
      time: JSON.stringify(new Date().getTime()),
    };

    const systemMessagePromise = messageSvc.sendMessage({
      message: sytemMessage,
      chatId: consultation.chatId,
    });

    const getConsultationTokenPromise = videoSvc.getTwilioToken(
      consultation.consultationId
    );

    const joinConsultationPromise = providerSvc.joinConsultation({
      consultationId: consultation.consultationId,
      userType: "client",
    });

    try {
      const result = await Promise.all([
        systemMessagePromise,
        getConsultationTokenPromise,
        joinConsultationPromise,
      ]);
      const token = result[1].data.token;

      navigate("/consultation", {
        state: {
          consultation,
          videoOn: redirectTo === "video",
          microphoneOn: redirectTo === "video",
          token,
        },
      });
    } catch (err) {
      console.log(err);
      toast(t("error"), { type: "error" });
    }

    onClose();
  };

  return (
    <Backdrop
      classes="join-consultation"
      title="JoinConsultation"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={t("subheading")}
    >
      <ButtonSelector
        label={t("button_label_1")}
        iconName="video"
        classes="join-consultation__button-selector"
        onClick={() => handleClick("video")}
      />
      <ButtonSelector
        label={t("button_label_2")}
        iconName="comment"
        classes="join-consultation__button-selector"
        onClick={() => handleClick("chat")}
      />
    </Backdrop>
  );
};
