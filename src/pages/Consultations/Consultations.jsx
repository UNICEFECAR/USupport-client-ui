import React from "react";
import { Page, Consultations as ConsultationsBlock } from "#blocks";
import { useTranslation } from "react-i18next";
import { Button } from "@USupport-components-library/src";

import "./consultations.scss";
import { useNavigate } from "react-router-dom";

/**
 * Consultations
 *
 * Consultations page
 *
 * @returns {JSX.Element}
 */
export const Consultations = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("consultations-page");

  const handleScheduleConsultationClick = () => {
    navigate("/select-provider");
  };

  return (
    <Page
      heading={t("header")}
      classes="page__consultations"
      headingButton={
        <Button
          label={t("button_label")}
          onClick={() => handleScheduleConsultationClick()}
          web={true}
        />
      }
    >
      <ConsultationsBlock />
    </Page>
  );
};
