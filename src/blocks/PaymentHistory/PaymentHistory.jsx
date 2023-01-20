import React, { useState } from "react";
import { Block, PaymentsHistoryTable } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";

import { PaymentInformation } from "#modals";

import "./payment-history.scss";

/**
 * PaymentHistory
 *
 * PaymentHistory Block
 *
 * @return {jsx}
 */
export const PaymentHistory = () => {
  const { t } = useTranslation("payment-history-block");
  const rows = ["service", "price", "date_of_payment", ""];

  const [isPaymentInformationModalOpen, setIsPaymentInformationModalOpen] =
    useState(false);

  const [selectedPaymentData, setSelectedPaymentData] = useState();

  const data = [
    {
      paymentId: "1234",
      service: "Product 1",
      price: "$100",
      date: "2020-01-01",
    },
    {
      paymentId: "123",
      service: "Product 2",
      price: "$150",
      date: "2020-01-01",
    },
  ];
  const openPaymentModal = (paymentId) => {
    if (paymentId) {
      const newSelectedPaymentData = data.find(
        (item) => item.paymentId === paymentId
      );
      setSelectedPaymentData(newSelectedPaymentData);
      setIsPaymentInformationModalOpen(true);
    }
  };
  const closePaymentModal = () => setIsPaymentInformationModalOpen(false);

  return (
    <Block classes="payment-history">
      <PaymentsHistoryTable
        isLoading={false}
        rows={rows}
        data={data}
        handleViewMore={openPaymentModal}
        t={t}
      />

      {selectedPaymentData && (
        <PaymentInformation
          isOpen={isPaymentInformationModalOpen}
          onClose={() => closePaymentModal()}
          data={selectedPaymentData}
        />
      )}
    </Block>
  );
};
