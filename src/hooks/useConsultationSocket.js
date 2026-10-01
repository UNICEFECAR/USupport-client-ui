import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";

const SOCKET_IO_URL = `${import.meta.env.VITE_SOCKET_IO_URL}`;

// Short blips reconnect on their own, so the notice is shown only if the connection stays down
const RECONNECTING_NOTICE_DELAY = 2000;
const RESTORED_NOTICE_DURATION = 3000;

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
  const [connectionStatus, setConnectionStatus] = useState("online");

  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io(SOCKET_IO_URL, {
      path: "/api/v1/ws/socket.io",
      transports: ["websocket"],
      secure: false,
    });

    let isNoticeShown = false;
    let reconnectingNoticeTimeout, restoredNoticeTimeout;

    const showReconnectingNotice = () => {
      clearTimeout(reconnectingNoticeTimeout);
      clearTimeout(restoredNoticeTimeout);
      isNoticeShown = true;
      setConnectionStatus("reconnecting");
    };

    const handleConnectionRestored = () => {
      clearTimeout(reconnectingNoticeTimeout);
      if (!isNoticeShown) return;

      isNoticeShown = false;
      setConnectionStatus("restored");
      restoredNoticeTimeout = setTimeout(
        () => setConnectionStatus("online"),
        RESTORED_NOTICE_DURATION
      );
    };

    // Every (re)connect creates a new server-side socket, so the chat has to be joined each time
    let hasConnectedBefore = false;
    socketRef.current.on("connect", () => {
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

    // The browser knows immediately when the network is gone
    const handleOffline = () => showReconnectingNotice();
    // Reconnect right away instead of waiting for the next reconnection attempt.
    // The socket may still look connected until the ping timeout (~45s) detects the dead connection,
    // so a fresh connection is forced
    const handleOnline = () => {
      socketRef.current.disconnect().connect();
    };
    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
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

    const handleBeforeUnload = () => {
      // leaveConsultation();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off();
        clearTimeout(emitJoinMessageTimeout);
      }
      clearTimeout(reconnectingNoticeTimeout);
      clearTimeout(restoredNoticeTimeout);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, []);

  return { socketRef, connectionStatus };
};
