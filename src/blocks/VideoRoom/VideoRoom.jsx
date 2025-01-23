import React, { useEffect, useMemo, useState } from "react";
import Participant from "./Participant";
import useRoom from "./utils/useRoom";

import { Controls, Icon, Modal } from "@USupport-components-library/src";

import "./video-room.scss";

export function VideoRoom({
  joinWithVideo = true,
  joinWithMicrophone = true,
  consultation,
  toggleChat,
  leaveConsultation,
  handleSendMessage,
  hasUnreadMessages,
  isProviderInSession,
  setIsProviderInSession,
  token,
  hideControls,
  t,
}) {
  const [showPermissionsPopUp, setShowPermissionsPopUp] = useState(false);
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
    error,
  } = useRoom(joinWithVideo, joinWithMicrophone, setIsProviderInSession);

  useEffect(() => {
    if (error) {
      if (error.message.includes("Permission denied")) {
        console.log("Permission error");
        setShowPermissionsPopUp(true);
      }
    }
  }, [error]);

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

  const hasRemoteParticipants = useMemo(() => {
    return remoteParticipants?.length > 0;
  }, [remoteParticipants]);

  useEffect(() => {
    if (isProviderInSession && !hasRemoteParticipants) {
      setIsProviderInSession(false);
    } else if (!isProviderInSession && hasRemoteParticipants) {
      setIsProviderInSession(true);
    }
  }, [isProviderInSession, hasRemoteParticipants]);

  const handleLeaveConsultation = () => {
    disconnectRoom();
    leaveConsultation();
  };

  return (
    <div className="video-room">
      <Modal
        isOpen={showPermissionsPopUp}
        heading={t("permissions_error")}
        closeModal={() => setShowPermissionsPopUp(false)}
      >
        <p>{t("allow_permissions")}</p>
      </Modal>
      {!hideControls && (
        <Controls
          consultation={consultation}
          toggleCamera={toggleCamera}
          toggleMicrophone={toggleMicrophone}
          toggleChat={toggleChat}
          leaveConsultation={handleLeaveConsultation}
          handleSendMessage={handleSendMessage}
          renderIn="client"
          isCameraOn={isCameraOn}
          isMicrophoneOn={isMicrophoneOn}
          isRoomConnecting={!localParticipant}
          hasUnreadMessages={hasUnreadMessages}
          isInSession={isProviderInSession}
          t={t}
        />
      )}

      <div
        className={`video-room__participants ${
          hideControls ? "video-room__participants--shrink-video" : ""
        }`}
      >
        <Participant
          deniedPermissions={!!error}
          type={"local"}
          participant={localParticipant}
        />
        {!hasRemoteParticipants ? (
          <div className="remote-video-off video-off">
            <Icon name="stop-camera" size="lg" color="#ffffff" />
          </div>
        ) : null}
        <div className="video-room__remote-participant">
          {hasRemoteParticipants && (
            <Participant
              type={"remote"}
              participant={remoteParticipants[remoteParticipants.length - 1]}
            />
          )}
        </div>
      </div>
    </div>
  );
}
