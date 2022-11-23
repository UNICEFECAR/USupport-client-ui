import React, { useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Block,
  CollapsibleFAQ,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useEventListener } from "#hooks";

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

  //--------------------- Country Change Event Listener ----------------------//
  const [currentCountry, setCurrentCountry] = useState(
    localStorage.getItem("country")
  );

  const handler = useCallback(() => {
    setCurrentCountry(localStorage.getItem("country"));
  }, []);

  // Add event listener
  useEventListener("countryChanged", handler);

  //--------------------- FAQs ----------------------//
  const getFAQIds = async () => {
    // Request faq ids from the master DB based for the client platform
    const faqIds = await adminSvc.getFAQs("client");

    return faqIds;
  };

  const faqIdsQuerry = useQuery(["faqIds", currentCountry], getFAQIds);

  const getFAQs = async () => {
    let { data } = await cmsSvc.getFAQs({
      locale: i18n.language,
      ids: faqIdsQuerry.data,
    });

    const faqs = [];
    data.data.forEach((faq) => {
      faqs.push({
        question: faq.attributes.question,
        answer: faq.attributes.answer,
      });
    });

    return faqs;
  };

  const {
    data: FAQsData,
    isLoading: FAQsLoading,
    isFetched: isFAQsFetched,
  } = useQuery(["FAQs", faqIdsQuerry.data, i18n.language], getFAQs, {
    // Run the query when the getCategories and getAgeGroups queries have finished running
    enabled: !faqIdsQuerry.isLoading && faqIdsQuerry.data?.length > 0,
  });

  return (
    <Block classes="faq">
      {FAQsData && <CollapsibleFAQ data={FAQsData} />}
      {faqIdsQuerry.data?.length > 0 && !FAQsData && FAQsLoading && <Loading />}
      {(!FAQsData?.length && !FAQsLoading && isFAQsFetched) ||
        (faqIdsQuerry.data?.length === 0 && (
          <h3 className="page__faq__no-results">{t("no_results")}</h3>
        ))}
    </Block>
  );
};
