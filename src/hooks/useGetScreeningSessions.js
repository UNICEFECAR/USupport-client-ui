import { useQuery } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";

export const useGetScreeningSessions = () => {
  return useQuery({
    queryKey: ["screening-sessions"],
    queryFn: async () => {
      const response = await clientSvc.getScreeningSessions();
      return response.data;
    },
  });
};
