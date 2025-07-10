import { useMutation } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";

export const useSendPlatformSuggestion = (onError, onSuccess) => {
  return useMutation({
    mutationFn: clientSvc.sendPlatformSuggestion,
    onError,
    onSuccess,
  });
};
