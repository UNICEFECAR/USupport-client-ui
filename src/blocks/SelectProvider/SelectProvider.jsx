import React from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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
  const navigate = useNavigate();

  const handleProviderClick = (provider) => {
    navigate("/provider-overview", {
      state: {
        providerData: provider,
      },
    });
  };

  const renderProviders = () => {
    return providers?.map((provider) => {
      return (
        <GridItem
          md={4}
          lg={6}
          key={provider.id}
          classes="select-provider__grid__provider"
        >
          <ProviderOverview
            name={provider.name}
            patronym={provider.patronym}
            surname={provider.surname}
            types={provider.types}
            experience={provider.experience}
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
