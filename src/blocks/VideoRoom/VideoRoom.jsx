import React from "react";
import { useEffect } from "react";
import Participant from "./Participant";
import useRoom from "./utils/useRoom";

import { Controls } from "@USupport-components-library/src";

import "./video-room.scss";

export function VideoRoom({
  joinWithVideo = true,
  joinWithMicrophone = true,
  consultation,
  toggleChat,
  leaveConsultation,
  token,
  t,
}) {
  const roomName = "1";
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

  const hasRemoteParticipants = remoteParticipants.length > 0;

  const handleLeaveConsultation = () => {
    disconnectRoom();
    leaveConsultation();
  };

  if (room)
    return (
      <div className="video-room">
        <Controls
          consultation={consultation}
          toggleCamera={toggleCamera}
          toggleMicrophone={toggleMicrophone}
          toggleChat={toggleChat}
          leaveConsultation={handleLeaveConsultation}
          isCameraOn={isCameraOn}
          isMicrophoneOn={isMicrophoneOn}
          t={t}
        />

        <div className="video-room__participants">
          <div className="video-room__local-participant">
            <Participant participant={localParticipant} />
          </div>
          <div className="video-room__remote-participant">
            {remoteParticipants.map((p) => (
              <Participant participant={p} />
            ))}
          </div>
        </div>
      </div>
    );
  return null;
}
