import React from "react";

import "./connection-status.scss";

// Translation key and dot style for every status that shows a notice
const NOTICES = {
  reconnecting: { key: "connection_lost", modifier: "lost" },
  peer_lost: { key: "peer_connection_lost", modifier: "lost" },
  poor: { key: "connection_poor", modifier: "poor" },
  peer_poor: { key: "peer_connection_poor", modifier: "poor" },
  restored: { key: "connection_restored", modifier: "restored" },
  peer_restored: { key: "peer_connection_restored", modifier: "restored" },
};

/**
 * ConnectionStatus
 *
 * Shows a subtle notice when the connection drops or is poor during a consultation,
 * or when the other participant loses connection or has a poor connection
 *
 * @param {"online" | "reconnecting" | "peer_lost" | "poor" | "peer_poor" | "restored" | "peer_restored"} status
 * @param {function} t - translation function of the consultation page
 *
 * @return {jsx}
 */
export const ConnectionStatus = ({ status, t }) => {
  const notice = NOTICES[status];
  if (!notice) return null;

  return (
    <div
      className={`connection-status connection-status--${notice.modifier}`}
      role="status"
      aria-live="polite"
    >
      <span className="connection-status__dot" />
      <p className="text connection-status__text">{t(notice.key)}</p>
    </div>
  );
};
