import { useMutation } from "@tanstack/react-query";

import { userSvc } from "@USupport-components-library/services";
import useError from "./useError";

export const useAddContentRating = (onMutate, onError, onSuccess) => {
  const addContentRating = async (payload) => {
    const { data } = await userSvc.addContentRating(payload);
    return { ...data, ...payload };
  };

  const { mutate: addContentRatingMutation } = useMutation({
    mutationFn: addContentRating,
    onMutate,
    onError: (error, _, rollback) => {
      const { message: errorMessage } = useError(error);
      onError(errorMessage, rollback);
    },
    onSuccess,
  });

  return addContentRatingMutation;
};
