import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Joi from "joi";

import { Backdrop, Textarea } from "@USupport-components-library/src";
import { validate } from "@USupport-components-library/utils";

import { useCreateOrganizationReport } from "#hooks";

import "./report-organization.scss";

/**
 * ReportOrganization
 *
 * Confirmation modal for submitting an organization report.
 */
export const ReportOrganization = ({ isOpen, onClose, organizationId }) => {
  const { t } = useTranslation("backdrops", {
    keyPrefix: "organization-report",
  });

  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);

  const schema = Joi.object({
    message: Joi.string().trim().min(1).label(t("message_error")),
  });

  useEffect(() => {
    if (!isOpen) {
      setMessage("");
      setErrors({});
      setSubmitError(null);
    }
  }, [isOpen]);

  const reportMutation = useCreateOrganizationReport(() => {
    toast.success(t("success_message"));
    onClose();
  }, (errMessage) => {
    setSubmitError(errMessage);
  });

  const handleConfirm = async () => {
    if (!organizationId) return;
    setSubmitError(null);

    if ((await validate({ message }, schema, setErrors)) !== null) {
      return;
    }

    try {
      await reportMutation.mutateAsync({
        organizationId,
        reason: message.trim(),
      });
    } catch {
      // Error surfaced via callback / submitError
    }
  };

  return (
    <Backdrop
      title="ReportOrganization"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={t("subheading")}
      ctaLabel={t("confirm_button")}
      ctaHandleClick={handleConfirm}
      isCtaDisabled={reportMutation.isLoading || !message.trim()}
      isCtaLoading={reportMutation.isLoading}
      secondaryCtaLabel={t("cancel_button")}
      secondaryCtaHandleClick={onClose}
      secondaryCtaType="ghost"
      errorMessage={submitError}
      style={{ zIndex: 10000000 }}
    >
      <div className="report-organization-modal__content">
        <Textarea
          label={t("message_label")}
          placeholder={t("message_placeholder")}
          value={message}
          onChange={setMessage}
          size="md"
          errorMessage={errors.message}
        />
      </div>
    </Backdrop>
  );
};

ReportOrganization.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  organizationId: PropTypes.string,
};
