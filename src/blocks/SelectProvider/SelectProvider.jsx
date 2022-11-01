import React from "react";
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
  const handleProviderClick = (id) => {
    console.log(`Open provider with ID: ${id}`);
  };

  const renderProviders = () => {
    const providers = [];
    for (let i = 0; i < 10; i++) {
      providers.push({
        id: i,
        name: "Dr. Joanna Doe",
        specialities: "Psychiatrist, Neuropsychiatrist, Psychotherapist",
        experience: 16,
      });
    }
    return providers.map((provider) => {
      return (
        <GridItem
          md={4}
          lg={6}
          key={provider.id}
          classes="select-provider__grid__provider"
        >
          <ProviderOverview
            name={provider.name}
            specialities={provider.specialities}
            experience={provider.experience}
            onClick={() => handleProviderClick(provider.id)}
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
