import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";

import {
  SendMessage,
  Message,
  SystemMessage,
  Loading,
  Backdrop,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import { useGetChatData, useSendMessage, useLeaveConsultation } from "#hooks";
import { Page, VideoRoom } from "#blocks";

import "./consultation.scss";

const SOCKET_IO_URL = `${import.meta.env.VITE_SOCKET_IO_URL}`;

/**
 * Consultation
 *
 * Video - text consultation page
 *
 * @returns {JSX.Element}
 */
export const Consultation = () => {
  const { t } = useTranslation("consultation-page");
  const { width } = useWindowDimensions();
  const navigate = useNavigate();
  const location = useLocation();
  const backdropMessagesContainerRef = useRef();

  const consultation = location.state?.consultation;
  const joinWithVideo = location.state?.videoOn;
  const token = location.state?.token;

  if (!consultation || !token) return <Navigate to="/consultations" />;

  const [isChatShownOnMobile, setIsChatShownOnMobile] = useState(
    !joinWithVideo
  );

  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (
      messages?.length > 0 &&
      backdropMessagesContainerRef.current &&
      backdropMessagesContainerRef.current.scrollHeight > 0
    ) {
      backdropMessagesContainerRef.current.scrollTo({
        top: backdropMessagesContainerRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, backdropMessagesContainerRef.current?.scrollHeight]);

  // Mutations
  const onSendSuccess = (data) => {
    setMessages([...data.messages]);
  };
  const onSendError = (err) => {
    toast(err, { type: "error" });
  };
  const sendMessageMutation = useSendMessage(onSendSuccess, onSendError);
  const leaveConsultationMutation = useLeaveConsultation();

  const chatDataQuery = useGetChatData(consultation?.chatId, (data) =>
    setMessages(data.messages)
  );

  const clientId = chatDataQuery.data?.clientDetailId;

  const language = localStorage.getItem("language");
  const country = localStorage.getItem("country");
  const socketRef = useRef();

  // TODO: Send a system message when the user joins the consultation
  // TODO: Send a consultation add services request only when the provider leaves the consultation
  // TODO: Send a system message when the client/provider toggles camera
  useEffect(() => {
    socketRef.current = io(SOCKET_IO_URL, {
      path: "/api/v1/ws/socket.io",
      transports: ["websocket"],
      secure: false,
    });
    socketRef.current.emit("join chat", {
      country,
      language,
      chatId: consultation.chatId,
      userType: "client",
    });

    socketRef.current.on("receive message", receiveMessage);
    // window.addEventListener("beforeunload", (ev) => {
    //   console.log("asd");
    //   return (ev.returnValue = "Are you sure you want to close?");
    // });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const receiveMessage = (message) => {
    setMessages((messages) => [...messages, message]);
  };

  const renderAllMessages = () => {
    if (chatDataQuery.isLoading) return <Loading size="lg" />;
    return messages.map((message) => {
      if (message.type === "system") {
        return (
          <SystemMessage
            key={message.time}
            title={message.content}
            date={new Date(Number(message.time))}
          />
        );
      } else {
        if (message.senderId === clientId) {
          return (
            <Message
              key={message.time}
              message={message.content}
              sent
              date={new Date(Number(message.time))}
            />
          );
        } else {
          return (
            <Message
              key={message.time}
              message={message.content}
              received
              date={new Date(Number(message.time))}
            />
          );
        }
      }
    });
  };

  const handleSendMessage = (content, type = "text") => {
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

  const showChat = width < 768;

  const toggleChat = () => {
    if (!isChatShownOnMobile) {
      setTimeout(() => {
        backdropMessagesContainerRef.current?.scrollTo({
          top: backdropMessagesContainerRef.current?.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
    setIsChatShownOnMobile(!isChatShownOnMobile);
  };

  const leaveConsultation = () => {
    leaveConsultationMutation.mutate({
      consultationId: consultation.consultationId,
      userType: "client",
    });

    navigate("/consultations");

    const leaveMessage = {
      time: JSON.stringify(new Date().getTime()),
      content: t("client_left"),
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
  };

  return (
    <Page
      showNavbar={width < 768 ? false : true}
      showFooter={width < 768 ? false : true}
      showEmergencyButton={false}
      classes="page__consultation"
      showGoBackArrow={false}
    >
      <div className="page__consultation__container">
        <VideoRoom
          joinWithVideo={joinWithVideo}
          consultation={consultation}
          toggleChat={toggleChat}
          leaveConsultation={leaveConsultation}
          handleSendMessage={handleSendMessage}
          token={token}
          t={t}
        />
        <MessageList
          messages={messages}
          isLoading={chatDataQuery.isLoading}
          handleSendMessage={handleSendMessage}
          clientId={clientId}
          width={width}
        />
      </div>
      <Backdrop
        classes="page__consultation__chat-backdrop"
        isOpen={isChatShownOnMobile}
        onClose={() => setIsChatShownOnMobile(false)}
        reference={backdropMessagesContainerRef}
      >
        <div className="page__consultation__chat-backdrop__conatiner">
          <div className="page__consultation__container__messages__messages-container">
            {renderAllMessages()}
          </div>
          <SendMessage handleSubmit={handleSendMessage} />
        </div>
      </Backdrop>
    </Page>
  );
};

const MessageList = ({
  messages,
  isLoading,
  width,
  handleSendMessage,
  clientId,
}) => {
  const messagesContainerRef = useRef();

  useEffect(() => {
    if (
      messages?.length > 0 &&
      messagesContainerRef.current &&
      messagesContainerRef.current.scrollHeight > 0
    ) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, messagesContainerRef.current?.scrollHeight]);

  const renderAllMessages = () => {
    if (isLoading) return <Loading size="lg" />;
    return messages.map((message) => {
      if (message.type === "system") {
        return (
          <SystemMessage
            key={message.time}
            title={message.content}
            date={new Date(Number(message.time))}
          />
        );
      } else {
        if (message.senderId === clientId) {
          return (
            <Message
              key={message.time}
              message={message.content}
              sent
              date={new Date(Number(message.time))}
            />
          );
        } else {
          return (
            <Message
              key={message.time}
              message={message.content}
              received
              date={new Date(Number(message.time))}
            />
          );
        }
      }
    });
  };

  return width >= 1024 ? (
    <div>
      <div
        ref={messagesContainerRef}
        className="page__consultation__container__messages__messages-container"
      >
        {renderAllMessages()}
      </div>
      <SendMessage handleSubmit={handleSendMessage} />
    </div>
  ) : null;
};
