import { useInfiniteQuery } from "@tanstack/react-query";
import { providerSvc } from "@USupport-components-library/services";
import {
  getStartAndEndOfWeek,
  getTimestampFromUTC,
} from "@USupport-components-library/utils";

const constructFiltersQueryString = (filters, billingType) => {
  const providerTypes = filters.providerTypes?.join(",");
  const sex = filters.providerSex?.join(",");
  const language = filters.language;
  const maxPrice = filters.maxPrice;
  const onlyFreeConsultation = filters.onlyFreeConsultation;
  const availableAfter = new Date(filters.availableAfter).getTime() / 1000;
  const availableBefore = new Date(filters.availableBefore).getTime() / 1000;
  const startDate = filters.startDate;

  let queryString = "";
  if (providerTypes) {
    queryString += `&providerTypes=${providerTypes}`;
  }

  if (sex) {
    queryString += `&sex=${sex}`;
  }

  if (maxPrice) {
    queryString += `&maxPrice=${maxPrice}`;
  }

  if (availableAfter) {
    queryString += `&availableAfter=${availableAfter}`;
  } else {
    queryString += `&availableAfter=${new Date().getTime() / 1000}`;
  }

  if (availableBefore) {
    queryString += `&availableBefore=${availableBefore}`;
  }

  if (onlyFreeConsultation) {
    queryString += `&onlyFreeConsultation=${true}`;
  }

  if (language) {
    queryString += `&language=${language}`;
  }

  if (startDate) {
    queryString += `&startDate=${startDate}`;
  }

  if (billingType) {
    queryString += `&billingType=${billingType}`;
  }

  return queryString || "";
};

/**
 * Reuseable hook to get and transform the client data in a desired format
 */
export default function useGetProvidersData(
  activeCoupon = null,
  filters,
  onSuccess = () => {},
  billingType = null
) {
  const fetchProvidersData = async ({ pageParam = 1 }) => {
    const today = new Date();
    const { first } = getStartAndEndOfWeek(today);
    const startDate = getTimestampFromUTC(first);

    const providersLimit = 15;
    const filtersQueryString = constructFiltersQueryString(
      {
        ...filters,
        startDate,
      },
      billingType
    );

    const { data } = await providerSvc.getAllProviders({
      campaignId: activeCoupon?.campaignId,
      limit: providersLimit,
      offset: pageParam,
      filtersQueryString,
    });
    const formattedData = [];
    for (let i = 0; i < data.length; i++) {
      const providerData = data[i];
      const formattedProvider = {
        providerDetailId: providerData.provider_detail_id || "",
        name: providerData.name || "",
        patronym: providerData.patronym || "",
        surname: providerData.surname || "",
        nickname: providerData.nickname || "",
        image: providerData.image || "default",
        specializations: providerData.specializations || [],
        education: providerData.education || [],
        sex: providerData.sex || "",
        consultationPrice: providerData.consultation_price || 0,
        description: providerData.description || "",
        languages: providerData.languages || [],
        workWith: providerData.work_with || [],
        totalConsultations: providerData.total_consultations || 0,
        earliestAvailableSlot: providerData.earliest_available_slot || "",
        latestAvailableSlot: providerData.latest_available_slot || "",
        couponPrice: providerData.price_per_coupon || 0,
      };
      formattedData.push(formattedProvider);
    }
    // Return only the providers that have available slot
    return formattedData.filter((x) => x.earliestAvailableSlot);
  };
  // Determine if the query should be enabled
  // For coupon billing type, only fetch if there's an active coupon
  // For other billing types, always fetch
  const isEnabled = (() => {
    if (!billingType) return false;
    if (billingType === "coupon") {
      return !!activeCoupon;
    }
    return true;
  })();

  const providersDataQuery = useInfiniteQuery(
    ["all-providers-data", activeCoupon, filters, billingType],
    fetchProvidersData,
    {
      getNextPageParam: (lastPage, pages) => {
        if (lastPage.length === 0) {
          return undefined;
        }
        return pages.length + 1;
      },
      onSuccess: () => {
        onSuccess();
      },
      enabled: isEnabled,
    }
  );
  return providersDataQuery;
}

export { useGetProvidersData };
