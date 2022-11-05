import React from "react";
import { Page } from "#blocks";
import {
  Block,
  CollapsibleFAQ,
  Loading,
} from "@USupport-components-library/src";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { cmsSvc } from "@USupport-components-library/services";

import "./faq.scss";

/**
 * FAQ
 *
 * FAQ page
 *
 * @returns {JSX.Element}
 */
export const FAQ = () => {
  const { i18n, t } = useTranslation("faq-page");

  const getFAQs = async () => {
    const { data } = await cmsSvc.getFAQs(i18n.language, true);

    return data;
  };

  const {
    data: FAQsData,
    isLoading: FAQsLoading,
    isFetched: isFAQsFetched,
  } = useQuery(["FAQs"], getFAQs);

  return (
    <Page
      classes="page__faq"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <Block classes="page__faq__block">
        {FAQsData && <CollapsibleFAQ data={FAQsData} />}
        {!FAQsData && FAQsLoading && <Loading />}
        {!FAQsData && !FAQsLoading && isFAQsFetched && (
          <h3 className="page__faq__no-results">{t("no_results")}</h3>
        )}
      </Block>
    </Page>
  );
};
