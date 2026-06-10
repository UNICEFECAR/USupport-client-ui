import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { useMediaPreview } from "#hooks";

import { Backdrop, Icon, Loading } from "@USupport-components-library/src";

import "./device-test.scss";

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
      <div className="device-test__preview device-test__preview--loading">
        <Loading size="md" />
        <p className="small-text device-test__preview-status">
          {t("configuring_devices")}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="device-test__preview device-test__preview--error">
        <Icon name="stop-camera" size="lg" color="#eb5757" />
        <p className="small-text">{t("permissions_error")}</p>
        <button
          type="button"
          className="device-test__retry-button"
          onClick={onRetry}
        >
          {t("retry_permissions")}
        </button>
      </div>
    );
  }

  return (
    <div className="device-test__preview">
      <div className="device-test__video-container">
        {hasStream && videoEnabled ? (
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="device-test__video"
          />
        ) : (
          <div className="device-test__video-placeholder">
            <Icon name="person" size="lg" color="#ffffff" />
            {!videoEnabled && (
              <p className="small-text device-test__video-placeholder-text">
                {t("camera_off_label")}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="device-test__mic-meter">
        <Icon
          name={audioEnabled ? "microphone" : "stop-mic"}
          size="sm"
          color="#6a4ffb"
        />
        <div className="device-test__mic-meter-track">
          <div
            className="device-test__mic-meter-fill"
            style={{ width: `${audioEnabled ? micLevel : 0}%` }}
          />
        </div>
        <span className="small-text device-test__mic-meter-label">
          {t("mic_level_label")}
        </span>
      </div>

      <div className="device-test__controls">
        <button
          type="button"
          className={[
            "device-test__control-button",
            !videoEnabled && "device-test__control-button--off",
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
            "device-test__control-button",
            !audioEnabled && "device-test__control-button--off",
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
 * DeviceTest
 *
 * Backdrop for testing audio and camera before a consultation
 *
 * @return {jsx}
 */
export const DeviceTest = ({ isOpen, onClose }) => {
  const { t } = useTranslation("backdrops", { keyPrefix: "device-test" });

  const preview = useMediaPreview(isOpen);

  useEffect(() => {
    if (isOpen) {
      preview.startPreview();
    }
  }, [isOpen]);

  const handleClose = () => {
    preview.stopStream();
    onClose();
  };

  return (
    <Backdrop
      classes="device-test"
      title="DeviceTest"
      isOpen={isOpen}
      onClose={handleClose}
      heading={t("heading")}
      text={t("subheading")}
      ctaLabel={t("done")}
      ctaHandleClick={handleClose}
    >
      <MediaPreviewPanel
        t={t}
        preview={preview}
        onRetry={preview.startPreview}
      />
    </Backdrop>
  );
};
