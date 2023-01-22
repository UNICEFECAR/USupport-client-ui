import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

import { Page, CheckoutForm as CheckoutFormBlock } from "#blocks";

import { paymentsSvc } from "@USupport-components-library/services";

import "./checkout.scss";

/**
 * Checkout
 *
 * Checkout Page
 *
 * @returns {JSX.Element}
 */
export const Checkout = () => {
  const { t, i18n } = useTranslation("checkout-page");
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripePublicKey, {
    locale: i18n.language ? "kk" : "ru",
  });

  const fetchPaymentIntent = async () => {
    const res = await paymentsSvc.createPaymentIntent({
      items: [{ id: "xl-tshirt" }],
    });

    return res?.data?.clientSecret;
  };
  const { data: clientSecret } = useQuery(["clientSecret"], fetchPaymentIntent);

  const appearance = {
    theme: "stripe",
    variables: {
      spacingGridRow: "1rem",
      fontFamily: "'Nunito', sans-serif",
    },
    rules: {
      ".Tab": {
        marginTop: "1rem",
        borderRadius: "1rem",
        boxShadow: "2px 2px 12px rgba(104, 77, 253, 0.1)",
      },
      ".Label": {},
      ".TabLabel": {
        color: "black",
      },
      ".Label": {
        fontSize: "15px",
      },
      ".Input": {
        borderRadius: "5rem",
        boxShadow: "2px 2px 12px rgba(104, 77, 253, 0.1)",
      },
      ".Input::placeholder": {
        backgroundColor: "#grey",
      },
    },
  };

  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Page
      classes="page__checkout"
      heading={t("heading")}
      subheading={t("subheading")}
      showGoBackArrow={false}
    >
      {" "}
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormBlock />
        </Elements>
      )}
    </Page>
  );
};
