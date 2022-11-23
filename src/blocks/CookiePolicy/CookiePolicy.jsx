import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Block,
  Grid,
  GridItem,
  Loading,
  Markdown,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useEventListener } from "#hooks";
import { cmsSvc } from "@USupport-components-library/services";

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
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

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
