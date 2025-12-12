import React, { useState, useCallback, useContext } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";

import {
  Block,
  Button,
  Emoticon,
  Textarea,
  Toggle,
  Modal,
} from "@USupport-components-library/src";
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
  const country = localStorage.getItem("country");
  const IS_RO = country === "RO";

  const navigate = useNavigate();
  const { t } = useTranslation("blocks", { keyPrefix: "mood-tracker" });

  const emoticonsArray = [
    { value: "happy", label: t("happy"), isSelected: false },
    { value: "good", label: t("good"), isSelected: false },
    { value: "sad", label: t("sad"), isSelected: false },
    { value: "depressed", label: t("depressed"), isSelected: false },
    { value: "worried", label: t("worried"), isSelected: false },
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
    return emoticons.map((emoticon, index) => {
      return (
        <div
          className={[
            "mood-tracker__rating__emoticon-container",
            !emoticon.isSelected &&
              "mood-tracker__rating__emoticon-container--not-selected",
          ].join(" ")}
          key={index}
          onClick={() => handleEmoticonClick(emoticon.value)}
        >
          <Emoticon
            name={`emoticon-${emoticon.value}`}
            size={emoticon.isSelected ? "lg" : "sm"}
          />
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
            <p
              className="small-text mood-tracker-button"
              onClick={handleMoodtrackClick}
            >
              {t("mood_tracker")}
            </p>
          ) : (
            <p
              className="small-text mood-tracker-button"
              onClick={() => setIsHowItWorksMoodTrackOpen(true)}
            >
              {t("how_it_works")}
            </p>
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
                <Button
                  label={t("submit_mood_track")}
                  size="lg"
                  onClick={handleSubmit}
                  loading={addMoodTrackMutation.isLoading}
                />
              </div>
            </div>
          )}
        </>
      </Block>
    </React.Fragment>
  );
};
