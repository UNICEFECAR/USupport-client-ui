import React, { useMemo, useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { useWindowDimensions } from "@USupport-components-library/utils";
import {
  RadialCircle,
  ButtonWithIcon,
  Button,
  Modal,
  Input,
  Block,
} from "@USupport-components-library/src";
import { clientSvc, countrySvc } from "@USupport-components-library/services";

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

const POLAND_COUPON = {
  couponValue: "UNICEF2025",
  campaignId: "f035657b-daa7-417a-9784-959b042473e7",
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

  const { isTmpUser, activeCoupon, setActiveCoupon } = useContext(RootContext);

  const country = localStorage.getItem("country");
  const IS_PL = country === "PL";

  const { data: isKzCountry } = useQuery(["country-min-price"], fetchCountry);

  if (isTmpUser)
    return (
      <Navigate to={`/client/${localStorage.getItem("language")}/dashboard`} />
    );

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponValue, setCouponValue] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    const isStaging = window.location.hostname.includes("staging");
    // || window.location.hostname.includes("localhost");
    if (IS_PL && !isStaging) {
      setCouponValue("UNICEF2025");
      setActiveCoupon(POLAND_COUPON);
    }
  }, [IS_PL]);

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
    activeCoupon,
    allFilters,
    onSuccess
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

  const openCouponModal = () => setIsCouponModalOpen(true);
  const closeCouponModal = () => setIsCouponModalOpen(false);

  const removeCoupon = () => {
    setActiveCoupon(null);
  };

  const handleSubmitCoupon = async () => {
    setIsLoading(true);
    try {
      const { data } = await clientSvc.checkIsCouponAvailable(couponValue);

      if (data?.campaign_id) {
        setActiveCoupon({
          couponValue,
          campaignId: data.campaign_id,
        });
        closeCouponModal();
        setCouponError("");
      }
    } catch (err) {
      const { message: errorMessage } = useError(err);
      setCouponError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
        activeCoupon
          ? t("heading_with_coupon", { coupon: activeCoupon.couponValue })
          : t("heading")
      }
      subheading={t("subheading")}
      showHeadingButtonBelow={width < 768 ? true : false}
      headingButton={
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
      }
    >
      <FiltersBlock
        handleSave={handleFilterSave}
        t={t}
        activeCoupon={activeCoupon}
        removeCoupon={removeCoupon}
        openCouponModal={openCouponModal}
        allFilters={allFilters}
        setAllFilters={setAllFilters}
        isFiltering={isFiltering}
        isToggleDisabled={isKzCountry}
        IS_PL={IS_PL}
      />

      <SelectProviderBlock
        providers={providersData}
        activeCoupon={activeCoupon}
        isLoading={providersQuery.isFetching}
        providersQuery={providersQuery}
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
      <Modal
        isOpen={isCouponModalOpen}
        closeModal={closeCouponModal}
        heading={t("modal_coupon_heading")}
        ctaLabel={t("modal_coupon_button_label")}
        ctaHandleClick={handleSubmitCoupon}
        isCtaLoading={isLoading}
        errorMessage={couponError}
      >
        <p className="text">{t("coupon_paragraph")}</p>
        <p className="text">{t("coupon_paragraph_two")}</p>
        <div className="page__select-provider__coupon-modal-input">
          <Input
            label={t("modal_coupon_input_label")}
            placeholder={t("modal_coupon_input_placeholder")}
            value={couponValue}
            onChange={(e) => setCouponValue(e.target.value)}
          />
        </div>
      </Modal>
    </Page>
  );
};

const FiltersBlock = ({
  handleSave,
  activeCoupon,
  removeCoupon,
  openCouponModal,
  allFilters,
  setAllFilters,
  isToggleDisabled = false,
  IS_PL,
  t,
}) => {
  const localStorageCountry = localStorage.getItem("country");
  const SHOW_COUPON = localStorageCountry !== "KZ";

  const handleChange = (field, val) => {
    const newData = { ...allFilters };
    newData[field] = val;
    setAllFilters(newData);
    handleSave(newData);
  };

  return (
    <Block classes="page__select-provider__filters-block">
      {/* <Input
        type="number"
        label={t("max_price")}
        placeholder={t("max_price")}
        value={allFilters.maxPrice}
        onChange={(e) => handleChange("maxPrice", e.target.value)}
      /> */}
      {/* <Toggle
        isToggled={allFilters.onlyFreeConsultation}
        setParentState={(val) => handleChange("onlyFreeConsultation", val)}
        label={t("providers_free_consultation_label")}
        isDisabled={isToggleDisabled}
      /> */}
      {SHOW_COUPON && (
        <div className="page__select-provider__filters-block__coupon-note">
          <Button
            label={
              activeCoupon ? t("remove_coupon_label") : t("button_coupon_label")
            }
            size="sm"
            color="green"
            onClick={activeCoupon ? removeCoupon : openCouponModal}
          />
          {IS_PL && <p className="">*{t("coupon_note")}</p>}
        </div>
      )}
    </Block>
  );
};
