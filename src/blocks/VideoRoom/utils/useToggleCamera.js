import { useCallback, useState } from "react";
import { createLocalVideoTrack } from "twilio-video";

/**
 * Toggle on/off local participant camera
 *
 * References:
 * https://www.twilio.com/docs/video/javascript-getting-started#mute-your-local-media
 */
export default function useToggleCamera({ room, initialState }) {
  const [isCameraOn, setIsCameraOn] = useState(initialState);

  const toggleCamera = useCallback(() => {
    if (room) {
      if (isCameraOn) {
        // turn off
        room.localParticipant.videoTracks.forEach((publication) => {
          publication.track.disable();
        });

        setIsCameraOn(false);
      } else {
        if (room.localParticipant.videoTracks.size === 0) {
          createLocalVideoTrack().then((track) => {
            room.localParticipant.publishTrack(track);
          });
        }
        // console.log(room.localParticipant.videoTracks, "videoTracks");
        // turn on
        room.localParticipant.videoTracks.forEach((publication) => {
          publication.track.enable();
        });

        setIsCameraOn(true);
      }
    }
  }, [isCameraOn, room]);

  return { isCameraOn, toggleCamera };
}
