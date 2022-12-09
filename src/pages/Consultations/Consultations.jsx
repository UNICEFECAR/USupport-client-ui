import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Page, Consultations as ConsultationsBlock } from "#blocks";
import {
  CancelConsultation,
  EditConsultation,
  JoinConsultation,
  ConfirmConsultation,
  SelectConsultation,
} from "#backdrops";
import { useBlockSlot, useRescheduleConsultation } from "#hooks";
import { Button } from "@USupport-components-library/src";

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
  const openSelectConsultation = () =>
    setIsSelectConsultationBackdropOpen(true);
  const openConfirmConsultationBackdrop = () => setIsConfirmBackdropOpen(true);

  // Close modals
  const closeConfirmConsultationBackdrop = () =>
    setIsConfirmBackdropOpen(false);
  const closeSelectConsultationBackdrop = () =>
    setIsSelectConsultationBackdropOpen(false);

  // Schedule consultation logic
  const onRescheduleConsultationSuccess = (data) => {
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
    // setIsBlockSlotSubmitting(false);
    // setConsultationId(consultationId);
    rescheduleConsultationMutation.mutate({
      consultationId: selectedConsultationId,
      newConsultationId,
    });

    // closeSelectConsultationBackdrop();
    // openConfirmConsultationBackdrop();
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

  const handleScheduleConsultationClick = () => {
    navigate("/select-provider");
  };

  return (
    <Page
      heading={t("header")}
      classes="page__consultations"
      headingButton={
        <Button
          label={t("button_label")}
          onClick={() => handleScheduleConsultationClick()}
          size="lg"
        />
      }
    >
      <ConsultationsBlock
        openJoinConsultation={openJoinConsultation}
        openEditConsultation={openEditConsultation}
      />
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
      <SelectConsultation
        isOpen={isSelectConsultationBackdropOpen}
        onClose={closeSelectConsultationBackdrop}
        handleBlockSlot={handleBlockSlot}
        providerId={selectedConsultationProviderId}
        isCtaDisabled={isBlockSlotSubmitting}
        errorMessage={blockSlotError}
        edit
      />
      {selectedSlot && (
        <ConfirmConsultation
          isOpen={isConfirmBackdropOpen}
          onClose={closeConfirmConsultationBackdrop}
          consultation={{
            startDate: new Date(selectedSlot),
            endDate: new Date(
              new Date(selectedSlot).setHours(
                new Date(selectedSlot).getHours() + 1
              )
            ),
          }}
        />
      )}
    </Page>
  );
};
