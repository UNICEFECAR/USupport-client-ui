import React from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

import {
  Block,
  Button,
  Loading,
  BaselineAssesmentBox,
} from "@USupport-components-library/src";

import { useGetLatestBaselineAssessment } from "#hooks";

import "./baseline-assessment-dashboard.scss";

/**
 * BaselineAssessmentDashboard
 *
 * BaselineAssessmentDashboard Block
 *
 * @return {jsx}
 */
export const BaselineAssessmentDashboard = ({
  openBaselineAssesmentModal,
  isTmpUser,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("blocks", {
    keyPrefix: "baseline-assessment-dashboard",
  });

  const { data: latestAssessment, isLoading } = useGetLatestBaselineAssessment(
    !isTmpUser
  );

  const handleViewAssessment = () => {
    console.log(latestAssessment);
    if (latestAssessment) {
      navigate(`/baseline-assesment/${latestAssessment.baselineAssessmentId}`);
    }
  };

  return (
    <Block classes="baseline-assessment-dashboard">
      <div className="baseline-assessment-dashboard__content">
        <h4 className="baseline-assessment-dashboard__heading">
          {t("heading")}
        </h4>

        <div className="baseline-assessment-dashboard__assessment">
          {isLoading ? (
            <Loading />
          ) : !latestAssessment || latestAssessment.status === "completed" ? (
            <Button size="lg" onClick={openBaselineAssesmentModal}>
              {t("start_new_assessment")}
            </Button>
          ) : (
            <BaselineAssesmentBox
              progress={latestAssessment.completionPercentage}
              status={latestAssessment.status}
              startedAt={latestAssessment.startedAt}
              currentPosition={latestAssessment.currentPosition}
              completionPercentage={latestAssessment.completionPercentage}
              handleViewAssessment={handleViewAssessment}
              t={t}
            />
          )}
        </div>
      </div>
    </Block>
  );
};
