import React from "react";
import { useEffect } from "react";
import Participant from "./Participant";
import useRoom from "./utils/useRoom";

import { Controls, Icon } from "@USupport-components-library/src";

import "./video-room.scss";

export function VideoRoom({
  joinWithVideo = true,
  joinWithMicrophone = true,
  consultation,
  toggleChat,
  leaveConsultation,
  handleSendMessage,
  token,
  t,
}) {
  const roomName = consultation.consultationId;

  const {
    room,
    connectRoom,
    disconnectRoom,
    localParticipant,
    remoteParticipants,
    isCameraOn,
    toggleCamera,
    isMicrophoneOn,
    toggleMicrophone,
  } = useRoom(joinWithVideo, joinWithMicrophone);

  useEffect(() => {
    if (!room && token && roomName) {
      connectRoom({
        token,
        options: {
          name: roomName,
          video: joinWithVideo,
          audio: joinWithMicrophone,
        },
      });
      return () => disconnectRoom();
    }
  }, [connectRoom, disconnectRoom, room, roomName, token]);

  const hasRemoteParticipants = remoteParticipants?.length > 0;

  const handleLeaveConsultation = () => {
    disconnectRoom();
    leaveConsultation();
  };
  useEffect(() => {
    console.log(`%c${remoteParticipants}`, `color: red`, "REMOTE PARTICIPANTS");
  }, [remoteParticipants]);

  return (
    <div className="video-room">
      <Controls
        consultation={consultation}
        toggleCamera={toggleCamera}
        toggleMicrophone={toggleMicrophone}
        toggleChat={toggleChat}
        leaveConsultation={handleLeaveConsultation}
        handleSendMessage={handleSendMessage}
        renderIn="provider"
        isCameraOn={isCameraOn}
        isMicrophoneOn={isMicrophoneOn}
        t={t}
      />

      <div className="video-room__participants">
        <Participant type={"local"} participant={localParticipant} />
        {!hasRemoteParticipants ? (
          <div className="remote-video-off video-off">
            <Icon name="stop-camera" size="lg" color="#ffffff" />
          </div>
        ) : null}
        <div className="video-room__remote-participant">
          {remoteParticipants.map((p, index) => (
            <Participant
              type={"remote"}
              key={"participant" + index}
              participant={p}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
