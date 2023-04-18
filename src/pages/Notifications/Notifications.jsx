import React, { useState } from "react";
import { Page, Notifications as NotificationsBlock } from "#blocks";
import { JoinConsultation } from "#backdrops";

import "./notifications.scss";

/**
 * Notifications
 *
 * Notifiations page
 *
 * @returns {JSX.Element}
 */
export const Notifications = () => {
  const [selectedConsultation, setSelectedConsultation] = useState();

  const [isJoinConsultationOpen, setIsJoinConsultationOpen] = useState(false);
  const openJoinConsultation = (consultation) => {
    setSelectedConsultation(consultation);
    setIsJoinConsultationOpen(true);
  };
  const closeJoinConsultation = () => setIsJoinConsultationOpen(false);
  return (
    <Page classes="page__notifications" showGoBackArrow={false}>
      <NotificationsBlock openJoinConsultation={openJoinConsultation} />
      <JoinConsultation
        isOpen={isJoinConsultationOpen}
        onClose={closeJoinConsultation}
        consultation={selectedConsultation}
      />
    </Page>
  );
};
