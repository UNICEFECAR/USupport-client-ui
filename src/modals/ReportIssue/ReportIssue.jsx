import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import { ContactForm, Modal } from "@USupport-components-library/src";

import { useSendIssueEmail } from "#hooks";

import "./report-issue.scss";

export const ReportIssue = ({
  isOpen,
  onClose,
  initialEmail,
  initialIssue,
}) => {
  const { t } = useTranslation("blocks", { keyPrefix: "contact-us-block" });

  const country = localStorage.getItem("country");
  const formRef = useRef(null);

  const technicalProblemOptions = useMemo(
    () => [
      {
        value: "technical-problem",
        label: t("technical_problem_label"),
      },
    ],
    [t],
  );
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [submitError, setSubmitError] = useState();

  useEffect(() => {
    if (isOpen) {
      setSubmitError(undefined);
    }
  }, [isOpen]);

  const tForContactForm = (key, opts) => {
    const keyMap = {
      contact_form_heading: "issue",
      email_label: "email",
      reason_label: "issue",
      message_label: "message",
      message_placeholder: "message_placeholder",
      send_button: "button",
      email_error: "email_error",
      reason_error: "issue_error",
      message_error: "message_error",
      contact_reason_placeholder: "issue_placeholder",
      contact_form: "contact_form",
      technical_problem_label: "technical_problem_label",

      contact_reason_1: "contact_reason_1",
      contact_reason_2: "contact_reason_2",
      contact_reason_3: "contact_reason_3",
      contact_reason_4: "contact_reason_4",
      contact_reason_5: "contact_reason_4",

      contact_reason_1_pl: "contact_reason_1_pl",
      contact_reason_2_pl: "contact_reason_2_pl",
      contact_reason_3_pl: "contact_reason_3_pl",
      contact_reason_4_pl: "contact_reason_4_pl",

      contact_reason_3_ro: "contact_reason_3",
    };
    return t(keyMap[key] ?? key, opts);
  };

  const onSendEmailSuccess = () => {
    setIsSuccessModalOpen(true);
  };
  const onSendEmailError = (errorMessage) => setSubmitError(errorMessage);

  const sendIssueEmailMutation = useSendIssueEmail(
    onSendEmailSuccess,
    onSendEmailError,
  );

  const closeSuccessModal = () => setIsSuccessModalOpen(false);

  return (
    <>
      <Modal
        isOpen={isOpen}
        closeModal={onClose}
        classes="report-issue-modal"
        heading={t("issue")}
        ctaLabel={t("button")}
        ctaHandleClick={() => formRef.current?.requestSubmit?.()}
        isCtaLoading={sendIssueEmailMutation.isLoading}
        secondaryCtaLabel={t("close_button_label")}
        secondaryCtaHandleClick={onClose}
      >
        <div className="report-issue-modal__content">
          <p className="text report-issue-modal__intro">
            {t("report_issue_intro")}
          </p>
          <ContactForm
            classes="report-issue-modal__contact-form"
            sendEmail={(payload) => sendIssueEmailMutation.mutateAsync(payload)}
            submitError={submitError}
            isMutating={sendIssueEmailMutation.isLoading}
            isSuccessModalOpen={isSuccessModalOpen}
            t={tForContactForm}
            country={country}
            initialEmail={initialEmail}
            initialReason={initialIssue ?? "technical-problem"}
            reasonOptions={technicalProblemOptions}
            subjectLabel={t("technical_problem_label")}
            hideHeading
            hideSubmitButton
            formRef={formRef}
          />
        </div>
      </Modal>

      <Modal
        isOpen={isSuccessModalOpen}
        closeModal={closeSuccessModal}
        heading={t("modal_title")}
        text={t("modal_text")}
        ctaLabel={t("modal_cta_label")}
        ctaHandleClick={() => {
          closeSuccessModal();
          onClose?.();
        }}
      />
    </>
  );
};
