import React, { useState } from "react";
import { Page, SelectProvider as SelectProviderBlock } from "#blocks";
import { useTranslation } from "react-i18next";
import { ButtonWithIcon } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { RadialCircle, Loading } from "@USupport-components-library/src";
import { useGetProvidersData } from "#hooks";
import { FilterProviders } from "#backdrops";

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

  const [providersDataQuery, providersData, setProvidersData] =
    useGetProvidersData();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const closeFilter = () => setIsFilterOpen(false);

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  const checkProviderHasType = (provider, types) => {
    return types
      .map((x) => {
        return provider.types.includes(x);
      })
      .some((x) => x === true);
  };

  const handleFilterSave = (data) => {
    const { providerTypes, providerSex, maxPrice } = data;
    const initialData = JSON.parse(JSON.stringify(providersDataQuery.data));
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
          : provider.price <= Number(maxPrice)
          ? false
          : true;
      if (hasType && isDesiredSex && isPriceMatching) {
        filteredData.push(provider);
      }
    }
    setProvidersData(filteredData);
    closeFilter();
  };
  return (
    <Page
      classes="page__select-provider"
      heading={t("heading")}
      subheading={t("subheading")}
      headingButton={
        <ButtonWithIcon
          label={t("button_label")}
          iconName="filter"
          iconColor="#ffffff"
          iconSize="sm"
          color="purple"
          size="xs"
          onClick={handleFilterClick}
        />
      }
    >
      {providersDataQuery.isLoading && !providersData ? (
        <Loading size="lg" />
      ) : (
        <SelectProviderBlock providers={providersData} />
      )}
      {width < 768 && <RadialCircle color="purple" />}

      <FilterProviders
        isOpen={isFilterOpen}
        onClose={(data) => handleFilterSave(data)}
      />
    </Page>
  );
};
