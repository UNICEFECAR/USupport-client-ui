// VideoTrack.js
import { useEffect, useRef } from "react";

export default function VideoTrack({ type, track }) {
  const ref = useRef();

  useEffect(() => {
    if (track) {
      const el = ref.current;

      try {
        if (track.track) {
          track.track.attach(el);
        } else {
          track.attach(el);
        }
      } catch (err) {
        console.error(err);
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

  return <video className={`${type}-video`} ref={ref} />;
}
