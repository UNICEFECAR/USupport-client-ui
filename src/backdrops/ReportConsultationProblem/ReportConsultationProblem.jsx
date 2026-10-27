import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, Textarea } from "@USupport-components-library/src";
import {
  collectReportEnvironment,
  createReportKey,
} from "@USupport-components-library/utils";
import { useReportConsultationProblem } from "#hooks";

import "./report-consultation-problem.scss";

export const ReportConsultationProblem = ({
  isOpen,
  onClose,
  consultationId,
  getCallContext,
}) => {
  const { t, i18n } = useTranslation("modals", {
    keyPrefix: "report-consultation-problem",
  });
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isPreparing, setIsPreparing] = useState(false);
  const [error, setError] = useState();
  const payload = useRef(null);
  const mutation = useReportConsultationProblem(
    () => setSent(true),
    () => setError(t("error"))
  );
  const isSubmitting = isPreparing || mutation.isLoading;
  const close = () => {
    if (!isSubmitting) onClose();
  };
  const submit = async () => {
    if (isSubmitting || !message.trim()) return;
    setError();
    setIsPreparing(true);
    try {
      if (!payload.current) {
        const callContext = await getCallContext();
        payload.current = {
          consultationId,
          idempotencyKey: createReportKey(),
          message: message.trim(),
          ...collectReportEnvironment(),
          interfaceLanguage: (
            i18n.resolvedLanguage ||
            i18n.language ||
            "en"
          ).slice(0, 16),
          callContext,
        };
      }
      mutation.mutate(payload.current);
    } catch {
      setError(t("error"));
    } finally {
      setIsPreparing(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      heading={t(sent ? "success_title" : "title")}
      closeModal={close}
      ctaLabel={t(sent ? "close" : "send")}
      ctaHandleClick={sent ? close : submit}
      isCtaLoading={isSubmitting}
      isCtaDisabled={!sent && (!message.trim() || isSubmitting)}
      errorMessage={error}
      classes="report-consultation-problem"
    >
      {sent ? (
        <p role="status">{t("success")}</p>
      ) : (
        <div className="report-consultation-problem__form">
          <Textarea
            label={t("message_label")}
            aria-label={t("message_label")}
            required
            value={message}
            disabled={isSubmitting}
            onChange={(value) => {
              setMessage([...value].slice(0, 2000).join(""));
              payload.current = null;
              mutation.reset();
              setError();
            }}
          />
        </div>
      )}
    </Modal>
  );
};
