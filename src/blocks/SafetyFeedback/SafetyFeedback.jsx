import React, { useContext, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Block,
  Button,
  Grid,
  GridItem,
  Icon,
  RadioButtonSelector,
  Textarea,
  Emoticon,
  Slider,
} from "@USupport-components-library/src";
import { ThemeContext } from "@USupport-components-library/utils";

import {
  useCreateConsultationSecurityCheck,
  useUpdateSecurityCheckAnswersByConsultationId,
} from "#hooks";

import "./safety-feedback.scss";

/**
 * SafetyFeedback
 *
 * Safe feedback to be shown after a consultation has ended
 *
 * @return {jsx}
 */
export const SafetyFeedback = ({ consultationId, answers = {} }) => {
  const { theme } = useContext(ThemeContext);
  const { t } = useTranslation("safety-feedback-block");
  const navigate = useNavigate();
  const hasAnsweredBefore =
    Object.values(answers).filter((x) => x !== undefined).length === 11;

  const [questions, setQuestions] = useState([
    {
      label: t("q0"),
      field: "providerAttend",
      value: answers.hasOwnProperty("providerAttend")
        ? answers.providerAttend
        : null,
      id: 0,
    },
    {
      label: t("q1"),
      field: "contactsDisclosure",
      value: answers.hasOwnProperty("contactsDisclosure")
        ? answers.contactsDisclosure
        : null,
      id: 1,
    },
    {
      label: t("q2"),
      field: "suggestOutsideMeeting",
      value: answers.hasOwnProperty("suggestOutsideMeeting")
        ? answers.suggestOutsideMeeting
        : null,
      id: 2,
    },
    {
      label: t("q3"),
      field: "identityCoercion",
      value: answers.hasOwnProperty("identityCoercion")
        ? answers.identityCoercion
        : null,
      id: 3,
    },
    {
      label: t("q4"),
      field: "unsafeFeeling",
      value: answers.hasOwnProperty("unsafeFeeling")
        ? answers.unsafeFeeling
        : null,
      id: 4,
      showInput: true,
    },
    {
      label: t("q5"),
      field: "feeling",
      value: answers.hasOwnProperty("feeling") ? answers.feeling : null,
      id: 5,
      type: "emoji",
    },
    {
      label: t("q6"),
      field: "addressedNeeds",
      value: answers.hasOwnProperty("addressedNeeds")
        ? answers.addressedNeeds
        : 10,
      id: 6,
      type: "slider",
    },
    {
      label: t("q7"),
      field: "improveWellbeing",
      value: answers.hasOwnProperty("improveWellbeing")
        ? answers.improveWellbeing
        : 10,
      id: 7,
      type: "slider",
    },
    {
      label: t("q8"),
      field: "feelingsNow",
      value: answers.hasOwnProperty("feelingsNow") ? answers.feelingsNow : 10,
      id: 8,
      type: "slider",
    },
    {
      label: t("q9"),
      field: "additionalComment",
      value: answers.hasOwnProperty("additionalComment")
        ? answers.additionalComment
        : null,
      id: 9,
      type: "textarea",
    },
  ]);

  const [moreDetails, setMoreDetails] = useState(
    answers.hasOwnProperty("moreDetails") ? answers.moreDetails : ""
  );

  const handleAnswerSelect = (id, value) => {
    const newQuestions = questions.map((question) => {
      if (question.id === id) {
        return { ...question, value };
      }
      return question;
    });
    setQuestions(newQuestions);
  };

  const onCreateSuccess = () => navigate("/consultations");
  const createConsultationSecurityCheckMutation =
    useCreateConsultationSecurityCheck(onCreateSuccess);

  const updateconsultationSecurityCheckMutation =
    useUpdateSecurityCheckAnswersByConsultationId(onCreateSuccess);

  const handleSubmit = () => {
    let payload = { consultationId };
    questions.forEach((question) => {
      if (questions[0].value === false) {
        payload = {
          consultationId,
          providerAttend: false,
          contactsDisclosure: false,
          suggestOutsideMeeting: false,
          identityCoercion: false,
          unsafeFeeling: false,
          feeling: null,
          addressedNeeds: 0,
          improveWellbeing: 0,
          feelingsNow: 0,
          additionalComment: "",
          moreDetails: "",
        };
      } else {
        payload[question.field] = question.value;
      }
    });
    payload.moreDetails = payload.unsafeFeeling ? moreDetails : "";

    if (hasAnsweredBefore) {
      updateconsultationSecurityCheckMutation.mutate(payload);
    } else {
      createConsultationSecurityCheckMutation.mutate(payload);
    }
  };

  const canSubmit = useMemo(() => {
    if (!questions[0].value) return true;
    const questionsExcludingLast = questions.slice(0, -1);

    return (
      questionsExcludingLast.filter(
        (x) => x.value !== null && x.value !== undefined
      ).length === questionsExcludingLast.length
    );
  }, [questions]);

  return (
    <Block
      classes={[
        "safety-feedback",
        theme === "dark" && "safety-feedback--dark",
      ].join(" ")}
    >
      <Grid classes="safety-feedback__grid">
        <GridItem md={8} lg={12} classes="safety-feedback__grid__headings-item">
          <h4>{t("heading")}</h4>
          <p className="text">{t("subheading")}</p>
        </GridItem>
        <GridItem
          md={8}
          lg={12}
          classes="safety-feedback__grid__warning-container"
        >
          <Icon name="warning" size="md" />
          <p className="small-text">{t("warning")}</p>
        </GridItem>
        {questions.map((question) => {
          if (questions[0].value === false && question.id !== 0) return null;
          return (
            <React.Fragment key={question.id}>
              <GridItem
                md={8}
                lg={12}
                key={question.id}
                classes="safety-feedback__question-item"
              >
                {question?.type === "emoji" ? (
                  <QuestionEmoji
                    question={question}
                    handleAnswerSelect={handleAnswerSelect}
                    t={t}
                    theme={theme}
                  />
                ) : question?.type === "slider" ? (
                  <QuestionSlider
                    question={question}
                    handleAnswerSelect={handleAnswerSelect}
                  />
                ) : question?.type === "textarea" ? (
                  <QuestionTextarea
                    question={question}
                    handleAnswerSelect={handleAnswerSelect}
                    t={t}
                  />
                ) : (
                  <Question
                    question={question}
                    handleAnswerSelect={handleAnswerSelect}
                    t={t}
                  />
                )}
              </GridItem>
              {question.id === 4 && questions[4].value === true && (
                <GridItem md={8} lg={12}>
                  <Textarea
                    label={t("more_details_label")}
                    value={moreDetails}
                    onChange={setMoreDetails}
                    placeholder={t("more_details_placeholder")}
                  />
                </GridItem>
              )}
            </React.Fragment>
          );
        })}
        <GridItem md={8} lg={12} classes="safety-feedback__grid__button">
          <Button
            label={t("button")}
            size="lg"
            onClick={handleSubmit}
            disabled={!canSubmit}
            loading={
              createConsultationSecurityCheckMutation.isLoading ||
              updateconsultationSecurityCheckMutation.isLoading
            }
          />
        </GridItem>
        {hasAnsweredBefore && (
          <GridItem
            md={8}
            lg={12}
            classes="safety-feedback__grid__continue-button"
          >
            <Button
              label={t("continue_button")}
              size="lg"
              type="secondary"
              disabled={!canSubmit}
              onClick={handleSubmit}
              loading={updateconsultationSecurityCheckMutation.isLoading}
            />
          </GridItem>
        )}
      </Grid>
    </Block>
  );
};

