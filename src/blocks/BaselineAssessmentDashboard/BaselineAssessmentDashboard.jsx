import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

import {
  BaselineAssesmentBox,
  NewButton,
  Box,
  Block,
  Loading,
  Icon,
} from "@USupport-components-library/src";

import { HowItWorksBA } from "#modals";
import { useGetLatestBaselineAssessment } from "#hooks";

import "./baseline-assessment-dashboard.scss";

/**
 * BaselineAssessmentDashboard
 *
 * BaselineAssessmentDashboard Block - Redesigned to match ConsultationsDashboard styling
 *
 * @return {jsx}
 */
export const BaselineAssessmentDashboard = ({
  openBaselineAssesmentModal,
  isTmpUser,
}) => {
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

  const renderAssessmentContent = () => {
    if (isFetching) {
      return <Loading />;
    }

    if (!latestAssessment) {
      return (
        <Box
          classes="baseline-assessment-dashboard__box__content__part__inner-box"
          liquidGlass
        >
          <div className="baseline-assessment-dashboard__box__content__part__inner-box__icon">
            <Icon name="document" size="lg" color="#6a4ffb" />
          </div>
          <p className="baseline-assessment-dashboard__box__content__part__description">
            {t("no_assessment_description")}
          </p>
          <NewButton size="lg" onClick={openBaselineAssesmentModal} isFullWidth>
            {t("start_new_assessment")}
          </NewButton>
        </Box>
      );
    }

    if (latestAssessment.status === "completed") {
      return (
        <Box
          classes="baseline-assessment-dashboard__box__content__part__inner-box"
          liquidGlass
        >
          <div className="baseline-assessment-dashboard__box__content__part__results">
            <div className="baseline-assessment-dashboard__box__content__part__results__item">
              <p className="small-text baseline-assessment-dashboard__box__content__part__results__label">
                {t("psychological")}
              </p>
              <h4 className="baseline-assessment-dashboard__box__content__part__results__value">
                {latestAssessment.finalResult.psychologicalScore}
              </h4>
            </div>
            <div className="baseline-assessment-dashboard__box__content__part__results__item">
              <p className="small-text baseline-assessment-dashboard__box__content__part__results__label">
                {t("social")}
              </p>
              <h4 className="baseline-assessment-dashboard__box__content__part__results__value">
                {latestAssessment.finalResult.socialScore}
              </h4>
            </div>
            <div className="baseline-assessment-dashboard__box__content__part__results__item">
              <p className="small-text baseline-assessment-dashboard__box__content__part__results__label">
                {t("biological")}
              </p>
              <h4 className="baseline-assessment-dashboard__box__content__part__results__value">
                {latestAssessment.finalResult.biologicalScore}
              </h4>
            </div>
          </div>
          <div className="baseline-assessment-dashboard__box__content__part__buttons">
            <NewButton
              size="lg"
              onClick={openBaselineAssesmentModal}
              isFullWidth
            >
              {t("start_new_assessment")}
            </NewButton>
            <NewButton
              size="lg"
              type="outline"
              onClick={handleViewAssessment}
              isFullWidth
            >
              {t("see_last_result")}
            </NewButton>
          </div>
        </Box>
      );
    }

    return (
      <BaselineAssesmentBox
        progress={latestAssessment.completionPercentage}
        status={latestAssessment.status}
        startedAt={latestAssessment.startedAt}
        currentPosition={latestAssessment.currentPosition}
        completionPercentage={latestAssessment.completionPercentage}
        handleViewAssessment={handleViewAssessment}
        t={t}
      />
    );
  };

  return (
    <React.Fragment>
      <HowItWorksBA
        isOpen={isHowItWorksBAOpen}
        onClose={() => setIsHowItWorksBAOpen(false)}
      />
      <Block classes="baseline-assessment-dashboard">
        <Box classes="baseline-assessment-dashboard__box" liquidGlass>
          <div className="baseline-assessment-dashboard__box__content">
            {/* Map / Explore Organizations Section */}
            <div className="baseline-assessment-dashboard__box__content__part baseline-assessment-dashboard__box__content__part--map">
              <h3>{t("explore_heading")}</h3>
              <div className="baseline-assessment-dashboard__box__content__part__map-container">
                <div className="baseline-assessment-dashboard__box__content__part__explore-card">
                  <div className="baseline-assessment-dashboard__box__content__part__explore-card__icon">
                    <Icon name="pin" size="lg" color="#6a4ffb" />
                  </div>
                  <p className="baseline-assessment-dashboard__box__content__part__explore-card__description">
                    {t("explore_card_description")}
                  </p>
                  <NewButton
                    label={t("explore_button_label")}
                    onClick={() => navigate("/organizations")}
                    size="lg"
                    isFullWidth
                  />
                </div>
              </div>
            </div>

            {/* Baseline Assessment Section */}
            <div className="baseline-assessment-dashboard__box__content__part baseline-assessment-dashboard__box__content__part--assessment">
              <div className="baseline-assessment-dashboard__box__content__part__header">
                <h3>
                  {hasCompletedAssessment
                    ? t("heading_completed")
                    : t("heading")}
                </h3>
                <h5
                  className="baseline-assessment-dashboard__box__content__part__header__link"
                  onClick={() => setIsHowItWorksBAOpen(true)}
                >
                  {t("how_it_works")}
                </h5>
              </div>
              {renderAssessmentContent()}
            </div>
          </div>
        </Box>
      </Block>
    </React.Fragment>
  );
};
