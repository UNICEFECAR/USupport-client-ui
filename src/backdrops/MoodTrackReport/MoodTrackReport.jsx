import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Joi from "joi";

import { Backdrop, DateInput } from "@USupport-components-library/src";
import { validate } from "@USupport-components-library/utils";
import { useGenerateMoodTrackReport } from "#hooks";

import "./mood-track-report.scss";

/**
 * MoodTrackReport
 *
 * The MoodTrackReport backdrop
 *
 * @return {jsx}
 */
export const MoodTrackReport = ({ isOpen, onClose }) => {
  const { t } = useTranslation("backdrops", { keyPrefix: "mood-track-report" });

  const [data, setData] = useState({ startDate: "", endDate: "" });
  const [errors, setErrors] = useState({});

  const onError = (errorMessage) => {
    setErrors({ submit: errorMessage });
  };

  const generateReportMutation = useGenerateMoodTrackReport(() => {}, onError);

  const schema = Joi.object({
    startDate: Joi.string().required(),
    endDate: Joi.string().required(),
  });

  const handleGenerateReport = async () => {
    if ((await validate(data, schema, setErrors)) === null) {
      if (
        data.startDate &&
        data.endDate &&
        new Date(data.endDate) < new Date(data.startDate)
      ) {
        setErrors({ endDate: t("end_date_before_start_error") });
        return;
      }

      await generateReportMutation.mutateAsync(data);
    }
  };

  return (
    <Backdrop
      title="MoodTrackReport"
      isOpen={isOpen}
      onClose={onClose}
      heading={t("heading")}
      text={t("subheading")}
      ctaLabel={t("export_button")}
      ctaHandleClick={handleGenerateReport}
      isCtaDisabled={
        data.startDate === "" ||
        data.endDate === "" ||
        generateReportMutation.isLoading
      }
      isCtaLoading={generateReportMutation.isLoading}
      secondaryCtaLabel={t("cancel_button")}
      secondaryCtaHandleClick={onClose}
      secondaryCtaType="ghost"
      errorMessage={errors.submit}
      style={{ zIndex: 10000000 }}
    >
      <div className="mood-track-report-modal__content">
        <DateInput
          label={t("start_date")}
          value={data.startDate}
          onChange={(e) => setData({ ...data, startDate: e.target.value })}
          errorMessage={errors.startDate}
        />
        <DateInput
          label={t("end_date")}
          value={data.endDate}
          onChange={(e) => setData({ ...data, endDate: e.target.value })}
          errorMessage={errors.endDate}
        />
      </div>
    </Backdrop>
  );
};
