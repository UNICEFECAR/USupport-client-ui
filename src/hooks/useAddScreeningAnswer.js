import { useMutation } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";

export function useAddScreeningAnswer() {
  /**
   * Submit a screening answer
   * @param {Object} payload - The answer data
   * @param {string} payload.questionId - The question ID
   * @param {number} payload.answerValue - The answer value (1-5)
   * @param {number} payload.currentPosition - The current position of the question
   * @param {string} [payload.screeningSessionId] - Optional screening session ID
   * @returns {Promise} Promise resolving to response data
   */
  const addScreeningAnswer = async (payload) => {
    const { data } = await clientSvc.addScreeningAnswer(payload);
    return data;
  };

  const addScreeningAnswerMutation = useMutation(addScreeningAnswer, {
    onError: (error) => {
      console.error("Error adding screening answer:", error);
    },
  });

  return addScreeningAnswerMutation;
}
