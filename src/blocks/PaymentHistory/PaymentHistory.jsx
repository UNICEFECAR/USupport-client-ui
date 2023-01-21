import React, { useState } from "react";
import { Block, PaymentsHistoryTable } from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";

import { PaymentInformation } from "#modals";

import { paymentsSvc } from "@USupport-components-library/services";

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

  const getPaymentHistory = async () => {
    try {
      const res = await paymentsSvc.getPaymentHistory();

      return res.data;
    } catch {}
  };

  const paymentHistoryQuery = useQuery(
    ["paymentHistoryData"],
    getPaymentHistory,
    {
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    }
  );

  const openPaymentModal = (paymentId) => {
    if (paymentId && paymentHistoryQuery.data) {
      const newSelectedPaymentData = paymentHistoryQuery.data.find(
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
        isLoading={paymentHistoryQuery.isLoading}
        rows={rows}
        data={paymentHistoryQuery.data}
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
