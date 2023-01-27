import React, { useState } from "react";
import {
  Block,
  PaymentsHistoryTable,
  Loading,
} from "@USupport-components-library/src";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

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

  const [paymentsData, setPaymentsData] = useState([]);
  const [isPaymentInformationModalOpen, setIsPaymentInformationModalOpen] =
    useState(false);

  const [selectedPaymentData, setSelectedPaymentData] = useState();
  const [lastPaymentId, setLastPaymentId] = useState(null);

  const getPaymentHistory = async () => {
    console.log("startingAfterPaymentIntentId dsdddddd", lastPaymentId);
    try {
      const res = await paymentsSvc.getPaymentHistory({
        limit: 2,
        startingAfterPaymentIntentId: lastPaymentId,
      });

      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const paymentHistoryQuery = useQuery(
    ["paymentHistoryData"],
    getPaymentHistory,
    {
      onSuccess: (data) => {
        const lastPayment = data.lastPaymentId;
        const payments = data.payments;

        setPaymentsData((prevPayments) => [...prevPayments, ...payments]);
        setLastPaymentId(lastPayment);
      },
    }
  );

  const openPaymentModal = (paymentId) => {
    if (paymentId && paymentsData.length > 0) {
      const newSelectedPaymentData = paymentsData.find(
        (item) => item.paymentId === paymentId
      );
      setSelectedPaymentData(newSelectedPaymentData);
      setIsPaymentInformationModalOpen(true);
    }
  };
  const closePaymentModal = () => setIsPaymentInformationModalOpen(false);

  return (
    <Block classes="payment-history">
      <InfiniteScroll
        dataLength={paymentsData.length || 0}
        hasMore={paymentHistoryQuery.data?.hasMore}
        loader={<Loading />}
        next={() => paymentHistoryQuery.refetch()}
        initialScrollY={20}
        scrollThreshold={0}
      >
        <PaymentsHistoryTable
          isLoading={paymentHistoryQuery.isLoading}
          rows={rows}
          data={paymentsData}
          handleViewMore={openPaymentModal}
          t={t}
        />
      </InfiniteScroll>

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
