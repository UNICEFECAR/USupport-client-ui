import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Page, Consultations as ConsultationsBlock } from "#blocks";
import {
  CancelConsultation,
  EditConsultation,
  JoinConsultation,
  ConfirmConsultation,
  SelectConsultation,
} from "#backdrops";

import { RequireDataAgreement } from "#modals";

import {
  useBlockSlot,
  useRescheduleConsultation,
  useGetClientData,
  useAcceptConsultation,
} from "#hooks";
import { RootContext } from "#routes";

import { Button, Loading } from "@USupport-components-library/src";

import "./consultations.scss";

/**
 * Consultations
 *
 * Consultations page
 *
 * @returns {JSX.Element}
 */
export const Consultations = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { t } = useTranslation("consultations-page");

  const { isTmpUser } = useContext(RootContext);

  if (isTmpUser) return <Navigate to="/dashboard" />;

  const clientDataQuery = useGetClientData()[0];

  const [selectedConsultation, setSelectedConsultation] = useState();
  const [selectedConsultationProviderId, setSelectedConsultationProviderId] =
    useState();
  const [selectedConsultationId, setSelectedConsultationId] = useState();

  const [isEditConsultationOpen, setIsEditConsultationOpen] = useState(false);
  const openEditConsultation = (consultation) => {
    setSelectedConsultationId(consultation.consultationId);
    setSelectedConsultationProviderId(consultation.providerId);
    setSelectedConsultation(consultation);
    setIsEditConsultationOpen(true);
  };
  const closeEditConsultation = () => setIsEditConsultationOpen(false);

  const [isCancelConsultationOpen, setIsCancelConsultationOpen] =
    useState(false);
  const openCancelConsultation = () => setIsCancelConsultationOpen(true);
  const closeCancelConsultation = () => setIsCancelConsultationOpen(false);

  const [isJoinConsultationOpen, setIsJoinConsultationOpen] = useState(false);
  const openJoinConsultation = (consultation) => {
    setIsJoinConsultationOpen(true);
    setSelectedConsultation(consultation);
  };
  const closeJoinConsultation = () => setIsJoinConsultationOpen(false);

  const [isRequireDataAgreementOpen, setIsRequireDataAgreementOpen] =
    useState(false);

  const [redirectToSelectProvider, setRedirectToSelectProvider] =
    useState(true);

  const openRequireDataAgreement = (successAction) => {
    if (successAction) {
      setRedirectToSelectProvider(false);
    } else {
      setRedirectToSelectProvider(true);
    }
    setIsRequireDataAgreementOpen(true);
  };
  const closeRequireDataAgreement = () => setIsRequireDataAgreementOpen(false);

  const [isBlockSlotSubmitting, setIsBlockSlotSubmitting] = useState(false);
  const [blockSlotError, setBlockSlotError] = useState();
  const [consultationId, setConsultationId] = useState();
  const [selectedSlot, setSelectedSlot] = useState();

  // Modal state variables
  const [
    isSelectConsultationBackdropOpen,
    setIsSelectConsultationBackdropOpen,
  ] = useState(false);
  const [isConfirmBackdropOpen, setIsConfirmBackdropOpen] = useState(false);

  // Open modals
  const openSelectConsultation = () => {
    setIsSelectConsultationBackdropOpen(true);
  };

  const openConfirmConsultationBackdrop = () => setIsConfirmBackdropOpen(true);

  // Close modals
  const closeConfirmConsultationBackdrop = () =>
    setIsConfirmBackdropOpen(false);
  const closeSelectConsultationBackdrop = () =>
    setIsSelectConsultationBackdropOpen(false);

  // Schedule consultation logic
  const onRescheduleConsultationSuccess = () => {
    setIsBlockSlotSubmitting(false);
    setConsultationId(consultationId);
    closeSelectConsultationBackdrop();
    openConfirmConsultationBackdrop();
    setBlockSlotError(null);

    queryClient.invalidateQueries(["all-consultations"]);
  };
  const onRescheduleConsultationError = (error) => {
    setBlockSlotError(error);
    setIsBlockSlotSubmitting(false);
  };
  const rescheduleConsultationMutation = useRescheduleConsultation(
    onRescheduleConsultationSuccess,
    onRescheduleConsultationError
  );

  // Block slot logic
  const onBlockSlotSuccess = (newConsultationId) => {
    rescheduleConsultationMutation.mutate({
      consultationId: selectedConsultationId,
      newConsultationId,
    });
  };
  const onBlockSlotError = (error) => {
    setBlockSlotError(error);
    setIsBlockSlotSubmitting(false);
  };
  const blockSlotMutation = useBlockSlot(onBlockSlotSuccess, onBlockSlotError);

  const handleBlockSlot = (slot) => {
    setIsBlockSlotSubmitting(true);
    setSelectedSlot(slot);
    blockSlotMutation.mutate({
      slot,
      providerId: selectedConsultationProviderId,
    });
  };

  const onAcceptConsultationSuccess = () => {
    toast(t("accept_consultation_success"));
    window.dispatchEvent(new Event("new-notification"));
  };
  const onAcceptConsultationError = (error) => {
    toast(error, { type: "error" });
  };
  const acceptConsultationMutation = useAcceptConsultation(
    onAcceptConsultationSuccess,
    onAcceptConsultationError
  );
  const acceptConsultation = (consultationId, price) => {
    if (!clientDataQuery.data?.dataProcessing) {
      openRequireDataAgreement(true);
    } else {
      acceptConsultationMutation.mutate({ consultationId, price });
    }
  };

  const handleScheduleConsultationClick = () => {
    if (!clientDataQuery.data?.dataProcessing) {
      openRequireDataAgreement();
    } else {
      navigate("/select-provider");
    }
  };

  const handleDataAgreementSuccess = () => {
    if (redirectToSelectProvider) {
      navigate("/select-provider");
    }
  };

  return (
    <Page
      heading={t("header")}
      classes="page__consultations"
      headingButton={
        <Button
          label={t("button_label")}
          onClick={handleScheduleConsultationClick}
          size="lg"
        />
      }
    >
      {clientDataQuery.isLoading || clientDataQuery.isFetching ? (
        <Loading />
      ) : (
        <ConsultationsBlock
          openJoinConsultation={openJoinConsultation}
          openEditConsultation={openEditConsultation}
          acceptConsultation={acceptConsultation}
          openRequireDataAgreement={openRequireDataAgreement}
        />
      )}
      {selectedConsultation && (
        <>
          <EditConsultation
            isOpen={isEditConsultationOpen}
            onClose={closeEditConsultation}
            openCancelConsultation={openCancelConsultation}
            openSelectConsultation={openSelectConsultation}
            consultation={selectedConsultation}
          />
          <CancelConsultation
            isOpen={isCancelConsultationOpen}
            onClose={closeCancelConsultation}
            consultation={selectedConsultation}
          />
        </>
      )}

      <JoinConsultation
        isOpen={isJoinConsultationOpen}
        onClose={closeJoinConsultation}
        consultation={selectedConsultation}
      />
      {selectedConsultationProviderId && (
        <SelectConsultation
          isOpen={isSelectConsultationBackdropOpen}
          onClose={closeSelectConsultationBackdrop}
          handleBlockSlot={handleBlockSlot}
          providerId={selectedConsultationProviderId}
          isCtaDisabled={isBlockSlotSubmitting}
          errorMessage={blockSlotError}
          edit
          campaignId={selectedConsultation?.campaignId}
        />
      )}
      {selectedSlot && (
        <ConfirmConsultation
          isOpen={isConfirmBackdropOpen}
          onClose={closeConfirmConsultationBackdrop}
          consultation={{
            startDate: new Date(selectedSlot?.time || selectedSlot),
            endDate: new Date(
              new Date(selectedSlot?.time || selectedSlot).setHours(
                new Date(selectedSlot?.time || selectedSlot).getHours() + 1
              )
            ),
          }}
        />
      )}
      <RequireDataAgreement
        isOpen={isRequireDataAgreementOpen}
        onClose={closeRequireDataAgreement}
        onSuccess={handleDataAgreementSuccess}
      />
    </Page>
  );
};
