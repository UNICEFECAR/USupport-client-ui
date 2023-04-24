import React, { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import { RadialCircle } from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import { useGetClientData } from "#hooks";
import { ScheduleConsultationGroup } from "#backdrops";
import { Page, ActivityHistory as ActivityHistoryBlock } from "#blocks";

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
  const openRequireDataAgreement = () => setIsRequireDataAgreementOpen(true);
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
      <ScheduleConsultationGroup
        isSelectConsultationOpen={isSelectConsultationOpen}
        setIsSelectConsultationOpen={setIsSelectConsultationOpen}
        isConfirmBackdropOpen={isConfirmBackdropOpen}
        setIsConfirmBackdropOpen={setIsConfirmBackdropOpen}
        isRequireDataAgreementOpen={isRequireDataAgreementOpen}
        setIsRequireDataAgreementOpen={setIsRequireDataAgreementOpen}
        providerId={providerId}
      />
    </Page>
  );
};
