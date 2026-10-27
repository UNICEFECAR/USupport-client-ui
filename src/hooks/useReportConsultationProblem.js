import { providerSvc } from "@USupport-components-library/services";
import { useMutation } from "@tanstack/react-query";
import { useError } from "./useError";

export const useReportConsultationProblem = (
  onSuccess = () => {},
  onError = () => {}
) => {
  const reportConsultationProblem = async (data) => {
    const response = await providerSvc.submitProblemReport(data);
    return response.data;
  };

  return useMutation(reportConsultationProblem, {
    onSuccess,
    onError: (error) => {
      const message = error.response?.data?.error
        ? useError(error).message
        : error.message;
      onError(message);
    },
  });
};
