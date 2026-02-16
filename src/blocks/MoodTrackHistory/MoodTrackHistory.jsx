import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

import {
  Block,
  Icon,
  MoodTrackDetails,
  Loading,
  LineChart,
  CardMedia,
  Modal,
  Grid,
  GridItem,
} from "@USupport-components-library/src";
import {
  useWindowDimensions,
  createArticleSlug,
} from "@USupport-components-library/utils";

import {
  useGetMoodTrackEntries,
  useGetMoodTrackerRecommendations,
  useCustomNavigate as useNavigate,
} from "#hooks";

import "./mood-track-history.scss";

/**
 * MoodTrackHistory
 *
 * MoodTrackHistory block
 *
 * @return {jsx}
 */
export const MoodTrackHistory = () => {
  const { t, i18n } = useTranslation("blocks", {
    keyPrefix: "mood-track-history",
  });
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const language = i18n.language;
  const country = localStorage.getItem("country");
  const IS_RO = country === "RO";

  const [pageNum, setPageNum] = useState(0);
  const [loadedPages, setLoadedPages] = useState([]);
  const limitToLoad = width < 768 ? 6 : 13;
  const limit = `pageNum_${pageNum}_limitToLoad_${limitToLoad}`;
  const [moodTrackerData, setMoodTrackerData] = useState({});
  const [selectedItemId, setSelectedItemId] = React.useState(null);
  const [lastMood, setLastMood] = useState(null);

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
        ...curEntries.slice(0, limitToLoad - prevEntries.length),
      );
    }

    dataCopy[prevPageLimit] = { entries: prevEntries, hasMore };
    let loadedPagesCopy = [...loadedPages];
    loadedPagesCopy.push(pageNum);
    setLoadedPages(loadedPagesCopy);

    if (curEntries.length > 0 && !lastMood && IS_RO) {
      setLastMood(curEntries[curEntries.length - 1].mood);
    }

    setMoodTrackerData(dataCopy);
  };

  const {
    data: moodTrackerRecommendations,
    isFetching: moodTrackerRecommendationsIsLoading,
  } = useGetMoodTrackerRecommendations(lastMood, language);

  const enabled = useMemo(() => {
    return !loadedPages.includes(pageNum);
  }, [loadedPages, pageNum]);

  useGetMoodTrackEntries(limitToLoad, pageNum, onSuccess, enabled);

  const emoticons = [
    { name: "happy", label: "Happy", value: 4, emoji: "😍" },
    { name: "good", label: "Good", value: 3, emoji: "😀" },
    { name: "sad", label: "Sad", value: 2, emoji: "😔" },
    { name: "depressed", label: "Depressed", value: 1, emoji: "☹️" },
    { name: "worried", label: "Worried", value: 0, emoji: "😣" },
  ];

  const renderAllEmoticons = () => {
    return emoticons.map((emoticon, index) => {
      return (
        <div className="mood-track-history__emoticon-container" key={index}>
          {/* <Emoticon
            name={`emoticon-${emoticon.name}`}
            classes="mood-track-history__emoticon"
            size="xs"
          /> */}
          {width < 768 ? <h1>{emoticon.emoji}</h1> : <h2>{emoticon.emoji}</h2>}
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
              {renderAllEmoticons()}
              <div
                className={[
                  "mood-track-history__icon-container",
                  !moodTrackerData[limit].hasMore &&
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
            </div>
            <div className="mood-track-history__content-container__chart-container">
              <div className="mood-track-history__content-container__chart-container__wrapper">
                <div className="mood-track-history__content-container__chart-wrapper">
                  <LineChart
                    data={moodTrackerData[limit]?.entries || []}
                    handleSelectItem={handleMoodClick}
                    selectedItemId={selectedItemId}
                  />
                </div>
                <div className="mood-track-history__content-container__chart-wrapper__dates">
                  {renderDates()}
                </div>
              </div>
              <div>
                <div
                  className={[
                    "mood-track-history__content-container__emoticons-container__icon--right",
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
          {(() => {
            const selectedMood = moodTrackerData[limit]?.entries.find(
              (x) => x.mood_tracker_id === selectedItemId,
            );

            if (!selectedMood) return null;

            const dateText = `${
              selectedMood.time.getDate() > 9
                ? selectedMood.time.getDate()
                : `0${selectedMood.time.getDate()}`
            }.${
              selectedMood.time.getMonth() + 1 > 9
                ? selectedMood.time.getMonth() + 1
                : `0${selectedMood.time.getMonth() + 1}`
            }`;
            const hourText = `${selectedMood.time.getHours()}:${
              selectedMood.time.getMinutes() > 9
                ? selectedMood.time.getMinutes()
                : `0${selectedMood.time.getMinutes()}`
            }`;

            return (
              <Modal
                isOpen={!!selectedMood}
                closeModal={() => setSelectedItemId(null)}
                heading={`${dateText} ${hourText}`}
                hasCloseIcon={true}
              >
                <MoodTrackDetails mood={selectedMood} t={t} />
              </Modal>
            );
          })()}
        </>
      )}

      {IS_RO && (
        <React.Fragment>
          {lastMood && (
            <div className="mood-track-history__recommendations-heading">
              <h3>{t("recommendations")}</h3>
            </div>
          )}

          {moodTrackerRecommendationsIsLoading ? (
            <Loading />
          ) : moodTrackerRecommendations?.hasRecommendations ? null : (
            <h5 className="mood-track-history__recommendations-no-results">
              {t("no_recommendations")}
            </h5>
          )}

          {moodTrackerRecommendations?.articles?.length > 0 && (
            <div className="mood-track-history__recommendations-container">
              <h4 className="mood-track-history__recommendations-container__articles-heading">
                {t("articles")}
              </h4>
              <Grid>
                {moodTrackerRecommendations.articles.map((article) => (
                  <GridItem>
                    <CardMedia
                      type="portrait"
                      title={article.title}
                      image={
                        article.imageMedium ||
                        article.imageThumbnail ||
                        article.imageSmall
                      }
                      description={article.description}
                      labels={article.labels}
                      creator={article.creator}
                      readingTime={article.readingTime}
                      categoryName={article.categoryName}
                      // isLikedByUser={isLikedByUser}
                      // isDislikedByUser={isDislikedByUser}
                      likes={article.likes}
                      dislikes={article.dislikes}
                      // isRead={readArticleIds.includes(article.id)}
                      t={t}
                      onClick={() => {
                        navigate(
                          `/information-portal/article/${
                            article.id
                          }/${createArticleSlug(article.title)}`,
                        );
                      }}
                    />
                  </GridItem>
                ))}
              </Grid>
            </div>
          )}
          {moodTrackerRecommendations?.videos?.length > 0 && (
            <div className="mood-track-history__recommendations-container">
              <h4 className="mood-track-history__recommendations-container__videos-heading">
                {t("videos")}
              </h4>
              <div className="mood-track-history__recommendations-container__videos">
                {moodTrackerRecommendations.videos.map((videoData) => (
                  <CardMedia
                    type="portrait"
                    size="md"
                    title={videoData.title}
                    image={videoData.imageMedium || videoData.imageSmall}
                    description={videoData.description}
                    labels={videoData.labels}
                    creator={videoData.creator}
                    readingTime={videoData.readingTime}
                    categoryName={videoData.categoryName}
                    // isLikedByUser={isLikedByUser}
                    // isDislikedByUser={isDislikedByUser}
                    likes={videoData.likes}
                    dislikes={videoData.dislikes}
                    // isRead={readArticleIds.includes(videoData.id)}
                    t={t}
                    onClick={() => {
                      navigate(
                        `/information-portal/video/${
                          videoData.id
                        }/${createArticleSlug(videoData.title)}`,
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          {moodTrackerRecommendations?.podcasts?.length > 0 && (
            <div className="mood-track-history__recommendations-container">
              <h4 className="mood-track-history__recommendations-container__podcasts-heading">
                {t("podcasts")}
              </h4>
              <div className="mood-track-history__recommendations-container__podcasts">
                {moodTrackerRecommendations.podcasts.map((podcastData) => (
                  <CardMedia
                    type="portrait"
                    size="md"
                    title={podcastData.title}
                    image={podcastData.imageMedium || podcastData.imageSmall}
                    description={podcastData.description}
                    labels={podcastData.labels}
                    creator={podcastData.creator}
                    readingTime={podcastData.readingTime}
                    categoryName={podcastData.categoryName}
                    // isLikedByUser={isLikedByUser}
                    // isDislikedByUser={isDislikedByUser}
                    likes={podcastData.likes}
                    dislikes={podcastData.dislikes}
                    // isRead={readArticleIds.includes(podcastData.id)}
                    t={t}
                    onClick={() => {
                      navigate(
                        `/information-portal/podcast/${
                          podcastData.id
                        }/${createArticleSlug(podcastData.title)}`,
                      );
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </React.Fragment>
      )}
    </Block>
  );
};
