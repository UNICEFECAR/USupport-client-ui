import { useQuery } from "@tanstack/react-query";

import { messageSvc } from "@USupport-components-library/services";

export default function useGetChatData(chatId, onSuccess = () => {}) {
  const fetchChatData = async () => {
    const { data } = await messageSvc.getChatData(chatId);
    const formattedData = {
      chatId: data.chat_id,
      clientDetailId: data.client_detail_id,
      providerDetailId: data.provider_detail_id,
      messages: data.messages || [],
    };

    return formattedData;
  };
  const query = useQuery(["chat-data", chatId], fetchChatData, {
    enabled: !!chatId,
    onSuccess,
  });

  return {
    ...query,
    // Disabled queries never fetch; avoid infinite "loading" when chatId is missing
    isLoading: Boolean(chatId) && query.isLoading,
  };
}

export { useGetChatData };
