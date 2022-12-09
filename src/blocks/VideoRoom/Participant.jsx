import React from "react";
import useTrack from "./utils/useTrack";
import VideoTrack from "./VideoTrack";
import AudioTrack from "./AudioTrack";

export default function Participant({ participant }) {
  const { videoOn, audioOn, videoTrack, audioTrack } = useTrack({
    participant,
  });
  return (
    <React.Fragment>
      {videoOn ? <VideoTrack track={videoTrack} /> : null}
      <br />
      {audioOn ? <AudioTrack track={audioTrack} /> : null}
    </React.Fragment>
  );
}
