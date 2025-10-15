import React from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

import {
  BaselineAssesmentBox,
  Button,
  Box,
  Block,
  Grid,
  GridItem,
  Loading,
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

  const { data: latestAssessment, isFetching } = useGetLatestBaselineAssessment(
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
          {isFetching ? (
            <Loading />
          ) : !latestAssessment ? (
            <Button size="lg" onClick={openBaselineAssesmentModal}>
              {t("start_new_assessment")}
            </Button>
          ) : latestAssessment.status === "completed" ? (
            <div className="baseline-assessment-dashboard__results">
              <h5 className="baseline-assessment-dashboard__results__heading">
                {t("latest_results")}
              </h5>
              <div className="baseline-assessment-dashboard__results__items">
                <Box classes="baseline-assesment-result__compare-grid__item">
                  <p>
                    {t("psychological")}:{" "}
                    {latestAssessment.finalResult.psychologicalScore}
                  </p>
                </Box>
                <Box classes="baseline-assesment-result__compare-grid__item">
                  <p>
                    {t("social")}: {latestAssessment.finalResult.socialScore}
                  </p>
                </Box>
                <Box classes="baseline-assesment-result__compare-grid__item">
                  <p>
                    {t("biological")}:{" "}
                    {latestAssessment.finalResult.biologicalScore}
                  </p>
                </Box>
              </div>
              <Button
                classes="baseline-assessment-dashboard__results__button"
                size="lg"
                onClick={openBaselineAssesmentModal}
              >
                {t("start_new_assessment")}
              </Button>
            </div>
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
