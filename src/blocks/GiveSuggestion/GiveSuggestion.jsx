import React, { useState, useEffect } from "react";
import {
  Block,
  Grid,
  GridItem,
  Textarea,
  Button,
  Modal,
} from "@USupport-components-library/src";
import { validate } from "@USupport-components-library/utils";
import { useTranslation } from "react-i18next";
import Joi from "joi";

import "./give-suggestion.scss";

const initialData = {
  suggestion: "",
};

/**
 * GiveSuggestion
 *
 * Give Suggestion Block
 *
 * @return {jsx}
 */
export const GiveSuggestion = () => {
  const { t } = useTranslation("give-suggestion");

  const [data, setData] = useState({ ...initialData });
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const schema = Joi.object({
    suggestion: Joi.string().min(5).label("Please enter your sugestion"),
  });

  useEffect(() => {
    if (data.suggestion !== "") {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [data]);

  const handleModalSuccessCtaClick = () => {
    window.location.reload(false);
    window.scrollTo(0, 0);
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const handleChange = (field, value) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleSubmit = async () => {
    if (!isSubmitting) {
      if ((await validate(data, schema, setErrors)) === null) {
        setIsSubmitting(true);
        setTimeout(() => {
          //TODO: send request to country administrator
          setIsSubmitting(false);
          setIsSuccessModalOpen(true);
        }, 500);
      }
    }
  };
  return (
    <Block classes="give-suggestion">
      <Grid classes="give-suggestion__grid">
        <GridItem md={4} lg={12} classes="give-suggestion__heading-item">
          <h4>{t("heading")}</h4>
        </GridItem>
        <GridItem md={8} lg={12} classes="give-suggestion__subheading-item">
          <p>{t("subheading")}</p>
        </GridItem>
        <GridItem md={8} lg={12} classes="give-suggestion__textarea-item">
          <Textarea
            size="md"
            placeholder={t("suggestion_placeholder")}
            onChange={(value) => handleChange("suggestion", value)}
            errorMessage={errors.suggestion}
          ></Textarea>
        </GridItem>

        <GridItem md={8} lg={12} classes="">
          <Button
            type="link"
            label={t("submit")}
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          ></Button>
        </GridItem>
      </Grid>
      <Modal
        isOpen={isSuccessModalOpen}
        closeModal={closeSuccessModal}
        title={t("modal_title")}
        text={t("modal_text")}
        ctaLabel={t("modal_cta_label")}
        ctaHandleClick={handleModalSuccessCtaClick}
      />
    </Block>
  );
};
