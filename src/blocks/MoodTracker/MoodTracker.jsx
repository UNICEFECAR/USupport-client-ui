import React, { useState } from "react";
import classNames from "classnames";
import { useTranslation } from "react-i18next";
import { Block, Emoticon } from "@USupport-components-library/src";

import "./mood-tracker.scss";

/**
 * MoodTracker
 *
 * MoodTracker component used in Dashboard
 *
 * @return {jsx}
 */
export const MoodTracker = ({ classes }) => {
  const { t } = useTranslation("mood-tracker");

  const [emoticons, setEmoticons] = useState([
    { name: "happy", label: t("perfect"), isSelected: false },
    { name: "good", label: t("happy"), isSelected: false },
    { name: "not-good", label: t("sad"), isSelected: false },
    { name: "bad", label: t("depressed"), isSelected: false },
    { name: "very-bad", label: t("worried"), isSelected: false },
  ]);

  const handleEmoticonClick = (index) => {
    const newEmoticons = [...emoticons];
    for (let i = 0; i < newEmoticons.length; i++) {
      if (i === index) {
        newEmoticons[i].isSelected = true;
      } else {
        newEmoticons[i].isSelected = false;
      }
    }
    setEmoticons(newEmoticons);
  };

  const renderEmoticons = () => {
    return emoticons.map((emoticon, index) => {
      return (
        <div key={index} onClick={() => handleEmoticonClick(index)}>
          <Emoticon
            name={`emoticon-${emoticon.name}`}
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

  return (
    <Block classes={["mood-tracker", classNames(classes)].join(" ")}>
      <div className="mood-tracker__heading">
        <h4>{t("heading")}</h4>
        <p className="small-text mood-tracker-button">{t("mood_tracker")}</p>
      </div>
      <div className="mood-tracker__rating">{renderEmoticons()}</div>
    </Block>
  );
};
