import React from "react";
import { useTranslation } from "react-i18next";

import {
  Modal,
  Icon,
  Like,
  Label,
  Avatar,
} from "@USupport-components-library/src";

import { isDateToday } from "@USupport-components-library/utils";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

import "./question-details.scss";

/**
 * QuestionDetails
 *
 * The QuestionDetails modal
 *
 * @return {jsx}
 */
export const QuestionDetails = ({
  question,
  handleLike,
  isOpen,
  onClose,
  handleScheduleClick,
}) => {
  const { t } = useTranslation("question-details");

  const providerInfo = question.providerData;

  const getDateText = () => {
    const date = new Date(question.questionCreatedAt);

    if (isDateToday(date)) {
      return t("today");
    } else {
      return `${date.getDate() > 9 ? date.getDate() : `0${date.getDate()}`}.${
        date.getMonth() + 1 > 9
          ? date.getMonth() + 1
          : `0${date.getMonth() + 1}`
      }`;
    }
  };

  return (
    <Modal classes="question-details" isOpen={isOpen} closeModal={onClose}>
      <div className="question-details__date-container">
        <Icon name="calendar" color="#92989B" />
        <p className="text question-details__date-container__text">
          {getDateText()}
        </p>
      </div>
      <div className="question-details__heading">
        <h4 className="question-details__heading__text">
          {question.answerTitle}
        </h4>
        <Like
          handleClick={handleLike}
          likes={question.likes}
          dislikes={question.dislikes}
          answerId={question.answerId}
          isLiked={question.isLiked}
          isDisliked={question.isDisliked}
        />
      </div>
      {question.tags ? (
        <div className="question-details__labels-container">
          {question.tags.map((label, index) => {
            return (
              <Label
                text={label}
                key={index}
                classes="question-details__labels-container__label"
              />
            );
          })}
        </div>
      ) : null}
      <p className="text question-details__answer-text">
        {question.answerText}
      </p>
      <div className="question-details__bottom-container">
        <div className="question-details__answered-by-container">
          <p className="text">{t("answered_by")}</p>
          <Avatar
            image={AMAZON_S3_BUCKET + "/" + providerInfo.image}
            alt="Specialist avatar"
            size="xs"
            classes="question-details__answered-by-container__avatar"
          />
          <p className="text">
            {providerInfo.name} {providerInfo.surname}
          </p>
        </div>
        <div
          className="question-details__schedule-button"
          onClick={() => handleScheduleClick()}
        >
          <Icon name="calendar" color="#20809e" />
          <p className="text">{t("schedule_consultation")}</p>
        </div>
      </div>
    </Modal>
  );
};
