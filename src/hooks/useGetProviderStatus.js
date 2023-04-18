import { useQuery } from "@tanstack/react-query";
import { providerSvc } from "@USupport-components-library/services";

export default function useGetProviderStatus(providerId) {
  console.log(providerId);
  const fetchProviderStatus = async () => {
    const { data } = await providerSvc.getProviderStatusById(providerId);
    return data;
  };

  const providerStatusQuery = useQuery(
    ["provider-status"],
    fetchProviderStatus,
    {
      enabled: !!providerId,
    }
  );

  return providerStatusQuery;
}

export { useGetProviderStatus };
