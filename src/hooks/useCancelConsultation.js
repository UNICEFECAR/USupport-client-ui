import { useMutation } from "@tanstack/react-query";
import {
  providerSvc,
  paymentsSvc,
} from "@USupport-components-library/services";
import { useError } from "./useError";

export default function useCancelConsultation(onSuccess, onError) {
  const cancelConsultation = async ({
    consultationId,
    price,
    shouldRefund,
  }) => {
    if (price > 0 && shouldRefund) {
      await paymentsSvc.refund(consultationId);
    } else {
      console.log("no refund");
      await providerSvc.cancelConsultation(consultationId);
    }
    return true;
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
