import { useQuery } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";

export function useGetClientQuestions(enabled, languageId) {
  /**
   *
   * @returns
   */
  const getClientQuestions = async () => {
    const { data } = await clientSvc.getClientQuestions(languageId);
    return data.map((question) => {
      const questionProviderData = question.providerData || {};
      return {
        answerId: question.answer_id,
        answerText: question.answer_text,
        answerTitle: question.answer_title,
        answerCreatedAt: question.answer_created_at,
        dislikes: question.dislikes,
        likes: question.likes,
        providerData: {
          providerId: questionProviderData?.provider_detail_id,
          ...questionProviderData,
        },
        providerDetailId: question.provider_detail_id,
        question: question.question,
        questionCreatedAt: question.question_created_at,
        tags: question.tags,
        isAskedByCurrentClient: true,
      };
    });
  };

  const getClientQuestionsQuery = useQuery(
    ["getClientQuestions", languageId],
    getClientQuestions,
    { enabled: !!enabled && !!languageId, onError: console.error }
  );

  return getClientQuestionsQuery;
}
