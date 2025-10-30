import { useQuery } from "@tanstack/react-query";
import { userSvc } from "@USupport-components-library/services";

export const useGetOrganizationKey = (platform = "web") => {
  return useQuery(["organizations_key", platform], async () => {
    const response = await userSvc.getOrganizationKey(platform);

    return response.data.organizationsKey;
  });
};
