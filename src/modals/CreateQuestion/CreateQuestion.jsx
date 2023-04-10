import React, { useState } from "react";
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

  const [data, setData] = useState({ question: "" });
  const [errors, setErrors] = useState("");

  const onSuccess = () => {
    toast("Your question has been sent!");
    onClose();
  };
  const onError = () => {
    toast("Error");
  };

  const addQuestionMutation = useAddQuestion(onSuccess, onError);

  const schema = Joi.object({
    question: Joi.string().min(20).label(t("Error message")),
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
      secondaryCtaLabel={t("cancel")}
      secondaryCtaType="secondary"
      secondaryCtaHandleClick={onClose}
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
