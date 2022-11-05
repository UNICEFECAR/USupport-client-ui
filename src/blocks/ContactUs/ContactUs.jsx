import React, { useEffect, useState } from "react";
import {
  Block,
  DropdownWithLabel,
  Textarea,
  Grid,
  GridItem,
  Button,
  Modal,
} from "@USupport-components-library/src";
import { validate } from "@USupport-components-library/utils";
import { emailSvc } from "@USupport-components-library/services";

import { useTranslation } from "react-i18next";
import Joi from "joi";

import "./contact-us.scss";

const initialIssues = [
  { label: "Reason 1", value: "reason-1", selected: false },
  { label: "Reason 2", value: "reason-2", selected: false },
  { label: "Reason 3", value: "reason-3", selected: false },
  { label: "Reason 4", value: "reason-4", selected: false },
  { label: "Reason 5", value: "reason-5", selected: false },
];

const initialData = {
  issue: null,
  message: "",
};

/**
 * ContactUs
 *
 * Contact us form block
 *
 * @return {jsx}
 */
export const ContactUs = () => {
  const { t } = useTranslation("contact-us-block");
  const [data, setData] = useState({ ...initialData });
  const [issues, setIssues] = useState([...initialIssues]);
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const schema = Joi.object({
    issue: Joi.string().label(t("issue_error")),
    message: Joi.string().min(5).label(t("message_error")),
  });

  useEffect(() => {
    if (data.message !== "" && data.issue) {
      setCanSubmit(true);
    } else {
      setCanSubmit(false);
    }
  }, [data]);

  const handleModalSuccessCtaClick = () => {
    // TODO: Redirect to the dashboard
    console.log("Redirect to Dashboard");
  };

  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  const handleChange = (field, value) => {
    setData({
      ...data,
      [field]: value,
    });
  };

  const handleIssueChange = (issue) => {
    const issuesCopy = [...issues];
    for (let i = 0; i < issuesCopy.length; i++) {
      if (issuesCopy[i].label === issue.label) {
        issuesCopy[i].selected = true;
      } else {
        issuesCopy[i].selected = false;
      }
    }
    setIssues(issuesCopy);
    setData({
      ...data,
      issue,
    });
  };

  const handleSubmit = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      const dataToValidate = {
        issue: data.issue.value,
        message: data.message,
      };

      if ((await validate(dataToValidate, schema, setErrors)) === null) {
        try {
          const payload = {
            subject: "Technical issue",
            title: data.issue.value,
            text: data.message,
          };
          const res = await emailSvc.sendAdmin(payload);
          if (res.status === 200) {
            setIsSuccessModalOpen(true);
            setIsSubmitting(false);
            setData({ ...initialData });
          } else {
            console.log("something else happened");
          }
        } catch (err) {
          setIsSubmitting(false);
          console.error(err);
        }
      }
    }
  };

  return (
    <Block classes="contact-us">
      <Grid classes="contact-us__grid" xs={4} md={8} lg={12}>
        <GridItem xs={4} md={8} lg={12}>
          <DropdownWithLabel
            label={t("issue")}
            errorMessage={errors.issue}
            classes="contact-us__issue-input"
            placeholder={t("issue_placeholder")}
            options={issues}
            selected={data.issue}
            setSelected={handleIssueChange}
          />
        </GridItem>
        <GridItem
          classes="contact-us__grid__textarea-item"
          xs={4}
          md={8}
          lg={12}
        >
          <Textarea
            label={t("message")}
            placeholder={t("message_placeholder")}
            onChange={(value) => handleChange("message", value)}
            errorMessage={errors.message}
            classes="contact-us__message-input"
            value={data.message}
          />
        </GridItem>

        <GridItem xs={4} md={8} lg={12}>
          <Button
            classes="contact-us__grid__button"
            size="lg"
            label={t("button")}
            type="primary"
            color="green"
            onClick={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          />
        </GridItem>
      </Grid>
      <Modal
        isOpen={isSuccessModalOpen}
        closeModal={closeSuccessModal}
        heading={t("modal_title")}
        text={t("modal_text")}
        ctaLabel={t("modal_cta_label")}
        ctaHandleClick={handleModalSuccessCtaClick}
      />
    </Block>
  );
};
