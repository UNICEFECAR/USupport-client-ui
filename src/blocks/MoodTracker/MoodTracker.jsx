import React, { useState, useCallback, useContext } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";

import {
  Block,
  NewButton,
  Textarea,
  Toggle,
  Modal,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useAddMoodTrack, useGetHasCompletedMoodTrackerEver } from "#hooks";
import { ThemeContext } from "@USupport-components-library/utils";
import { HowItWorksMoodTrack } from "#modals";

import { RootContext } from "#routes";

import "./mood-tracker.scss";

/**
 * MoodTracker
 *
 * MoodTracker component used in Dashboard
 *
 * @return {jsx}
 */
export const MoodTracker = ({
  classes,
  isTmpUser,
  clientData,
  openRequireDataAgreement,
}) => {
  const { theme } = useContext(ThemeContext);
  const { handleRegistrationModalOpen } = useContext(RootContext);
  const { width } = useWindowDimensions();
  const country = localStorage.getItem("country");
  const IS_RO = country === "RO";

  const navigate = useNavigate();
  const { t } = useTranslation("blocks", { keyPrefix: "mood-tracker" });

  const emoticonsArray = [
    { value: "happy", label: t("happy"), isSelected: false, emoji: "😍" },
    { value: "good", label: t("good"), isSelected: false, emoji: "😀" },
    { value: "sad", label: t("sad"), isSelected: false, emoji: "😔" },
    {
      value: "depressed",
      label: t("depressed"),
      isSelected: false,
      emoji: "☹️",
    },
    { value: "worried", label: t("worried"), isSelected: false, emoji: "😣" },
  ];

  const [comment, setComment] = useState("");
  const [emoticons, setEmoticons] = useState(emoticonsArray);
  const [isEmergency, setIsEmergency] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isHowItWorksMoodTrackOpen, setIsHowItWorksMoodTrackOpen] =
    useState(false);

  const { data: hasCompletedMoodTrackerEver } =
    useGetHasCompletedMoodTrackerEver(IS_RO);

  const hasSelectedMoodtracker = useCallback(() => {
    return emoticons.some((emoticon) => emoticon.isSelected);
  }, [emoticons]);

  const onSuccess = () => {
    setComment("");
    setEmoticons(emoticonsArray);
    setIsEmergency(false);
    toast(t("add_mood_tracker_success"));
    if (IS_RO) {
      setIsSuccessModalOpen(true);
    }
  };
  const onError = (error) => {
    toast(error, { type: "error" });
  };

  const renderEmoticons = () => {
    const anySelected = emoticons.some((e) => e.isSelected);
    return emoticons.map((emoticon, index) => {
      const isActive = !anySelected || emoticon.isSelected;
      return (
        <div
          className={[
            "mood-tracker__rating__emoticon-container",
            !isActive &&
              "mood-tracker__rating__emoticon-container--not-selected",
          ].join(" ")}
          key={index}
          onClick={() => handleEmoticonClick(emoticon.value)}
        >
          <div className="mood-tracker__rating__emoticon-container__content">
            <span
              className={[
                "emoticon",
                `emoticon--${isActive ? "lg" : "sm"}`,
              ].join(" ")}
              style={{
                fontSize: isActive ? "6.4rem" : "4.8rem",
                display: "inline-block",
                lineHeight: "1",
              }}
            >
              {emoticon.emoji}
            </span>
            <p
              className={[
                "small-text",
                emoticon.isSelected &&
                  theme !== "dark" &&
                  "mood-tracker__rating__emoticon-container__text--selected",
              ].join(" ")}
            >
              {t(emoticon.value)}
            </p>
          </div>
        </div>
      );
    });
  };

  const addMoodTrackMutation = useAddMoodTrack(onSuccess, onError);

  const handleEmoticonClick = (value) => {
    if (isTmpUser) {
      handleRegistrationModalOpen();
      return;
    }
    if (!clientData.dataProcessing) {
      openRequireDataAgreement(true);
      return;
    }
    const newEmoticons = [...emoticons];
    for (let i = 0; i < newEmoticons.length; i++) {
      const currentMood = newEmoticons[i];
      if (currentMood.value === value) {
        newEmoticons[i].isSelected = true;
      } else {
        newEmoticons[i].isSelected = false;
      }
    }
    setEmoticons(newEmoticons);
  };

  const handleSubmit = () => {
    const selectedMood = emoticons.find((x) => x.isSelected);
    addMoodTrackMutation.mutate({
      comment,
      mood: selectedMood.value,
      emergency: IS_RO ? isEmergency : false,
    });
  };

  const handleMoodtrackClick = () => {
    if (isTmpUser) {
      handleRegistrationModalOpen();
    } else if (!clientData.dataProcessing) {
      openRequireDataAgreement(true);
    } else {
      navigate("/mood-tracker");
    }
  };

  return (
    <React.Fragment>
      {IS_RO && (
        <HowItWorksMoodTrack
          isOpen={isHowItWorksMoodTrackOpen}
          onClose={() => setIsHowItWorksMoodTrackOpen(false)}
        />
      )}
      <Modal
        isOpen={isSuccessModalOpen}
        closeModal={() => setIsSuccessModalOpen(false)}
        heading={t("recommendations")}
        text={t("recommendations_text")}
        ctaLabel={t("check_out")}
        ctaHandleClick={() => {
          navigate("/mood-tracker");
        }}
      />
      <Block classes={["mood-tracker", classNames(classes)].join(" ")}>
        <div className="mood-tracker__heading">
          <h4>{t("heading")}</h4>
          {!(IS_RO && !hasCompletedMoodTrackerEver) ? (
            width < 768 ? (
              <p
                className="small-text mood-tracker-button"
                onClick={handleMoodtrackClick}
              >
                {t("mood_tracker")}
              </p>
            ) : (
              <h5
                className="mood-tracker-button"
                onClick={handleMoodtrackClick}
              >
                {t("mood_tracker_long")}
              </h5>
            )
          ) : width < 768 ? (
            <p
              className="small-text mood-tracker-button"
              onClick={() => setIsHowItWorksMoodTrackOpen(true)}
            >
              {t("how_it_works")}
            </p>
          ) : (
            <h5
              className="mood-tracker-button"
              onClick={() => setIsHowItWorksMoodTrackOpen(true)}
            >
              {t("how_it_works")}
            </h5>
          )}
        </div>
        <>
          <div className="mood-tracker__rating">{renderEmoticons()}</div>
          {hasSelectedMoodtracker() && (
            <div className="mood-tracker__additional-comment">
              <Textarea
                value={comment}
                onChange={(value) => setComment(value)}
                placeholder={t("additional_comment_placeholder")}
                size="md"
                classes="mood-tracker__additional-comment__textarea"
              />
              {country === "RO" && (
                <div className="mood-tracker__additional-comment__toggle-container">
                  <p className="mood-tracker__additional-comment__toggle-container__text">
                    {t("emergency_label")}
                  </p>
                  <Toggle
                    isToggled={isEmergency}
                    setParentState={(toggled) => setIsEmergency(toggled)}
                  />
                </div>
              )}
              <div className="mood-tracker__additional-comment__button-container">
                <NewButton
                  label={t("submit_mood_track")}
                  size="lg"
                  onClick={handleSubmit}
                  loading={addMoodTrackMutation.isLoading}
                  isFullWidth={true}
                />
              </div>
            </div>
          )}
        </>
      </Block>
    </React.Fragment>
  );
};
