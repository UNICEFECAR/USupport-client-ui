import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Navigate } from "react-router-dom";
import { Button, RadialCircle } from "@USupport-components-library/src";
import {
  useBlockSlot,
  useScheduleConsultation,
} from "@USupport-components-library/hooks";
import { Page, ProviderOverview as ProviderOverviewBlock } from "#blocks";
import { SelectConsultation, ConfirmConsultation } from "#backdrops";

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
  // Should we get the provider ID from the URL or from the location
  const location = useLocation();
  const providerData = location.state?.providerData;
  if (!providerData) return <Navigate to="/select-provider" />;

  const [isBlockSlotSubmitting, setIsBlockSlotSubmitting] = useState(false);
  const [blockSlotError, setBlockSlotError] = useState();
  const [consultationId, setConsultationId] = useState();
  const [selectedSlot, setSelectedSlot] = useState();

  // Modal state variables
  const [isScheduleBackdropOpen, setIsScheduleBackdropOpen] = useState(false);
  const [isConfirmBackdropOpen, setIsConfirmBackdropOpen] = useState(false);

  // Open modals
  const openScheduleBackdrop = () => setIsScheduleBackdropOpen(true);
  const openConfirmConsultationBackdrop = () => setIsConfirmBackdropOpen(true);

  // Close modals
  const closeConfirmConsultationBackdrop = () =>
    setIsConfirmBackdropOpen(false);
  const closeScheduleBackdrop = () => setIsScheduleBackdropOpen(false);

  const onBlockSlotSuccess = (consultationId) => {
    // setIsBlockSlotSubmitting(false);
    // setConsultationId(consultationId);

    scheduleConsultationMutation.mutate(consultationId);

    // closeScheduleBackdrop();
    // openConfirmConsultationBackdrop();
  };
  const onBlockSlotError = (error) => {
    setBlockSlotError(error);
    setIsBlockSlotSubmitting(false);
  };
  const blockSlotMutation = useBlockSlot(onBlockSlotSuccess, onBlockSlotError);

  const onScheduleConsultationSuccess = (data) => {
    setIsBlockSlotSubmitting(false);
    setConsultationId(consultationId);
    closeScheduleBackdrop();
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
      providerId: providerData.providerDetailId,
    });
  };

  return (
    <Page
      classes="page__provider-overview"
      heading={t("heading")}
      subheading={t("subheading")}
    >
      {providerData && (
        <ProviderOverviewBlock
          provider={providerData}
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
        providerId={providerData?.providerDetailId}
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
