import useParticipant from "./useParticipant";
import useRoomConnection from "./useRoomConnection";
import useToggleCamera from "./useToggleCamera";
import useToggleMicrophone from "./useToggleMicrophone";

export default function useRoom(
  startWithVideoOn,
  startWithAudioOn,
  setIsProviderInSession
) {
  const { room, error, connectRoom, disconnectRoom } = useRoomConnection(
    setIsProviderInSession
  );
  const { localParticipant, remoteParticipants } = useParticipant({ room });
  const { isCameraOn, toggleCamera } = useToggleCamera({
    room,
    initialState: startWithVideoOn,
  });
  const { isMicrophoneOn, toggleMicrophone } = useToggleMicrophone({
    room,
    initialState: startWithAudioOn,
  });

  return {
    room,
    error,
    connectRoom,
    disconnectRoom,
    localParticipant,
    remoteParticipants,
    isCameraOn,
    toggleCamera,
    isMicrophoneOn,
    toggleMicrophone,
  };
}
