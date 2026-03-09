import React from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  Block,
  Box,
  Grid,
  GridItem,
  ProviderOverview,
  Loading,
  NewButton,
} from "@USupport-components-library/src";

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
  providersQuery,
  isFiltering,
  subheading,
  onFilterClick,
  filterButtonLabel,
}) => {
  const { t } = useTranslation("blocks", { keyPrefix: "select-provider" });
  const navigate = useNavigate();

  const handleProviderClick = (provider) => {
    navigate(`/provider-overview?provider-id=${provider.providerDetailId}`);
  };

  const providers = providersQuery.data?.pages.flat() || [];
  const renderProviders = () => {
    if ((isFiltering && providersQuery.isFetching) || providersQuery.isLoading)
      return (
        <GridItem
          classes="select-provider__grid__providers-item__grid__empty"
          md={8}
          lg={12}
        >
          <Loading />
        </GridItem>
      );
    if (providers?.length === 0)
      return (
        <GridItem
          classes="select-provider__grid__providers-item__grid__empty"
          md={8}
          lg={12}
        >
          <p>{t("no_match")}</p>
        </GridItem>
      );
    const hasMoreThanOne = providers.length > 1;
    return providers?.map((provider) => {
      return (
        <GridItem
          md={4}
          lg={hasMoreThanOne ? 4 : 12}
          key={provider.providerDetailId}
          classes="select-provider__grid__providers-item__grid__provider"
        >
          <ProviderOverview
            provider={provider}
            name={provider.name}
            patronym={provider.patronym}
            surname={provider.surname}
            specializations={provider.specializations.map((x) => t(x))}
            price={activeCoupon ? null : provider.consultationPrice}
            onClick={() => handleProviderClick(provider)}
            image={provider.image}
            freeLabel={activeCoupon ? t("coupon") : t("free")}
            earliestAvailableSlot={provider.earliestAvailableSlot}
            t={t}
            liquidGlass
          />
        </GridItem>
      );
    });
  };

  return (
    <Block classes="select-provider">
      <Box classes="select-provider__box" liquidGlass>
        {(subheading || onFilterClick) && (
          <div className="select-provider__heading">
            <div className="select-provider__heading-main">
              {subheading && (
                <p className="select-provider__heading-subheading text">
                  {subheading}
                </p>
              )}
            </div>
            {onFilterClick && (
              <NewButton
                label={filterButtonLabel}
                iconName="filter"
                iconColor="#ffffff"
                iconSize="sm"
                size="sm"
                onClick={onFilterClick}
                classes="select-provider__heading-button"
              />
            )}
          </div>
        )}
        <InfiniteScroll
          dataLength={providersQuery.data?.pages.length || 0}
          next={providersQuery.fetchNextPage}
          hasMore={providersQuery.hasNextPage}
          loader={<Loading />}
          initialScrollY={20}
          hasChildren={true}
          scrollThreshold={0}
          style={{ overflow: "visible" }}
        >
          <Grid
            md={8}
            lg={12}
            classes="select-provider__grid__providers-item__grid"
          >
            {renderProviders()}
          </Grid>
        </InfiniteScroll>
      </Box>
    </Block>
  );
};
