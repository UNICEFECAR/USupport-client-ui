import { useMutation } from "@tanstack/react-query";

import { userSvc } from "@USupport-components-library/services";
import useError from "./useError";

export const useAddContentRating = (onMutate, onError) => {
  const addContentRating = async (payload) => {
    const { data } = await userSvc.addContentRating(payload);
    return data;
  };

  const { mutate: addContentRatingMutation } = useMutation({
    mutationFn: addContentRating,
    onMutate,
    onError: (error, _, rollback) => {
      const { message: errorMessage } = useError(error);
      onError(errorMessage, rollback);
    },
  });

  return addContentRatingMutation;
};
