import { useQuery } from "@tanstack/react-query";
import { providerSvc } from "@USupport-components-library/services";

export function useGetQuestionsTags(languageId, onSuccess) {
  const getQuestionsTags = async () => {
    const { data } = await providerSvc.getQuestionTags(languageId);
    return data.map((item) => {
      return { label: item.tag, id: item.tag_id };
    });
  };

  const getQuestionsTagsQuery = useQuery(
    ["getQuestionsTags", languageId],
    getQuestionsTags,
    {
      onSuccess,
      enabled: !!languageId,
    }
  );

  return getQuestionsTagsQuery;
}
