import { useMutation } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";

export function useAddBaselineAssessmentAnswer() {
  /**
   * Submit a baseline assessment answer
   * @param {Object} payload - The answer data
   * @param {string} payload.questionId - The question ID
   * @param {number} payload.answerValue - The answer value (1-5)
   * @param {number} payload.currentPosition - The current position of the question
   * @param {string} [payload.baselineAssessmentId] - Optional baseline assessment ID
   * @returns {Promise} Promise resolving to response data
   */
  const addBaselineAssessmentAnswer = async (payload) => {
    const { data } = await clientSvc.addBaselineAssessmentAnswer(payload);
    return data;
  };

  const addBaselineAssessmentAnswerMutation = useMutation(
    addBaselineAssessmentAnswer,
    {
      onError: (error) => {
        console.error("Error adding baseline assessment answer:", error);
      },
    }
  );

  return addBaselineAssessmentAnswerMutation;
}
