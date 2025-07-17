import { useMutation } from "@tanstack/react-query";

import { clientSvc } from "@USupport-components-library/services";

export function useCreateScreeningSession() {
  const createScreeningSession = async () => {
    const { data } = await clientSvc.createScreeningSession();
    return data;
  };

  const createScreeningSessionMutation = useMutation(createScreeningSession);

  return createScreeningSessionMutation;
}
