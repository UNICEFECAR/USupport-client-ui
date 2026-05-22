import { useQuery } from "@tanstack/react-query";

import { adminSvc } from "@USupport-components-library/services";

/**
 * Country-published Strapi article id list (`GET admin/country/articles`) for dashboard logic.
 *
 * @param {object} options
 * @param {unknown} options.selectedAgeGroupId — participates in react-query cache key only
 * @param {string} options.usersLanguage
 * @param {(ids: unknown[]) => void} options.setArticleIdsForRatings — side effect retained from legacy Dashboard (en preload for ratings query)
 */
export function useArticlesDashboardCountryArticleIds({
  selectedAgeGroupId,
  usersLanguage,
  setArticleIdsForRatings,
}) {
  const getArticlesIds = async () => {
    const articlesIds = await adminSvc.getArticles();
    if (usersLanguage === "en") {
      setArticleIdsForRatings(articlesIds);
    }
    return articlesIds;
  };

  return useQuery(["articleIds", selectedAgeGroupId], getArticlesIds);
}
