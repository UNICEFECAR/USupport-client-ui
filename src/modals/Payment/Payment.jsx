import React, { useState, useEffect } from "react";
import { Modal } from "@USupport-components-library/src";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useQuery } from "@tanstack/react-query";
import { CheckoutForm as CheckoutFormBlock } from "#blocks";
import { useTranslation } from "react-i18next";

import { paymentsSvc } from "@USupport-components-library/services";

import "./payment.scss";

/**
 * Payment
 *
 * The Payment modal
 *
 * @return {jsx}
 */
export const Payment = ({ isOpen, onClose }) => {
  const { t, i18n } = useTranslation("payment");
  const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY;
  const stripePromise = loadStripe(stripePublicKey, {
    locale: i18n.language ? "kk" : "ru",
  });

  console.log(i18n.language);

  const fetchPaymentIntent = async () => {
    const res = await paymentsSvc.createPaymentIntent({
      items: [{ id: "xl-tshirt" }],
    });

    return res?.data?.clientSecret;
  };

  const { data: clientSecret } = useQuery(["clientSecret"], fetchPaymentIntent);

  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <Modal
      classes="payment"
      heading={t("heading")}
      text={t("text")}
      isOpen={isOpen}
      closeModal={onClose}
    >
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutFormBlock />
        </Elements>
      )}
    </Modal>
  );
};
