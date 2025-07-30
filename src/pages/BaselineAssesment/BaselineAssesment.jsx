import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { Page, BaselineAssesment as BaselineAssesmentBlock } from "#blocks";
import { useGetScreeningSessions } from "#hooks";

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
  const { data: screeningSessions, isLoading } = useGetScreeningSessions();
  const { sessionId } = useParams();

  const [selectedSession, setSelectedSession] = useState(null);
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);

  useEffect(() => {
    if (sessionId && screeningSessions) {
      const session = screeningSessions.find(
        (session) => session.screeningSessionId === sessionId
      );
      if (session) {
        setSelectedSession(session);
        setHasStartedAssessment(true);
      }
    }
  }, [sessionId, screeningSessions]);

  // Separate sessions by status
  const { inProgressSession, completedSessions } = useMemo(() => {
    if (!screeningSessions) {
      return { inProgressSession: null, completedSessions: [] };
    }

    const inProgress = screeningSessions.find(
      (session) => session.status === "in_progress"
    );
    const completed = screeningSessions.filter(
      (session) => session.status === "completed"
    );

    return {
      inProgressSession: inProgress || null,
      completedSessions: completed,
    };
  }, [screeningSessions]);

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
                key={inProgressSession.screeningSessionId}
                progress={inProgressSession.completionPercentage}
                status={inProgressSession.status}
                startedAt={inProgressSession.startedAt}
                currentPosition={inProgressSession.currentPosition - 1}
                completionPercentage={inProgressSession.completionPercentage}
                handleViewSession={() => setSelectedSession(inProgressSession)}
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
                  key={session.screeningSessionId}
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
                  handleViewSession={() => setSelectedSession(session)}
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
