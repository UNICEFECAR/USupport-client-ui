import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Avatar,
  Block,
  Button,
  SystemMessage,
  Message,
  Icon,
  Loading,
} from "@USupport-components-library/src";

import { useGetChatData, useGetProviderStatus } from "#hooks";

import "./activity-history.scss";

const AMAZON_S3_BUCKET = `${import.meta.env.VITE_AMAZON_S3_BUCKET}`;

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

  const chatQueryData = useGetChatData(consultation?.chatId);
  const { data } = useGetProviderStatus(providerId);
  const providerStatus = data?.status;

  const renderAllMessages = () => {
    return chatQueryData.data?.messages.map((message, index) => {
      if (message.type === "system") {
        return (
          <SystemMessage
            key={index + message.time}
            title={message.content}
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
  };

  const handleSchedule = () => {
    openSelectConsultation();
  };

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
          <Avatar
            image={AMAZON_S3_BUCKET + "/" + (consultation.image || "default")}
          />
          <h4>{consultation.providerName}</h4>
        </div>
      </Block>

      <Block classes="activity-history__main">
        <div className="activity-history__main__content">
          <div className="activity-history__main__messages-container">
            {renderAllMessages()}
          </div>
          {!consultation.campaignId && providerStatus === "active" && (
            <div className="activity-history__main__button-container">
              <Button
                label={t("button_label")}
                size="lg"
                onClick={handleSchedule}
              />
            </div>
          )}
        </div>
      </Block>
    </>
  );
};
