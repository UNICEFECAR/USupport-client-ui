import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Emoticon,
  Grid,
  GridItem,
  Icon,
  Loading,
} from "@USupport-components-library/src";

import {
  getStartAndEndOfWeek,
  getDatesInRange,
  isDateToday,
  getDateView,
  useWindowDimensions,
  getTimestampFromUTC,
} from "@USupport-components-library/utils";

import { useGetMoodTrackForWeek } from "#hooks";
import { MoodTrackMoreInformation } from "#modals";

import "./mood-track-history.scss";

const namesOfDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

/**
 * MoodTrackHistory
 *
 * Mood track history block
 *
 * @return {jsx}
 */
export const MoodTrackHistory = () => {
  const { t } = useTranslation("mood-track-history");
  const { width } = useWindowDimensions();

  const today = new Date();

  const emoticons = [
    {
      value: "happy",
      label: t("happy"),
      numericalValue: 4,
      isSelected: false,
    },
    { value: "good", label: t("good"), numericalValue: 3, isSelected: false },
    {
      value: "sad",
      label: t("sad"),
      numericalValue: 2,
      isSelected: false,
    },
    {
      value: "depressed",
      label: t("depressed"),
      numericalValue: 1,
      isSelected: false,
    },
    {
      value: "worried",
      label: t("worried"),
      numericalValue: 0,
      isSelected: false,
    },
  ];

  const { first: startDate, last: endDate } = getStartAndEndOfWeek(today);
  const [weekStartDate, setWeekStartDate] = useState(startDate);
  const [weekEndDate, setWeekEndDate] = useState(endDate);

  const [overallMood, setOverallMood] = useState();

  const [selectedMoodTrack, setSelectedMoodTrack] = useState();
  const [isMoreInformationModalOpen, setIsMoreInformationModalOpen] =
    useState(false);

  const moodTrackForWeekQuery = useGetMoodTrackForWeek(
    getTimestampFromUTC(weekStartDate)
  );
  const days = getDatesInRange(new Date(startDate), new Date(endDate));
  const [weekDays, setWeekDays] = useState(days);

  useEffect(() => {
    if (moodTrackForWeekQuery.data && weekDays) {
      const moodTracks = moodTrackForWeekQuery.data;
      const weekDaysStrings = weekDays.map((x) => x.toDateString());
      const weekMoods = moodTracks.filter((moodTrack) => {
        return weekDaysStrings.includes(moodTrack.time.toDateString());
      });
      const feelingOccurances = {};

      weekMoods.forEach((mood) => {
        if (!feelingOccurances[mood.mood]) {
          feelingOccurances[mood.mood] = 1;
        } else {
          feelingOccurances[mood.mood] += 1;
        }
      });

      const highestValue = Math.max(...Object.values(feelingOccurances));
      const highestValueOccurance = Object.values(feelingOccurances).filter(
        (x) => x === highestValue
      ).length;

      if (highestValueOccurance === 1) {
        const mostFrequentFeeling = Object.keys(feelingOccurances).find(
          (key) => feelingOccurances[key] === highestValue
        );
        const mostFrequentFeelingEmoticon = emoticons.find(
          (x) => x.value === mostFrequentFeeling
        );
        setOverallMood(mostFrequentFeelingEmoticon);
        return;
      } else {
        setOverallMood(null);
      }
    }
  }, [moodTrackForWeekQuery.data, weekDays]);

  const handleWeekChange = (direction) => {
    if (direction === "next") {
      const nextWeek = getStartAndEndOfWeek(
        new Date(weekEndDate.getTime() + 24 * 60 * 60 * 1000)
      );
      setWeekStartDate(nextWeek.first);
      setWeekEndDate(nextWeek.last);
      setWeekDays(getDatesInRange(nextWeek.first, nextWeek.last));
    } else {
      const prevWeek = getStartAndEndOfWeek(
        new Date(weekStartDate.getTime() - 24 * 60 * 60 * 1000)
      );
      setWeekStartDate(prevWeek.first);
      setWeekEndDate(prevWeek.last);
      setWeekDays(getDatesInRange(prevWeek.first, prevWeek.last));
    }
  };

  const handleMoodTrackClick = (day, emoticon) => {
    const moodTrack = moodTrackForWeekQuery.data?.find(
      (x) =>
        x.time.toDateString() === day.toDateString() &&
        x.mood === emoticon.value
    );
    // console.log(moodTrack);
    setSelectedMoodTrack(moodTrack);
    setIsMoreInformationModalOpen(true);
  };

  const checkDayMood = (day) => {
    const dayMood = moodTrackForWeekQuery.data?.find(
      (mood) => mood.time.toDateString() === day.toDateString()
    );

    if (dayMood) {
      return dayMood;
    }
    return null;
  };
  return (
    <>
      <Block classes="mood-track-history__heading-block">
        <Heading
          handleWeekChange={handleWeekChange}
          startDate={weekStartDate}
          endDate={weekEndDate}
          width={width}
          t={t}
        />
        {overallMood && (
          <OverallMood overallMood={overallMood} emoticons={emoticons} t={t} />
        )}
      </Block>
      <Block classes="scheduler">
        {moodTrackForWeekQuery.isLoading ? (
          <Loading />
        ) : (
          <>
            <Grid classes="mood-track-history__days-grid">
              {emoticons.map((emoticon) => {
                return (
                  <React.Fragment key={"week" + emoticon.value}>
                    <GridItem
                      xs={1}
                      classes="mood-track-history__days-grid__emoticon"
                    >
                      {emoticon.value === "happy" && (
                        <div className="mood-track-history__days-grid__emoticon__empty-space" />
                      )}
                      <Emoticon
                        name={`emoticon-${emoticon.value}`}
                        size={emoticon.isSelected ? "lg" : "sm"}
                      />
                      {width >= 768 && (
                        <p
                          className={[
                            "small-text",
                            emoticon.isSelected && "selected",
                          ].join(" ")}
                        >
                          {emoticon.label}
                        </p>
                      )}
                    </GridItem>
                    {weekDays.map((day, weekDayIndex) => {
                      const isToday = isDateToday(day);
                      const date = getDateView(day);
                      const displayDate =
                        width < 1366 ? date.slice(0, -3) : date;

                      const moodForDay = checkDayMood(day);
                      const hasDoneMoodForDay =
                        moodForDay && moodForDay.mood === emoticon.value;

                      return (
                        <React.Fragment key={weekDayIndex}>
                          <GridItem key={"single-day" + day} xs={1}>
                            {emoticon.value === "happy" ? (
                              <div
                                className={[
                                  "mood-track-history__day-of-week",
                                  isToday
                                    ? "mood-track-history__day-of-week--today"
                                    : "",
                                ].join(" ")}
                              >
                                <p className="mood-track-history__day-of-week__day">
                                  {t(namesOfDays[day.getDay()])}
                                </p>
                                <p>{displayDate}</p>
                              </div>
                            ) : (
                              ""
                            )}
                            <div
                              onClick={() => {
                                if (hasDoneMoodForDay) {
                                  handleMoodTrackClick(day, emoticon);
                                }
                              }}
                              className={`mood-track-history__single-day ${
                                hasDoneMoodForDay
                                  ? "mood-track-history__single-day--available"
                                  : ""
                              }`}
                            >
                              {hasDoneMoodForDay &&
                                (width < 768 ? (
                                  <Icon name="info" color="#20809e" size="md" />
                                ) : (
                                  <p className="small-text">{t("view_more")}</p>
                                ))}
                            </div>
                          </GridItem>
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </Grid>
          </>
        )}
      </Block>
      {isMoreInformationModalOpen && selectedMoodTrack && (
        <MoodTrackMoreInformation
          isOpen={isMoreInformationModalOpen}
          onClose={() => {
            setIsMoreInformationModalOpen(false);
            setSelectedMoodTrack(null);
          }}
          moodTrack={selectedMoodTrack}
          emoticons={emoticons}
        />
      )}
    </>
  );
};

const Heading = ({ handleWeekChange, startDate, endDate, width, t }) => {
  return (
    <Grid classes="mood-track-history__heading-grid">
      <GridItem md={8} lg={12}>
        <ChangeWeek
          startDate={startDate}
          endDate={endDate}
          handleWeekChange={handleWeekChange}
          width={width}
        />
      </GridItem>
    </Grid>
  );
};

const ChangeWeek = ({ startDate, endDate, handleWeekChange, width }) => {
  return (
    <div className="mood-track-history__change-week">
      <Icon
        color="#9749FA"
        name="arrow-chevron-back"
        size={width < 768 ? "lg" : "md"}
        onClick={() => handleWeekChange("previous")}
      />
      <div className="mood-track-history__change-week__date">
        <p className="text">
          {getDateView(startDate)} - {getDateView(endDate)}
        </p>
      </div>
      <Icon
        color="#9749FA"
        name="arrow-chevron-forward"
        size={width < 768 ? "lg" : "md"}
        onClick={() => handleWeekChange("next")}
      />
    </div>
  );
};

const OverallMood = ({ overallMood, emoticons, t }) => {
  return (
    <div className="mood-track-history__overall-mood">
      <p className="paragraph mood-track-history__overall-mood__label">
        {t("overall_mood")}
      </p>

      <div className="mood-track-history__overall-mood__emoticons-container">
        {emoticons.map((emoticon) => {
          return (
            <div
              key={"overall" + emoticon.value}
              className={`
              mood-track-history__overall-mood__emoticons-container__single-emoticon
              ${
                emoticon.value !== overallMood?.value
                  ? "mood-track-history__overall-mood__emoticons-container__single-emoticon--unavailable"
                  : "mood-track-history__overall-mood__emoticons-container__single-emoticon--available"
              }`}
            >
              <Emoticon
                name={`emoticon-${emoticon.value}`}
                size={emoticon.value === overallMood?.value ? "lg" : "sm"}
              />
              <p className="text">{t(emoticon.label)}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
