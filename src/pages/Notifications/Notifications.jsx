import React from "react";
import { Page, Notifications as NotificationsBlock } from "#blocks";

import "./notifications.scss";

/**
 * Notifications
 *
 * Notifiations page
 *
 * @returns {JSX.Element}
 */
export const Notifications = () => {
  return (
    <Page classes="page__notifications" showGoBackArrow={false}>
      <NotificationsBlock />
    </Page>
  );
};
