import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";

import { Page, PaymentStatus as PaymentStatusBlock } from "#blocks";

import "./payment-status.scss";

/**
 * PaymentStatus
 *
 * PaymentStatus Page
 *
 * @returns {JSX.Element}
 */
export const PaymentStatus = () => {
  const { t, i18n } = useTranslation("payment-status-page");
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripePublicKey, {
    locale: i18n.language ? "kk" : "ru",
  });
  return (
    <Page
      classes="page__payment-status"
      heading={t("heading")}
      showGoBackArrow={false}
    >
      <Elements stripe={stripePromise}>
        <PaymentStatusBlock />
      </Elements>
    </Page>
  );
};
