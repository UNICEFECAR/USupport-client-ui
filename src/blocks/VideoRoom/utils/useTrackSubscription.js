import { useEffect, useState } from "react";

/**
 * participant track subscription
 */
export default function useTrackSubscription({ participant }) {
  const [videoTrack, setVideoTrack] = useState(null);
  const [audioTrack, setAudioTrack] = useState(null);

  useEffect(() => {
    if (participant) {
      /**
       * participant track subs
       */
      const trackSubscribed = (track) => {
        if (!track) {
          setVideoTrack(null);
        } else if (track.kind === "video") {
          setVideoTrack(track);
        } else if (track.kind === "audio") {
          setAudioTrack(track);
        }
      };

      participant.tracks.forEach((publication) => {
        if (publication.track) {
          trackSubscribed(publication.track);
        }
      });

      const trackPublished = (track) => {
        if (!track) {
          setVideoTrack(null);
          return;
        } else if (track.kind === "video") {
          setVideoTrack(track);
        } else if (track.kind === "audio") {
          setAudioTrack(track);
        }
      };
      participant.on("trackPublished", (track) => {
        if (track.track) {
          trackPublished(track.track);
        } else {
          trackPublished(track);
        }
      });
      participant.on("trackSubscribed", trackSubscribed);

      /**
       * participant track unsubs
       */
      const trackUnsubscribed = (track) => {
        if (!track) {
          setVideoTrack(null);
          return;
        } else if (track.kind === "video") {
          setVideoTrack(null);
        } else if (track.kind === "audio") {
          setAudioTrack(null);
        }
      };
      participant.on("trackUnsubscribed", trackUnsubscribed);
      participant.on("trackUnpublished", () => {
        trackUnsubscribed();
      });

      return () => {
        participant.off("trackSubscribed", trackSubscribed);
        participant.off("trackUnsubscribed", trackUnsubscribed);
      };
    }
  }, [participant]);

  return { audioTrack, videoTrack };
}
