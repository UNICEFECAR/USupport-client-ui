import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  Block,
  Loading,
  BaseTable,
  Button,
} from "@USupport-components-library/src";

import {
  getDateView,
  getTime,
  downloadCSVFile,
} from "@USupport-components-library/src/utils";
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
  const rows = [
    { label: t("service") },
    { label: t("price"), isCentered: true },
    { label: t("date_of_payment"), isCentered: true },
    { label: "" },
  ];
  const currencySymbol = localStorage.getItem("currency_symbol");

  const [paymentsData, setPaymentsData] = useState([]);
  const [isPaymentInformationModalOpen, setIsPaymentInformationModalOpen] =
    useState(false);

  const [selectedPaymentData, setSelectedPaymentData] = useState();
  const [lastPaymentId, setLastPaymentId] = useState(null);

  const getPaymentHistory = async () => {
    try {
      const res = await paymentsSvc.getPaymentHistory({
        limit: 30,
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

        if (payments) {
          setPaymentsData((prevPayments) => [...prevPayments, ...payments]);
        }
        setLastPaymentId(lastPayment);
        if (data.hasMore) {
          setTimeout(() => {
            paymentHistoryQuery.refetch();
          }, 150);
        }
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

  const getTableRows = () => {
    return paymentsData?.map((payment) => {
      return [
        <p className="text">{t(payment.service)}</p>,
        <p className="text centered">
          {payment.price}
          {currencySymbol}
        </p>,
        <p className="text centered">
          {getDateView(payment.date)} - {getTime(payment.date)}
        </p>,
        <Button
          type="link"
          label={t("more_details")}
          onClick={() => openPaymentModal(payment.paymentId)}
        />,
      ];
    });
  };

  const handleExportPaymentHistory = () => {
    let csv = `${rows
      .slice(0, rows.length - 1)
      .map((x) => x.label)
      .join(",")},${t("more_details")}\n`;

    paymentsData.forEach((p) => {
      csv += `${p.service},${p.price}${currencySymbol},${getDateView(
        p.date
      )} - ${getTime(p.date)},${p.receipt_url}\n`;
    });
    downloadCSVFile(csv, `payment-history-${getDateView(new Date())}.csv`);
  };

  return (
    <Block classes="payment-history">
      <InfiniteScroll
        dataLength={paymentsData.length || 0}
        hasMore={paymentHistoryQuery.data?.hasMore}
        loader={<Loading padding="1rem" />}
        next={() => {}}
        initialScrollY={20}
        scrollThreshold={0}
      >
        {paymentsData.length === 0 && paymentHistoryQuery.isLoading ? (
          <Loading />
        ) : (
          <BaseTable
            rowsData={getTableRows()}
            data={paymentsData}
            rows={rows}
            t={t}
            hasMenu={false}
            secondaryButtonLabel={t("export_label")}
            secondaryButtonAction={handleExportPaymentHistory}
            isSecondaryButtonDisabled={
              paymentsData.length === 0 ||
              paymentHistoryQuery.data?.hasMore === true
            }
          />
        )}
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
