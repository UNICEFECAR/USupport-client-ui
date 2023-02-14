import React, { useState, useCallback } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Block,
  Button,
  Emoticon,
  Loading,
  Textarea,
} from "@USupport-components-library/src";
import { useAddMoodTrack, useGetMoodTrackForToday } from "#hooks";

import "./mood-tracker.scss";

/**
 * MoodTracker
 *
 * MoodTracker component used in Dashboard
 *
 * @return {jsx}
 */
export const MoodTracker = ({ classes }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("mood-tracker");

  const [isMoodTrackCompleted, setIsMoodTrackCompleted] = useState(false);
  const [comment, setComment] = useState("");
  const [emoticons, setEmoticons] = useState([
    { value: "happy", label: t("happy"), isSelected: false },
    { value: "good", label: t("good"), isSelected: false },
    { value: "sad", label: t("sad"), isSelected: false },
    { value: "depressed", label: t("depressed"), isSelected: false },
    { value: "worried", label: t("worried"), isSelected: false },
  ]);

  const onGetMoodTrackSuccess = (data) => {
    if (data) {
      handleEmoticonClick(data.mood);
      setComment(data.comment);
      setIsMoodTrackCompleted(true);
    }
  };
  const useGetMoodTrackForTodayQuery = useGetMoodTrackForToday({
    onSuccess: onGetMoodTrackSuccess,
  });

  const hasSelectedMoodtracker = useCallback(() => {
    return emoticons.some((emoticon) => emoticon.isSelected);
  }, [emoticons]);

  const onSuccess = () => {
    setIsMoodTrackCompleted(true);
    toast(t("add_mood_tracker_success"));
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
            !emoticon.isSelected && "not-selected",
          ].join(" ")}
          key={index}
          onClick={() => handleEmoticonClick(emoticon.value)}
        >
          <Emoticon
            name={`emoticon-${emoticon.value}`}
            size={emoticon.isSelected ? "lg" : "sm"}
          />
          <p
            className={["small-text", emoticon.isSelected && "selected"].join(
              " "
            )}
          >
            {emoticon.label}
          </p>
        </div>
      );
    });
  };

  const addMoodTrackMutation = useAddMoodTrack(onSuccess, onError);

  const handleEmoticonClick = (value) => {
    if (isMoodTrackCompleted) return;
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
    });
  };

  const handleMoodtrackClick = () => navigate("/mood-tracker");

  return (
    <Block classes={["mood-tracker", classNames(classes)].join(" ")}>
      <div className="mood-tracker__heading">
        <h4>{t("heading")}</h4>
        <p
          className="small-text mood-tracker-button"
          onClick={handleMoodtrackClick}
        >
          {t("mood_tracker")}
        </p>
      </div>
      {!useGetMoodTrackForTodayQuery.isLoading ? (
        <>
          <div className="mood-tracker__rating">{renderEmoticons()}</div>
          {hasSelectedMoodtracker() && (
            <div className="mood-tracker__additional-comment">
              <Textarea
                value={comment}
                onChange={(value) => setComment(value)}
                placeholder={t("additional_comment_placeholder")}
                size="md"
                disabled={isMoodTrackCompleted}
              />
              {!isMoodTrackCompleted && (
                <div className="mood-tracker__additional-comment__button-container">
                  <Button
                    label={t("submit_mood_track")}
                    size="lg"
                    onClick={handleSubmit}
                    disabled={addMoodTrackMutation.isLoading}
                  />
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <Loading size="md" />
      )}
    </Block>
  );
};
