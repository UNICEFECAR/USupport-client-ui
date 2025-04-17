import React, { useState, useRef, useContext } from "react";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RadialCircle } from "@USupport-components-library/src";

import {
  useCustomNavigate as useNavigate,
  useBlockSlot,
  useScheduleConsultation,
  useGetClientData,
} from "#hooks";
import { Page, ProviderOverview as ProviderOverviewBlock } from "#blocks";
import { SelectConsultation, ConfirmConsultation } from "#backdrops";
import { RequireDataAgreement } from "#modals";
import { RootContext } from "#routes";

import "./provider-overview.scss";

/**
 * ProviderOverview
 *
 * ProviderOverview page
 *
 * @returns {JSX.Element}
 */
export const ProviderOverview = () => {
  const { t } = useTranslation("provider-overview-page");
  const { setActiveCoupon } = useContext(RootContext);

  const navigate = useNavigate();

  const providerId = new URLSearchParams(window.location.search).get(
    "provider-id"
  );
  if (!providerId)
    return (
      <Navigate
        to={`/${localStorage.getItem("language")}/client/select-provider`}
      />
    );

  const clientData = useGetClientData()[1];

  const [isBlockSlotSubmitting, setIsBlockSlotSubmitting] = useState(false);
  const [blockSlotError, setBlockSlotError] = useState();
  const [consultationId, setConsultationId] = useState();
  const consultationPrice = useRef();
  const selectedSlot = useRef();

  // Modal state variables
  const [isScheduleBackdropOpen, setIsScheduleBackdropOpen] = useState(false);
  const [isConfirmBackdropOpen, setIsConfirmBackdropOpen] = useState(false);
  const [isRequireDataAgreementOpen, setIsRequireDataAgreementOpen] =
    useState(false);

  // Open modals
  const openScheduleBackdrop = () => {
    if (!clientData.dataProcessing) {
      openRequireDataAgreement();
    } else {
      setIsScheduleBackdropOpen(true);
    }
  };
  const openConfirmConsultationBackdrop = () => setIsConfirmBackdropOpen(true);
  const openRequireDataAgreement = () => setIsRequireDataAgreementOpen(true);

  // Close modals
  const closeConfirmConsultationBackdrop = () =>
    setIsConfirmBackdropOpen(false);
  const closeScheduleBackdrop = () => setIsScheduleBackdropOpen(false);
  const closeRequireDataAgreement = () => setIsRequireDataAgreementOpen(false);

  const onBlockSlotSuccess = (consultationId) => {
    if (
      consultationPrice.current &&
      consultationPrice.current > 0 &&
      !selectedSlot.current?.campaign_id
    ) {
      navigate("/checkout", {
        state: {
          consultationId: consultationId,
          campaignId: selectedSlot.current?.campaign_id,
        },
      });
    } else {
      scheduleConsultationMutation.mutate(consultationId);
    }
  };
  const onBlockSlotError = (error) => {
    setBlockSlotError(error);
    setIsBlockSlotSubmitting(false);
  };
  const blockSlotMutation = useBlockSlot(onBlockSlotSuccess, onBlockSlotError);

  const onScheduleConsultationSuccess = () => {
    setIsBlockSlotSubmitting(false);
    setConsultationId(consultationId);
    closeScheduleBackdrop();
    openConfirmConsultationBackdrop();
    setBlockSlotError(null);
    setActiveCoupon(null);
    window.dispatchEvent(new Event("new-notification"));
  };
  const onScheduleConsultationError = (error) => {
    setBlockSlotError(error);
    setIsBlockSlotSubmitting(false);
  };
  const scheduleConsultationMutation = useScheduleConsultation(
    onScheduleConsultationSuccess,
    onScheduleConsultationError
  );

  const handleBlockSlot = (slot, price) => {
    setIsBlockSlotSubmitting(true);
    selectedSlot.current = slot;
    consultationPrice.current = price;
    blockSlotMutation.mutate({
      slot,
      providerId,
    });
  };

  return (
    <Page
      classes="page__provider-overview"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      {providerId && (
        <ProviderOverviewBlock
          providerId={providerId}
          openScheduleBackdrop={openScheduleBackdrop}
        />
      )}
      <RadialCircle
        color="purple"
        classes="page__provider-overview__radial-circle"
      />
      <SelectConsultation
        isOpen={isScheduleBackdropOpen}
        onClose={closeScheduleBackdrop}
        handleBlockSlot={handleBlockSlot}
        providerId={providerId}
        isCtaDisabled={isBlockSlotSubmitting}
        isMutating={
          isBlockSlotSubmitting || scheduleConsultationMutation.isLoading
        }
        errorMessage={blockSlotError}
      />
      {selectedSlot.current && (
        <ConfirmConsultation
          isOpen={isConfirmBackdropOpen}
          onClose={closeConfirmConsultationBackdrop}
          consultation={{
            startDate: new Date(
              selectedSlot.current?.time || selectedSlot.current
            ),
            endDate: new Date(
              new Date(
                selectedSlot.current?.time || selectedSlot.current
              ).setHours(
                new Date(
                  selectedSlot.current?.time || selectedSlot.current
                ).getHours() + 1
              )
            ),
          }}
        />
      )}
      <RequireDataAgreement
        isOpen={isRequireDataAgreementOpen}
        onClose={closeRequireDataAgreement}
        onSuccess={() => setIsScheduleBackdropOpen(true)}
      />
    </Page>
  );
};
