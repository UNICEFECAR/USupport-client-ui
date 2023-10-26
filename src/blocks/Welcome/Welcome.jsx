import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import {
  Block,
  Button,
  Grid,
  GridItem,
  DropdownWithLabel,
  Loading,
} from "@USupport-components-library/src";
import { languageSvc, countrySvc } from "@USupport-components-library/services";
import { logoVerticalSvg } from "@USupport-components-library/assets";

import "./welcome.scss";

/**
 * Welcome
 *
 * Welcome block
 *
 * @return {jsx}
 */
export const Welcome = () => {
  const { t, i18n } = useTranslation("welcome");
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const localStorageCountry = localStorage.getItem("country");
  const localStorageLanguage = localStorage.getItem("language");
  const localStorageCountryID = localStorage.getItem("country_id");

  const fetchCountries = async () => {
    const res = await countrySvc.getActiveCountries();
    const countries = res.data.map((x) => {
      const countryObject = {
        value: x.alpha2,
        label: x.name,
        localName: x.local_name,
        id: x["country_id"],
        minAge: x["min_client_age"],
        maxAge: x["max_client_age"],
        countrySymbol: x["symbol"],
      };

      if (localStorageCountry === x.alpha2) {
        if (!localStorageCountryID) {
          localStorage.setItem("country_id", x["country_id"]);
          localStorage.setItem("currency_symbol", x["symbol"]);
        }
        setSelectedCountry(x.alpha2);
      }

      return countryObject;
    });
    return countries;
  };

  const fetchLanguages = async () => {
    const res = await languageSvc.getActiveLanguages();
    const languages = res.data.map((x) => {
      const languageObject = {
        value: x.alpha2,
        label: x.name === "English" ? x.name : `${x.name} (${x.local_name})`,
        id: x["language_id"],
      };
      if (localStorageLanguage === x.alpha2) {
        setSelectedLanguage(x.alpha2);
        i18n.changeLanguage(localStorageLanguage);
      }
      return languageObject;
    });
    return languages;
  };

  const countriesQuery = useQuery(["countries"], fetchCountries, {
    retry: false,
  });
  const languagesQuery = useQuery(["languages"], fetchLanguages, {
    retry: false,
  });

  const handleContinue = () => {
    const country = selectedCountry;
    const language = selectedLanguage;

    localStorage.setItem("country", country);
    localStorage.setItem(
      "country_id",
      countriesQuery.data.find((x) => x.value === selectedCountry).id
    );
    localStorage.setItem(
      "currency_symbol",
      countriesQuery.data.find((x) => x.value === selectedCountry).countrySymbol
    );
    localStorage.setItem("language", language);

    i18n.changeLanguage(language);

    navigate("/register-preview");
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
          />{" "}
          <h2 className="welcome__grid__logo-item__heading">{t("client")}</h2>
        </GridItem>
        <GridItem md={8} lg={12} classes="welcome__grid__content-item">
          {!(countriesQuery.isLoading || languagesQuery.isLoading) ? (
            <>
              <DropdownWithLabel
                options={
                  countriesQuery.data?.map((x) => {
                    return {
                      ...x,
                      label: `${x.label} (${x.localName})`,
                    };
                  }) || []
                }
                classes="welcome__grid__content-item__countries-dropdown"
                selected={selectedCountry}
                setSelected={setSelectedCountry}
                label={t("country")}
                placeholder={t("placeholder")}
              />
              <DropdownWithLabel
                options={languagesQuery.data || []}
                selected={selectedLanguage}
                setSelected={(lang) => {
                  setSelectedLanguage(lang);
                  i18n.changeLanguage(lang);
                }}
                classes="welcome__grid__content-item__languages-dropdown"
                label={t("language")}
                placeholder={t("placeholder")}
              />
            </>
          ) : (
            <div className="welcome__grid__loading-container">
              <Loading size="lg" />
            </div>
          )}
          <Button
            label={t("button")}
            size="lg"
            disabled={!selectedCountry || !selectedLanguage}
            onClick={handleContinue}
          />
        </GridItem>
      </Grid>
    </Block>
  );
};
