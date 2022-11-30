import React, { useState } from "react";
import classNames from "classnames";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Block, Emoticon } from "@USupport-components-library/src";
import { useAddMoodTrack } from "#hooks";

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

  const [emoticons, setEmoticons] = useState([
    { value: "happy", label: t("perfect"), isSelected: false },
    { value: "good", label: t("happy"), isSelected: false },
    { value: "not-good", label: t("sad"), isSelected: false },
    { value: "bad", label: t("depressed"), isSelected: false },
    { value: "very-bad", label: t("worried"), isSelected: false },
  ]);

  const onMutate = (data) => {
    const oldData = JSON.parse(JSON.stringify(emoticons));

    const newEmoticons = [...emoticons];
    for (let i = 0; i < newEmoticons.length; i++) {
      const currentMood = newEmoticons[i];
      if (currentMood.value === data.mood) {
        newEmoticons[i].isSelected = true;
      } else {
        newEmoticons[i].isSelected = false;
      }
    }
    setEmoticons(newEmoticons);

    return () => {
      setEmoticons(oldData);
    };
  };
  const onSuccess = () => {};
  const onError = (error, variables, rollback) => {
    rollback();
    toast(error, { type: "error" });
  };
  const addMoodTrackMutation = useAddMoodTrack(onSuccess, onError, onMutate);

  const handleEmoticonClick = (value) => {
    addMoodTrackMutation.mutate({ mood: value, date: new Date().getTime() });
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
      <div className="mood-tracker__rating">{renderEmoticons()}</div>
    </Block>
  );
};
