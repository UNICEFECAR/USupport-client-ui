import { useQuery } from "@tanstack/react-query";

import { messageSvc } from "@USupport-components-library/services";

export default function useGetAllChatHistoryData(
  providerDetailId,
  clientDetailId,
  enabled
) {
  const fetchChatData = async () => {
    const { data } = await messageSvc.getAllChatData(
      providerDetailId,
      clientDetailId
    );
    const formattedData = {
      chatId: data.chat_id,
      clientDetailId: data.client_detail_id,
      providerDetailId: data.provider_detail_id,
      messages: data.messages || [],
    };
    return formattedData;
  };
  const query = useQuery(
    ["all-chat-data", providerDetailId, clientDetailId],
    fetchChatData,
    {
      enabled: !!enabled && !!providerDetailId && !!clientDetailId,
    }
  );

  return query;
}

export { useGetAllChatHistoryData };
