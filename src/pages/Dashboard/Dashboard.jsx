import React, { useState, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useCustomNavigate as useNavigate } from "#hooks";
import { useTranslation } from "react-i18next";

import {
  Page,
  MascotWelcomeHeader,
  MoodTracker,
  ConsultationsDashboard,
  ArticlesDashboard,
} from "#blocks";

import {
  CancelConsultation,
  EditConsultation,
  JoinConsultation,
  ConfirmConsultation,
  SelectConsultation,
} from "#backdrops";

import {
  useAcceptConsultation,
  useBlockSlot,
  useRescheduleConsultation,
  useGetAllConsultations,
  useScheduleConsultation,
  useGetClientData,
} from "#hooks";

import { BaselineAssesmentModal, RequireDataAgreement } from "#modals";

import { userSvc } from "@USupport-components-library/services";
import { ONE_HOUR } from "@USupport-components-library/utils";
import "./dashboard.scss";

/**
 * Dashboard
 *
 * Dashboard page
 *
 * @returns {JSX.Element}
 */
export const Dashboard = () => {
  const { t } = useTranslation("pages", { keyPrefix: "dashboard-page" });
  const navigate = useNavigate();
  const isTmpUser = userSvc.getUserID() === "tmp-user";
  const clientDataQuery = useGetClientData(!isTmpUser)[0];
  const clientData = clientDataQuery?.data;

  const IS_RO = localStorage.getItem("country") === "RO";

  const clientName = clientData
    ? clientData.name
      ? `${clientData.name} ${clientData.surname || ""}`
      : clientData.nickname
    : "";

  const queryClient = useQueryClient();

  const consultationPrice = useRef();

  // Get the consultations data only if the user is NOT temporary
  const consultationsQuery = isTmpUser ? [] : useGetAllConsultations();

  const upcomingConsultations = useMemo(() => {
    const currentDateTs = new Date().getTime();
    if (consultationsQuery.data) {
      return consultationsQuery.data
        ?.filter((consultation) => {
          const endTime = consultation.timestamp + ONE_HOUR;
          return (
            consultation.timestamp >= currentDateTs ||
            (currentDateTs >= consultation.timestamp &&
              currentDateTs <= endTime)
          );
        })
        .sort((a, b) => a.timestamp - b.timestamp);
    }
    return null;
  }, [consultationsQuery.data]);

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
    setSelectedConsultation(consultation);
    setIsJoinConsultationOpen(true);
  };
  const closeJoinConsultation = () => setIsJoinConsultationOpen(false);

  const [isEditingConsultation] = useState(true);
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

  // Accept consultation logic

  const onAcceptConsultationSuccess = () => {
    toast(t("accept_success"));
    window.dispatchEvent(new Event("new-notification"));
  };
  const onAcceptConsultationError = (error) => {
    toast(error, { type: "error" });
  };
  const acceptConsultationMutation = useAcceptConsultation(
    onAcceptConsultationSuccess,
    onAcceptConsultationError
  );

  const handleAcceptSuggestion = (consultationId, price) => {
    if (!clientData.dataProcessing) {
      openRequireDataAgreement(true);
    } else {
      acceptConsultationMutation.mutate({ consultationId, price });
    }
  };

  // Schedule consultation logic
  const onRescheduleConsultationSuccess = () => {
    setIsBlockSlotSubmitting(false);
    setConsultationId(consultationId);
    closeSelectConsultationBackdrop();
    openConfirmConsultationBackdrop();
    setBlockSlotError(null);
    window.dispatchEvent(new Event("new-notification"));

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

  const onScheduleConsultationError = (error) => {
    toast(error, { type: "error" });
  };
  const scheduleConsultationMutation = useScheduleConsultation(
    onRescheduleConsultationSuccess,
    onScheduleConsultationError
  );

  // Block slot logic
  const onBlockSlotSuccess = (newConsultationId) => {
    if (isEditingConsultation) {
      rescheduleConsultationMutation.mutate({
        consultationId: selectedConsultationId,
        newConsultationId,
      });
    } else {
      if (consultationPrice.current && consultationPrice.current > 0) {
        navigate(`/checkout`, {
          state: { consultationId: consultationId },
        });
      } else {
        scheduleConsultationMutation.mutate(selectedConsultationId);
      }
    }
  };
  const onBlockSlotError = (error) => {
    setBlockSlotError(error);
    setIsBlockSlotSubmitting(false);
  };
  const blockSlotMutation = useBlockSlot(onBlockSlotSuccess, onBlockSlotError);

  const handleBlockSlot = (slot, price) => {
    setIsBlockSlotSubmitting(true);
    setSelectedSlot(slot);
    consultationPrice.current = price;
    blockSlotMutation.mutate({
      slot,
      providerId: selectedConsultationProviderId,
      rescheduleCampaignSlot: slot?.campaign_id ? true : false,
    });
  };
  const handleScheduleConsultation = () => {
    if (!clientData.dataProcessing) {
      openRequireDataAgreement();
    } else {
      navigate(`/select-provider`);
    }
  };

  const handleDataAgreementSucess = () => {
    if (redirectToSelectProvider) {
      navigate(`/select-provider`);
    }
  };
  return (
    <Page
      classes="page__dashboard"
      showNavbar
      showFooter
      showEmergencyButton
      showGoBackArrow={false}
    >
      <BaselineAssesmentModal />
      <div className="page__dashboard__content">
        <MascotWelcomeHeader
          nextConsultation={
            upcomingConsultations ? upcomingConsultations[0] : null
          }
          handleJoin={openJoinConsultation}
          handleEdit={openEditConsultation}
          handleSchedule={handleScheduleConsultation}
          handleAcceptSuggestion={handleAcceptSuggestion}
          name={clientName}
          t={t}
        />
        <MoodTracker isTmpUser={isTmpUser} />
        <ArticlesDashboard />
        {!IS_RO && (
          <ConsultationsDashboard
            openJoinConsultation={openJoinConsultation}
            openEditConsultation={openEditConsultation}
            handleAcceptSuggestion={handleAcceptSuggestion}
            handleSchedule={handleScheduleConsultation}
            upcomingConsultations={upcomingConsultations}
            isLoading={consultationsQuery.isLoading}
            t={t}
          />
        )}
        {/* <ActivityLogDashboard /> */}
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
            couponCode={selectedConsultation?.couponCode}
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
      </div>
      <RequireDataAgreement
        isOpen={isRequireDataAgreementOpen}
        onClose={closeRequireDataAgreement}
        onSuccess={handleDataAgreementSucess}
      />
    </Page>
  );
};
