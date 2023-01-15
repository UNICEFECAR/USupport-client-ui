import React, { useState } from "react";
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
} from "@USupport-components-library/src";

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
export const SafetyFeedback = ({ consultationId, answers }) => {
  const { t } = useTranslation("safety-feedback-block");
  const navigate = useNavigate();
  const hasAnsweredBefore =
    Object.values(answers).filter((x) => x !== undefined).length === 5;

  const [questions, setQuestions] = useState([
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
    const payload = { consultationId };
    questions.forEach((question) => {
      payload[question.field] = question.value;
    });
    payload.moreDetails = payload.unsafeFeeling ? moreDetails : "";

    if (hasAnsweredBefore) {
      updateconsultationSecurityCheckMutation.mutate(payload);
    } else {
      createConsultationSecurityCheckMutation.mutate(payload);
    }
  };

  return (
    <Block classes="safety-feedback">
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
        {questions.map((question) => (
          <GridItem md={8} lg={12} key={question.id}>
            <Question
              question={question}
              handleAnswerSelect={handleAnswerSelect}
              t={t}
            />
          </GridItem>
        ))}

        {questions[3].value === true && (
          <GridItem md={8} lg={12}>
            <Textarea
              label={t("more_details_label")}
              value={moreDetails}
              onChange={setMoreDetails}
              placeholder={t("more_details_placeholder")}
            />
          </GridItem>
        )}
        <GridItem md={8} lg={12} classes="safety-feedback__grid__button">
          <Button
            label={t("button")}
            size="lg"
            disabled={questions.filter((x) => x.value !== null).length !== 4}
            onClick={handleSubmit}
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
              disabled={questions.filter((x) => x.value !== null).length !== 4}
              onClick={handleSubmit}
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
