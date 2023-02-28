import React, { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
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

  const [clientSecret, setClientSecret] = useState(null);
  const [price, setPrice] = useState(null);
  const [currency, setCurrency] = useState(null);
  const [consultationCreationTime, setConsultationCreationTime] = useState();

  const location = useLocation();

  const consultationId = location.state?.consultationId;
  const entryTime = location.state?.entryTime;
  if (!consultationId) return <Navigate to="/dashboard" />;

  const fetchPaymentIntent = async () => {
    const res = await paymentsSvc.createPaymentIntent(consultationId);

    return res?.data;
  };
  const paymentIntent = useQuery(["paymentIntent"], fetchPaymentIntent, {
    onSuccess: ({
      currency,
      price,
      clientSecret,
      consultationCreationTime,
    }) => {
      setCurrency(currency);
      setPrice(price);
      setClientSecret(clientSecret);
      if (entryTime) {
        setConsultationCreationTime(entryTime);
      } else {
        setConsultationCreationTime(consultationCreationTime);
      }
    },
  });

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
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormBlock
            price={price}
            currency={currency}
            consultationId={consultationId}
            consultationCreationTime={consultationCreationTime}
            clientSecret={clientSecret}
          />
        </Elements>
      )}
    </Page>
  );
};
