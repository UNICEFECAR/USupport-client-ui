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

import "./terms-of-use.scss";

/**
 * TermsOfUse
 *
 * TermsOfUse Block
 *
 * @return {jsx}
 */
export const TermsOfUse = () => {
  const { i18n, t } = useTranslation("terms-of-use");

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- Terms of Use ----------------------//
  const getTermsOfUse = async () => {
    const { data } = await cmsSvc.getTermsOfUse(
      i18n.language,
      currentCountry,
      "client"
    );

    return data;
  };

  const {
    data: termsOfUseData,
    isLoading: termsOfUseLoading,
    isFetched: isTermsOfUseFetched,
  } = useQuery(["terms-of-use", currentCountry, i18n.language], getTermsOfUse);
  return (
    <Block classes="terms-of-use">
      <Grid>
        <GridItem md={8} lg={12}>
          {termsOfUseData && (
            <Markdown markDownText={termsOfUseData}></Markdown>
          )}
          {!termsOfUseData && termsOfUseLoading && <Loading />}
          {!termsOfUseData && !termsOfUseLoading && isTermsOfUseFetched && (
            <h3 className="terms-of-use__no-results">{t("no_results")}</h3>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
