import React, { useContext, useRef, useState, useEffect } from "react";

import { JitsiMeeting } from "@jitsi/react-sdk";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import { Controls, Loading } from "@USupport-components-library/src";
import {
  useWindowDimensions,
  ThemeContext,
  ONE_HOUR,
} from "@USupport-components-library/utils";

import { Page, SafetyFeedback } from "#blocks";
import { RootContext } from "#routes";
import {
  useConsultationSocket,
  useSendMessage,
  useGetSecurityCheckAnswersByConsultationId,
  useLeaveConsultation,
  useCustomNavigate as useNavigate,
} from "#hooks";

import { MessageList } from "./MessageList";

import "./jitsi-room.scss";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

const defaultConfig = {
  disableModeratorIndicator: true,
  startScreenSharing: false,
  enableEmailInStats: false,
  requireDisplayName: false,
  prejoinPageEnabled: false,
  disableInitialGUM: false,
  deeplinking: {
    desktop: { enabled: false },
    disabled: true,
  },
  prejoinConfig: {
    enabled: false,
  },
};

/**
 * JitsiRoom
 *
 * Jitsi
 *
 * @returns {JSX.Element}
 */
export const JitsiRoom = () => {
  const language = localStorage.getItem("language");
  const country = localStorage.getItem("country");
  const { theme } = useContext(ThemeContext);

  const { t } = useTranslation("pages", { keyPrefix: "consultation-page" });
  const consultationRef = useRef();
  const api = useRef();
  const backdropMessagesContainerRef = useRef();

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const { width } = useWindowDimensions();
  const { isTmpUser, leaveConsultationFn } = useContext(RootContext);

  if (!location?.state) {
    return <Navigate to={`/client/${language}/consultations`} />;
  }
  const { consultation, videoOn, microphoneOn, token } = location?.state;

  const [isLoading, setIsLoading] = useState(true);
  const [showSafetyFeedback, setShowSafetyFeedback] = useState(false);
  const [hideControls, setHideControls] = useState(false);
  const [interfaces, setInterfaceData] = useState({
    videoOn,
    microphoneOn,
    isChatShownOnTablet: false,
    isChatShownOnMobile: false,
    isProviderTyping: false,
    isProviderInSession: false,
    hasUnreadMessages: false,
    isProviderInSession: false,
  });
  const interfacesRef = useRef(interfaces);

  const [messages, setMessages] = useState({
    currentSession: [],
    previousSessions: [],
  });

  useSessionEndReminder(consultation.timestamp, t);

  const receiveMessage = (message) => {
    const interfacesCopy = { ...interfacesRef.current };
    if (message.content === "provider_left") {
      interfacesCopy.isProviderInSession = false;
    } else if (message.content === "provider_joined") {
      interfacesCopy.isProviderInSession = true;
    }

    interfacesCopy.hasUnreadMessages = true;

    setMessages((messages) => {
      return {
        ...messages,
        currentSession: [...messages.currentSession, message],
      };
    });
    setInterfaceData(interfacesCopy);
  };

  const socketRef = useConsultationSocket({
    isProviderTyping: interfaces.isProviderTyping,
    chatId: consultation.chatId,
    receiveMessage: () => {},
    setInterfaceData,
    receiveMessage,
  });

  useEffect(() => {
    interfacesRef.current = interfaces;
  }, [interfaces]);

  useEffect(() => {
    // If the chat is shown but user shrinks the window:
    // hide the side chat and open the backdrop
    if (width < 1150) {
      if (interfaces.isChatShownOnTablet) {
        consultationRef.current.style.width = "100vw";
        consultationRef.current.style.height = "30vh";
        setInterfaceData({
          ...interfaces,
          isChatShownOnTablet: false,
          isChatShownOnMobile: true,
        });
      }
    } else {
      // If the chat is shown on mobile and user expands the window:
      // hide the backdrop and open the side chat
      if (interfaces.isChatShownOnMobile) {
        consultationRef.current.style.width = "calc(100vw - 50rem)";
        consultationRef.current.style.height = "100vh";
        setInterfaceData({
          ...interfaces,
          isChatShownOnTablet: true,
          isChatShownOnMobile: false,
        });
      }
    }

    if (interfaces.isChatShownOnMobile) {
      setTimeout(() => {
        setHideControls(true);
      }, 500);

      if (consultationRef.current && consultationRef.current.style) {
        consultationRef.current.style.height = "30vh";
      }
    } else {
      setTimeout(() => {
        setHideControls(false);
      }, 500);

      if (consultationRef.current && consultationRef.current.style) {
        consultationRef.current.style.height = "100vh";
      }
    }
  }, [width, interfaces.isChatShownOnMobile, consultationRef]);

  const clientData = queryClient.getQueryData({ queryKey: ["client-data"] });

  if (isTmpUser)
    return (
      <Navigate to={`/${localStorage.getItem("language")}/client/dashboard`} />
    );
  if (!clientData || !consultation || !token)
    return (
      <Navigate
        to={`/client/${localStorage.getItem("language")}/consultations`}
      />
    );

  const { data: securityCheckAnswers } =
    useGetSecurityCheckAnswersByConsultationId(consultation.consultationId);

  const toggleChat = () => {
    const { isChatShownOnMobile, hasUnreadMessages } = interfaces;

    if (!isChatShownOnMobile && width < 1150) {
      setTimeout(() => {
        backdropMessagesContainerRef.current?.scrollTo({
          top: backdropMessagesContainerRef.current?.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
    if (hasUnreadMessages) {
      setInterfaceData({
        ...interfaces,
        hasUnreadMessages: false,
      });
    }
    if (width < 1150) {
      consultationRef.current.style.height = interfaces.isChatShownOnMobile
        ? "100vh"
        : "30vh";
      setInterfaceData({
        ...interfaces,
        isChatShownOnMobile: !interfaces.isChatShownOnMobile,
        hasUnreadMessages: false,
      });
    } else {
      consultationRef.current.style.width = interfaces.isChatShownOnTablet
        ? "100vw"
        : "calc(100vw - 50rem)";
      setInterfaceData({
        ...interfaces,
        isChatShownOnTablet: !interfaces.isChatShownOnTablet,
        hasUnreadMessages: false,
      });
    }
  };

  // Mutations
  const onSendSuccess = (newMessage) => {
    const message = newMessage.message;
    message.senderId = clientData.clientID;

    setMessages((prev) => ({
      ...prev,
      currentSession: [...prev.currentSession, message],
    }));
  };
  const onSendError = (err) => {
    toast(err, { type: "error" });
  };
  const sendMessageMutation = useSendMessage(onSendSuccess, onSendError);
  const handleSendMessage = (content, type = "text") => {
    if (interfaces.hasUnreadMessages) {
      setInterfaceData({ ...interfaces, hasUnreadMessages: false });
    }
    const message = {
      content,
      type,
      time: JSON.stringify(new Date().getTime()),
    };

    sendMessageMutation.mutate({
      message,
      chatId: consultation.chatId,
    });

    socketRef.current.emit("send message", {
      language,
      country,
      chatId: consultation.chatId,
      to: "provider",
      message,
    });
  };

  const leaveConsultationMutation = useLeaveConsultation();

  const leaveConsultation = () => {
    setShowSafetyFeedback(true);
    const leaveMessage = {
      time: JSON.stringify(new Date().getTime()),
      content: "client_left",
      type: "system",
    };

    sendMessageMutation.mutate({
      chatId: consultation.chatId,
      message: leaveMessage,
    });

    socketRef.current.emit("send message", {
      language,
      country,
      chatId: consultation.chatId,
      to: "provider",
      message: leaveMessage,
    });

    leaveConsultationMutation.mutate({
      consultationId: consultation.consultationId,
      userType: "client",
    });
  };

  useEffect(() => {
    if (leaveConsultation) {
      leaveConsultationFn.current = leaveConsultation;
    }
  }, [leaveConsultation]);

  if (showSafetyFeedback) {
    return (
      <SafetyFeedback
        answers={securityCheckAnswers}
        consultationId={consultation.consultationId}
      />
    );
  }

  const userInfo = {
    displayName:
      clientData.name || clientData.surname
        ? `${clientData.name} ${clientData.surname}`
        : clientData.nickname,
    id: clientData.clientID,
  };

  return (
    <Page
      showNavbar={false}
      showFooter={false}
      showEmergencyButton={false}
      showGoBackArrow={false}
      classes="page__jitsi-room"
    >
      <div style={{ display: "flex" }}>
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
            }}
          >
            {!hideControls && (
              <Controls
                t={t}
                consultation={consultation}
                handleSendMessage={handleSendMessage}
                hasUnreadMessages={interfaces.hasUnreadMessages}
                toggleCamera={() => {
                  api.current.executeCommand("toggleVideo");
                  setInterfaceData({
                    ...interfaces,
                    videoOn: !interfaces.videoOn,
                  });
                }}
                toggleMicrophone={() => {
                  api.current.executeCommand("toggleAudio");
                  setInterfaceData({
                    ...interfaces,
                    microphoneOn: !interfaces.microphoneOn,
                  });
                }}
                toggleChat={toggleChat}
                leaveConsultation={leaveConsultation}
                isCameraOn={interfaces.videoOn}
                isMicrophoneOn={interfaces.microphoneOn}
                renderIn="client"
                isInSession={interfaces.isProviderInSession}
              />
            )}
          </div>
        </div>
        {isLoading && (
          <div className="loading-spinner">
            <Loading />
          </div>
        )}
        <JitsiMeeting
          domain={"jitsi.usupport.online"}
          roomName={consultation.consultationId}
          ssl={false}
          spinner={Loading}
          configOverwrite={{
            ...defaultConfig,
            startWithAudioMuted: !microphoneOn,
            startWithVideoMuted: !videoOn,
            hideConferenceSubject: true,
            showJitsiBranding: false,
            showJitsiWatermark: false,
            SETTINGS_SECTIONS: ["language", "devices", "background", "profile"],
          }}
          interfaceConfigOverwrite={{
            HIDE_CONFERENCE_SUBJECT: true,
            SHOW_JITSI_WATERMARK: false,
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            TOOLBAR_BUTTONS: ["raisehand", "settings", "fullscreen"],
            SETTINGS_SECTIONS: ["language", "devices", "background", "profile"],
            SHOW_ROOM_NAME: false,
          }}
          userInfo={userInfo}
          onApiReady={async (externalApi) => {
            const rooms = await externalApi.getRoomsInfo();

            const roomInfo = rooms[0] || rooms?.rooms[0];
            const participants = roomInfo?.participants?.filter(
              (x) => !!x && x.id !== userInfo.id && x.id !== "local"
            );
            if (roomInfo) {
              setInterfaceData({
                ...interfaces,
                isProviderInSession: participants.length > 0,
              });
            }

            api.current = externalApi;
            externalApi.executeCommand("joinConference");
            externalApi.executeCommand(
              "avatarUrl",
              `${AMAZON_S3_BUCKET}/${clientData.image || "default"}`
            );
            externalApi.addListener(
              "participantJoined",
              ({ id, displayName }) => {
                console.log("Participant joined: ", displayName);
                if (
                  !interfaces.isProviderInSession &&
                  id !== userInfo.id &&
                  id !== "local"
                ) {
                  setInterfaceData((prev) => ({
                    ...prev,
                    isProviderInSession: true,
                  }));
                }
              }
            );
            externalApi.addListener("videoConferenceJoined", () => {
              setIsLoading(false);
            });
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = "100vh";
            iframeRef.style.width = "100vw";
            consultationRef.current = iframeRef;
          }}
        />
        <Chat
          t={t}
          interfaces={interfaces}
          setInterfaceData={setInterfaceData}
          theme={theme}
          messages={messages}
          setMessages={setMessages}
          consultation={consultation}
          clientId={clientData.clientID}
          handleSendMessage={handleSendMessage}
          isChatShownOnMobile={interfaces.isChatShownOnMobile}
          isChatShownOnTablet={interfaces.isChatShownOnTablet}
          setIsChatShownOnMobile={(value) => {
            setInterfaceData({ ...interfaces, isChatShownOnMobile: value });
          }}
          hasUnreadMessages={interfaces.hasUnreadMessages}
          socketRef={socketRef}
          setHasUnreadMessages={(value) => {
            setInterfaceData({ ...interfaces, hasUnreadMessages: value });
          }}
          backdropMessagesContainerRef={backdropMessagesContainerRef}
        />
      </div>
    </Page>
  );
};

/**
 * Chat component that handles both mobile and desktop chat views
 */
export const Chat = ({
  interfaces,
  setInterfaceData,
  messages,
  setMessages,
  clientId,
  consultation,
  handleSendMessage,
  theme,
  t,
  isChatShownOnMobile,
  setIsChatShownOnMobile,
  isChatShownOnTablet,
  socketRef,
  hasUnreadMessages,
  setHasUnreadMessages,
  backdropMessagesContainerRef,
}) => {
  const country = localStorage.getItem("country");
  const language = localStorage.getItem("language");
  const { width } = useWindowDimensions();

  const [areMessagesHidden, setAreMessagesHidden] = useState(true);
  const [showOptions, setShowOptions] = useState(false);
  const [showAllMessages, setShowAllMessages] = useState(false);
  const [areSystemMessagesShown, setAreSystemMessagesShown] = useState(true);

  // Handle message visibility
  useEffect(() => {
    let timeout, timeoutTwo;
    const hasMessages =
      messages?.currentSession?.length > 0 ||
      messages?.previousSessions?.length > 0;

    if (hasMessages && areMessagesHidden && isChatShownOnMobile) {
      timeout = setTimeout(() => {
        if (backdropMessagesContainerRef.current) {
          backdropMessagesContainerRef.current.scrollTop =
            backdropMessagesContainerRef.current.scrollHeight;
        }
        setAreMessagesHidden(false);
      }, 1000);
    }

    if (!areMessagesHidden && !isChatShownOnMobile) {
      timeoutTwo = setTimeout(() => {
        setAreMessagesHidden(true);
      }, 300);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      if (timeoutTwo) clearTimeout(timeoutTwo);
    };
  }, [messages, isChatShownOnMobile]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (
      (messages.currentSession?.length > 0 ||
        messages.previousSessions?.length > 0) &&
      backdropMessagesContainerRef.current &&
      backdropMessagesContainerRef.current.scrollHeight > 0 &&
      !areMessagesHidden
    ) {
      console.log("new message");
      backdropMessagesContainerRef.current.scrollTo({
        top: backdropMessagesContainerRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [
    messages,
    backdropMessagesContainerRef.current?.scrollHeight,
    areMessagesHidden,
  ]);

  const emitTyping = (type) => {
    socketRef.current.emit("typing", {
      to: "provider",
      language,
      country,
      chatId: consultation.chatId,
      type,
    });
  };

  const handleTextareaFocus = () => {
    if (hasUnreadMessages) {
      setHasUnreadMessages(false);
    }
  };

  const setIsProviderInSession = (value) => {
    setInterfaceData({ ...interfaces, isProviderInSession: value });
  };

  // Render tablet/desktop view
  return (
    <MessageList
      messages={messages}
      setMessages={setMessages}
      consultation={consultation}
      clientId={clientId}
      handleSendMessage={handleSendMessage}
      width={width}
      areSystemMessagesShown={areSystemMessagesShown}
      setAreSystemMessagesShown={setAreSystemMessagesShown}
      showOptions={showOptions}
      setShowOptions={setShowOptions}
      isProviderTyping={interfaces.isProviderTyping}
      setIsProviderInSession={setIsProviderInSession}
      showAllMessages={showAllMessages}
      setShowAllMessages={setShowAllMessages}
      onTextareaFocus={handleTextareaFocus}
      emitTyping={emitTyping}
      isChatShownOnTablet={isChatShownOnTablet}
      isChatShownOnMobile={isChatShownOnMobile}
      setIsChatShownOnMobile={setIsChatShownOnMobile}
      areMessagesHidden={areMessagesHidden}
      setAreMessagesHidden={setAreMessagesHidden}
      backdropMessagesContainerRef={backdropMessagesContainerRef}
      handleTextareaFocus={handleTextareaFocus}
      theme={theme}
      t={t}
    />
  );
};

const useSessionEndReminder = (timestamp, t) => {
  useEffect(() => {
    const endTime = new Date(timestamp + ONE_HOUR);
    let isTenMinAlertShown,
      isFiveMinAlertShown = false;

    const interval = setInterval(() => {
      const now = new Date();
      const timeDifferenceInMinutes = Math.floor((endTime - now) / (1000 * 60));

      if (timeDifferenceInMinutes <= 10 && !isTenMinAlertShown) {
        toast(t("consultation_end_reminder", { minutes: 10 }), {
          autoClose: false,
          type: "info",
        });
        isTenMinAlertShown = true;
      }
      if (timeDifferenceInMinutes <= 5 && !isFiveMinAlertShown) {
        toast(t("consultation_end_reminder", { minutes: 5 }), {
          autoClose: false,
          type: "info",
        });
        isFiveMinAlertShown;
        clearInterval(interval);
      }
    }, 20000);

    return () => {
      clearInterval(interval);
    };
  }, []);
};
