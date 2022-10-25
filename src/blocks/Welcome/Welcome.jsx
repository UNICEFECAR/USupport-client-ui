import React from "react";
import { Block } from "@USupport-components-library/src";
import {
  Grid,
  GridItem,
  DropdownWithLabel,
  Button,
} from "@USupport-components-library/src";

import "./welcome.scss";

import { logoVerticalSvg } from "../../../USupport-components-library/src/assets";

/**
 * Welcome
 *
 * Welcome block
 *
 * @return {jsx}
 */
export const Welcome = () => {
  const countries = [
    { label: "Romania", languages: ["Romanian", "English"] },
    { label: "Germany", languages: ["German", "English"] },
    { label: "France", languages: ["French", "English"] },
  ];

  const [selectedCountry, setSelectedCountry] = React.useState(null);

  return (
    <Block classes="welcome">
      <Grid md={8} lg={12} classes="welcome__grid">
        <GridItem md={8} lg={12} classes="welcome__grid__logo-item">
          <h2 className="welcome__grid__logo-item__heading">Welcome to</h2>
          <img
            src={logoVerticalSvg}
            alt="Logo"
            className="welcome__grid__logo-item__logo"
          />
        </GridItem>
        <GridItem md={8} lg={12} classes="welcome__grid__content-item">
          <DropdownWithLabel
            options={countries}
            classes="welcome__grid__content-item__countries-dropdown"
            selected={selectedCountry}
            setSelectedCountry={setSelectedCountry}
            label="Country"
          />
          <DropdownWithLabel
            options={countries}
            classes="welcome__grid__content-item__languages-dropdown"
            label="Language"
          />
          <Button label="Continue" size="lg" />
        </GridItem>
      </Grid>
    </Block>
  );
};
