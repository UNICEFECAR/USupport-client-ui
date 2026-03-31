import { useQuery } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";

export default function useCheckActiveCampaign(enabled = true) {
  const getActiveCampaignStatus = async () => {
    const { data } = await clientSvc.checkActiveCampaign();
    return data?.hasActiveCampaign ?? false;
  };

  const checkActiveCampaignQuery = useQuery({
    queryKey: ["checkActiveCampaign"],
    queryFn: getActiveCampaignStatus,
    enabled: !!enabled,
  });

  return checkActiveCampaignQuery;
}

export { useCheckActiveCampaign };
