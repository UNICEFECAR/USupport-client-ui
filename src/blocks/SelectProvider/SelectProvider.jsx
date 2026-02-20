import React, { useContext, useMemo, useState, useEffect } from "react";
import { useCustomNavigate as useNavigate, useError } from "#hooks";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  Block,
  Grid,
  GridItem,
  ProviderOverview,
  Loading,
  Tabs,
  Input,
  Button,
  ButtonWithIcon,
} from "@USupport-components-library/src";
import { clientSvc } from "@USupport-components-library/services";

import { RootContext } from "../../routes/Root/Root";

import "./select-provider.scss";

/**
 * SelectProvider
 *
 * SelectProvider block
 *
 * @return {jsx}
 */
export const SelectProvider = ({
  activeCoupon,
  setActiveCoupon,
  urlCoupon,
  urlCouponErrorMessage,
  onRemoveCoupon,
  providersQuery,
  isFiltering,
  selectedBillingType,
  setSelectedBillingType,
}) => {
  const { t } = useTranslation("blocks", { keyPrefix: "select-provider" });
  const tPage = useTranslation("pages", {
    keyPrefix: "select-provider-page",
  }).t;
  const navigate = useNavigate();

  const { selectedCountry } = useContext(RootContext);

  // Coupon input state (urlCoupon from URL takes precedence for display when no active coupon yet)
  const [couponValue, setCouponValue] = useState(
    () =>
      activeCoupon?.couponValue ||
      urlCoupon ||
      selectedCountry?.defaultCouponCode ||
      ""
  );
  const [couponError, setCouponError] = useState("");
  const [isLoadingCoupon, setIsLoadingCoupon] = useState(false);
  const [userRemovedCoupon, setUserRemovedCoupon] = useState(false);

  // Keep input in sync when active coupon, URL coupon, or country default changes (don't restore urlCoupon after user clicked Remove)
  useEffect(() => {
    if (activeCoupon) {
      setUserRemovedCoupon(false);
    }

    const value =
      activeCoupon?.couponValue ??
      (userRemovedCoupon ? "" : urlCoupon) ??
      selectedCountry?.defaultCouponCode ??
      "";
    setCouponValue(value);
  }, [
    activeCoupon?.couponValue,
    urlCoupon,
    selectedCountry?.defaultCouponCode,
    userRemovedCoupon,
  ]);

  // Reset "user removed" when URL coupon changes (e.g. navigated to different link)
  useEffect(() => {
    setUserRemovedCoupon(false);
  }, [urlCoupon]);

  // Build tabs based on country billing options
  const billingTabs = useMemo(() => {
    if (!selectedCountry) return [];

    const tabs = [];
    const { hasPayments, hasCoupons, hasFreeConsultations } = selectedCountry;

    if (hasPayments) {
      tabs.push({
        label: t("tab_paid"),
        value: "paid",
        isSelected: selectedBillingType === "paid",
      });
    }

    if (hasCoupons) {
      tabs.push({
        label: t("tab_coupon"),
        value: "coupon",
        isSelected: selectedBillingType === "coupon",
      });
    }

    if (hasFreeConsultations) {
      tabs.push({
        label: t("tab_free"),
        value: "free",
        isSelected: selectedBillingType === "free",
      });
    }

    return tabs;
  }, [selectedCountry, selectedBillingType, t]);

  const handleTabSelect = (index) => {
    const selectedTab = billingTabs[index];
    if (selectedTab && setSelectedBillingType) {
      setSelectedBillingType(selectedTab.value);
    }
  };

  const handleProviderClick = (provider) => {
    navigate(`/provider-overview?provider-id=${provider.providerDetailId}`);
  };

  const handleSubmitCoupon = async () => {
    setIsLoadingCoupon(true);
    setCouponError("");
    try {
      const { data } = await clientSvc.checkIsCouponAvailable(couponValue);

      if (data?.campaign_id) {
        setActiveCoupon({
          couponValue,
          campaignId: data.campaign_id,
        });
        setCouponError("");
      }
    } catch (err) {
      const { message: errorMessage } = useError(err);
      setActiveCoupon(null);
      setCouponError(errorMessage);
    } finally {
      setIsLoadingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setUserRemovedCoupon(true);
    setActiveCoupon(null);
    setCouponValue("");
    setCouponError("");
    onRemoveCoupon?.();
  };

  const isCouponTabSelected = selectedBillingType === "coupon";

  const providers = providersQuery.data?.pages.flat() || [];

  const renderCouponInput = () => {
    return (
      <div className="select-provider__coupon-section">
        <div className="select-provider__coupon-section__header">
          <p className="text">{tPage("coupon_paragraph")}</p>
          <p className="text">{tPage("coupon_paragraph_two")}</p>
        </div>
        {selectedCountry?.defaultCouponCode && !urlCoupon && (
          <p
            className="small-text"
            style={{ marginTop: "1.2rem", fontSize: "12px", textAlign: "left" }}
          >
            {t("coupon_note")}
          </p>
        )}
        <div className="select-provider__coupon-section__input-container">
          <Input
            label={tPage("modal_coupon_input_label")}
            placeholder={tPage("modal_coupon_input_placeholder")}
            value={couponValue}
            onChange={(e) => {
              const newValue = e.target.value;
              setCouponValue(newValue);
              if (newValue === "" && urlCoupon) {
                setUserRemovedCoupon(true);
                onRemoveCoupon?.();
              }
            }}
            errorMessage={
              activeCoupon ? null : urlCouponErrorMessage || couponError
            }
          />
          <div className="select-provider__coupon-section__buttons">
            <Button
              label={tPage("modal_coupon_button_label")}
              onClick={handleSubmitCoupon}
              loading={isLoadingCoupon}
              disabled={!couponValue || isLoadingCoupon}
              size="md"
            />
            {(activeCoupon || (urlCoupon && !userRemovedCoupon)) && (
              <Button
                label={tPage("remove_coupon_label")}
                onClick={handleRemoveCoupon}
                color="red"
                size="md"
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProviders = () => {
    // If coupon tab is selected but no active coupon, only show the coupon input
    if (isCouponTabSelected && !activeCoupon) {
      return null;
    }

    if ((isFiltering && providersQuery.isFetching) || providersQuery.isLoading)
      return (
        <GridItem classes="select-provider__grid__item-no-match" md={8} lg={12}>
          <Loading />
        </GridItem>
      );
    if (providers?.length === 0)
      return (
        <GridItem classes="select-provider__grid__item-no-match" md={8} lg={12}>
          <p>{t("no_match")}</p>
        </GridItem>
      );
    return providers?.map((provider) => {
      return (
        <GridItem
          md={4}
          lg={6}
          key={provider.providerDetailId}
          classes="select-provider__grid__provider"
        >
          <ProviderOverview
            provider={provider}
            name={provider.name}
            patronym={provider.patronym}
            surname={provider.surname}
            specializations={provider.specializations.map((x) => t(x))}
            price={
              selectedBillingType === "free"
                ? 0
                : activeCoupon
                ? null
                : provider.consultationPrice
            }
            onClick={() => handleProviderClick(provider)}
            image={provider.image}
            freeLabel={selectedBillingType === "free" ? t("free") : t("coupon")}
            earliestAvailableSlot={provider.earliestAvailableSlot}
            t={t}
          />
        </GridItem>
      );
    });
  };

  return (
    <Block classes="select-provider">
      <div className="select-provider__content-container">
        {billingTabs.length > 1 && (
          <Tabs options={billingTabs} handleSelect={handleTabSelect} t={t} />
        )}

        {isCouponTabSelected && renderCouponInput()}
        <p style={{ marginTop: "1.2rem", textAlign: "left" }}>
          {t("choose-the-provider")}
        </p>

        <ButtonWithIcon
          label={"Filter"}
          iconName="filter"
          iconColor="#ffffff"
          iconSize="sm"
          color="purple"
          size="sm"
          classes="select-provider__filter-button"
          // onClick={handleFilterClick}
        />
        {(!isCouponTabSelected || activeCoupon) && (
          <InfiniteScroll
            dataLength={providersQuery.data?.pages.length || 0}
            next={providersQuery.fetchNextPage}
            hasMore={providersQuery.hasNextPage}
            loader={<Loading />}
            initialScrollY={20}
            hasChildren={true}
            scrollThreshold={0}
          >
            <Grid md={8} lg={12} classes="select-provider__grid">
              {renderProviders()}
            </Grid>
          </InfiniteScroll>
        )}
      </div>
    </Block>
  );
};
