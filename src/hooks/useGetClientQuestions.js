import { useQuery } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";

export function useGetClientQuestions(enabled) {
  /**
   *
   * @returns
   */
  const getClientQuestions = async () => {
    const { data } = await clientSvc.getClientQuestions();
    return data;
  };

  const getClientQuestionsQuery = useQuery(
    ["getClientQuestions"],
    getClientQuestions,
    { enabled: !!enabled }
  );

  return getClientQuestionsQuery;
}
