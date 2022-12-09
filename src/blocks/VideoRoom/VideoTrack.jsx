// VideoTrack.js
import { useEffect, useRef } from "react";

export default function VideoTrack({ track }) {
  const ref = useRef();

  useEffect(() => {
    if (track) {
      const el = ref.current;
      if (track.track) {
        track.track.attach(el);
      } else {
        track.attach(el);
      }

      return () => {
        if (track.track) {
          track.track.detach(el);
        } else {
          track.detach(el);
        }
      };
    }
  }, [track]);

  return <video ref={ref} />;
}
