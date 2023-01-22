import React, { useEffect, useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  Button,
} from "@USupport-components-library/src";
import { useStripe } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";

import "./payment-status.scss";

import {
  mascotHappyOrange,
  mascotConfusedBlue,
  mascotCalmBlue,
} from "@USupport-components-library/assets";

/**
 * PaymentStatus
 *
 * PaymentStatus Block
 *
 * @return {jsx}
 */
export const PaymentStatus = () => {
  const { t } = useTranslation("payment-status-block");
  const stripe = useStripe();

  const [statusData, setStatusData] = useState();

  const getDataForState = (status) => {
    switch (status) {
      case "succeeded":
        return {
          heading: t("payment_succeded_heading"),
          subHeading: t("payment_succeded_subheading"),
          mascotToUse: mascotHappyOrange,
          buttonLabel: t("continue_button_label"),
        };

      case "processing":
        return {
          heading: t("payment_processing_heading"),
          subHeading: t("payment_processing_subheading"),
          mascotToUse: mascotCalmBlue,
          buttonLabel: t("continue_button_label"),
        };

      case "requires_payment_method":
        return {
          heading: t("payment_requires_payment_method_heading"),
          subHeading: t("payment_requires_payment_method_subheading"),
          mascotToUse: mascotConfusedBlue,
          buttonLabel: t("try_again_button_label"),
        };

      default:
        return {
          heading: t("payment_failed_heading"),
          subHeading: t("payment_failed_subheading"),
          mascotToUse: mascotConfusedBlue,
          buttonLabel: t("try_again_button_label"),
        };
    }
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setStatusData(getDataForState("succeeded"));

          break;
        case "processing":
          setStatusData(getDataForState("processing"));
          break;
        case "requires_payment_method":
          setStatusData(getDataForState("requires_payment_method"));

          break;
        default:
          setStatusData(getDataForState("default"));
          break;
      }
    });
  }, [stripe]);
  return (
    <Block classes="payment-status">
      {statusData && (
        <Grid classes="payment-status__grid">
          <GridItem
            xs={4}
            md={8}
            lg={12}
            classes="payment-status__grid__mascot-item"
          >
            <img src={statusData.mascotToUse} />
          </GridItem>
          <GridItem
            xs={4}
            md={8}
            lg={12}
            classes="payment-status__grid__heading"
          >
            <h4>{statusData.heading}</h4>
          </GridItem>

          <GridItem
            xs={4}
            md={8}
            lg={12}
            classes="payment-status__grid__subheading"
          >
            <p>{statusData.subHeading}</p>
          </GridItem>

          <GridItem
            xs={4}
            md={8}
            lg={12}
            classes="payment-status__grid__button"
          >
            <Button
              classes="checkout-form__pay-button"
              type="primary"
              label={statusData.buttonLabel}
              size="lg"
              isSubmit={false}
            ></Button>
          </GridItem>
        </Grid>
      )}
    </Block>
  );
};
