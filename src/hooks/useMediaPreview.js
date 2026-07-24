import { useRef, useState, useEffect, useCallback } from "react";

/**
 * Manages a local camera/microphone preview stream before joining a consultation.
 */
export function useMediaPreview(isActive) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [micLevel, setMicLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasStream, setHasStream] = useState(false);
  const [error, setError] = useState(null);

  const stopStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setHasStream(false);
    setMicLevel(0);
  }, []);

  const startPreview = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setError(new Error("Media devices are not supported in this browser."));
      return;
    }

    setIsLoading(true);
    setError(null);
    stopStream();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      streamRef.current = stream;
      setHasStream(true);
    } catch (err) {
      setError(err);
      setHasStream(false);
    } finally {
      setIsLoading(false);
    }
  }, [stopStream]);

  useEffect(() => {
    if (!isActive || !hasStream || !streamRef.current || !audioEnabled) {
      setMicLevel(0);
      return;
    }

    const audioTrack = streamRef.current.getAudioTracks()[0];
    if (!audioTrack) return;

    const ctx = new AudioContext();
    const analyser = ctx.createAnalyser();
    const source = ctx.createMediaStreamSource(streamRef.current);
    source.connect(analyser);
    analyser.fftSize = 256;

    const data = new Uint8Array(analyser.frequencyBinCount);
    let rafId;

    const tick = () => {
      analyser.getByteFrequencyData(data);
      const avg = data.reduce((sum, value) => sum + value, 0) / data.length;
      setMicLevel(Math.min(100, Math.round((avg / 255) * 100)));
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      ctx.close();
    };
  }, [isActive, hasStream, audioEnabled]);

  useEffect(() => {
    if (!isActive) {
      stopStream();
      setVideoEnabled(true);
      setAudioEnabled(true);
      setError(null);
    }
  }, [isActive, stopStream]);

  useEffect(() => {
    if (!videoRef.current || !streamRef.current) return;

    videoRef.current.srcObject =
      hasStream && videoEnabled ? streamRef.current : null;
  }, [hasStream, videoEnabled]);

  const toggleVideo = useCallback(() => {
    const next = !videoEnabled;
    setVideoEnabled(next);
    streamRef.current?.getVideoTracks().forEach((track) => {
      track.enabled = next;
    });

    if (!next && videoRef.current) {
      videoRef.current.srcObject = null;
    } else if (next && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [videoEnabled]);

  const toggleAudio = useCallback(() => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    streamRef.current?.getAudioTracks().forEach((track) => {
      track.enabled = next;
    });
  }, [audioEnabled]);

  return {
    videoRef,
    videoEnabled,
    audioEnabled,
    micLevel,
    isLoading,
    hasStream,
    error,
    startPreview,
    stopStream,
    toggleVideo,
    toggleAudio,
  };
}
