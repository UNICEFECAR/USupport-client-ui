import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";

const SOCKET_IO_URL = `${import.meta.env.VITE_SOCKET_IO_URL}`;

// Short blips reconnect on their own, so the notice is shown only if the connection stays down
const RECONNECTING_NOTICE_DELAY = 2000;
const RESTORED_NOTICE_DURATION = 3000;

// The connection quality is measured by the round trip time of a small message to the gateway
const LATENCY_CHECK_INTERVAL = 5000;
const LATENCY_CHECK_TIMEOUT = 3000;
const POOR_LATENCY = 1500;
const GOOD_LATENCY = 800;
// Consecutive slow/fast checks needed to change the quality, so a single spike is ignored
const QUALITY_CHANGE_CHECKS = 2;

/**
 * The status shown to the user, from most to least important:
 * "reconnecting" | "peer_lost" | "poor" | "peer_poor" | "restored" | "peer_restored" | "online"
 */
const getDisplayedStatus = (
  ownStatus,
  isPoorConnection,
  peerStatus,
  peerQuality
) => {
  if (ownStatus === "reconnecting") return "reconnecting";
  if (peerStatus === "lost") return "peer_lost";
  if (isPoorConnection) return "poor";
  if (peerQuality === "poor") return "peer_poor";
  if (ownStatus === "restored") return "restored";
  if (peerStatus === "restored") return "peer_restored";
  return "online";
};

/**
 * "lost" if either side is disconnected, "poor" if either side has a poor connection, "good" otherwise
 */
const getCallQuality = (ownStatus, isPoorConnection, peerStatus, peerQuality) => {
  if (ownStatus === "reconnecting" || peerStatus === "lost") return "lost";
  if (isPoorConnection || peerQuality === "poor") return "poor";
  return "good";
};

