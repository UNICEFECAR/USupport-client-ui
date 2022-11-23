import { useMutation } from "@tanstack/react-query";
import { providerSvc } from "@USupport-components-library/services";
import { useError } from "./useError";

export default function useCancelConsultation(onSuccess, onError) {
  const cancelConsultation = async (
    consultationId = "de817c73-297a-4a5a-8430-5de4ba767804"
  ) => {
    const res = await providerSvc.cancelConsultation(consultationId);
    return res;
  };

  const cancelConsultationMutation = useMutation(cancelConsultation, {
    onSuccess,
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      onError(errorMessage);
    },
  });

  return cancelConsultationMutation;
}

export { useCancelConsultation };
