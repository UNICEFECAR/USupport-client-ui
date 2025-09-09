import { useQuery } from "@tanstack/react-query";

import { clientSvc } from "@USupport-components-library/services";

export function useGetClientAnswersForBaselineAssessmentById(
  assessmentId,
  enabled = true
) {
  /**
   * Fetch client answers for a specific baseline assessment
   * @param {string} assessmentId - The assessment ID to fetch answers for
   * @returns {Object} React Query object with assessment answers data
   */
  const getClientAnswersForBaselineAssessmentById = async () => {
    if (!assessmentId) return [];
    const { data } = await clientSvc.getClientAnswersForBaselineAssessmentById(
      assessmentId
    );
    return data;
  };

  const getClientAnswersForBaselineAssessmentByIdQuery = useQuery(
    ["getClientAnswersForBaselineAssessmentById", assessmentId],
    getClientAnswersForBaselineAssessmentById,
    {
      enabled: enabled && !!assessmentId,
    }
  );

  return getClientAnswersForBaselineAssessmentByIdQuery;
}
