import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Block,
  Emoticon,
  Grid,
  GridItem,
} from "@USupport-components-library/src";

import "./mood-tracker-history.scss";

/**
 * MoodTrackerHistory
 *
 * MoodTrackerHistory block used in MoodTracker page
 *
 * @return {jsx}
 */
export const MoodTrackerHistory = () => {
  const { t } = useTranslation("mood-tracker-history");

  //TODO - get the Data from the API
  const [emoticons] = useState([
    { name: "happy", label: t("perfect"), isSelected: false, counter: 6 },
    { name: "good", label: t("happy"), isSelected: false, counter: 2 },
    { name: "not-good", label: t("sad"), isSelected: true, counter: 10 },
    { name: "bad", label: t("depressed"), isSelected: false, counter: 1 },
    { name: "very-bad", label: t("worried"), isSelected: false, counter: 0 },
  ]);

  const renderEmoticons = () => {
    return emoticons.map((emoticon, index) => {
      return (
        <div
          key={index}
          className={[
            "mood-tracker__rating__emoticon-container",
            !emoticon.isSelected && "not-selected",
          ].join(" ")}
        >
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

  const renderEmoticonsWithCounter = () => {
    return emoticons.map((emoticon, index) => {
      return (
        <GridItem key={index} xs={2} md={4} lg={6}>
          <div className="emoticon-counter-container">
            <div
              key={index}
              className={"mood-tracker__rating__emoticon-container"}
            >
              <Emoticon name={`emoticon-${emoticon.name}`} />
              <p className="small-text">{emoticon.label}</p>
            </div>
            <p className="text counter-text">
              {emoticon.counter}{" "}
              {emoticon.counter === 1 ? t("time") : t("times")}
            </p>
          </div>
        </GridItem>
      );
    });
  };

  return (
    <Block classes="mood-tracker-history">
      <div className="mood-tracker-history__content-container">
        <p className="mood-tracker-history__heading">
          {t("heading", {
            //Refactor: get the label of the emoticon with the highest counter
            feeling: emoticons.find((emoticon) => emoticon.isSelected)?.label,
          })}
        </p>
        <div className="mood-tracker-history__content-container__emoticons-container">
          {renderEmoticons()}
        </div>
        <p className="text mood-tracker-history__last-thirty-days-text">
          {t("last_thirty_days_text")}
        </p>
        <Grid classes="mood-tracker-history__grid">
          {renderEmoticonsWithCounter()}
        </Grid>
      </div>
    </Block>
  );
};
