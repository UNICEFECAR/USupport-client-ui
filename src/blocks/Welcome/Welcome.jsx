import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useCustomNavigate as useNavigate } from "#hooks";

import {
  Block,
  Button,
  Grid,
  GridItem,
  DropdownWithLabel,
  Loading,
} from "@USupport-components-library/src";
import { languageSvc } from "@USupport-components-library/services";
import {
  logoVerticalSvg,
  logoVerticalDarkSvg,
} from "@USupport-components-library/assets";
import {
  ThemeContext,
  replaceLanguageInUrl,
  getLanguageFromUrl,
  getCountryLabelFromAlpha2,
  redirectToUrl,
} from "@USupport-components-library/utils";

import "./welcome.scss";

/**
 * Welcome
 *
 * Welcome block
 *
 * @return {jsx}
 */
export const Welcome = () => {
  const { t, i18n } = useTranslation("blocks", { keyPrefix: "welcome" });
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { theme, setIsInWelcome } = useContext(ThemeContext);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const localStorageLanguage = localStorage.getItem("language");

  const countriesQueryData = queryClient.getQueryData(["countries"]);
  const [countries, setCountries] = useState(countriesQueryData);

  useEffect(() => {
    setIsInWelcome(true);

    return () => {
      setIsInWelcome(false);
    };
  }, []);

  useEffect(() => {
    const localStorageCountry = localStorage.getItem("country");
    if (localStorageCountry && localStorageCountry !== "global") {
      setSelectedCountry(localStorageCountry);

      // If there is country in the local storage
      // set it in the url
      const subdomain = window.location.hostname.split(".")[0];
      const countryLabel = getCountryLabelFromAlpha2(localStorageCountry);
      if (subdomain === "usupport") {
        window.location.href = window.location.href.replace(
          subdomain,
          `${countryLabel}.usupport`
        );
      } else if (subdomain === "staging") {
        window.location.href = window.location.href.replace(
          subdomain,
          `${countryLabel}.staging`
        );
      }
    }

    // Make sure to get countries from query cache
    // if they are not available on first try
    if (!countries || !countries.length) {
      setTimeout(() => {
        const countries = queryClient.getQueryData(["countries"]);
        setCountries(countries);
      }, 2000);
    }
  }, [countries]);

  const fetchLanguages = async () => {
    const res = await languageSvc.getActiveLanguages();
    const languageFromUrl = getLanguageFromUrl();
    let hasUpdatedUrl = false;
    const hasLanguage = res.data.find((x) => x.alpha2 === languageFromUrl);

    if (hasLanguage) {
      localStorage.setItem("language", languageFromUrl);
      setSelectedLanguage(languageFromUrl);
      i18n.changeLanguage(languageFromUrl);
      replaceLanguageInUrl(languageFromUrl);
      hasUpdatedUrl = true;
    }

    const languages = res.data.map((x) => {
      const languageObject = {
        value: x.alpha2,
        label: x.name === "English" ? x.name : `${x.name} (${x.local_name})`,
        id: x["language_id"],
      };
      if (localStorageLanguage === x.alpha2 && !hasUpdatedUrl) {
        setSelectedLanguage(x.alpha2);
        i18n.changeLanguage(localStorageLanguage);
        replaceLanguageInUrl(localStorageLanguage);
      }
      return languageObject;
    });
    return languages;
  };

  const languagesQuery = useQuery(
    ["languages", selectedCountry],
    fetchLanguages,
    {
      retry: false,
      staleTime: Infinity,
      cacheTime: 1000 * 60 * 60 * 24, // Keep cached for 24 hours
      enabled: !!selectedCountry,
    }
  );

  const handleSelectCountry = (country) => {
    setTimeout(() => {
      setSelectedCountry(country);
    }, 1);
    const countryObject = countries.find(
      (x) => x.value.toLocaleLowerCase() === country.toLocaleLowerCase()
    );
    const subdomain = window.location.hostname.split(".")[0];
    if (!window.location.href.includes("localhost")) {
      const label = countryObject.label.toLocaleLowerCase();
      let newUrl;
      if (subdomain === "usupport") {
        newUrl = window.location.href.replace(subdomain, `${label}.usupport`);
      } else if (subdomain === "staging") {
        newUrl = window.location.href.replace(subdomain, `${label}.staging`);
      } else {
        newUrl = window.location.href.replace(subdomain, label);
      }
      redirectToUrl(newUrl);
    } else {
      localStorage.setItem("country", country);
    }
  };

  const handleSelectLanguage = (lang) => {
    localStorage.setItem("language", lang);
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    replaceLanguageInUrl(lang);
  };

  const handleContinue = () => {
    const country = selectedCountry;
    const language = selectedLanguage;

    localStorage.setItem("country", country);
    localStorage.setItem(
      "country_id",
      countries.find((x) => x.value === selectedCountry).countryID
    );
    localStorage.setItem(
      "currency_symbol",
      countries.find((x) => x.value === selectedCountry).currencySymbol
    );
    localStorage.setItem("language", language);
    window.dispatchEvent(new Event("countryChanged"));
    i18n.changeLanguage(language);

    navigate("/register-preview");
  };

  return (
    <Block classes="welcome">
      <Grid md={8} lg={12} classes="welcome__grid">
        <GridItem md={8} lg={12} classes="welcome__grid__logo-item">
          <h2 className="welcome__grid__logo-item__heading">{t("heading")}</h2>
          <img
            src={theme !== "light" ? logoVerticalDarkSvg : logoVerticalSvg}
            alt="Logo"
            className="welcome__grid__logo-item__logo"
          />{" "}
          <h2 className="welcome__grid__logo-item__heading">{t("client")}</h2>
          {selectedCountry === "PL" && (
            <h4 className="welcome__grid__logo-item__pl-description">
              {t("poland_description")}
            </h4>
          )}
        </GridItem>
        <GridItem md={8} lg={12} classes="welcome__grid__content-item">
          {!languagesQuery.isFetching && countries ? (
            <>
              <DropdownWithLabel
                options={
                  countries?.map((x) => {
                    return {
                      ...x,
                      label: `${x.label} (${x.localName})`,
                    };
                  }) || []
                }
                classes="welcome__grid__content-item__countries-dropdown"
                selected={selectedCountry}
                setSelected={handleSelectCountry}
                label={t("country")}
                placeholder={t("placeholder")}
              />
              <DropdownWithLabel
                options={languagesQuery.data || []}
                disabled={!selectedCountry}
                selected={selectedLanguage}
                setSelected={handleSelectLanguage}
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
