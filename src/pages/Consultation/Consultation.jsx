import React, { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";

import {
  SendMessage,
  Controls,
  Grid,
  GridItem,
  Message,
  SystemMessage,
  Loading,
} from "@USupport-components-library/src";

import { useGetChatData, useSendMessage } from "#hooks";
import { Page } from "#blocks";

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
  const location = useLocation();

  const consultation = location.state?.consultation;
  if (!consultation) return <Navigate to="/consultations" />;

  const [messages, setMessages] = useState([]);

  const chatDataQuery = useGetChatData(consultation?.chatId, (data) =>
    setMessages(data.messages)
  );

  const clientId = chatDataQuery.data?.clientDetailId;

  const language = localStorage.getItem("language");
  const country = localStorage.getItem("country");
  const socketRef = useRef();
  useEffect(() => {
    socketRef.current = io(SOCKET_IO_URL, {
      path: "/api/v1/ws/socket.io",
      transports: ["websocket"],
      secure: false,
    });
    socketRef.current.emit("join chat", {
      country,
      language,
      chatId: consultation?.chatId,
      userType: "client",
    });

    socketRef.current.on("receive message", receiveMessage);

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
      if (message.type === "system-message") {
        return (
          <SystemMessage
            key={message.time}
            title={message.content}
            date={new Date(message.time)}
          />
        );
      } else {
        if (message.senderId === clientId) {
          return (
            <Message
              key={message.time}
              message={message.content}
              sent
              date={new Date(message.time)}
            />
          );
        } else {
          return (
            <Message
              key={message.time}
              message={message.content}
              received
              date={new Date(message.time)}
            />
          );
        }
      }
    });
  };

  const onSendSuccess = (data) => {
    setMessages([...data.messages]);
  };
  const onSendError = (err) => {
    toast(err, { type: "error" });
  };
  const sendMessageMutation = useSendMessage(onSendSuccess, onSendError);

  const handleSendMessage = (content) => {
    const message = {
      content,
      type: "text",
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

  return (
    <Page classes="page__consultation" showGoBackArrow={false}>
      <div className="page__consultation__container">
        <Grid classes="page__consultation__container__grid">
          <GridItem md={8} lg={12}>
            <Controls
              startDate={new Date()}
              endDate={new Date()}
              providerName="Georgi"
              providerImage="default"
              t={t}
            />
          </GridItem>
          <GridItem
            md={8}
            lg={12}
            classes="page__consultation__container__messages"
          >
            {/* <MessagesList messages={messages} /> */}
            <div className="page__consultation__container__messages__messages-container">
              {renderAllMessages()}
            </div>
          </GridItem>
          {/* <GridItem md={8} lg={12}> */}
          <SendMessage handleSubmit={handleSendMessage} />
          {/* </GridItem> */}
        </Grid>
      </div>
    </Page>
  );
};
