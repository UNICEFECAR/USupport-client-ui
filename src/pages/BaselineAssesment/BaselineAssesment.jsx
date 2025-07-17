import { useState } from "react";
import { useTranslation } from "react-i18next";

import { Page, BaselineAssesment as BaselineAssesmentBlock } from "#blocks";
import { useGetScreeningSessions } from "#hooks";

import { BaselineAssesmentBox } from "@USupport-components-library/src";

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
  const { data: screeningSessions } = useGetScreeningSessions();

  const [selectedSession, setSelectedSession] = useState(null);
  const [hasStartedAssessment, setHasStartedAssessment] = useState(false);

  return (
    <Page classes="page__baseline-assesment">
      <BaselineAssesmentBlock
        selectedSession={selectedSession}
        setSelectedSession={setSelectedSession}
        setHasStartedAssessment={setHasStartedAssessment}
      />
      <div className="page__baseline-assesment__sessions">
        {selectedSession || hasStartedAssessment
          ? null
          : screeningSessions?.map((session) => (
              <BaselineAssesmentBox
                key={session.screeningSessionId}
                progress={session.completionPercentage}
                status={session.status}
                startedAt={session.startedAt}
                currentPosition={session.currentPosition - 1}
                completionPercentage={session.completionPercentage}
                handleViewSession={() => setSelectedSession(session)}
                t={t}
              />
            ))}
      </div>
    </Page>
  );
};
