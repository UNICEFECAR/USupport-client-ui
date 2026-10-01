import React from "react";

import "./connection-status.scss";

/**
 * ConnectionStatus
 *
 * Shows a subtle notice when the connection drops during a consultation
 *
 * @param {"online" | "reconnecting" | "restored"} status
 * @param {function} t - translation function of the consultation page
 *
 * @return {jsx}
 */
export const ConnectionStatus = ({ status, t }) => {
  if (status === "online") return null;

  const isReconnecting = status === "reconnecting";

  return (
    <div
      className={`connection-status ${
        isReconnecting ? "" : "connection-status--restored"
      }`}
      role="status"
      aria-live="polite"
    >
      <span className="connection-status__dot" />
      <p className="small-text connection-status__text">
        {isReconnecting ? t("connection_lost") : t("connection_restored")}
      </p>
    </div>
  );
};
