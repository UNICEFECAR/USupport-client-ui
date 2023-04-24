import { useMutation } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";
import useError from "./useError";

export default function useAddQuestion(onSuccess, onError, onMutate) {
  /**
   *
   * @param {Object} data - containing the "mood" and "comment" fields
   * @returns
   */
  const addQuestion = async (question) => {
    const response = await clientSvc.addQuestion(question);
    return response.data;
  };

  const addQuestionMutation = useMutation(addQuestion, {
    onMutate,
    onSuccess,
    onError: (error, variables, rollback) => {
      const { message: errorMessage } = useError(error);
      onError(errorMessage, variables, rollback);
    },
  });

  return addQuestionMutation;
}

export { useAddQuestion };
