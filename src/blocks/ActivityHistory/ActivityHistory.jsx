import React, { useState, useEffect, useCallback, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
  Image,
  Font,
} from "@react-pdf/renderer";

import {
  Avatar,
  Block,
  Button,
  Icon,
  InputSearch,
  Loading,
  Message,
  SystemMessage,
  Toggle,
} from "@USupport-components-library/src";

import {
  getDateView,
  getTime,
  systemMessageTypes,
} from "@USupport-components-library/utils";

import {
  logoHorizontalPng,
  NunitoSans,
  NunitoSansSemiBold,
  NunitoSansBold,
} from "@USupport-components-library/assets";

import {
  useGetChatData,
  useGetProviderStatus,
  useGetAllChatHistoryData,
  useDebounce,
} from "#hooks";

import "./activity-history.scss";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

Font.register({
  family: "NunitoSans",
  fonts: [
    {
      src: NunitoSans,
      fontWeight: 400,
    },
    {
      src: NunitoSansSemiBold,
      fontWeight: 600,
    },
    {
      src: NunitoSansBold,
      fontWeight: 700,
    },
  ],
});

/**
 * ActivityHistory
 *
 * ActivityHistory block
 *
 * @return {jsx}
 */
export const ActivityHistory = ({
  openSelectConsultation,
  consultation,
  providerId,
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("activity-history");

  const [search, setSearch] = useState("");
  const [showSystemMessages, setShowSystemMessages] = useState(true);
  const [showAllConsultations, setShowAllConsultations] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const [shownMessages, setShownMessages] = useState();
  const messagesContainerRef = useRef();

  const chatQueryData = useGetChatData(consultation?.chatId);
  const allChatHistoryQuery = useGetAllChatHistoryData(
    providerId,
    chatQueryData.data?.clientDetailId,
    showAllConsultations
  );
  const { data } = useGetProviderStatus(providerId);
  const providerStatus = data?.status;

  // Set the initial messages
  useEffect(() => {
    if (!shownMessages && chatQueryData.data) {
      setShownMessages(chatQueryData.data.messages);
    }
  }, [chatQueryData.data]);

  useEffect(() => {
    if (shownMessages) {
      if (
        showAllConsultations &&
        showSystemMessages &&
        allChatHistoryQuery.data
      ) {
        setShownMessages(allChatHistoryQuery.data?.messages);
      } else if (
        showAllConsultations &&
        !showSystemMessages &&
        allChatHistoryQuery.data
      ) {
        setShownMessages(allChatHistoryQuery.data?.messages);
      } else if (!showAllConsultations && showSystemMessages) {
        setShownMessages(chatQueryData.data?.messages);
      } else if (!showAllConsultations && !showSystemMessages) {
        setShownMessages(chatQueryData.data?.messages);
      }
      setIsFiltering(false);
    }
  }, [
    showAllConsultations,
    showSystemMessages,
    allChatHistoryQuery.data,
    chatQueryData.data,
  ]);

  useEffect(() => {
    if (shownMessages?.length && !isFiltering) {
      messagesContainerRef.current?.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behaviour: "smooth",
      });
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [shownMessages, isFiltering]);

  const debouncedSearch = useDebounce(search, 500);

  const renderAllMessages = useCallback(() => {
    if (shownMessages?.length === 0)
      return (
        <p className="activity-history__main__messages-container__no-messages">
          {t("no_messages")}
        </p>
      );
    return shownMessages?.map((message, index) => {
      if (
        debouncedSearch &&
        !message.content.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
        return null;
      if (message.type === "system") {
        if (!showSystemMessages) return null;
        return (
          <SystemMessage
            key={index + message.time}
            title={
              systemMessageTypes.includes(message.content)
                ? t(message.content)
                : message.content
            }
            date={new Date(Number(message.time))}
          />
        );
      } else {
        if (message.senderId !== providerId) {
          return (
            <Message
              key={index + message.time}
              message={message.content}
              sent
              date={new Date(Number(message.time))}
            />
          );
        } else {
          return (
            <Message
              key={index + message.time}
              message={message.content}
              received
              date={new Date(Number(message.time))}
            />
          );
        }
      }
    });
  }, [shownMessages, debouncedSearch, showSystemMessages, providerId]);

  const handleSchedule = () => {
    openSelectConsultation();
  };

  const handleToggleSystemMessages = () => {
    setIsFiltering(true);
    setShowSystemMessages(!showSystemMessages);
  };

  const providerImage =
    AMAZON_S3_BUCKET + "/" + (consultation.image || "default");
  return chatQueryData.isLoading ? (
    <Loading size="lg" />
  ) : (
    <>
      <Block classes="activity-history__header-block">
        <div className="activity-history__header-block__provider-container">
          <Icon
            name="arrow-chevron-back"
            classes="activity-history__header-block__provider-container__icon"
            size="md"
            color="#20809E"
            onClick={() => navigate(-1)}
          />
          <Avatar image={providerImage} />
          <h4>{consultation.providerName}</h4>
        </div>
        <div className="activity-history__main__controls">
          <InputSearch
            value={search}
            onChange={setSearch}
            placeholder={t("search")}
            classes="activity-history__main__search"
          />
          <div className="activity-history__main__controls__toggle">
            <Toggle
              isToggled={showSystemMessages}
              setParentState={handleToggleSystemMessages}
            />
            <p>{t("show_system_messages")}</p>
          </div>
          <div className="activity-history__main__controls__toggle">
            <Toggle
              isToggled={showAllConsultations}
              setParentState={setShowAllConsultations}
            />
            <p>{t("show_previous_consultations")}</p>
          </div>

          <PDFDownloadLink
            style={{ color: "white" }}
            document={
              <MyDocument
                messages={shownMessages}
                providerId={providerId}
                providerName={consultation.providerName}
                showSystemMessages={showSystemMessages}
                providerImage={providerImage}
                t={t}
              />
            }
            fileName={`Chat-history-${consultation.providerName}.pdf`}
          >
            {({ loading }) =>
              loading ? (
                "Loading document..."
              ) : (
                <Button
                  classes="activity-history__main__controls__export-button"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                  label={t("export_label")}
                />
              )
            }
          </PDFDownloadLink>
        </div>
      </Block>

      <Block classes="activity-history__main">
        <div className="activity-history__main__content">
          <div
            className="activity-history__main__messages-container"
            ref={messagesContainerRef}
          >
            {isFiltering ||
            (showAllConsultations && allChatHistoryQuery.isLoading) ? (
              <Loading size="lg" />
            ) : (
              renderAllMessages()
            )}
          </div>
        </div>
        {providerStatus === "active" && (
          <div className="activity-history__main__button-container">
            <Button
              label={t("button_label")}
              size="lg"
              onClick={handleSchedule}
            />
          </div>
        )}
      </Block>
    </>
  );
};

const MyDocument = ({
  messages = [],
  providerId,
  providerName,
  showSystemMessages,
  t,
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Image src={logoHorizontalPng} style={styles.logo} />
        <Text
          style={{
            alignSelf: "center",
            marginTop: "24px",
          }}
        >
          {t("chat_history")}
        </Text>
        <View style={styles.nameContainer}>
          <Text style={styles.providerName}>{providerName}</Text>
        </View>
        {messages.map((message, index) => {
          const isSent = message.senderId !== providerId;
          if (message.type === "system" && !showSystemMessages) return null;
          return (
            <View key={index} style={styles.view} wrap={false}>
              <View
                style={[
                  styles.message,
                  isSent ? styles.messageSent : styles.messageReceived,
                  message.type === "system" && styles.systemMessage,
                ]}
              >
                <Text style={styles.messageText}>
                  {message.type === "system"
                    ? t(message.content)
                    : message.content}
                </Text>
                <Text style={[styles.date, isSent ? styles.dateSent : ""]}>
                  {getDateView(new Date(Number(message.time)))},{" "}
                  {getTime(new Date(Number(message.time)))}
                </Text>
              </View>
            </View>
          );
        })}
      </Page>
    </Document>
  );
};

const styles = StyleSheet.create({
  page: {
    height: "1000px",
    fontFamily: "NunitoSans",
  },
  logo: {
    width: "30%",
    alignSelf: "center",
    marginTop: "24px",
  },
  nameContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "24px",
    marginTop: "6px",
    fontWeight: "normal",
  },
  image: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  providerName: {
    textAlign: "center",
    alignSelf: "center",
    fontWeight: "normal",
  },
  view: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  message: {
    borderRadius: "24px",
    padding: "16px 24px",
    textAlign: "left",
    maxWidth: "35%",
    marginTop: "16px",
  },
  systemMessage: {
    alignSelf: "center",
    backgroundColor: "white",
    borderColor: "#20809e",
    borderWidth: "1px",
    maxWidth: "50%",
    width: "50%",
  },
  messageText: {
    color: "#20809e",
    fontSize: "14px",
    fontWeight: "bold",
  },
  messageSent: {
    backgroundColor: "#54cfd9",
    alignSelf: "flex-end",
    marginRight: "5px",
  },
  messageReceived: {
    backgroundColor: "#e6f1f4",
    marginLeft: "5px",
  },
  date: { color: "gray", marginTop: "6px", fontSize: "14" },
  dateSent: {
    color: "#66768d",
  },
});
