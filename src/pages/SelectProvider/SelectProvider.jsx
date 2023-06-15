import React, { useContext, useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { useWindowDimensions } from "@USupport-components-library/utils";
import {
  RadialCircle,
  ButtonWithIcon,
  Loading,
  Button,
  Modal,
  Input,
  Toggle,
  Block,
} from "@USupport-components-library/src";
import { clientSvc } from "@USupport-components-library/services";

import { useGetProvidersData, useError } from "#hooks";
import { FilterProviders } from "#backdrops";
import { RootContext } from "#routes";
import { Page, SelectProvider as SelectProviderBlock } from "#blocks";

import "./select-provider.scss";

/**
 * SelectProvider
 *
 * SelectProvider page
 *
 * @returns {JSX.Element}
 */
export const SelectProvider = () => {
  const { t } = useTranslation("select-provider-page");
  const { width } = useWindowDimensions();

  const { isTmpUser, activeCoupon, setActiveCoupon } = useContext(RootContext);

  if (isTmpUser) return <Navigate to="/dashboard" />;

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponValue, setCouponValue] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sharedFilters, setSharedFilters] = useState({
    maxPrice: "",
    onlyFreeConsultation: false,
  });

  const [providersDataQuery, providersData, setProvidersData] =
    useGetProvidersData(activeCoupon);

  const closeFilter = () => setIsFilterOpen(false);
  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const checkProviderHasType = (provider, types) => {
    return types
      .map((x) => {
        return provider.specializations.includes(x);
      })
      .some((x) => x === true);
  };

  const handleFilterSave = (data) => {
    const {
      providerTypes,
      providerSex,
      maxPrice,
      language,
      onlyFreeConsultation,
      availableAfter,
      availableBefore,
    } = data;
    setSharedFilters({
      maxPrice,
      onlyFreeConsultation,
    });
    const initialData = JSON.parse(
      JSON.stringify(providersDataQuery.data || [])
    );
    const filteredData = [];
    for (let i = 0; i < initialData.length; i++) {
      const provider = initialData[i];
      const hasType =
        !providerTypes || providerTypes.length === 0
          ? true
          : checkProviderHasType(provider, providerTypes);

      const isDesiredSex =
        !providerSex || providerSex.length === 0
          ? true
          : providerSex.includes(provider.sex);

      const isPriceMatching =
        maxPrice === ""
          ? true
          : provider.consultationPrice <= Number(maxPrice)
          ? true
          : false;

      const providerLanguages = provider.languages.map((x) => x.language_id);
      const providerHasLanguage = !language
        ? true
        : providerLanguages.includes(language);

      const providesFreeConsultation = !onlyFreeConsultation
        ? true
        : provider.consultationPrice === 0 || !provider.consultationPrice;

      const isAvailableAfter = !availableAfter
        ? true
        : new Date(new Date(availableAfter).setHours(0, 0, 0, 0)).getTime() <=
          new Date(provider.earliestAvailableSlot).getTime();

      const isAvailableBefore = !availableBefore
        ? true
        : new Date(availableBefore).getTime() >=
          new Date(
            new Date(provider.earliestAvailableSlot).setHours(0, 0, 0, 0)
          ).getTime();

      if (
        hasType &&
        isDesiredSex &&
        isPriceMatching &&
        providerHasLanguage &&
        providesFreeConsultation &&
        isAvailableAfter &&
        isAvailableBefore
      ) {
        filteredData.push(provider);
      }
    }
    setProvidersData(filteredData);
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
      }
    } catch (err) {
      const { message: errorMessage } = useError(err);
      setCouponError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            size="xs"
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
        sharedFilters={sharedFilters}
      />
      {(providersDataQuery.isLoading && !providersData) ||
      providersDataQuery.isFetching ? (
        <Loading size="lg" />
      ) : (
        <SelectProviderBlock
          providers={providersData}
          activeCoupon={activeCoupon}
          isLoading={providersDataQuery.isFetching}
        />
      )}
      {width < 768 && <RadialCircle color="purple" />}

      <FilterProviders
        isOpen={isFilterOpen}
        onClose={(data) => handleFilterSave(data)}
        sharedFilters={sharedFilters}
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
  sharedFilters,
  t,
}) => {
  const [data, setData] = useState({
    maxPrice: "",
    onlyFreeConsultation: false,
  });

  useEffect(() => {
    setData({ ...sharedFilters });
  }, [sharedFilters]);

  const handleChange = (field, val) => {
    const newData = { ...data };
    newData[field] = val;
    setData(newData);
    handleSave(newData);
  };

  return (
    <Block classes="page__select-provider__filters-block">
      <Input
        type="number"
        label={t("max_price")}
        placeholder={t("max_price")}
        value={data.maxPrice}
        onChange={(e) => handleChange("maxPrice", e.target.value)}
      />
      <Toggle
        isToggled={data.onlyFreeConsultation}
        setParentState={(val) => handleChange("onlyFreeConsultation", val)}
        label={t("providers_free_consultation_label")}
      />
      <Button
        label={
          activeCoupon ? t("remove_coupon_label") : t("button_coupon_label")
        }
        size="sm"
        color="green"
        onClick={activeCoupon ? removeCoupon : openCouponModal}
      />
    </Block>
  );
};
