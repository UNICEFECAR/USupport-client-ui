import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Block,
  Grid,
  GridItem,
  Loading,
  Markdown,
} from "@USupport-components-library/src";

import { useTranslation } from "react-i18next";

import { cmsSvc } from "@USupport-components-library/services";

import "./privacy-policy.scss";

/**
 * PrivacyPolicy
 *
 * PrivacyPolicy block
 *
 * @return {jsx}
 */
export const PrivacyPolicy = () => {
  const { i18n, t } = useTranslation("privacy-policy");

  const countryAlpha2 = "KZ"; // TODO: get country code

  const getPolicies = async () => {
    const { data } = await cmsSvc.getPolicies(
      i18n.language,
      countryAlpha2,
      "client"
    );

    return data;
  };

  const {
    data: policiesData,
    isLoading: policiesLoading,
    isFetched: isPoliciesFetched,
  } = useQuery(["policies"], getPolicies);
  return (
    <Block classes="privacy-policy">
      <Grid>
        <GridItem md={8} lg={12}>
          {policiesData && <Markdown markDownText={policiesData}></Markdown>}
          {!policiesData && policiesLoading && <Loading />}
          {!policiesData && !policiesLoading && isPoliciesFetched && (
            <h3 className="privacy-policy__no-results">{t("no_results")}</h3>
          )}
        </GridItem>
      </Grid>
    </Block>
  );
};
