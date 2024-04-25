import React, { useEffect, useState } from "react";
import {
  Block,
  Grid,
  GridItem,
  Button,
} from "@USupport-components-library/src";
import { useQuery } from "@tanstack/react-query";
import { useStripe } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { getDateView, getTime } from "@USupport-components-library/utils";

import "./payment-status.scss";

import {
  mascotHappyOrange,
  mascotConfusedBlue,
  mascotCalmBlue,
} from "@USupport-components-library/assets";

import { providerSvc } from "@USupport-components-library/services";
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
  const navigate = useNavigate();
  const { consultationId } = useParams();

  const [statusData, setStatusData] = useState();
  const [consultationDate, setConsultationDate] = useState();
  const [consultationTime, setConsultaitonTime] = useState();

  const getConsultation = async () => {
    const res = await providerSvc.getConsultationsTime(consultationId);

    return res?.data;
  };
  useQuery(["consultation"], getConsultation, {
    onSuccess: (data) => {
      setConsultationDate(getDateView(data.time));
      setConsultaitonTime(getTime(data.time));
    },
    enabled: !!consultationId,
  });

  useEffect(() => {
    if (stripe && consultationId && consultationDate) {
      const clientSecret = new URLSearchParams(window.location.search).get(
        "payment_intent_client_secret"
      );

      if (!clientSecret) {
        navigate("/not-found");
      } else {
        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
          let newStatusData = {};
          switch (paymentIntent.status) {
            case "succeeded":
              newStatusData = {
                heading: t("payment_succeded_heading"),
                subHeading: t("payment_succeded_subheading", {
                  consultationDate,
                  consultationTime,
                }),
                mascotToUse: mascotHappyOrange,
                buttonLabel: t("continue_button_label"),
              };
              setStatusData(newStatusData);

              break;
            case "processing":
              newStatusData = {
                heading: t("payment_processing_heading"),
                subHeading: t("payment_processing_subheading"),
                mascotToUse: mascotCalmBlue,
                buttonLabel: t("continue_button_label"),
              };
              setStatusData(newStatusData);
              break;
            case "requires_payment_method":
              newStatusData = {
                heading: t("payment_requires_payment_method_heading"),
                subHeading: t("payment_requires_payment_method_subheading"),
                mascotToUse: mascotConfusedBlue,
                buttonLabel: t("try_again_button_label"),
              };
              setStatusData(newStatusData);

              break;
            default:
              newStatusData = {
                heading: t("payment_failed_heading"),
                subHeading: t("payment_failed_subheading"),
                mascotToUse: mascotConfusedBlue,
                buttonLabel: t("try_again_button_label"),
              };
              setStatusData(newStatusData);
              break;
          }
        });
      }
    }
  }, [stripe, consultationId, consultationDate]);

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
              onClick={() => navigate("/consultations")}
            />
          </GridItem>
        </Grid>
      )}
    </Block>
  );
};
