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
  Emoticon,
  CircleIconButton,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useAddMoodTrack, useGetHasCompletedMoodTrackerEver } from "#hooks";
import { mascotHappyPurpleFull } from "@USupport-components-library/assets";
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
  openUserGuide,
}) => {
  const { theme } = useContext(ThemeContext);
  const { handleRegistrationModalOpen } = useContext(RootContext);
  const { width } = useWindowDimensions();
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
  const [isMoodTrackModalOpen, setIsMoodTrackModalOpen] = useState(false);

  const { data: hasCompletedMoodTrackerEver } =
    useGetHasCompletedMoodTrackerEver(IS_RO);
  const clientName = clientData
    ? clientData.name && clientData.surname
      ? `${clientData.name} ${clientData.surname}`
      : clientData.nickname || clientData.name || ""
    : "";

  const hasSelectedMoodtracker = useCallback(() => {
    return emoticons.some((emoticon) => emoticon.isSelected);
  }, [emoticons]);

  const onSuccess = () => {
    setComment("");
    setEmoticons(emoticonsArray);
    setIsEmergency(false);
    setIsMoodTrackModalOpen(false);
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
      const labelClasses = [
        width < 768 && "small-text",
        emoticon.isSelected &&
          theme !== "dark" &&
          "mood-tracker__rating-box__rating__emoticon-container__text--selected",
      ]
        .filter(Boolean)
        .join(" ");

      return (
        <div
          className={[
            "mood-tracker__rating-box__rating__emoticon-container",
            !emoticon.isSelected &&
              emoticons.find((item) => item.isSelected) &&
              "mood-tracker__rating-box__rating__emoticon-container--not-selected",
          ].join(" ")}
          key={index}
          onClick={() => handleEmoticonClick(emoticon.value)}
        >
          <Emoticon
            name={`emoticon-${emoticon.value}`}
            size={emoticon.isSelected ? "lg" : "sm"}
          />
          <p className={labelClasses}>{t(emoticon.value)}</p>
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
    setIsMoodTrackModalOpen(true);
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

  const renderButton = () => {
    if (!IS_RO || !openUserGuide) return null;
    if (width <= 768) {
      return (
        <div>
          <CircleIconButton
            size="sm"
            color="purple"
            onClick={openUserGuide}
            iconName="read-book"
            iconColor="#fff"
            iconSize="sm"
          />
        </div>
      );
    } else {
      return (
        <NewButton
          size="sm"
          label={t("user_guide")}
          onClick={openUserGuide}
          iconName="read-book"
          iconColor="#fff"
        />
      );
    }
  };

  const renderEmojiBox = () => {
    return (
      <div className="mood-tracker__rating-container">
        <div className="mood-tracker__rating-box__rating">
          {renderEmoticons()}
        </div>
        {!(IS_RO && !hasCompletedMoodTrackerEver) ? (
          width < 768 ? (
            <NewButton
              onClick={handleMoodtrackClick}
              label={t("mood_tracker_long")}
              fullWidth
            />
          ) : (
            <NewButton
              onClick={handleMoodtrackClick}
              label={t("mood_tracker_long")}
              size="lg"
              fullWidth
            />
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
    );
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
        <div className="mood-tracker__content">
          <div className="mood-tracker__heading-row">
            <div className="mood-tracker__heading-row__content">
              <h1 className="mood-tracker__heading">
                {t("welcome-heading")}
                {clientName && (
                  <>
                    ,{" "}
                    <span className="mood-tracker__heading__name">
                      {clientName}
                    </span>
                  </>
                )}
              </h1>
              {
                <div className="mood-tracker__subheading-container">
                  <h3 className="mood-tracker__subheading-container__subheading">
                    {t("heading")}
                  </h3>
                </div>
              }
              {width > 768 ? renderEmojiBox() : null}
            </div>
            {width <= 768 ? renderButton() : null}
          </div>
          {width <= 768 ? renderEmojiBox() : null}
          <div className="mood-tracker__mascot-container">
            <img
              className="mood-tracker__mascot-container__image"
              src={mascotHappyPurpleFull}
              alt="Mascot"
            />
            {width > 768 ? renderButton() : null}
          </div>
        </div>
        <Modal
          heading={t("heading")}
          isOpen={isMoodTrackModalOpen}
          closeModal={() => setIsMoodTrackModalOpen(false)}
          ctaLabel={t("submit_mood_track")}
          ctaHandleClick={handleSubmit}
          ctaLoading={addMoodTrackMutation.isLoading}
          ctaDisabled={
            !hasSelectedMoodtracker() || addMoodTrackMutation.isLoading
          }
        >
          <div className={"mood-tracker__rating-box__rating"}>
            {renderEmoticons()}
          </div>
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
            </div>
          )}
        </Modal>
      </Block>
    </React.Fragment>
  );
};
