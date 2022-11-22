import React from "react";
import { useTranslation } from "react-i18next";
import {
  Avatar,
  Block,
  Button,
  SystemMessage,
  Message,
  Icon,
} from "@USupport-components-library/src";

import "./activity-history.scss";

/**
 * ActivityHistory
 *
 * ActivityHistory block
 *
 * @return {jsx}
 */
export const ActivityHistory = ({}) => {
  const { t } = useTranslation("activity-history");

  const id = "1";
  const messages = [
    {
      type: "system-message",
      message: "Consultation started",
      date: 1669051768000,
    },
    {
      type: "message",
      senderId: "1",
      receiverId: "2",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra mattis lectus turpis mauris odio vestibulum urna.",
      date: 1669051948000,
    },
    {
      type: "message",
      senderId: "2",
      receiverId: "1",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra mattis lectus turpis mauris odio vestibulum urna.",
      date: new Date("10.25.2022 14:35"),
    },
    {
      type: "message",
      senderId: "1",
      receiverId: "2",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra mattis lectus turpis mauris odio vestibulum urna.",
      date: 1669052128000,
    },
    {
      type: "message",
      senderId: "2",
      receiverId: "1",
      message: "yes.",
      date: 1669052428000,
    },
    {
      type: "message",
      senderId: "1",
      receiverId: "2",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra mattis lectus turpis mauris odio vestibulum urna.",
      date: 1669052668000,
    },
    {
      type: "message",
      senderId: "2",
      receiverId: "1",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra mattis lectus turpis mauris odio vestibulum urna.",
      date: 1669052788000,
    },
    {
      type: "system-message",
      message: "Consultation ended",
      date: 1669052988000,
    },
  ];

  const renderAllMessages = () => {
    return messages.map((message, index) => {
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
    console.log("schedule");
  };

  return (
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
          <h4>Dr. Joanna Doe </h4>
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
