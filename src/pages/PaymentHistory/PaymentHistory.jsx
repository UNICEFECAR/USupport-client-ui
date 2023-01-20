import React from "react";
import { useTranslation } from "react-i18next";
import { Page, PaymentHistory as PaymentHistoryBlock } from "#blocks";

import "./payment-history.scss";

/**
 * PaymentHistory
 *
 * PaymentHistory Page
 *
 * @returns {JSX.Element}
 */
export const PaymentHistory = () => {
  const { t } = useTranslation("payment-history-page");
  return (
    <Page
      classes="page__payment-history"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      <PaymentHistoryBlock />
    </Page>
  );
};
