import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import {
  Backdrop,
  DropdownWithLabel,
  Loading,
} from "@USupport-components-library/src";
import { languageSvc, userSvc } from "@USupport-components-library/services";
import {
  logoVerticalSvg,
  logoVerticalDarkSvg,
  logoVerticalRomaniaPng,
} from "@USupport-components-library/assets";
import {
  ThemeContext,
  replaceLanguageInUrl,
  getLanguageFromUrl,
  getCountryLabelFromAlpha2,
  redirectToUrl,
} from "@USupport-components-library/utils";

import { useAddCountryEvent, useError } from "#hooks";

import "./welcome.scss";

/**
 * Welcome
 *
 * Welcome backdrop
 *
 * @return {jsx}
 */
export const Welcome = ({
  onRegisterEmail,
  onRegisterAnonymous,
  onOpenRequest,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (onOpenRequest) {
      onOpenRequest(() => {
        setIsOpen(true);
        setError(null); // Clear errors when reopening
      });
    }
  }, [onOpenRequest]);
  const { t, i18n } = useTranslation("backdrops", { keyPrefix: "welcome" });
  const queryClient = useQueryClient();
  const { theme, setIsInWelcome } = useContext(ThemeContext);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const IS_RO = localStorage.getItem("country") === "RO";

  const addCountryEventMutation = useAddCountryEvent();

  const handleAddCountryEvent = (eventType) => {
    addCountryEventMutation.mutate({ eventType });
  };

  const tmpLogin = async () => {
    handleAddCountryEvent("web_guest_register_click");
    const res = await userSvc.tmpLogin();
    return res.data;
  };

  const tmpLoginMutation = useMutation(tmpLogin, {
    onSuccess: (data) => {
      const { token, expiresIn, refreshToken } = data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("expires-in", expiresIn);
      localStorage.setItem("refresh-token", refreshToken);

      window.dispatchEvent(new Event("login"));
      setIsOpen(false);
    },
    onError: (error) => {
      const { message: errorMessage } = useError(error);
      setError(errorMessage);
    },
  });

  const handleRedirect = (redirectTo) => {
    setError(null); // Clear any previous errors
    if (redirectTo === "email") {
      handleAddCountryEvent("web_email_register_click");
      setIsOpen(false);
      onRegisterEmail?.();
    } else if (redirectTo === "anonymously") {
      handleAddCountryEvent("web_anonymous_register_click");
      setIsOpen(false);
      onRegisterAnonymous?.();
    } else {
      tmpLoginMutation.mutate();
    }
  };

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
          `${countryLabel}.usupport`,
        );
      } else if (subdomain === "staging") {
        window.location.href = window.location.href.replace(
          subdomain,
          `${countryLabel}.staging`,
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
      cacheTime: 1000 * 60 * 60 * 24,
      enabled: !!selectedCountry,
    },
  );

  const handleSelectCountry = (country) => {
    setTimeout(() => {
      setSelectedCountry(country);
    }, 1);
    const countryObject = countries.find(
      (x) => x.value.toLocaleLowerCase() === country.toLocaleLowerCase(),
    );

    localStorage.setItem("country", country);
    if (countryObject) {
      localStorage.setItem("country_id", countryObject.countryID);
      localStorage.setItem("currency_symbol", countryObject.currencySymbol);
    }
    window.dispatchEvent(new Event("countryChanged"));

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
    }
  };

  const handleSelectLanguage = (lang) => {
    localStorage.setItem("language", lang);
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    replaceLanguageInUrl(lang);
  };

  return (
    <Backdrop
      classes="welcome-modal"
      title="Welcome"
      isOpen={isOpen}
      ctaLabel={t("register_email")}
      ctaHandleClick={() => handleRedirect("email")}
      isCtaDisabled={!selectedCountry || !selectedLanguage}
      secondaryCtaLabel={t("register_anonymously")}
      secondaryCtaHandleClick={() => handleRedirect("anonymously")}
      isSecondaryCtaDisabled={!selectedCountry || !selectedLanguage}
      heading={t("heading")}
      thirdCtaLabel={t("continue_as_guest")}
      thirdCtaHandleClick={() => handleRedirect("guest")}
      isThirdCtaDisabled={!selectedCountry || !selectedLanguage}
      hasCloseIcon={false}
      errorMessage={error}
    >
      <div className="welcome-modal__content-container">
        <img
          src={
            IS_RO
              ? logoVerticalRomaniaPng
              : theme !== "light"
                ? logoVerticalDarkSvg
                : logoVerticalSvg
          }
          alt="Logo"
          className="welcome-modal__content-container__logo"
        />
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
              classes="welcome-modal__content-container__dropdown"
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
              classes="welcome-modal__content-container__dropdown"
              label={t("language")}
              placeholder={t("placeholder")}
            />
          </>
        ) : (
          <div className="welcome-modal__grid__loading-container">
            <Loading size="lg" />
          </div>
        )}
      </div>
    </Backdrop>
  );
};
