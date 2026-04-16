import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  ConnectionQuality,
  LiveAvatarSession,
  SessionState,
  SessionEvent,
  VoiceChatEvent,
  VoiceChatState,
  AgentEventsEnum,
  VoiceChatConfig,
} from "@heygen/liveavatar-web-sdk";

type LiveAvatarContextProps = {
  sessionRef: React.RefObject<LiveAvatarSession>;
  isMuted: boolean;
  voiceChatState: VoiceChatState;
  sessionState: SessionState;
  isStreamReady: boolean;
  connectionQuality: ConnectionQuality;
  isUserTalking: boolean;
  isAvatarTalking: boolean;
};

export const LiveAvatarContext = createContext<LiveAvatarContextProps>({
  sessionRef: {
    current: null,
  } as unknown as React.RefObject<LiveAvatarSession>,
  connectionQuality: ConnectionQuality.UNKNOWN,
  isMuted: true,
  voiceChatState: VoiceChatState.INACTIVE,
  sessionState: SessionState.DISCONNECTED,
  isStreamReady: false,
  isUserTalking: false,
  isAvatarTalking: false,
});

type LiveAvatarContextProviderProps = {
  children: React.ReactNode;
  sessionAccessToken: string;
  voiceChatConfig?: boolean | VoiceChatConfig;
};

const useSessionState = (session: LiveAvatarSession | null) => {
  const [sessionState, setSessionState] = useState<SessionState>(SessionState.INACTIVE);
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>(ConnectionQuality.UNKNOWN);
  const [isStreamReady, setIsStreamReady] = useState<boolean>(false);

  useEffect(() => {
    if (!session) return;

    // Synchronize initial state
    setSessionState(session.state);
    setConnectionQuality(session.connectionQuality);

    const handleStateChange = (state: SessionState) => {
      setSessionState(state);
      if (state === SessionState.DISCONNECTED) {
        setIsStreamReady(false);
      }
    };

    const handleStreamReady = () => setIsStreamReady(true);
    const handleQualityChange = (q: ConnectionQuality) => setConnectionQuality(q);

    session.on(SessionEvent.SESSION_STATE_CHANGED, handleStateChange);
    session.on(SessionEvent.SESSION_STREAM_READY, handleStreamReady);
    session.on(SessionEvent.SESSION_CONNECTION_QUALITY_CHANGED, handleQualityChange);

    return () => {
      session.off(SessionEvent.SESSION_STATE_CHANGED, handleStateChange);
      session.off(SessionEvent.SESSION_STREAM_READY, handleStreamReady);
      session.off(SessionEvent.SESSION_CONNECTION_QUALITY_CHANGED, handleQualityChange);
    };
  }, [session]);

  return { sessionState, isStreamReady, connectionQuality };
};

const useVoiceChatState = (session: LiveAvatarSession | null) => {
  const [isMuted, setIsMuted] = useState(true);
  const [voiceChatState, setVoiceChatState] = useState<VoiceChatState>(VoiceChatState.INACTIVE);

  useEffect(() => {
    if (!session) return;

    // Synchronize initial state
    setVoiceChatState(session.voiceChat.state);
    setIsMuted(session.voiceChat.isMuted);

    const handleMute = () => setIsMuted(true);
    const handleUnmute = () => setIsMuted(false);
    const handleStateChange = (s: VoiceChatState) => setVoiceChatState(s);

    session.voiceChat.on(VoiceChatEvent.MUTED, handleMute);
    session.voiceChat.on(VoiceChatEvent.UNMUTED, handleUnmute);
    session.voiceChat.on(VoiceChatEvent.STATE_CHANGED, handleStateChange);

    return () => {
      session.voiceChat.off(VoiceChatEvent.MUTED, handleMute);
      session.voiceChat.off(VoiceChatEvent.UNMUTED, handleUnmute);
      session.voiceChat.off(VoiceChatEvent.STATE_CHANGED, handleStateChange);
    };
  }, [session]);

  return { isMuted, voiceChatState };
};

