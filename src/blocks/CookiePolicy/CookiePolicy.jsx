import React, { useState, useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import {
  Block,
  Grid,
  GridItem,
  Loading,
  Markdown,
} from "@USupport-components-library/src";
import { cmsSvc } from "@USupport-components-library/services";
import { getCountryFromSubdomain } from "@USupport-components-library/utils";

import { useEventListener } from "#hooks";

import "./cookie-policy.scss";

/**
 * CookiePolicy
 *
 * CookiePolicy Block
 *
 * @return {jsx}
 */
export const CookiePolicy = () => {
  const { i18n, t } = useTranslation("cookie-policy");

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState();

  useEffect(() => {
    const country = localStorage.getItem("country");
    if (country) {
      setCurrentCountry(country);
    } else {
      const subdomain = window.location.hostname.split(".")[0];
      if (
        subdomain === "usupport" ||
        subdomain === "staging" ||
        subdomain === "www"
      ) {
        setCurrentCountry("global");
      } else {
        const country = getCountryFromSubdomain(subdomain);
        setCurrentCountry(country);
      }
    }
  }, []);

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- Policies ----------------------//
  const getCookiePolicy = async () => {
    const { data } = await cmsSvc.getCookiePolicy(
      i18n.language,
      currentCountry,
      "client"
    );

    return data;
  };

  const {
    data: cookiePolicyData,
    isLoading: cookiePolicyLoading,
    isFetched: isCookiePolicyFetched,
  } = useQuery(
    ["cookie-policy", currentCountry, i18n.language],
    getCookiePolicy
  );
  return (
    <Block classes="cookie-policy">
      <Grid>
        <GridItem md={8} lg={12}>
          {cookiePolicyData && (
            <Markdown markDownText={cookiePolicyData}></Markdown>
          )}
          {!cookiePolicyData && cookiePolicyLoading && <Loading />}
          {!cookiePolicyData &&
            !cookiePolicyLoading &&
            isCookiePolicyFetched && (
              <h3 className="cookie-policy__no-results">{t("no_results")}</h3>
            )}
        </GridItem>
      </Grid>
    </Block>
  );
};
