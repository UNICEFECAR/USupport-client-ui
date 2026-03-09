import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useCustomNavigate as useNavigate } from "#hooks";

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
  Box,
  Icon,
  InputSearch,
  Loading,
  Message,
  SystemMessage,
  Toggle,
  NewButton,
} from "@USupport-components-library/src";

import {
  getDateView,
  getTime,
  systemMessageTypes,
  getTimeAsString,
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
  const { t } = useTranslation("blocks", { keyPrefix: "activity-history" });

  const [search, setSearch] = useState("");
  const [showSystemMessages, setShowSystemMessages] = useState(true);
  const [showAllConsultations, setShowAllConsultations] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);

  const messagesEndRef = useRef(null);

  const chatQueryData = useGetChatData(consultation?.chatId);
  const allChatHistoryQuery = useGetAllChatHistoryData(
    providerId,
    chatQueryData.data?.clientDetailId,
    showAllConsultations,
  );
  const { data } = useGetProviderStatus(providerId);
  const providerStatus = data?.status;

  const baseMessages = useMemo(() => {
    if (showAllConsultations && allChatHistoryQuery.data) {
      return allChatHistoryQuery.data.messages || [];
    }
    return chatQueryData.data?.messages || [];
  }, [
    showAllConsultations,
    allChatHistoryQuery.data,
    chatQueryData.data?.messages,
  ]);

  const debouncedSearch = useDebounce(search, 500);

  const filteredMessages = useMemo(() => {
    let messages = baseMessages;

    if (!showSystemMessages) {
      messages = messages.filter((msg) => msg.type !== "system");
    }

    if (debouncedSearch) {
      const searchLower = debouncedSearch.toLowerCase();
      messages = messages.filter((msg) =>
        msg.content.toLowerCase().includes(searchLower),
      );
    }

    return messages.map((msg) => ({
      ...msg,
      dateObj: new Date(Number(msg.time)),
    }));
  }, [baseMessages, showSystemMessages, debouncedSearch]);

  const prevShowAllRef = useRef(showAllConsultations);

  useEffect(() => {
    if (prevShowAllRef.current !== showAllConsultations) {
      prevShowAllRef.current = showAllConsultations;
      if (filteredMessages.length > 0) {
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
        }, 50);
      }
    }
    setIsFiltering(false);
  }, [filteredMessages.length, showAllConsultations]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

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
    <Block classes="activity-history">
      <Box classes="activity-history__box" liquidGlass>
        <div className="activity-history__header">
          <div className="activity-history__header__provider-info">
            <Icon
              name="arrow-chevron-back"
              classes="activity-history__header__back-icon"
              size="md"
              color="#20809E"
              onClick={() => navigate(-1)}
            />
            <Avatar image={providerImage} />
            <div className="activity-history__header__provider-details">
              <h4 className="activity-history__header__provider-name">
                {consultation.providerName}
              </h4>
              <span className="activity-history__header__subtitle text">
                {t("chat_history")}
              </span>
            </div>
          </div>

          <div className="activity-history__header__actions">
            <PDFDownloadLink
              style={{ color: "white", textDecoration: "none" }}
              document={
                <MyDocument
                  messages={filteredMessages}
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
                  <Loading size="sm" />
                ) : (
                  <NewButton
                    classes="activity-history__header__export-button"
                    size="sm"
                    onClick={(e) => e.stopPropagation()}
                    label={t("export_label")}
                    iconName="download"
                    iconColor="#ffffff"
                    iconSize="sm"
                  />
                )
              }
            </PDFDownloadLink>
            {providerStatus === "active" && (
              <NewButton
                label={t("button_label")}
                iconName="calendar"
                iconColor="#ffffff"
                iconSize="sm"
                size="sm"
                onClick={handleSchedule}
              />
            )}
          </div>
        </div>

        <div className="activity-history__controls">
          <InputSearch
            value={search}
            onChange={setSearch}
            placeholder={t("search")}
            classes="activity-history__controls__search"
          />
          <div className="activity-history__controls__toggles">
            <div className="activity-history__controls__toggle">
              <span>{t("show_system_messages")}</span>
              <Toggle
                isToggled={showSystemMessages}
                setParentState={handleToggleSystemMessages}
              />
            </div>
            <div className="activity-history__controls__toggle">
              <span>{t("show_previous_consultations")}</span>
              <Toggle
                isToggled={showAllConsultations}
                setParentState={setShowAllConsultations}
              />
            </div>
          </div>
        </div>

        <div className="activity-history__messages">
          {isFiltering ||
          (showAllConsultations && allChatHistoryQuery.isLoading) ? (
            <Loading size="lg" />
          ) : filteredMessages.length === 0 ? (
            <p className="activity-history__messages__no-messages">
              {t("no_messages")}
            </p>
          ) : (
            filteredMessages.map((message, index) => {
              if (message.type === "system") {
                return (
                  <SystemMessage
                    key={message.time + index}
                    title={
                      systemMessageTypes.includes(message.content)
                        ? t(message.content)
                        : message.content
                    }
                    date={message.dateObj}
                  />
                );
              }

              const isSent = message.senderId !== providerId;
              return (
                <Message
                  key={message.time + index}
                  message={message.content}
                  sent={isSent}
                  received={!isSent}
                  date={message.dateObj}
                />
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </Box>
    </Block>
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
        <Text style={styles.dateText}>
          {t("exported_at", {
            time: getTimeAsString(new Date()) + ", " + getDateView(new Date()),
          })}
        </Text>
        {messages.map((message, index) => {
          const isSent = message.senderId !== providerId;
          if (message.type === "system" && !showSystemMessages) return null;
          const messageDate = message.dateObj || new Date(Number(message.time));
          return (
            <View key={index} style={styles.view} wrap={false}>
              <View
                style={[
                  styles.message,
                  message.type != "system" &&
                    (isSent ? styles.messageSent : styles.messageReceived),
                  message.type === "system" && styles.systemMessage,
                ]}
              >
                <Text style={styles.messageText}>
                  {message.type === "system"
                    ? t(message.content)
                    : message.content}
                </Text>
                <Text style={[styles.date, isSent ? styles.dateSent : ""]}>
                  {getDateView(messageDate)}, {getTime(messageDate)}
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
    marginTop: "6px",
    fontWeight: "normal",
  },
  dateText: {
    alignSelf: "center",
    marginTop: "6px",
    fontWeight: "normal",
    textAlign: "center",
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
    borderRadius: "18px",
    padding: "8px 14px",
    textAlign: "left",
    maxWidth: "35%",
    marginTop: "8px",
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
    fontSize: "12px",
    fontWeight: "bold",
  },
  messageSent: {
    backgroundColor: "#54cfd9",
    alignSelf: "flex-end",
    marginRight: "16px",
  },
  messageReceived: {
    backgroundColor: "#e6f1f4",
    marginLeft: "16px",
  },
  date: { color: "gray", marginTop: "6px", fontSize: "10" },
  dateSent: {
    color: "#66768d",
  },
});
