import { useMutation } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";
import useError from "./useError";

export default function useAddVoteQuestion(onError, onMutate) {
  /**
   *
   * @param {Object} data - containing the "mood" and "comment" fields
   * @returns
   */

  const addVoteQuestion = async ({ answerId, vote }) => {
    const response = await clientSvc.addQuestionVote(answerId, vote);
    return response.data;
  };

  const addVoteQuestionMutation = useMutation(addVoteQuestion, {
    onMutate,
    onError: (error, variables, rollback) => {
      const { message: errorMessage } = useError(error);
      onError(errorMessage, rollback);
    },
  });

  return addVoteQuestionMutation;
}

export { useAddVoteQuestion };
