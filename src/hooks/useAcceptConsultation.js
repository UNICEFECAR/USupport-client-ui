import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { providerSvc } from "@USupport-components-library/services";
import { useError } from "./useError";

export default function useAcceptConsultation(onSuccess, onError) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const acceptConsultation = async ({ consultationId, price }) => {
    if (price && price > 0) {
      navigate(`/checkout`, { state: { consultationId: consultationId } });
      return false;
    } else {
      const res = await providerSvc.acceptConsultation(consultationId);
      return res;
    }
  };
  const acceptConsultationMutation = useMutation(acceptConsultation, {
    onSuccess: (data) => {
      if (data?.status === 200) {
        onSuccess();
        queryClient.invalidateQueries({ queryKey: ["all-consultations"] });
      }
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      onError(errorMessage);
    },
  });
  return acceptConsultationMutation;
}

export { useAcceptConsultation };
