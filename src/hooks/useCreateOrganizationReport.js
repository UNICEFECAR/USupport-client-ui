import { useMutation } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";
import { useError } from "./useError";

export default function useCreateOrganizationReport(onSuccess, onError) {
  const submitReport = async ({ organizationId, reason }) => {
    return await clientSvc.createOrganizationReport(organizationId, {
      reason: reason ?? "",
    });
  };

  return useMutation({
    mutationFn: submitReport,
    mutationKey: ["create-organization-report"],
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      onError?.(errorMessage);
    },
  });
}

export { useCreateOrganizationReport };