const Question = ({ question, handleAnswerSelect, t }) => {
  return (
    <div className="safety-feedback__question">
      <p className="text">{question.label}</p>
      <div className="safety-feedback__question__answers">
        <RadioButtonSelector
          label={t("yes")}
          isChecked={question.value === true}
          setIsChecked={() => handleAnswerSelect(question.id, true)}
        />
        <RadioButtonSelector
          label={t("no")}
          isChecked={question.value === false}
          setIsChecked={() => handleAnswerSelect(question.id, false)}
        />
      </div>
    </div>
  );
};

const QuestionTextarea = ({ question, handleAnswerSelect, t }) => {
  return (
    <div className="safety-feedback__question">
      <p className="text">{question.label}</p>
      <div className="safety-feedback__question__answers">
        <Textarea
          value={question.value}
          onChange={(value) => handleAnswerSelect(question.id, value)}
          placeholder={t("more_details_placeholder")}
        />
      </div>
    </div>
  );
};

const QuestionEmoji = ({ question, handleAnswerSelect, t, theme }) => {
  const emoticonsArray = [
    {
      value: "very_satisfied",
      label: t("very_satisfied"),
      emoji: "happy",
      isSelected: question.value === "very_satisfied",
    },
    {
      value: "satisfied",
      label: t("satisfied"),
      emoji: "good",
      isSelected: question.value === "satisfied",
    },
    {
      value: "neutral",
      label: t("neutral"),
      emoji: "sad",
      isSelected: question.value === "neutral",
    },
    {
      value: "dissatisfied",
      label: t("dissatisfied"),
      emoji: "depressed",
      isSelected: question.value === "dissatisfied",
    },
    {
      value: "very Dissatisfied",
      label: t("very_dissatisfied"),
      emoji: "worried",
      isSelected: question.value === "very_dissatisfied",
    },
  ];
  const [emoticons, setEmoticons] = useState(emoticonsArray);

  const handleSelect = (value) => {
    const newEmoticons = emoticons.map((emoticon) => {
      if (emoticon.value === value) {
        return { ...emoticon, isSelected: true };
      }
      return { ...emoticon, isSelected: false };
    });
    setEmoticons(newEmoticons);
    handleAnswerSelect(question.id, value);
  };

  return (
    <div className="safety-feedback__question">
      <p className="text">{question.label}</p>
      <div className="safety-feedback__question__answers">
        {emoticons.map((emoticon, index) => (
          <div
            className={[
              "mood-tracker__rating__emoticon-container",
              !emoticon.isSelected &&
                "mood-tracker__rating__emoticon-container--not-selected",
              "safety-feedback__question__answers__emoticon-container",
            ].join(" ")}
            key={index}
            onClick={() => handleSelect(emoticon.value)}
          >
            <Emoticon
              name={`emoticon-${emoticon.emoji}`}
              size={emoticon.isSelected ? "lg" : "sm"}
            />
            <p
              className={[
                "small-text",
                emoticon.isSelected &&
                  theme !== "dark" &&
                  "mood-tracker__rating__emoticon-container__text--selected",
              ].join(" ")}
            >
              {emoticon.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

const QuestionSlider = ({ question, handleAnswerSelect }) => {
  return (
    <div className="safety-feedback__question">
      <p className="text">{question.label}</p>
      <div className="safety-feedback__question__slider">
        <Slider
          value={question.value}
          onChange={(value) => handleAnswerSelect(question.id, value)}
        />
      </div>
    </div>
  );
};
