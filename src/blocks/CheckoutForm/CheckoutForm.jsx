import React, { useEffect, useState } from "react";
import {
  PaymentElement,
  LinkAuthenticationElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import {
  Block,
  Button,
  Loading,
  Icon,
  Grid,
  GridItem,
} from "@USupport-components-library/src";

import "./checkout-form.scss";

/**
 * CheckoutForm
 *
 * CheckoutForm Block
 *
 * @return {jsx}
 */
export const CheckoutForm = ({ price, currency, consultationId }) => {
  const { t } = useTranslation("checkout-form");

  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url:
          "http://127.0.0.1:5173/client/payment-status/" + `${consultationId}`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message);
    } else {
      setMessage(t("payment_unexpected_error"));
    }

    setIsLoading(false);
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <Block classes="checkout-form">
      <form id="payment-form" onSubmit={handleSubmit}>
        <LinkAuthenticationElement
          id="link-authentication-element"
          onChange={(e) => setEmail(e.value.email)}
        />
        <PaymentElement id="payment-element" options={paymentElementOptions} />

        <Grid>
          <GridItem
            classes="checkout-form__grid__inforamtion-item"
            xs={4}
            md={8}
            lg={12}
          >
            <Icon
              name="circle-actions-alert-info"
              classes="checkout-form__information__icon"
              size="sm"
              color="#20809E"
              onClick={() => navigate(-1)}
            />
            <p className="small-text checkout-form__grid__information_text">
              {t("payment_info")}
            </p>
          </GridItem>
          <GridItem
            classes="checkout-form__grid__total-item"
            xs={2}
            md={4}
            lg={6}
          >
            <h4>{t("total_heading")}</h4>
          </GridItem>
          <GridItem
            classes="checkout-form__grid__price-item"
            xs={2}
            md={4}
            lg={6}
          >
            {price} {currency}
          </GridItem>
        </Grid>
        <Button
          classes="checkout-form__pay-button"
          type="primary"
          label={
            isLoading ? <Loading padding="0" size="sm" /> : t("button_pay_now")
          }
          disabled={isLoading || !stripe || !elements}
          size="lg"
          id="submit"
          isSubmit={true}
        ></Button>

        {/* Show any error or success messages */}
        {message && (
          <div className="checkout-form__payment-message">
            <p>{message}</p>
          </div>
        )}
      </form>
    </Block>
  );
};
