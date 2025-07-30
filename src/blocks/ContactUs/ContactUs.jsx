import React, { useEffect, useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";
import {
  Block,
  DropdownWithLabel,
  Textarea,
  Grid,
  GridItem,
  Button,
  Modal,
  Input,
  Loading,
} from "@USupport-components-library/src";
import { validate } from "@USupport-components-library/utils";

import { RootContext } from "#routes";

import { useSendIssueEmail, useGetClientData } from "#hooks";

import Joi from "joi";

import "./contact-us.scss";

const initialData = {
  issue: null,
  message: "",
  email: "",
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

  const { isTmpUser } = useContext(RootContext);

  const country = localStorage.getItem("country");
  console.log(country);

  const IS_PL = country === "PL";

  const initialIssues = [
    {
      value: "information",
      label: IS_PL ? "contact_reason_1_pl" : "contact_reason_1",
    },
    {
      value: "services-information",
      label: IS_PL ? "contact_reason_2_pl" : "contact_reason_2",
    },
    {
      value: "technical-problem",
      label: IS_PL ? "contact_reason_3_pl" : "contact_reason_3",
    },
    {
      value: "other",
      label: IS_PL ? "contact_reason_4_pl" : "contact_reason_4",
    },
  ];

  const navigate = useNavigate();
  const [data, setData] = useState({ ...initialData });
  const [issues, setIssues] = useState([...initialIssues]);
  const [errors, setErrors] = useState({});
  const [canSubmit, setCanSubmit] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  const [clientDataQuery] = useGetClientData(!isTmpUser);

  useEffect(() => {
    if (clientDataQuery.data) {
      const { email } = clientDataQuery.data;
      setData({
        ...data,
        email,
      });
    }
  }, [clientDataQuery.data]);

  const schema = Joi.object({
    issue: Joi.string().label(t("issue_error")),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .label(t("email_error")),
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
    navigate("/dashboard");
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
      if (issuesCopy[i].value === issue) {
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

  const onSendEmailSuccess = () => {
    setIsSuccessModalOpen(true);
    setData({ ...initialData });
  };
  const onSendEmailError = (error) => {
    setErrors({ submit: error });
  };
  const sendIssueEmailMutation = useSendIssueEmail(
    onSendEmailSuccess,
    onSendEmailError
  );

  const handleSubmit = async () => {
    const dataToValidate = {
      issue: data.issue,
      message: data.message,
      email: data.email,
    };
    if ((await validate(dataToValidate, schema, setErrors)) === null) {
      const payload = {
        subjectValue: data.issue,
        subjectLabel: t("contact_form"),
        title: t(issues.find((x) => x.value === data.issue)?.label),
        text: data.message,
        email: data.email,
      };
      sendIssueEmailMutation.mutate(payload);
    }
  };

  return (
    <Block classes="contact-us">
      {clientDataQuery.isLoading && !clientDataQuery.data && !isTmpUser ? (
        <Loading size="lg" />
      ) : (
        <Grid classes="contact-us__grid" xs={4} md={8} lg={12}>
          <GridItem xs={4} md={8} lg={12}>
            <DropdownWithLabel
              label={t("issue")}
              errorMessage={errors.issue}
              classes="contact-us__issue-input"
              placeholder={t("issue_placeholder")}
              options={issues.map((x) => ({
                ...x,
                label: t(x.label),
              }))}
              selected={data.issue}
              setSelected={handleIssueChange}
            />
          </GridItem>
          {clientDataQuery.data?.accessToken && (
            <GridItem xs={4} md={8} lg={12}>
              <Input
                value={data.email}
                label={t("email")}
                placeholder="user@mail.com"
                onChange={(e) => handleChange("email", e.currentTarget.value)}
              />
            </GridItem>
          )}
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
              disabled={!canSubmit}
              isLoading={sendIssueEmailMutation.isLoading}
            />
          </GridItem>
        </Grid>
      )}
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
