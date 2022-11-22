import React from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Block,
  Grid,
  GridItem,
  ProviderOverview,
} from "@USupport-components-library/src";

import "./select-provider.scss";

/**
 * SelectProvider
 *
 * SelectProvider block
 *
 * @return {jsx}
 */
export const SelectProvider = ({ providers }) => {
  const { t } = useTranslation("select-provider");
  const navigate = useNavigate();

  const handleProviderClick = (provider) => {
    navigate("/provider-overview", {
      state: {
        providerData: provider,
      },
    });
  };

  const renderProviders = () => {
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
            onClick={() => handleProviderClick(provider)}
            image={provider.image}
          />
        </GridItem>
      );
    });
  };

  return (
    <Block classes="select-provider">
      <Grid md={8} lg={12} classes="select-provider__grid">
        {renderProviders()}
      </Grid>
    </Block>
  );
};
