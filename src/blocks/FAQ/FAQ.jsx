import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Block,
  CollapsibleFAQ,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { getFilteredData } from "@USupport-components-library/utils";

import { cmsSvc, adminSvc } from "@USupport-components-library/services";

import "./faq.scss";

/**
 * FAQ
 *
 * FAQ block
 *
 * @return {jsx}
 */
export const FAQ = () => {
  const { i18n, t } = useTranslation("faq");

  const getFAQs = async () => {
    // Request faq ids from the master DB based for website platform
    const faqIds = await adminSvc.getFAQs("client");

    const faqs = [];

    if (faqIds?.length > 0) {
      let { data } = await cmsSvc.getFAQs("all", true, faqIds);

      data = getFilteredData(data, i18n.language);

      console.log(data);

      data.forEach((faq) => {
        faqs.push({
          question: faq.attributes.question,
          answer: faq.attributes.answer,
        });
      });
    }
    return faqs;
  };

  const {
    data: FAQsData,
    isLoading: FAQsLoading,
    isFetched: isFAQsFetched,
  } = useQuery(["FAQs", i18n.language], getFAQs);

  return (
    <Block classes="faq">
      {FAQsData && <CollapsibleFAQ data={FAQsData} />}
      {!FAQsData && FAQsLoading && <Loading />}
      {!FAQsData?.length && !FAQsLoading && isFAQsFetched && (
        <h3 className="page__faq__no-results">{t("no_results")}</h3>
      )}
    </Block>
  );
};
