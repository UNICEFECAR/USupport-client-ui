import React from "react";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  Block,
  Grid,
  GridItem,
  ProviderOverview,
  Loading,
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
            price={activeCoupon ? null : provider.consultationPrice}
            onClick={() => handleProviderClick(provider)}
            image={provider.image}
            freeLabel={activeCoupon ? t("coupon") : t("free")}
            earliestAvailableSlot={provider.earliestAvailableSlot}
            t={t}
          />
        </GridItem>
      );
    });
  };

  return (
    <Block classes="select-provider">
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
    </Block>
  );
};
