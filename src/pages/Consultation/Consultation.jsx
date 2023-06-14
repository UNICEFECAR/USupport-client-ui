import React, {
  useState,
  useEffect,
  useRef,
  useContext,
  useCallback,
} from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import io from "socket.io-client";

import {
  Backdrop,
  Button,
  Loading,
  Message,
  SendMessage,
  SystemMessage,
  Toggle,
  InputSearch,
} from "@USupport-components-library/src";
import { useWindowDimensions } from "@USupport-components-library/utils";

import {
  useGetChatData,
  useSendMessage,
  useLeaveConsultation,
  useGetSecurityCheckAnswersByConsultationId,
  useDebounce,
  useGetAllChatHistoryData,
} from "#hooks";
import { Page, VideoRoom, SafetyFeedback } from "#blocks";
import { RootContext } from "#routes";

import { Logger } from "twilio-video";
const logger = Logger.getLogger("twilio-video");
logger.setLevel("silent");

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
  const language = localStorage.getItem("language");
  const country = localStorage.getItem("country");
  const { width } = useWindowDimensions();
  const location = useLocation();
  const backdropMessagesContainerRef = useRef();
  const socketRef = useRef();

  const { isTmpUser } = useContext(RootContext);

  if (isTmpUser) return <Navigate to="/dashboard" />;

  const consultation = location.state?.consultation;
  const joinWithVideo = location.state?.videoOn;
  const joinWithMicrophone = location.state?.microphoneOn;
  const token = location.state?.token;

  if (!consultation || !token) return <Navigate to="/consultations" />;

  const { data: securityCheckAnswers } =
    useGetSecurityCheckAnswersByConsultationId(consultation.consultationId);

  const [isChatShownOnMobile, setIsChatShownOnMobile] = useState(
    !joinWithVideo
  );

  const [messages, setMessages] = useState([]);
  const [areSystemMessagesShown, setAreSystemMessagesShown] = useState(true);
  const [isSafetyFeedbackShown, setIsSafetyFeedbackShown] = useState(false);

  const [showAllMessages, setShowAllMessages] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [search, setSearch] = useState("");
  const [hasUnreadMessages, setHasUnreadMessages] = useState(true);

  const debouncedSearch = useDebounce(search, 500);

  const chatDataQuery = useGetChatData(consultation?.chatId, (data) =>
    setMessages(data.messages)
  );

  const clientId = chatDataQuery.data?.clientDetailId;
  const providerId = chatDataQuery.data?.providerDetailId;
  const allChatHistoryQuery = useGetAllChatHistoryData(
    providerId,
    clientId,
    showAllMessages
  );

  // TODO: Send a consultation add services request only when the provider leaves the consultation
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

  // Filter the messages based on the search input
  useEffect(() => {
    const messagesToFilter = showAllMessages
      ? allChatHistoryQuery.data?.messages
      : chatDataQuery.data?.messages;

    if (debouncedSearch) {
      const filteredMessages = messagesToFilter.filter((message) =>
        message.content.toLowerCase().includes(debouncedSearch.toLowerCase())
      );
      setMessages(filteredMessages);
    } else if (!debouncedSearch && chatDataQuery.data?.messages) {
      setMessages(messagesToFilter);
    }
  }, [debouncedSearch]);

  // Scroll the messages container to the bottom when a new message is received
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

  useEffect(() => {
    if (showAllMessages && allChatHistoryQuery.data?.messages) {
      setMessages(allChatHistoryQuery.data?.messages);
    } else if (!showAllMessages) {
      setMessages(chatDataQuery.data?.messages);
    }
  }, [showAllMessages, allChatHistoryQuery.data]);

  // Mutations
  const onSendSuccess = (data) => {
    setMessages([...data.messages]);
  };
  const onSendError = (err) => {
    toast(err, { type: "error" });
  };
  const sendMessageMutation = useSendMessage(onSendSuccess, onSendError);
  const leaveConsultationMutation = useLeaveConsultation();

  const receiveMessage = (message) => {
    setHasUnreadMessages(true);
    setMessages((messages) => [...messages, message]);
  };

  const renderAllMessages = useCallback(() => {
    if (chatDataQuery.isLoading) return <Loading size="lg" />;
    return messages?.map((message) => {
      if (message.type === "system") {
        if (!areSystemMessagesShown) return null;
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
  }, [messages, chatDataQuery.isLoading, clientId, areSystemMessagesShown]);

  const handleSendMessage = (content, type = "text") => {
    if (hasUnreadMessages) {
      setHasUnreadMessages(false);
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
  const [isChatShownOnTablet, setIsChatShownOnTablet] = useState(true);
  const toggleChat = () => {
    if (!isChatShownOnMobile) {
      setTimeout(() => {
        backdropMessagesContainerRef.current?.scrollTo({
          top: backdropMessagesContainerRef.current?.scrollHeight,
          behavior: "smooth",
        });
      }, 200);
    }
    if (!isChatShownOnMobile && hasUnreadMessages) {
      setHasUnreadMessages(false);
    }

    if (width < 1024) {
      setIsChatShownOnMobile(!isChatShownOnMobile);
    } else {
      setIsChatShownOnTablet(!isChatShownOnTablet);
    }
  };

  const leaveConsultation = () => {
    leaveConsultationMutation.mutate({
      consultationId: consultation.consultationId,
      userType: "client",
    });
    setIsSafetyFeedbackShown(true);
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

  const handleTextareaFocus = () => {
    if (hasUnreadMessages) {
      setHasUnreadMessages(false);
    }
  };

  return isSafetyFeedbackShown ? (
    <SafetyFeedback
      answers={securityCheckAnswers}
      consultationId={consultation.consultationId}
    />
  ) : (
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
          joinWithMicrophone={joinWithMicrophone}
          consultation={consultation}
          toggleChat={toggleChat}
          leaveConsultation={leaveConsultation}
          handleSendMessage={handleSendMessage}
          token={token}
          hasUnreadMessages={hasUnreadMessages}
          t={t}
        />
        {isChatShownOnTablet && (
          <MessageList
            messages={messages}
            isLoading={chatDataQuery.isLoading}
            handleSendMessage={handleSendMessage}
            clientId={clientId}
            width={width}
            areSystemMessagesShown={areSystemMessagesShown}
            setAreSystemMessagesShown={setAreSystemMessagesShown}
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            search={search}
            setSearch={setSearch}
            showAllMessages={showAllMessages}
            setShowAllMessages={setShowAllMessages}
            onTextareaFocus={handleTextareaFocus}
            t={t}
          />
        )}
      </div>
      <Backdrop
        classes="page__consultation__chat-backdrop"
        isOpen={isChatShownOnMobile}
        onClose={() => setIsChatShownOnMobile(false)}
        reference={width < 768 ? backdropMessagesContainerRef : null}
        headingComponent={
          <OptionsContainer
            showOptions={showOptions}
            setShowOptions={setShowOptions}
            search={search}
            setSearch={setSearch}
            showAllMessages={showAllMessages}
            setShowAllMessages={setShowAllMessages}
            areSystemMessagesShown={areSystemMessagesShown}
            setAreSystemMessagesShown={setAreSystemMessagesShown}
            t={t}
          />
        }
      >
        <div className="page__consultation__chat-backdrop__container">
          <div
            ref={width >= 768 ? backdropMessagesContainerRef : null}
            className="page__consultation__container__messages__messages-container"
          >
            {renderAllMessages()}
            <div
              style={{
                width: "100%",
                marginBottom: width >= 768 ? "100px" : "50px",
              }}
            />
          </div>
          {(isChatShownOnMobile || width >= 768) && (
            <SendMessage
              handleSubmit={handleSendMessage}
              onTextareaFocus={handleTextareaFocus}
            />
          )}
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
  areSystemMessagesShown,
  setAreSystemMessagesShown,
  showOptions,
  setShowOptions,
  search,
  setSearch,
  showAllMessages,
  setShowAllMessages,
  onTextareaFocus,
  t,
}) => {
  const messagesContainerRef = useRef();
  const [showMessages, setShowMessages] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowMessages(true);
    }, 200);

    return () => {
      clearTimeout(timeout);
      setShowMessages(false);
    };
  }, []);

  useEffect(() => {
    if (
      messages?.length > 0 &&
      messagesContainerRef.current &&
      messagesContainerRef.current.scrollHeight > 0 &&
      showMessages
    ) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current?.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, messagesContainerRef.current?.scrollHeight, showMessages]);

  const renderAllMessages = useCallback(() => {
    if (isLoading) return <Loading size="lg" />;
    return messages?.map((message) => {
      if (message.type === "system") {
        if (!areSystemMessagesShown) return null;
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
  }, [messages, areSystemMessagesShown]);

  return width >= 1024 ? (
    <div style={{ position: "relative" }}>
      <OptionsContainer
        showOptions={showOptions}
        setShowOptions={setShowOptions}
        search={search}
        setSearch={setSearch}
        showAllMessages={showAllMessages}
        setShowAllMessages={setShowAllMessages}
        areSystemMessagesShown={areSystemMessagesShown}
        setAreSystemMessagesShown={setAreSystemMessagesShown}
        isAbsolute
        t={t}
      />
      <div
        ref={messagesContainerRef}
        className={`page__consultation__container__messages__messages-container ${
          showOptions
            ? "page__consultation__container__messages__messages-container--show-options"
            : ""
        }`}
      >
        {showMessages && renderAllMessages()}
      </div>
      <SendMessage
        handleSubmit={handleSendMessage}
        onTextareaFocus={onTextareaFocus}
      />
    </div>
  ) : null;
};

const OptionsContainer = ({
  showAllMessages,
  setShowAllMessages,
  showOptions,
  setShowOptions,
  areSystemMessagesShown,
  setAreSystemMessagesShown,
  search,
  setSearch,
  isAbsolute,
  t,
}) => {
  return (
    <div
      style={{
        position: isAbsolute ? "absolute" : "static",
      }}
      className="page__consultation__options-container"
    >
      <Button
        size="sm"
        label={t(showOptions ? "hide_options" : "show_options")}
        onClick={() => setShowOptions(!showOptions)}
        style={{ marginBottom: "16px" }}
      />
      {showOptions && (
        <div>
          <div className="page__consultation__system-message-toggle">
            <Toggle
              isToggled={areSystemMessagesShown}
              setParentState={setAreSystemMessagesShown}
            />
            <p>{t("show_system_messages")}</p>
          </div>
          <div className="page__consultation__system-message-toggle">
            <Toggle
              isToggled={showAllMessages}
              setParentState={setShowAllMessages}
            />
            <p>{t("show_previous_consultations")}</p>
          </div>
          <InputSearch
            value={search}
            onChange={setSearch}
            placeholder={t("search")}
          />
        </div>
      )}
    </div>
  );
};
