import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Emoticon,
  Icon,
  MoodTrackDetails,
  Loading,
  LineChart,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useGetMoodTrackEntries } from "#hooks";

import "./mood-track-history.scss";

/**
 * MoodTrackHistory
 *
 * MoodTrackHistory block
 *
 * @return {jsx}
 */
export const MoodTrackHistory = () => {
  const { t } = useTranslation("mood-track-history");
  const { width } = useWindowDimensions();

  const [pageNum, setPageNum] = useState(0);
  const [loadedPages, setLoadedPages] = useState([]);
  const limitToLoad = width < 768 ? 6 : 13;
  const limit = `pageNum_${pageNum}_limitToLoad_${limitToLoad}`;
  const [moodTrackerData, setMoodTrackerData] = useState({});
  const [selectedItemId, setSelectedItemId] = React.useState(null);

  const onSuccess = (data) => {
    const { curEntries, prevEntries, hasMore } = data;

    let dataCopy = { ...moodTrackerData };

    if (!dataCopy[limit]) {
      dataCopy[limit] = {
        entries: curEntries,
        hasMore: prevEntries.length > 0,
      };
    }
    const prevPageLimit = `pageNum_${pageNum + 1}_limitToLoad_${limitToLoad}`;

    if (prevEntries.length < limitToLoad) {
      prevEntries.push(
        ...curEntries.slice(0, limitToLoad - prevEntries.length)
      );
    }

    dataCopy[prevPageLimit] = { entries: prevEntries, hasMore };
    let loadedPagesCopy = [...loadedPages];
    loadedPagesCopy.push(pageNum);
    setLoadedPages(loadedPagesCopy);

    setMoodTrackerData(dataCopy);
  };

  const enabled = useMemo(() => {
    return !loadedPages.includes(pageNum);
  }, [loadedPages, pageNum]);

  useGetMoodTrackEntries(limitToLoad, pageNum, onSuccess, enabled);

  const emoticons = [
    { name: "happy", label: "Happy", value: 4 },
    { name: "good", label: "Good", value: 3 },
    { name: "sad", label: "Sad", value: 2 },
    { name: "depressed", label: "Depressed", value: 1 },
    { name: "worried", label: "Worried", value: 0 },
  ];

  const renderAllEmoticons = () => {
    return emoticons.map((emoticon, index) => {
      return (
        <div className="mood-track-history__emoticon-container" key={index}>
          <Emoticon
            name={`emoticon-${emoticon.name}`}
            classes="mood-track-history__emoticon"
            size="xs"
          />
          <p className="small-text">
            {width >= 768 ? t(emoticon.label.toLowerCase()) : ""}
          </p>
        </div>
      );
    });
  };

  const renderDates = () => {
    return moodTrackerData[limit]?.entries.map((mood, index) => {
      const dateText = `${
        mood.time.getDate() > 9
          ? mood.time.getDate()
          : `0${mood.time.getDate()}`
      }.${
        mood.time.getMonth() + 1 > 9
          ? mood.time.getMonth() + 1
          : `0${mood.time.getMonth() + 1}`
      }`;
      const hourText = `${mood.time.getHours()}:${
        mood.time.getMinutes() > 9
          ? mood.time.getMinutes()
          : `0${mood.time.getMinutes()}`
      }`;

      return (
        <div className="mood-track-history__date-container" key={index}>
          <p className="small-text">{dateText}</p>
          <p className="small-text">{hourText}</p>
        </div>
      );
    });
  };

  const handlePageChange = (next = false) => {
    setPageNum((prev) => (next ? prev + 1 : prev - 1));
  };

  const handleMoodClick = (index) => {
    setSelectedItemId(moodTrackerData[limit].entries[index].mood_tracker_id);
    console.log(moodTrackerData[limit].entries[index].mood_tracker_id);
  };

  return (
    <Block classes="mood-track-history">
      {!moodTrackerData[limit] ? (
        <Loading />
      ) : (
        <>
          {moodTrackerData[limit].entries.length === 0 && (
            <div>
              <p>{t("no_result")}</p>
            </div>
          )}
          <div className="mood-track-history__content-container">
            <div className="mood-track-history__content-container__emoticons-container">
              <div
                className={[
                  "mood-track-history__icon-container",
                  !moodTrackerData[limit].hasMore && //TODO: make it work
                    "mood-track-history__icon-container__disabled",
                ].join(" ")}
              >
                <Icon
                  name="arrow-chevron-back"
                  size="sm"
                  color="#20809E"
                  classes="mood-track-history__content-container__emoticons-container__icon"
                  onClick={() =>
                    moodTrackerData[limit].hasMore ? handlePageChange(true) : {}
                  }
                />
              </div>
              {renderAllEmoticons()}
            </div>
            <div className="mood-track-history__content-container__chart-container">
              <div className="mood-track-history__content-container__chart-container__wrapper">
                <div className="mood-track-history__content-container__chart-wrapper__dates">
                  {renderDates()}
                </div>
                <div className="mood-track-history__content-container__chart-wrapper">
                  <LineChart
                    data={moodTrackerData[limit]?.entries || []}
                    handleSelectItem={handleMoodClick}
                    selectedItemId={selectedItemId}
                  />
                </div>
              </div>
              <div>
                <div
                  className={[
                    "mood-track-history__content-container__emoticons-container__icon",
                    pageNum === 0 &&
                      "mood-track-history__content-container__emoticons-container__icon__right__disabled",
                  ].join(" ")}
                >
                  <Icon
                    name="arrow-chevron-forward"
                    size="sm"
                    color="#20809E"
                    classes="mood-track-history__content-container__emoticons-container__icon__right"
                    onClick={() => (pageNum === 0 ? {} : handlePageChange())}
                  />
                </div>
              </div>
            </div>
          </div>
          {moodTrackerData[limit]?.entries.find(
            (x) => x.mood_tracker_id === selectedItemId
          ) && (
            <div className="mood-track-history__information-container">
              <MoodTrackDetails
                mood={moodTrackerData[limit]?.entries.find(
                  (x) => x.mood_tracker_id === selectedItemId
                )}
                handleClose={() => setSelectedItemId(null)}
                t={t}
              />
            </div>
          )}
        </>
      )}
    </Block>
  );
};
