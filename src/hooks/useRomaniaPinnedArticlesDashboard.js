import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { cmsSvc, adminSvc } from "@USupport-components-library/services";

/**
 * CMS `find` rewrites requested ids to the locale-specific Strapi id
 * (`meta.availableLocales` is `{ [anyFamilyId]: { en, ro, ... } }`).
 * Pin order stays on the canonical id; the row we render is the localized one.
 *
 * @param {object[]} rows
 * @param {string[]} canonicalIds
 * @param {Record<string, Record<string, number|string>>} availableLocales
 * @param {string} locale
 */
export function orderPinnedArticlesByCanonicalId(
  rows,
  canonicalIds,
  availableLocales,
  locale,
) {
  const byId = new Map((rows || []).map((entry) => [String(entry.id), entry]));
  if (!byId.size) return [];

  const ordered = canonicalIds
    .map((canonicalId) => {
      const localeMap = availableLocales?.[String(canonicalId)];
      if (localeMap && typeof localeMap === "object") {
        const localizedId = localeMap[locale] ?? localeMap.en;
        if (localizedId != null) {
          const localized = byId.get(String(localizedId));
          if (localized) return localized;
        }
      }
      return byId.get(String(canonicalId));
    })
    .filter(Boolean);

  return ordered.length ? ordered : [...byId.values()];
}

/**
 * Romanian dashboard: `pinned_articles` and `article_ids` share the same canonical Strapi IDs
 * (see country admin assigns/pins). We intersect in order of the pin list, then hydrate from CMS.
 *
 * @param {object} options
 * @param {string | null | undefined} options.country — raw `localStorage` country (stable query key fragment)
 * @param {boolean} options.IS_RO
 * @param {string} options.usersLanguage
 * @param {import("@tanstack/react-query").UseQueryResult} options.articleIdsQuerry
 * @param {boolean} options.dashboardArticleSourcesReadyForPinnedCms
 */
export function useRomaniaPinnedArticlesDashboard({
  country,
  IS_RO,
  usersLanguage,
  articleIdsQuerry,
  dashboardArticleSourcesReadyForPinnedCms,
}) {
  const pinnedArticleStrapiIdsQuery = useQuery(
    ["clientDashboardPinnedArticleStrapiIds", country],
    () => adminSvc.getPinnedArticles(),
    { enabled: IS_RO, refetchOnWindowFocus: false },
  );

  const adminPinnedArticleIdsUnique = useMemo(() => {
    if (!IS_RO || !Array.isArray(pinnedArticleStrapiIdsQuery.data)) return [];
    return [
      ...new Set(
        pinnedArticleStrapiIdsQuery.data.map((id) => String(id).trim()),
      ),
    ].filter(Boolean);
  }, [IS_RO, pinnedArticleStrapiIdsQuery.data]);

  const romaniaPinnedIdsLoading = IS_RO && pinnedArticleStrapiIdsQuery.isLoading;

  const publishedArticleIdSet = useMemo(() => {
    if (!articleIdsQuerry.data?.length) return new Set();
    return new Set(
      articleIdsQuerry.data.map((id) => String(id).trim()).filter(Boolean),
    );
  }, [articleIdsQuerry.data]);

  /** Pinned IDs that exist in country `article_ids`, preserving admin pin order. */
  const orderedPinnedStrapiIdsInPublishedPool = useMemo(() => {
    if (!adminPinnedArticleIdsUnique.length || !publishedArticleIdSet.size) {
      return [];
    }
    return adminPinnedArticleIdsUnique.filter((id) =>
      publishedArticleIdSet.has(String(id)),
    );
  }, [adminPinnedArticleIdsUnique, publishedArticleIdSet]);

  const showRomaniaPinnedArticlesOnly =
    IS_RO &&
    pinnedArticleStrapiIdsQuery.isSuccess &&
    adminPinnedArticleIdsUnique.length > 0;

  const romanianDashboardUsesPinnedLayout =
    showRomaniaPinnedArticlesOnly || romaniaPinnedIdsLoading;

  const pinnedArticlesCmsQuery = useQuery(
    [
      "articlesDashboardPinnedCmsArticles",
      usersLanguage,
      orderedPinnedStrapiIdsInPublishedPool,
    ],
    async () => {
      const ids = orderedPinnedStrapiIdsInPublishedPool;
      if (!ids.length) return [];

      const baseRequest = {
        ids,
        populate: true,
        limit: ids.length,
      };

      const fetchForLocale = async (locale) => {
        const { data } = await cmsSvc.getArticles({ ...baseRequest, locale });
        return {
          rows: data?.data ?? [],
          availableLocales: data?.meta?.availableLocales ?? {},
        };
      };

      let { rows, availableLocales } = await fetchForLocale(usersLanguage);

      if (!rows.length && usersLanguage !== "en") {
        ({ rows, availableLocales } = await fetchForLocale("en"));
      }

      return orderPinnedArticlesByCanonicalId(
        rows,
        ids,
        availableLocales,
        usersLanguage,
      );
    },
    {
      enabled:
        IS_RO &&
        orderedPinnedStrapiIdsInPublishedPool.length > 0 &&
        dashboardArticleSourcesReadyForPinnedCms,
      refetchOnWindowFocus: false,
    },
  );

  return {
    romaniaPinnedIdsLoading,
    orderedPinnedStrapiIdsInPublishedPool,
    showRomaniaPinnedArticlesOnly,
    romanianDashboardUsesPinnedLayout,
    pinnedArticlesCmsQuery,
  };
}
