import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Joi from "joi";

import { Modal, Textarea } from "@USupport-components-library/src";
import { useAddQuestion } from "#hooks";

import { validate } from "@USupport-components-library/utils";

import "./create-question.scss";

/**
 * CreateQuestion
 *
 * The CreateQuestion modal
 *
 * @return {jsx}
 */
export const CreateQuestion = ({ isOpen, onClose }) => {
  const { t } = useTranslation("create-question");
  const queryClient = useQueryClient();

  const [data, setData] = useState({ question: "" });
  const [errors, setErrors] = useState("");

  const onSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ["getClientQuestions"] });
    toast(t("success_toast"));
    onClose();
  };
  const onError = (errorMessage) => {
    const errorsCopy = { ...errors };
    errorsCopy.query = errorMessage;
    setErrors(errorsCopy);
  };

  const addQuestionMutation = useAddQuestion(onSuccess, onError);

  const schema = Joi.object({
    question: Joi.string().min(10).label(t("text_area_error_label")),
  });

  const handleSendQuestion = async () => {
    const question = data.question;
    if ((await validate(data, schema, setErrors)) === null) {
      addQuestionMutation.mutate({ question });
    }
  };

  const handleChange = (value) => {
    const dataCopy = { ...data };
    dataCopy.question = value;
    setData(dataCopy);
  };

  return (
    <Modal
      classes="create-question"
      heading={t("heading")}
      text={t("subheading")}
      isOpen={isOpen}
      closeModal={onClose}
      ctaLabel={t("send_your_question")}
      ctaHandleClick={handleSendQuestion}
      isCtaLoading={addQuestionMutation.isLoading}
      secondaryCtaLabel={t("cancel")}
      secondaryCtaType="secondary"
      secondaryCtaHandleClick={onClose}
      errorMessage={errors.query}
    >
      <Textarea
        label={t("text_area_label")}
        classes="create-question__textarea"
        onChange={(value) => handleChange(value)}
        value={data.message}
        errorMessage={errors.question}
      />
    </Modal>
  );
};
