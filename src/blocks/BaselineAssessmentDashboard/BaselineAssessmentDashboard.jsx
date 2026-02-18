import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

import {
  BaselineAssesmentBox,
  NewButton,
  Box,
  Block,
  Loading,
} from "@USupport-components-library/src";

import { useWindowDimensions } from "@USupport-components-library/utils";

import { HowItWorksBA } from "#modals";
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
  const { width } = useWindowDimensions();
  const [isHowItWorksBAOpen, setIsHowItWorksBAOpen] = useState(false);

  const navigate = useNavigate();
  const { t } = useTranslation("blocks", {
    keyPrefix: "baseline-assessment-dashboard",
  });

  const { data: latestAssessment, isFetching } =
    useGetLatestBaselineAssessment(!isTmpUser);
  const hasCompletedAssessment = latestAssessment?.status === "completed";
  const handleViewAssessment = () => {
    if (latestAssessment) {
      navigate(`/baseline-assesment/${latestAssessment.baselineAssessmentId}`);
    }
  };

  return (
    <React.Fragment>
      <HowItWorksBA
        isOpen={isHowItWorksBAOpen}
        onClose={() => setIsHowItWorksBAOpen(false)}
      />
      <Block classes="baseline-assessment-dashboard">
        <div className="baseline-assessment-dashboard__content">
          <div className="mood-tracker__heading">
            <h4 className="baseline-assessment-dashboard__heading">
              {t("heading")}
            </h4>
            {hasCompletedAssessment ? (
              width < 768 ? (
                <p
                  onClick={handleViewAssessment}
                  className="small-text mood-tracker-button"
                >
                  {t("see_last_result")}
                </p>
              ) : (
                <h5
                  className="mood-tracker-button"
                  onClick={handleViewAssessment}
                >
                  {t("see_last_result")}
                </h5>
              )
            ) : width < 768 ? (
              <p
                className="small-text mood-tracker-button"
                onClick={() => setIsHowItWorksBAOpen(true)}
              >
                {t("how_it_works")}
              </p>
            ) : (
              <h5
                className="mood-tracker-button"
                onClick={() => setIsHowItWorksBAOpen(true)}
              >
                {t("how_it_works")}
              </h5>
            )}
          </div>

          <div className="baseline-assessment-dashboard__container">
            <div className="baseline-assessment-dashboard__assessment">
              {isFetching ? (
                <Loading />
              ) : !latestAssessment ? (
                <NewButton size="lg" onClick={openBaselineAssesmentModal}>
                  {t("start_new_assessment")}
                </NewButton>
              ) : latestAssessment.status === "completed" ? (
                <div className="baseline-assessment-dashboard__results">
                  <h5 className="baseline-assessment-dashboard__results__heading">
                    {t("latest_results")}
                  </h5>
                  <div className="baseline-assessment-dashboard__results__items">
                    <Box classes="baseline-assessment-dashboard__results__items__item">
                      <p>
                        {t("psychological")}:{" "}
                        {latestAssessment.finalResult.psychologicalScore}
                      </p>
                    </Box>
                    <Box classes="baseline-assessment-dashboard__results__items__item">
                      <p>
                        {t("social")}:{" "}
                        {latestAssessment.finalResult.socialScore}
                      </p>
                    </Box>
                    <Box classes="baseline-assessment-dashboard__results__items__item">
                      <p>
                        {t("biological")}:{" "}
                        {latestAssessment.finalResult.biologicalScore}
                      </p>
                    </Box>
                  </div>
                  <NewButton
                    classes="baseline-assessment-dashboard__results__button"
                    size="lg"
                    onClick={openBaselineAssesmentModal}
                  >
                    {t("start_new_assessment")}
                  </NewButton>
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
            <div className="baseline-assessment-dashboard__explore-button">
              <NewButton
                label={t("explore_button_label")}
                onClick={() => {
                  navigate("/organizations");
                }}
                iconName="search"
                iconColor="#fff"
                iconSize="sm"
              />
            </div>
          </div>
        </div>
      </Block>
    </React.Fragment>
  );
};
