import React, {
  useMemo,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Navigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle, ButtonWithIcon } from "@USupport-components-library/src";
import { countrySvc, clientSvc } from "@USupport-components-library/services";

import { useGetProvidersData, useError } from "#hooks";
import { FilterProviders } from "#backdrops";
import { RootContext } from "#routes";
import { Page, SelectProvider as SelectProviderBlock } from "#blocks";

import "./select-provider.scss";

const fetchCountry = async () => {
  const { data } = await countrySvc.getActiveCountries();
  const currentCountryId = localStorage.getItem("country_id");
  const currentCountry = data.find((x) => x.country_id === currentCountryId);
  return currentCountry?.alpha2 === "KZ" ? true : false;
};

/**
 * SelectProvider
 *
 * SelectProvider page
 *
 * @returns {JSX.Element}
 */
export const SelectProvider = () => {
  const { t } = useTranslation("pages", { keyPrefix: "select-provider-page" });
  const { width } = useWindowDimensions();
  const [searchParams] = useSearchParams();
  const urlCoupon = searchParams.get("coupon")?.trim() || null;

  const { isTmpUser, activeCoupon, setActiveCoupon, selectedCountry } =
    useContext(RootContext);

  const { data: isKzCountry } = useQuery(["country-min-price"], fetchCountry);

  // Validate URL coupon if present (takes priority over country default when valid)
  const urlCouponQuery = useQuery(
    ["url-coupon", urlCoupon],
    () => clientSvc.checkIsCouponAvailable(urlCoupon).then((res) => res.data),
    { enabled: !!urlCoupon, retry: false }
  );
  // Determine the default billing type based on country settings (or URL coupon)
  const getDefaultBillingType = useCallback(() => {
    if (!selectedCountry) return null;

    const {
      hasPayments,
      hasCoupons,
      hasFreeConsultations,
      defaultBillingType,
    } = selectedCountry;

    // If URL has a coupon param, show the coupon tab (so user sees the coupon form)
    if (urlCoupon && hasCoupons) return "coupon";

    // If defaultBillingType is set and the corresponding option is available, use it
    if (defaultBillingType) {
      if (defaultBillingType === "paid" && hasPayments) return "paid";
      if (defaultBillingType === "coupon" && hasCoupons) return "coupon";
      if (defaultBillingType === "free" && hasFreeConsultations) return "free";
    }

    // Fallback to first available option
    if (hasPayments) return "paid";
    if (hasCoupons) return "coupon";
    if (hasFreeConsultations) return "free";

    return null;
  }, [selectedCountry, urlCoupon]);

  const [selectedBillingType, setSelectedBillingType] = useState(null);

  // Set default billing type when country is loaded (coupon tab when ?coupon= is in URL)
  useEffect(() => {
    if (!selectedCountry || selectedBillingType !== null) return;
    const defaultType = getDefaultBillingType();
    if (defaultType) setSelectedBillingType(defaultType);
  }, [selectedCountry, getDefaultBillingType, selectedBillingType]);

  useEffect(() => {
    if (selectedBillingType !== "coupon") {
      setActiveCoupon(null);
    }
  }, [selectedBillingType, setActiveCoupon]);

  const defaultCouponCode = selectedCountry?.defaultCouponCode;
  const defaultCouponQuery = useQuery(
    ["default-coupon", defaultCouponCode],
    () =>
      clientSvc
        .checkIsCouponAvailable(defaultCouponCode)
        .then((res) => res.data),
    { enabled: !!defaultCouponCode && !urlCoupon }
  );

  const safeUrlCouponError = urlCouponQuery.error ?? {
    response: { data: { error: { message: null } } },
  };

  const urlCouponErrorData = useError(safeUrlCouponError);
  const [urlCouponErrorDismissed, setUrlCouponErrorDismissed] = useState(false);
  const urlCouponErrorMessage =
    !urlCouponErrorDismissed &&
    urlCoupon &&
    urlCouponQuery.isFetched &&
    !urlCouponQuery.data?.campaign_id
      ? urlCouponErrorData?.message || t("coupon_not_found_error")
      : null;

  useEffect(() => {
    setUrlCouponErrorDismissed(false);
  }, [urlCoupon]);

  // On coupon tab: apply URL coupon if valid; if URL coupon invalid, clear activeCoupon so input shows URL coupon.
  // Only use country default when there is no URL coupon.
  useEffect(() => {
    if (selectedBillingType !== "coupon") return;
    setActiveCoupon((current) => {
      if (urlCoupon) {
        if (urlCouponQuery.data?.campaign_id) {
          return {
            couponValue: urlCoupon,
            campaignId: urlCouponQuery.data.campaign_id,
          };
        }
        if (urlCouponQuery.isFetched) return null; // URL coupon invalid – clear so input shows urlCoupon only
        return current; // still validating
      }
      if (current) return current; // no URL coupon – keep user's choice
      if (defaultCouponCode && defaultCouponQuery.data?.campaign_id) {
        return {
          couponValue: defaultCouponCode,
          campaignId: defaultCouponQuery.data.campaign_id,
        };
      }
      return current;
    });
  }, [
    selectedBillingType,
    defaultCouponCode,
    defaultCouponQuery.data,
    urlCoupon,
    urlCouponQuery.data,
    urlCouponQuery.isFetched,
    setActiveCoupon,
  ]);

  // Don't apply coupon if not on coupon tab
  const effectiveActiveCoupon =
    selectedBillingType === "coupon" ? activeCoupon : null;

  if (isTmpUser)
    return (
      <Navigate to={`/client/${localStorage.getItem("language")}/dashboard`} />
    );

  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const initialFilters = useMemo(() => {
    return {
      providerTypes: [],
      providerSex: [],
      maxPrice: "",
      language: null,
      onlyFreeConsultation: isKzCountry || false,
      availableAfter: "",
      availableBefore: "",
    };
  }, [isKzCountry]);

  const [allFilters, setAllFilters] = useState({
    ...initialFilters,
  });

  useEffect(() => {
    if (isKzCountry) {
      setAllFilters((prev) => ({
        ...prev,
        onlyFreeConsultation: true,
      }));
    }
  }, [isKzCountry]);

  // Set this to true when the filters have been changed and set
  // it back to false when the providers data has been fetched
  const [isFiltering, setIsFiltering] = useState(false);

  const onSuccess = () => {
    setIsFiltering(false);
  };
  const providersQuery = useGetProvidersData(
    effectiveActiveCoupon,
    allFilters,
    onSuccess,
    selectedBillingType
  );
  const [providersData, setProvidersData] = useState();

  useEffect(() => {
    if (providersQuery.data) {
      setProvidersData(providersQuery.data.pages.flat());
    }
  }, [providersQuery.data]);

  const closeFilter = () => setIsFilterOpen(false);
  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const handleFilterSave = (data) => {
    setIsFiltering(true);

    setAllFilters((prev) => ({ ...prev, ...data }));

    closeFilter();
  };

  const providerLanguages = providersQuery.data?.pages
    .flat()
    .map((x) => x.languages)
    .flat()
    ?.reduce((acc, curr) => {
      if (!acc.some((y) => y.language_id === curr.language_id)) {
        acc.push(curr);
      }
      return acc;
    }, []);

  return (
    <Page
      classes="page__select-provider"
      heading={
        effectiveActiveCoupon
          ? t("heading_with_coupon", {
              coupon: effectiveActiveCoupon.couponValue,
            })
          : t("heading")
      }
      // subheading={t("subheading")}
      showHeadingButtonBelow={width < 768 ? true : false}
      headingButton={
        width < 768 ? null : (
          <div className="page__select-provider__buttons">
            <ButtonWithIcon
              label={t("button_label")}
              iconName="filter"
              iconColor="#ffffff"
              iconSize="sm"
              color="purple"
              size="sm"
              onClick={handleFilterClick}
            />
          </div>
        )
      }
    >
      <SelectProviderBlock
        providers={providersData}
        activeCoupon={effectiveActiveCoupon}
        setActiveCoupon={setActiveCoupon}
        urlCoupon={urlCoupon}
        urlCouponErrorMessage={urlCouponErrorMessage}
        onRemoveCoupon={() => setUrlCouponErrorDismissed(true)}
        isLoading={providersQuery.isFetching}
        providersQuery={providersQuery}
        isFiltering={isFiltering}
        selectedBillingType={selectedBillingType}
        setSelectedBillingType={setSelectedBillingType}
        width={width}
      />

      {width < 768 && <RadialCircle color="purple" />}

      <FilterProviders
        isOpen={isFilterOpen}
        onClose={(data) => handleFilterSave(data)}
        allFilters={allFilters}
        setAllFilters={setAllFilters}
        isToggleDisabled={isKzCountry}
        languages={providerLanguages}
        initialFilters={initialFilters}
      />
    </Page>
  );
};