export const useConsultationSocket = ({
  chatId,
  receiveMessage,
  isProviderTyping,
  setInterfaceData,
}) => {
  const language = localStorage.getItem("language");
  const country = localStorage.getItem("country");
  const queryClient = useQueryClient();

  // "online" | "reconnecting" | "restored"
  const [ownStatus, setOwnStatus] = useState("online");
  const [isPoorConnection, setIsPoorConnection] = useState(false);
  // Connection of the other participant: "online" | "lost" | "restored"
  const [peerStatus, setPeerStatus] = useState("online");
  // Connection quality reported by the other participant: "good" | "poor"
  const [peerQuality, setPeerQuality] = useState("good");
  // Whether the other participant has the consultation open, as reported by the gateway.
  // null until it is known (e.g. a gateway without presence support)
  const [isPeerPresent, setIsPeerPresent] = useState(null);

  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io(SOCKET_IO_URL, {
      path: "/api/v1/ws/socket.io",
      transports: ["websocket"],
      secure: false,
    });

    let isNoticeShown = false;
    let reconnectingNoticeTimeout, restoredNoticeTimeout, peerRestoredTimeout;

    const showReconnectingNotice = () => {
      clearTimeout(reconnectingNoticeTimeout);
      clearTimeout(restoredNoticeTimeout);
      isNoticeShown = true;
      setOwnStatus("reconnecting");
    };

    const handleConnectionRestored = () => {
      clearTimeout(reconnectingNoticeTimeout);
      if (!isNoticeShown) return;

      isNoticeShown = false;
      setOwnStatus("restored");
      restoredNoticeTimeout = setTimeout(
        () => setOwnStatus("online"),
        RESTORED_NOTICE_DURATION
      );
    };

    // Connection quality
    let slowChecks = 0;
    let fastChecks = 0;
    // Checks are evaluated only once the gateway has answered one, so a gateway
    // without support for them is not reported as a poor connection
    let isLatencyCheckSupported = false;

    const resetConnectionQuality = () => {
      slowChecks = 0;
      fastChecks = 0;
      setIsPoorConnection(false);
    };

    const checkLatency = () => {
      const socket = socketRef.current;
      if (!socket.connected) return;

      const startTime = performance.now();
      socket.timeout(LATENCY_CHECK_TIMEOUT).emit("latency check", (err) => {
        if (!err) isLatencyCheckSupported = true;
        if (!isLatencyCheckSupported || !socket.connected) return;

        const latency = err ? Infinity : performance.now() - startTime;
        if (latency >= POOR_LATENCY) {
          fastChecks = 0;
          slowChecks += 1;
          if (slowChecks >= QUALITY_CHANGE_CHECKS) setIsPoorConnection(true);
        } else if (latency <= GOOD_LATENCY) {
          slowChecks = 0;
          fastChecks += 1;
          if (fastChecks >= QUALITY_CHANGE_CHECKS) setIsPoorConnection(false);
        }
      });
    };
    const latencyCheckInterval = setInterval(
      checkLatency,
      LATENCY_CHECK_INTERVAL
    );

    // Every (re)connect creates a new server-side socket, so the chat has to be joined each time
    let hasConnectedBefore = false;
    socketRef.current.on("connect", () => {
      // The other participant may have reconnected meanwhile, the gateway reports it again if not
      clearTimeout(peerRestoredTimeout);
      setPeerStatus("online");
      setPeerQuality("good");
      setIsPeerPresent(null);

      socketRef.current.emit("join chat", {
        country,
        language,
        chatId,
        userType: "client",
      });

      // Messages sent while this socket was disconnected were only persisted, not delivered
      if (hasConnectedBefore) {
        queryClient.invalidateQueries(["chat-data", chatId]);
      }
      hasConnectedBefore = true;

      handleConnectionRestored();
    });

    socketRef.current.on("disconnect", (reason) => {
      resetConnectionQuality();

      // Disconnected on purpose when leaving the page
      if (reason === "io client disconnect") return;

      // The client does not reconnect by itself after a server-side disconnect
      if (reason === "io server disconnect") {
        socketRef.current.connect();
      }

      clearTimeout(reconnectingNoticeTimeout);
      reconnectingNoticeTimeout = setTimeout(
        showReconnectingNotice,
        RECONNECTING_NOTICE_DELAY
      );
    });

    socketRef.current.on("peer connection", (status) => {
      clearTimeout(peerRestoredTimeout);
      if (status === "lost") {
        setPeerStatus("lost");
      } else if (status === "restored") {
        setPeerStatus("restored");
        peerRestoredTimeout = setTimeout(
          () => setPeerStatus("online"),
          RESTORED_NOTICE_DURATION
        );
      }
    });

    socketRef.current.on("peer quality", (quality) => {
      setPeerQuality(quality === "poor" ? "poor" : "good");
    });

    socketRef.current.on("peer presence", (presence) => {
      setIsPeerPresent(presence === "present");
    });

    // The browser knows immediately when the network is gone
    const handleOffline = () => showReconnectingNotice();
    // Reconnect right away instead of waiting for the next reconnection attempt.
    // The socket may still look connected until the ping timeout detects the dead connection,
    // so a fresh connection is forced
    const handleOnline = () => {
      socketRef.current.disconnect().connect();
    };
    // Leaving the page is not a lost connection, so the other participant is not told otherwise
    const handlePageHide = () => {
      socketRef.current.disconnect();
    };
    // The page was restored from the back/forward cache after being hidden
    const handlePageShow = (event) => {
      if (event.persisted) socketRef.current.connect();
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    window.addEventListener("pagehide", handlePageHide);
    window.addEventListener("pageshow", handlePageShow);
    if (!navigator.onLine) showReconnectingNotice();

    socketRef.current.on("receive message", receiveMessage);

    socketRef.current.on("typing", (type) => {
      const isTyping = !isProviderTyping && type === "typing";
      setInterfaceData((prev) => ({ ...prev, isProviderTyping: isTyping }));
    });

    const systemMessage = {
      type: "system",
      content: "client_joined",
      time: JSON.stringify(new Date().getTime()),
    };

    const emitJoinMessageTimeout = setTimeout(() => {
      socketRef.current.emit("send message", {
        language,
        country,
        chatId,
        to: "provider",
        message: systemMessage,
      });
    }, 1500);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off();
        clearTimeout(emitJoinMessageTimeout);
      }
      clearInterval(latencyCheckInterval);
      clearTimeout(reconnectingNoticeTimeout);
      clearTimeout(restoredNoticeTimeout);
      clearTimeout(peerRestoredTimeout);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("pagehide", handlePageHide);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, []);

  // Let the other participant know about the quality of this connection
  const hasReportedQuality = useRef(false);
  useEffect(() => {
    // Nothing to report until the quality changes for the first time
    if (!hasReportedQuality.current && !isPoorConnection) return;
    hasReportedQuality.current = true;

    socketRef.current?.emit("connection quality", {
      chatId,
      userType: "client",
      quality: isPoorConnection ? "poor" : "good",
    });
  }, [isPoorConnection]);

  return {
    socketRef,
    isPeerPresent,
    connectionStatus: getDisplayedStatus(
      ownStatus,
      isPoorConnection,
      peerStatus,
      peerQuality
    ),
    // Health of the call, from both sides, shown by the connection icon in the controls
    callQuality: getCallQuality(ownStatus, isPoorConnection, peerStatus, peerQuality),
  };
};
