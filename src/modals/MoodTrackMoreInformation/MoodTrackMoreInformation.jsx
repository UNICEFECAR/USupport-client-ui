import React from "react";
import { useTranslation } from "react-i18next";

import { Modal, Emoticon } from "@USupport-components-library/src";
import { getOrdinal, getMonthName } from "@USupport-components-library/utils";

import "./mood-track-more-information.scss";

/**
 * MoodTrackMoreInformation
 *
 * The MoodTrackMoreInformation modal
 *
 * @return {jsx}
 */
export const MoodTrackMoreInformation = ({
  isOpen,
  onClose,
  emoticons,
  moodTrack,
}) => {
  const { t } = useTranslation("mood-track-more-information");

  const date = moodTrack.time;
  const day = date?.getDate();
  const ordinal = getOrdinal(day);
  const heading = `${day}${t(ordinal)} ${getMonthName(
    date
  )} ${date.getFullYear()}`;
  const emoticonLabel = emoticons.find(
    (x) => x.value === moodTrack.mood
  )?.label;

  return (
    <Modal
      classes="mood-track-more-information"
      heading={heading}
      isOpen={isOpen}
      closeModal={onClose}
    >
      <div className="mood-track-more-information__feeling-container">
        <p className="mood-track-more-information__feeling-container__left">
          {t("you_felt")}{" "}
        </p>
        <Emoticon name={`emoticon-${moodTrack.mood}`} size="lg" />
        <p className="mood-track-more-information__feeling-container__right">
          <strong>{emoticonLabel}</strong>
        </p>
        {moodTrack.comment && <p>{t("comment_text")}</p>}
      </div>

      {moodTrack.comment && (
        <p className="mood-track-more-information__comment">
          “{moodTrack.comment}”
        </p>
      )}
    </Modal>
  );
};
