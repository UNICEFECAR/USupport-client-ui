import React from "react";
import { Modal } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { Grid, GridItem, Line, Button } from "@USupport-components-library/src";
import { getDateView, getTime } from "@USupport-components-library/utils";

import "./payment-information.scss";

/**
 * PaymentInformation
 *
 * The PaymentInformation modal
 *
 * @return {jsx}
 */
export const PaymentInformation = ({ isOpen, onClose, data }) => {
  const {
    service,
    paymentMethod,
    price,
    date,
    recipient,
    address,
    receipt_url,
  } = data;
  const { t } = useTranslation("payment-information");

  const handleViewReceiptButtonClick = (receiptUrl) => {
    window.open(receiptUrl, "_blank");
  };

  const paymentTime = getTime(date);

  return (
    <Modal
      classes="payment-information"
      heading={t("heading")}
      isOpen={isOpen}
      closeModal={onClose}
    >
      <Grid>
        <GridItem xs={4} md={8} lg={12}>
          <p>
            <span className="text">{t("service")}</span>
            <span className="payment-information__text">{service}</span>
          </p>
        </GridItem>
        {/* <GridItem xs={4} md={8} lg={12}>
          <p className="text">
            <span className="text">{t("date_of_consultation")}</span>
            <span className="payment-information__text">10.02.2022</span>
          </p>
        </GridItem> */}
        <GridItem xs={4} md={8} lg={12}>
          <p className="text">
            <span className="text">{t("date_of_payment")}</span>
            <span className="payment-information__text">
              {getDateView(date)}
            </span>
          </p>
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          <p className="text">
            <span className="text">{t("time_of_payment")}</span>
            <span className="payment-information__text">{paymentTime}</span>
          </p>
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          <p className="text">
            <span className="text">{t("payment_method")}</span>
            <span className="payment-information__text">{paymentMethod} </span>
          </p>
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          <p className="text">
            <span className="text">{t("recipient")}</span>
            <span className="payment-information__text">{recipient}</span>
          </p>
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          <p className="text">
            <span className="text">{t("address")}</span>
            <span className="payment-information__text">{address}</span>
          </p>
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          <p className="text">
            <span className="text">{t("email_address")}</span>
            <span className="payment-information__text">
              usupport@7digit.io
            </span>
          </p>
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          <Line />
        </GridItem>
        <GridItem xs={4} md={8} lg={12}>
          <p className="text">
            <span className="text">{t("price")}</span>
            <span className="payment-information__text">{price} </span>
          </p>
        </GridItem>

        <GridItem xs={4} md={8} lg={12}>
          <Button
            classes="payment-information__view-receipt-button"
            type="primary"
            label={t("view_receipt")}
            size="lg"
            onClick={() => handleViewReceiptButtonClick(receipt_url)}
          ></Button>
        </GridItem>
      </Grid>
    </Modal>
  );
};
