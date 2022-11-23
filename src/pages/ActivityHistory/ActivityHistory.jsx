import React, { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { Page, ActivityHistory as ActivityHistoryBlock } from "#blocks";
import { RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";
import { useBlockSlot, useScheduleConsultation } from "#hooks";
import { SelectConsultation, ConfirmConsultation } from "#backdrops";

import "./activity-history.scss";

/**
 * ActivityHistory
 *
 * ActivityHistory page
 *
 * @returns {JSX.Element}
 */
export const ActivityHistory = () => {
  const { width } = useWindowDimensions();
  const navigate = useNavigate();

  const location = useLocation();
  const consultationId = location.state?.consultationId;
  const providerId = location.state?.providerId;
  if (!consultationId || !providerId) return <Navigate to="/consultations" />;

  const [isBlockSlotSubmitting, setIsBlockSlotSubmitting] = useState(false);
  const [blockSlotError, setBlockSlotError] = useState();
  // const [consultationId, setConsultationId] = useState();
  const [selectedSlot, setSelectedSlot] = useState();

  // Modal state variables
  const [isSelectConsultationOpen, setIsSelectConsultationOpen] =
    useState(false);
  const [isConfirmBackdropOpen, setIsConfirmBackdropOpen] = useState(false);

  // Open modals
  const openSelectConsultation = () => setIsSelectConsultationOpen(true);
  const openConfirmConsultationBackdrop = () => setIsConfirmBackdropOpen(true);

  // Close modals
  const closeConfirmConsultationBackdrop = () =>
    setIsConfirmBackdropOpen(false);
  const closeSelectConsultation = () => setIsSelectConsultationOpen(false);

  const onBlockSlotSuccess = (consultationId) => {
    // setIsBlockSlotSubmitting(false);
    // setConsultationId(consultationId);

    scheduleConsultationMutation.mutate(consultationId);

    // closeSelectConsultation();
    // openConfirmConsultationBackdrop();
  };
  const onBlockSlotError = (error) => {
    setBlockSlotError(error);
    setIsBlockSlotSubmitting(false);
  };
  const blockSlotMutation = useBlockSlot(onBlockSlotSuccess, onBlockSlotError);

  const onScheduleConsultationSuccess = (data) => {
    setIsBlockSlotSubmitting(false);
    // setConsultationId(consultationId);
    closeSelectConsultation();
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

  const handleBlockSlot = (slot) => {
    setIsBlockSlotSubmitting(true);
    setSelectedSlot(slot);
    blockSlotMutation.mutate({
      slot,
      providerId: providerId,
    });
  };

  const handleGoBack = () => navigate(-1);

  return (
    <Page
      classes="page__activity-history"
      showEmergencyButton={false}
      handleGoBack={handleGoBack}
      showFooter={width < 768 ? false : true}
      showNavbar={width < 768 ? false : true}
      additionalPadding={width < 768 ? false : true}
      showGoBackArrow={false}
    >
      <ActivityHistoryBlock
        openSelectConsultation={openSelectConsultation}
        consultationId={consultationId}
      />
      {width < 768 && (
        <RadialCircle classes="page__activity-history__radial-circle" />
      )}

      <SelectConsultation
        isOpen={isSelectConsultationOpen}
        onClose={closeSelectConsultation}
        handleBlockSlot={handleBlockSlot}
        providerId={providerId}
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
