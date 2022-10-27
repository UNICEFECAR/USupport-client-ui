import React from "react";
import {
  Block,
  Grid,
  GridItem,
  DropdownWithLabel,
  Button,
} from "@USupport-components-library/src";

import "./welcome.scss";

import { logoVerticalSvg } from "@USupport-components-library/assets";
import { useTranslation } from "react-i18next";

/**
 * Welcome
 *
 * Welcome block
 *
 * @return {jsx}
 */
export const Welcome = () => {
  const { t } = useTranslation("welcome");
  const countries = [
    { label: "Romania", languages: ["Romanian", "English"] },
    { label: "Germany", languages: ["German", "English"] },
    { label: "France", languages: ["French", "English"] },
  ];

  const [selectedCountry, setSelectedCountry] = React.useState(null);
  const [selectedLanguage, setSelectedLanguage] = React.useState(null);

  const handleContinue = () => {
    console.log("continue");
  };

  return (
    <Block classes="welcome">
      <Grid md={8} lg={12} classes="welcome__grid">
        <GridItem md={8} lg={12} classes="welcome__grid__logo-item">
          <h2 className="welcome__grid__logo-item__heading">{t("heading")}</h2>
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
            setSelected={setSelectedCountry}
            label={t("country")}
            placeholder={t("placeholder")}
          />
          <DropdownWithLabel
            options={countries}
            selected={selectedLanguage}
            setSelected={setSelectedLanguage}
            classes="welcome__grid__content-item__languages-dropdown"
            label={t("language")}
            placeholder={t("placeholder")}
          />
          <Button
            label={t("button")}
            size="lg"
            disabled={!selectedCountry && !selectedLanguage}
            onClick={handleContinue}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
