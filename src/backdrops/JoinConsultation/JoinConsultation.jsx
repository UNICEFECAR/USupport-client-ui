import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import {
  useCustomNavigate as useNavigate,
  useAddCountryEvent,
  useMediaPreview,
} from "#hooks";

import {
  Backdrop,
  ButtonSelector,
  Icon,
  Loading,
} from "@USupport-components-library/src";
import { messageSvc, providerSvc } from "@USupport-components-library/services";

import "./join-consultation.scss";

const MediaPreviewPanel = ({ t, preview, onRetry }) => {
  const {
    videoRef,
    videoEnabled,
    audioEnabled,
    micLevel,
    isLoading,
    hasStream,
    error,
    toggleVideo,
    toggleAudio,
  } = preview;

  if (isLoading) {
    return (
      <div className="join-consultation__preview join-consultation__preview--loading">
        <Loading size="md" />
        <p className="small-text join-consultation__preview-status">
          {t("configuring_devices")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="join-consultation__preview join-consultation__preview--error">
        <Icon name="stop-camera" size="lg" color="#eb5757" />
        <p className="small-text">{t("permissions_error")}</p>
        <button
          type="button"
          className="join-consultation__retry-button"
          onClick={onRetry}
        >
          {t("retry_permissions")}
        </button>
      </div>
    );
  }

  return (
    <div className="join-consultation__preview">
      <div className="join-consultation__video-container">
        {hasStream && videoEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="join-consultation__video"
          />
        ) : (
          <div className="join-consultation__video-placeholder">
            <Icon name="person" size="lg" color="#ffffff" />
            {!videoEnabled && (
              <p className="small-text join-consultation__video-placeholder-text">
                {t("camera_off_label")}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="join-consultation__mic-meter">
        <Icon
          name={audioEnabled ? "microphone" : "stop-mic"}
          size="sm"
          color="#6a4ffb"
        />
        <div className="join-consultation__mic-meter-track">
          <div
            className="join-consultation__mic-meter-fill"
            style={{ width: `${audioEnabled ? micLevel : 0}%` }}
          />
        </div>
        <span className="small-text join-consultation__mic-meter-label">
          {t("mic_level_label")}
        </span>
      </div>

      <div className="join-consultation__controls">
        <button
          type="button"
          className={[
            "join-consultation__control-button",
            !videoEnabled && "join-consultation__control-button--off",
          ].join(" ")}
          onClick={toggleVideo}
          aria-label={t("toggle_camera")}
        >
          <Icon
            name={videoEnabled ? "video" : "stop-camera"}
            size="md"
            color="#6a4ffb"
          />
        </button>
        <button
          type="button"
          className={[
            "join-consultation__control-button",
            !audioEnabled && "join-consultation__control-button--off",
          ].join(" ")}
          onClick={toggleAudio}
          aria-label={t("toggle_microphone")}
        >
          <Icon
            name={audioEnabled ? "microphone" : "stop-mic"}
            size="md"
            color="#6a4ffb"
          />
        </button>
      </div>
    </div>
  );
};

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

  const addCountryEventMutation = useAddCountryEvent();
  const [step, setStep] = useState("choose");
  const [isJoining, setIsJoining] = useState(false);

  const isPreviewStep = step === "preview";
  const preview = useMediaPreview(isOpen && isPreviewStep);

  useEffect(() => {
    if (isOpen && isPreviewStep) {
      preview.startPreview();
    }
  }, [isOpen, isPreviewStep]);

  const handleClose = () => {
    preview.stopStream();
    setStep("choose");
    setIsJoining(false);
    onClose();
  };

  const handleGoBack = () => {
    preview.stopStream();
    setStep("choose");
  };

  const handleOpenPreview = () => {
    setStep("preview");
  };

  const joinConsultation = async ({ redirectTo, videoOn, microphoneOn }) => {
    const sytemMessage = {
      type: "system",
      content: "client_joined",
      time: JSON.stringify(new Date().getTime()),
    };

    addCountryEventMutation.mutate({
      eventType: "web_join_consultation_click",
    });

    const systemMessagePromise = messageSvc.sendMessage({
      message: sytemMessage,
      chatId: consultation.chatId,
    });

    const joinConsultationPromise = providerSvc.joinConsultation({
      consultationId: consultation.consultationId,
      userType: "client",
    });

    try {
      setIsJoining(true);
      await Promise.all([systemMessagePromise, joinConsultationPromise]);

      preview.stopStream();

      navigate("/consultation", {
        state: {
          consultation,
          videoOn: redirectTo === "video" && videoOn,
          microphoneOn: redirectTo === "video" && microphoneOn,
        },
      });

      handleClose();
    } catch (err) {
      console.log(err);
      toast(t("error"), { type: "error" });
      setIsJoining(false);
    }
  };

  const handleJoinWithVideo = () => {
    joinConsultation({
      redirectTo: "video",
      videoOn: preview.hasStream && preview.videoEnabled,
      microphoneOn: preview.hasStream && preview.audioEnabled,
    });
  };

  const handleJoinWithChat = () => {
    joinConsultation({
      redirectTo: "chat",
      videoOn: false,
      microphoneOn: false,
    });
  };

  return (
    <Backdrop
      classes={[
        "join-consultation",
        isPreviewStep && "join-consultation--preview",
      ]
        .filter(Boolean)
        .join(" ")}
      title={isPreviewStep ? "JoinConsultationPreview" : "JoinConsultation"}
      isOpen={isOpen}
      onClose={handleClose}
      heading={isPreviewStep ? t("preview_heading") : t("heading")}
      text={isPreviewStep ? t("preview_subheading") : t("subheading")}
      hasGoBackArrow={isPreviewStep}
      handleGoBack={handleGoBack}
      ctaLabel={isPreviewStep ? t("join_video") : undefined}
      ctaHandleClick={isPreviewStep ? handleJoinWithVideo : undefined}
      isCtaDisabled={isPreviewStep ? !preview.hasStream || isJoining : undefined}
      isCtaLoading={isPreviewStep ? isJoining : undefined}
    >
      {isPreviewStep ? (
        <MediaPreviewPanel
          t={t}
          preview={preview}
          onRetry={preview.startPreview}
        />
      ) : (
        <>
          <ButtonSelector
            label={t("button_label_1")}
            iconName="video"
            classes="join-consultation__button-selector"
            onClick={handleOpenPreview}
          />
          <ButtonSelector
            label={t("button_label_2")}
            iconName="comment"
            classes="join-consultation__button-selector"
            onClick={handleJoinWithChat}
          />
        </>
      )}
    </Backdrop>
  );
};
