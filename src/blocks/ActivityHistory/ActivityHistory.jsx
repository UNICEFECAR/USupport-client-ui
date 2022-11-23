import React from "react";
import { useTranslation } from "react-i18next";
import { Navigate, useLocation } from "react-router-dom";

import {
  Avatar,
  Block,
  Button,
  SystemMessage,
  Message,
  Icon,
  Loading,
} from "@USupport-components-library/src";
import { useGetConsultationData } from "#hooks";
import "./activity-history.scss";

/**
 * ActivityHistory
 *
 * ActivityHistory block
 *
 * @return {jsx}
 */
export const ActivityHistory = ({ openSelectConsultation, consultationId }) => {
  const { t } = useTranslation("activity-history");

  const consultationDataQuery = useGetConsultationData(consultationId);
  const data = consultationDataQuery.data;

  const id = "1";

  const renderAllMessages = () => {
    return data?.messages.map((message, index) => {
      if (message.type === "system-message") {
        return (
          <SystemMessage
            key={index + message.date}
            title={message.message}
            date={new Date(message.date)}
          />
        );
      } else {
        if (message.senderId === id) {
          return (
            <Message
              key={index + message.date}
              message={message.message}
              sent
              date={new Date(message.date)}
            />
          );
        } else {
          return (
            <Message
              key={index + message.date}
              message={message.message}
              received
              date={new Date(message.date)}
            />
          );
        }
      }
    });
  };

  const handleSchedule = () => {
    openSelectConsultation();
  };

  return consultationDataQuery.isLoading ? (
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
          />
          <Avatar />
          <h4>{data.providerName}</h4>
        </div>
      </Block>

      <Block classes="activity-history__main">
        <div className="activity-history__main__content">
          <div className="activity-history__main__messages-container">
            {renderAllMessages()}
          </div>
          <div className="activity-history__main__button-container">
            <Button
              label={t("button_label")}
              size="lg"
              onClick={handleSchedule}
            />
          </div>
        </div>
      </Block>
    </>
  );
};
