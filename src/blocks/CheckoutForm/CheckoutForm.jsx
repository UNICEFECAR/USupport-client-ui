import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Modal,
} from "@USupport-components-library/src";

import { FIVE_MINUTES } from "@USupport-components-library/utils";

import "./checkout-form.scss";

function msToHMS(duration) {
  let seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60);

  minutes = minutes < 10 ? "0" + minutes : minutes;
  seconds = seconds < 10 ? "0" + seconds : seconds;

  const totalSeconds = Number(Number(minutes) * 60 + seconds);
  return totalSeconds;
}

const returnUrl = `${import.meta.env.VITE_HOST}/payment-status/`;

/**
 * CheckoutForm
 *
 * CheckoutForm Block
 *
 * @return {jsx}
 */
export const CheckoutForm = ({
  price,
  currency,
  consultationId,
  consultationCreationTime,
  clientSecret,
}) => {
  const { t } = useTranslation("checkout-form");
  const navigate = useNavigate();

  const stripe = useStripe();
  const elements = useElements();

  // Variable to track when the consultation status will become "timeout"
  const timeOfTimeout =
    new Date(consultationCreationTime).getTime() + FIVE_MINUTES;
  const now = new Date().getTime();

  const difference = timeOfTimeout - now;
  const differenceInMins = msToHMS(difference);

  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasTimeouted, setHasTimeouted] = useState(now > timeOfTimeout);

  const timeout = useTimer(differenceInMins);

  useEffect(() => {
    if (timeout[0] === 0 && timeout[1] === 0) {
      setHasTimeouted(true);
    }
  }, [timeout]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const response = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: returnUrl + `${consultationId}`,
      },
      redirect: "if_required",
    });

    const error = response.error;

    if (!error) {
      navigate(
        `/payment-status/${consultationId}/?payment_intent_client_secret=${clientSecret}`
      );
      return;
    }

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
        <p>
          {timeout[0] < 10 ? `0${timeout[0]}` : timeout[0]}:
          {timeout[1] < 10 ? `0${timeout[1]}` : timeout[1]}
        </p>
        <LinkAuthenticationElement
          id="link-authentication-element"
          // onChange={(e) => setEmail(e.value.email)}
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
          disabled={isLoading || !stripe || !elements || hasTimeouted}
          size="lg"
          id="submit"
          isSubmit={true}
        />

        {/* Show any error or success messages */}
        {message && (
          <div className="checkout-form__payment-message">
            <p>{message}</p>
          </div>
        )}
      </form>

      <Modal
        heading={t("timeout_heading")}
        isOpen={hasTimeouted}
        closeModal={() => {}}
        ctaLabel={t("continue_button")}
        ctaHandleClick={() => navigate("/select-provider")}
      >
        <p>{t("consultation_timeout")}</p>
      </Modal>
    </Block>
  );
};

const useTimer = (seconds) => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    let interval = null;
    interval = setInterval(() => {
      setTime((time) => time - 1);
    }, 1000);

    if (time === 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [time]);

  // Convert seconds into MM:SS format
  const minutes = Math.floor(time / 60);
  const finalSeconds = time - minutes * 60;

  if (isNaN(minutes) || isNaN(finalSeconds)) return [0, 0];

  return [minutes, finalSeconds];
};
