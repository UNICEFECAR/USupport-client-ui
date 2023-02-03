import React, { useState, useRef } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import {
  useBlockSlot,
  useScheduleConsultation,
  useGetClientData,
} from "#hooks";
import { SelectConsultation, ConfirmConsultation } from "#backdrops";
import { Page, ActivityHistory as ActivityHistoryBlock } from "#blocks";
import { RequireDataAgreement } from "#modals";

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
  const consultation = location.state?.consultation;
  const providerId = location.state?.providerId;
  if (!consultation || !providerId) return <Navigate to="/consultations" />;

  const clientData = useGetClientData()[1];

  const [isBlockSlotSubmitting, setIsBlockSlotSubmitting] = useState(false);
  const [blockSlotError, setBlockSlotError] = useState();
  // const [consultationId, setConsultationId] = useState();
  const [selectedSlot, setSelectedSlot] = useState();
  const consultationPrice = useRef();

  // Modal state variables
  const [isSelectConsultationOpen, setIsSelectConsultationOpen] =
    useState(false);
  const [isConfirmBackdropOpen, setIsConfirmBackdropOpen] = useState(false);
  const [isRequireDataAgreementOpen, setIsRequireDataAgreementOpen] =
    useState(false);

  // Open modals
  const openSelectConsultation = () => {
    if (!clientData.dataProcessing) {
      openRequireDataAgreement();
    } else {
      setIsSelectConsultationOpen(true);
    }
  };
  const openConfirmConsultationBackdrop = () => setIsConfirmBackdropOpen(true);
  const openRequireDataAgreement = () => setIsRequireDataAgreementOpen(true);

  // Close modals
  const closeConfirmConsultationBackdrop = () =>
    setIsConfirmBackdropOpen(false);
  const closeSelectConsultation = () => setIsSelectConsultationOpen(false);
  const closeRequireDataAgreement = () => setIsRequireDataAgreementOpen(false);

  const onBlockSlotSuccess = (consultationId) => {
    // setIsBlockSlotSubmitting(false);
    // setConsultationId(consultationId);

    if (consultationPrice.current && consultationPrice.current > 0) {
      navigate(`/checkout`, { state: { consultationId: consultationId } });
    } else {
      scheduleConsultationMutation.mutate({ consultationId });
    }

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

  const handleBlockSlot = (slot, price) => {
    setIsBlockSlotSubmitting(true);
    setSelectedSlot(slot);
    consultationPrice.current = price;
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
        consultation={consultation}
        providerId={providerId}
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
      <RequireDataAgreement
        isOpen={isRequireDataAgreementOpen}
        onClose={closeRequireDataAgreement}
        onSuccess={() => setIsSelectConsultationOpen(true)}
      />
    </Page>
  );
};
