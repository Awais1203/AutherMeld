import { useCallback } from "react";
import { useLiveAvatarContext } from "./context";

export const useSession = () => {
  const {
    sessionRef,
    sessionState,
    isStreamReady,
    isUserTalking,
    isAvatarTalking,
    isMuted,
  } = useLiveAvatarContext();

  const startSession = useCallback(async () => {
    if (!sessionRef.current) return;
    try {
      await sessionRef.current.start();
    } catch (error) {
      console.error("Failed to start LiveAvatar session:", error);
      throw error;
    }
  }, [sessionRef]);

  const stopSession = useCallback(async () => {
    if (!sessionRef.current) return;
    try {
      await sessionRef.current.stop();
    } catch (error) {
      console.error("Failed to stop LiveAvatar session:", error);
    }
  }, [sessionRef]);

  const mute = useCallback(async () => {
    const vc = sessionRef.current?.voiceChat;
    if (vc) return await vc.mute();
  }, [sessionRef]);

  const unmute = useCallback(async () => {
    const vc = sessionRef.current?.voiceChat;
    if (vc) return await vc.unmute();
  }, [sessionRef]);

  const attachElement = useCallback(
    (element: HTMLVideoElement) => {
      if (!sessionRef.current || !isStreamReady) return;
      sessionRef.current.attach(element);
    },
    [sessionRef, isStreamReady]
  );

  return {
    state: sessionState,
    isStreamReady,
    isUserTalking,
    isAvatarTalking,
    isMuted,
    startSession,
    stopSession,
    mute,
    unmute,
    attachElement,
  };
};
