import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Page, BaselineAssesment as BaselineAssesmentBlock } from "#blocks";
import { useGetBaselineAssessments } from "#hooks";

import {
  BaselineAssesmentBox,
  Loading,
} from "@USupport-components-library/src";

import "./baseline-assesment.scss";

/**
 * BaselineAssesment
 *
 * Baseline assesment test page
 *
 * @returns {JSX.Element}
 */
export const BaselineAssesment = () => {
  const { t } = useTranslation("baseline-assesment-page");
  const { data: baselineAssessments, isLoading } = useGetBaselineAssessments();
  const { assessmentId } = useParams();

  const [selectedSession, setSelectedSession] = useState(null);
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);

  useEffect(() => {
    if (assessmentId && baselineAssessments) {
      const assessment = baselineAssessments.find(
        (assessment) => assessment.baselineAssessmentId === assessmentId
      );
      if (assessment) {
        setSelectedSession(assessment);
        setHasStartedAssessment(true);
      }
    }
  }, [assessmentId, baselineAssessments]);

  // Separate assessments by status
  const { inProgressSession, completedSessions } = useMemo(() => {
    if (!baselineAssessments) {
      return { inProgressSession: null, completedSessions: [] };
    }

    const inProgress = baselineAssessments.find(
      (assessment) => assessment.status === "in_progress"
    );
    const completed = baselineAssessments.filter(
      (assessment) => assessment.status === "completed"
    );

    return {
      inProgressSession: inProgress || null,
      completedSessions: completed,
    };
  }, [baselineAssessments]);

  return (
    <Page classes="page__baseline-assesment">
      {isLoading ? (
        <Loading />
      ) : (
        <BaselineAssesmentBlock
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          setHasStartedAssessment={setHasStartedAssessment}
          inProgressSession={inProgressSession}
        />
      )}

      {/* Only show session list if no session is selected and no new assessment started */}
      {!selectedSession && !hasStartedAssessment && (
        <div className="page__baseline-assesment__sessions">
          {/* Show in-progress session first if it exists */}
          {inProgressSession && (
            <div className="page__baseline-assesment__sessions__in-progress">
              <h3>{t("continue_assessment")}</h3>
              <BaselineAssesmentBox
                key={inProgressSession.baselineAssessmentId}
                progress={inProgressSession.completionPercentage}
                status={inProgressSession.status}
                startedAt={inProgressSession.startedAt}
                currentPosition={inProgressSession.currentPosition - 1}
                completionPercentage={inProgressSession.completionPercentage}
                handleViewAssessment={() =>
                  setSelectedSession(inProgressSession)
                }
                t={t}
              />
            </div>
          )}

          {/* Show completed sessions if there are any */}
          {completedSessions.length > 0 && (
            <div className="page__baseline-assesment__sessions__completed">
              <h3>{t("completed_assessments")}</h3>
              {completedSessions.map((session) => (
                <BaselineAssesmentBox
                  key={session.baselineAssessmentId}
                  progress={
                    session.status === "completed"
                      ? 100
                      : session.completionPercentage
                  }
                  status={session.status}
                  startedAt={session.startedAt}
                  currentPosition={
                    session.status === "completed"
                      ? session.currentPosition
                      : session.currentPosition - 1
                  }
                  completionPercentage={session.completionPercentage}
                  handleViewAssessment={() => setSelectedSession(session)}
                  t={t}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Page>
  );
};
