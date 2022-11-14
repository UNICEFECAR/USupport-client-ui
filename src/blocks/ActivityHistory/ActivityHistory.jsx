import React from "react";
import {
  Block,
  SystemMessage,
  Message,
  Avatar,
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
  const id = "1";
  const messages = [
    {
      type: "system-message",
      message: "Consultation started",
      date: new Date("10.25.2022 14:30"),
    },
    {
      type: "message",
      senderId: "1",
      receiverId: "2",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra mattis lectus turpis mauris odio vestibulum urna.",
      date: new Date("10.25.2022 14:32"),
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
      date: new Date("10.25.2022 14:32"),
    },
    {
      type: "message",
      senderId: "2",
      receiverId: "1",
      message: "yes.",
      date: new Date("10.25.2022 14:35"),
    },
    {
      type: "message",
      senderId: "1",
      receiverId: "2",
      message:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra mattis lectus turpis mauris odio vestibulum urna.",
      date: new Date("10.25.2022 14:32"),
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
      type: "system-message",
      message: "Consultation ended",
      date: new Date("10.25.2022 15:30"),
    },
  ];

  const renderAllMessages = () => {
    return messages.map((message) => {
      if (message.type === "system-message") {
        return <SystemMessage title={message.message} date={message.date} />;
      } else {
        if (message.senderId === id) {
          return <Message message={message.message} sent date={message.date} />;
        } else {
          return (
            <Message message={message.message} received date={message.date} />
          );
        }
      }
    });
  };

  return (
    <Block classes="activity-history">
      <div className="activity-history__content">
        <div className="activity-history__provider-container">
          <Avatar />
          <h4>Dr. Joanna Doe </h4>
        </div>
        <div className="activity-history__messages-container">
          {renderAllMessages()}
        </div>
      </div>
    </Block>
  );
};