const useTalkingState = (session: LiveAvatarSession | null) => {
  const [isUserTalking, setIsUserTalking] = useState(false);
  const [isAvatarTalking, setIsAvatarTalking] = useState(false);

  useEffect(() => {
    if (!session) return;

    const onUserStart = () => setIsUserTalking(true);
    const onUserEnd = () => setIsUserTalking(false);
    const onAvatarStart = () => setIsAvatarTalking(true);
    const onAvatarEnd = () => setIsAvatarTalking(false);

    session.on(AgentEventsEnum.USER_SPEAK_STARTED, onUserStart);
    session.on(AgentEventsEnum.USER_SPEAK_ENDED, onUserEnd);
    session.on(AgentEventsEnum.AVATAR_SPEAK_STARTED, onAvatarStart);
    session.on(AgentEventsEnum.AVATAR_SPEAK_ENDED, onAvatarEnd);

    return () => {
      session.off(AgentEventsEnum.USER_SPEAK_STARTED, onUserStart);
      session.off(AgentEventsEnum.USER_SPEAK_ENDED, onUserEnd);
      session.off(AgentEventsEnum.AVATAR_SPEAK_STARTED, onAvatarStart);
      session.off(AgentEventsEnum.AVATAR_SPEAK_ENDED, onAvatarEnd);
    };
  }, [session]);

  return { isUserTalking, isAvatarTalking };
};

// Persistent cache to survive React StrictMode remounts in development
const globalSessionCache = new Map<string, LiveAvatarSession>();
const globalStartFlags = new Set<string>();

export const LiveAvatarContextProvider = ({
  children,
  sessionAccessToken,
  voiceChatConfig = true,
}: LiveAvatarContextProviderProps) => {
  const sessionRef = useRef<LiveAvatarSession | null>(null);
  const [, forceUpdate] = useState({});

  // Lifecycle 1: Instance Management (SURVIVES REMOUNTS)
  useEffect(() => {
    if (!sessionAccessToken) return;

    // Reuse existing session if available for this token
    if (globalSessionCache.has(sessionAccessToken)) {
        sessionRef.current = globalSessionCache.get(sessionAccessToken)!;
        forceUpdate({}); // Ensure hooks re-sync with cached session
        return;
    }

    // Clean up old sessions that don't match this token
    for (const [token, oldSession] of globalSessionCache.entries()) {
        if (token !== sessionAccessToken) {
            console.log("SDK: Cleaning up abandoned session...");
            oldSession.stop();
            globalSessionCache.delete(token);
            globalStartFlags.delete(token);
        }
    }

    const config = {
      voiceChat: voiceChatConfig,
      apiUrl: "https://api.liveavatar.com",
    };

    console.log("SDK: Creating fresh session instance...");
    const newSession = new LiveAvatarSession(sessionAccessToken, config);
    globalSessionCache.set(sessionAccessToken, newSession);
    sessionRef.current = newSession;
    forceUpdate({});

    return () => {
        // We DON'T stop immediately on unmount to survive StrictMode.
        // Cleanup happens when a NEW token is provided or app truly dies.
    };
  }, [sessionAccessToken, voiceChatConfig]);

  // Hooks to sync state (they handle their own internal sync via useEffect)
  const { sessionState, isStreamReady, connectionQuality } = useSessionState(sessionRef.current);
  const { isMuted, voiceChatState } = useVoiceChatState(sessionRef.current);
  const { isUserTalking, isAvatarTalking } = useTalkingState(sessionRef.current);

  // Lifecycle 2: Sequential Global Start
  useEffect(() => {
    const session = sessionRef.current;
    if (session && sessionState === SessionState.INACTIVE && !globalStartFlags.has(sessionAccessToken)) {
        console.log("SDK: Initiating global session lock...");
        globalStartFlags.add(sessionAccessToken);
        
        session.start().catch(err => {
            if (!err.message?.includes("already started") && !err.message?.includes("connected")) {
                console.error("SDK: Session Start Error", err);
                globalStartFlags.delete(sessionAccessToken);
            }
        });
    }
  }, [sessionState, sessionRef, sessionAccessToken]);

  // Lifecycle 3: Sequential Voice Start
  useEffect(() => {
    const session = sessionRef.current;
    if (session && sessionState === SessionState.CONNECTED && voiceChatState === VoiceChatState.INACTIVE) {
        console.log("SDK: Starting voice chat...");
        session.voiceChat.start().catch(err => console.error("SDK: Voice Start Error", err));
        session.voiceChat.unmute().catch(err => console.error("SDK: Voice Unmute Error", err));
    }
  }, [sessionState, voiceChatState]);

  return (
    <LiveAvatarContext.Provider
      value={{
        sessionRef: sessionRef as React.RefObject<LiveAvatarSession>,
        sessionState,
        isStreamReady,
        connectionQuality,
        isMuted,
        voiceChatState,
        isUserTalking,
        isAvatarTalking,
      }}
    >
      {children}
    </LiveAvatarContext.Provider>
  );
};

export const useLiveAvatarContext = () => {
  return useContext(LiveAvatarContext);
};
