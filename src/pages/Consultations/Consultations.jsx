import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { Page, Consultations as ConsultationsBlock } from "#blocks";
import {
  CancelConsultation,
  EditConsultation,
  JoinConsultation,
  ConfirmConsultation,
  SelectConsultation,
} from "#backdrops";
import {
  useBlockSlot,
  useScheduleConsultation,
} from "@USupport-components-library/hooks";
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
  const navigate = useNavigate();
  const { t } = useTranslation("consultations-page");

  const [selectedConsultationProviderId, setSelectedConsultationProviderId] =
    useState();
  const [selectedConsultationId, setSelectedConsultationId] = useState();

  const [isEditConsultationOpen, setIsEditConsultationOpen] = useState(false);
  const openEditConsultation = (providerId, consultationId) => {
    if (providerId) {
      setSelectedConsultationProviderId(providerId);
    }
    if (consultationId) {
      setSelectedConsultationId(consultationId);
    }
    setIsEditConsultationOpen(true);
  };
  const closeEditConsultation = () => setIsEditConsultationOpen(false);

  const [isCancelConsultationOpen, setIsCancelConsultationOpen] =
    useState(false);
  const openCancelConsultation = () => setIsCancelConsultationOpen(true);
  const closeCancelConsultation = () => setIsCancelConsultationOpen(false);

  const [isJoinConsultationOpen, setIsJoinConsultationOpen] = useState(false);
  const openJoinConsultation = () => setIsJoinConsultationOpen(true);
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
  const onScheduleConsultationSuccess = (data) => {
    setIsBlockSlotSubmitting(false);
    setConsultationId(consultationId);
    closeSelectConsultationBackdrop();
    openConfirmConsultationBackdrop();
    setBlockSlotError(null);
  };
  const onScheduleConsultationError = (error) => {
    setBlockSlotError(error);
    setIsBlockSlotSubmitting(false);
  };
  const scheduleConsultationMutation = useScheduleConsultation(
    onScheduleConsultationSuccess,
    onScheduleConsultationError
  );

  // Block slot logic
  const onBlockSlotSuccess = (consultationId) => {
    // setIsBlockSlotSubmitting(false);
    // setConsultationId(consultationId);

    scheduleConsultationMutation.mutate(consultationId);

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
    // TODO: Call the reschedule endpoint with the selectedConsultationId
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
      <EditConsultation
        isOpen={isEditConsultationOpen}
        onClose={closeEditConsultation}
        openCancelConsultation={openCancelConsultation}
        openSelectConsultation={openSelectConsultation}
      />
      <CancelConsultation
        isOpen={isCancelConsultationOpen}
        onClose={closeCancelConsultation}
      />
      <JoinConsultation
        isOpen={isJoinConsultationOpen}
        onClose={closeJoinConsultation}
      />
      <SelectConsultation
        isOpen={isSelectConsultationBackdropOpen}
        onClose={closeSelectConsultationBackdrop}
        handleBlockSlot={handleBlockSlot}
        providerId={selectedConsultationProviderId}
        isCtaDisabled={isBlockSlotSubmitting}
        errorMessage={blockSlotError}
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
