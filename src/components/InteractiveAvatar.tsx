"use client";

import { useEffect, useRef, useState } from "react";
import { LiveAvatarContextProvider, useLiveAvatarContext } from "../liveavatar/context";
import { useSession } from "../liveavatar/useSession";
import { Loader2, Send, BookOpen, Mic2 } from "lucide-react";
import { SessionState, AgentEventsEnum } from "@heygen/liveavatar-web-sdk";

type PitchState = "zoomCall" | "typing" | "splitScreen" | "finalCover";

/**
 * STATE 1: AVATAR STAGE (zoomCall)
 */
const AvatarStage = ({ 
    videoRef, 
    inputText, 
    setInputText, 
    onSend 
}: { 
    videoRef: React.RefObject<HTMLVideoElement | null>,
    inputText: string,
    setInputText: (s: string) => void,
    onSend: () => void 
}) => {
    const { isStreamReady, isAvatarTalking, isUserTalking, isMuted, mute, unmute } = useSession();
    const { sessionState } = useLiveAvatarContext();

    return (
        <div className="w-full h-full flex items-center justify-center bg-[#0a0a0a] p-8 animate-in fade-in duration-700">
        <div className="relative w-[80vw] h-[80vh] bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(0,0,0,1)] ring-1 ring-white/5">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-contain z-0" />
                
              

                {/* HUD Overlay */}
                <div className="absolute top-24 left-8 right-8 z-20 flex justify-between items-start pointer-events-none">
                    <div className="flex flex-col gap-3">
                        {isAvatarTalking && (
                            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-[#D4AF37]/50 shadow-xl">
                                <div className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] animate-pulse"></div>
                                <span className="text-[11px] text-[#D4AF37] font-mono uppercase tracking-[0.2em] font-bold">Napoleon Hill Speaking</span>
                            </div>
                        )}
                        {isUserTalking && (
                            <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-blue-500/20 backdrop-blur-md border border-blue-400/50 shadow-xl">
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
                                <span className="text-[11px] text-blue-400 font-mono uppercase tracking-[0.2em] font-bold">Listening...</span>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => isMuted ? unmute() : mute()}
                        className="pointer-events-auto cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full font-mono text-[11px] uppercase tracking-widest border bg-black/40 border-white/10 text-white hover:bg-white hover:text-black transition-all"
                    >
                        <Mic2 className="w-3.5 h-3.5" />
                        {isMuted ? 'Mic Off' : 'Mic Live'}
                    </button>
                </div>

                <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6 z-30 flex gap-3 pointer-events-auto">
                    <input
                        type="text" value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && onSend()}
                        placeholder="Engage with the Author..."
                        className="flex-1 bg-black/80 backdrop-blur-2xl border border-white/10 rounded-full px-8 py-5 text-sm focus:outline-none focus:border-[#D4AF37]/50 text-white"
                    />
                    <button onClick={onSend} className="p-5 bg-[#D4AF37] text-black rounded-full shadow-[0_0_40px_rgba(212,175,55,0.3)] cursor-pointer"><Send className="w-6 h-6" /></button>
                </div>

                {!isStreamReady && sessionState !== SessionState.DISCONNECTED && (
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/95">
                        <Loader2 className="w-12 h-12 animate-spin text-[#D4AF37] mb-6" />
                        <p className="text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.5em]">Synchronizing Master Mind Session...</p>
                    </div>
                )}
            </div>
        </div>
    );
};

/**
 * STATE 2: TYPING STAGE (typing)
 */
const TypingStage = ({ isActive, onComplete }: { isActive: boolean, onComplete: () => void }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(() => {});
            
            // Auto-advance to Split Screen after 10 seconds
            const timer = setTimeout(() => {
                onComplete();
            }, 10000);
            return () => clearTimeout(timer);
        } else if (videoRef.current) {
            videoRef.current.pause();
        }
    }, [isActive, onComplete]);

    return (
        <div className="w-full h-full relative bg-black flex flex-col items-center justify-center overflow-hidden">
            <video ref={videoRef} src="/typing.mp4" loop muted playsInline className="absolute inset-0 w-full h-full object-fill opacity-80" />
            <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-20 w-full text-center px-6">
                <p className="text-white font-mono text-[16px] font-bold uppercase tracking-[0.4em] animate-pulse-fade opacity-90">
                    Protocol v2.0: Compiling Psychological Profile & Re-Authoring Manuscript...
                </p>
            </div>
        </div>
    );
};

/**
 * STATE 3: MELD STAGE (splitScreen)
 */
const MeldStage = ({ isActive, onComplete }: { isActive: boolean, onComplete: () => void }) => {
    const [liveText, setLiveText] = useState("");
    const full = "Truly, your ambitions are tangible forces, especially when combined with your decisive 'Type-A' drive and your burning desire to overcome that recent bottleneck in your enterprise.";
    
    useEffect(() => {
        if (!isActive) {
            setLiveText("");
            return;
        }
        let i = 0;
        const interval = setInterval(() => {
            setLiveText(full.slice(0, i));
            i++;
            if (i > full.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, [isActive]);

    return (
        <div className="w-full h-full grid grid-cols-2 bg-[#111827] relative animate-in slide-in-from-bottom-10 duration-1000">
            <div className="border-r border-white/5 flex flex-col p-24 justify-center gap-10 bg-black/20">
                <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-white/40">ORIGINAL TEXT (1937)</span>
                <p className="max-w-xl text-2xl font-serif text-white/30 italic leading-relaxed">
                    "Truly, thoughts are things, and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a burning desire for their translation into riches, or other material objects."
                </p>
            </div>
            <div className="flex flex-col p-24 justify-center gap-10 bg-gradient-to-br from-black/0 to-[#D4AF37]/5">
                <span className="text-[10px] font-mono uppercase tracking-[0.5em] text-[#D4AF37] drop-shadow-[0_0_100px_rgba(212,175,55,0.4)] font-bold">MELDED TEXT (LIVE)</span>
                <p className="max-w-xl min-h-[300px] text-3xl font-serif text-[#D4AF37] leading-snug tracking-tight">
                    {liveText}<span className="inline-block w-1 h-8 bg-[#D4AF37] ml-2 animate-pulse translate-y-1"></span>
                </p>
            </div>
            <div className="absolute bottom-16 left-0 right-0 flex justify-center z-50">
                <button onClick={onComplete} className="px-12 py-5 bg-[#D4AF37] text-black font-extrabold uppercase tracking-[0.3em] text-[10px] rounded-full shadow-[0_0_40px_rgba(212,175,55,0.2)] hover:scale-110 active:scale-95 transition-all cursor-pointer">
                    Compile Final Manuscript
                </button>
            </div>
        </div>
    );
};

/**
 * STATE 4: REVEAL STAGE (finalCover)
 */
const RevealStage = ({ onReset }: { onReset: () => void }) => (
    <div className="w-full h-full bg-black flex items-center justify-center p-12 relative animate-in zoom-in-95 fade-in duration-1000">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#D4AF3715_0%,_transparent_70%)] opacity-30"></div>
        <div className="relative z-10 flex flex-col items-center gap-12">
            <div className="relative group">
                <img src="/cover.jpg" className="max-h-[85vh] object-contain shadow-[0_50px_100px_rgba(0,0,0,1)] border border-white/10 group-hover:scale-105 transition-transform duration-1000" alt="Cover" />
                <div className="absolute -inset-4 border border-[#D4AF37]/10 rounded-sm -z-10 group-hover:-inset-6 transition-all duration-1000"></div>
            </div>
            <button onClick={onReset} className="px-10 py-4 border border-white/10 text-white/30 font-mono text-[9px] uppercase tracking-[0.4em] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all cursor-pointer">
                Reset AuthorMeld Session
            </button>
        </div>
    </div>
);

/**
 * THE SESSION VIEW ORCHESTRATOR
 */
function SessionView({ pitchState, setPitchState, onReset }: { pitchState: PitchState, setPitchState: (s: PitchState) => void, onReset: () => void }) {
    const { isStreamReady, attachElement } = useSession();
    const { sessionRef } = useLiveAvatarContext();
    const [inputText, setInputText] = useState("");
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        if (isStreamReady && videoRef.current && pitchState === "zoomCall") {
            attachElement(videoRef.current);
            videoRef.current.muted = false;
            videoRef.current.play().catch(() => {});
        }
    }, [isStreamReady, attachElement, pitchState]);

    // Automatic Speech Trigger (State 1 -> State 2)
    useEffect(() => {
        const session = sessionRef.current;
        if (!session) return;

        const handleTranscription = (event: any) => {
            const text = event.text?.toLowerCase() || "";
            // Look for the "holy grail" trigger phrase
            if (text.includes("integrate your profile") || text.includes("integrate your profile into our manuscript")) {
                console.log("Trigger phrase detected! Transitioning to Typing Stage...");
                setPitchState("typing");
            }
        };

        session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, handleTranscription);
        return () => {
            session.off(AgentEventsEnum.AVATAR_TRANSCRIPTION, handleTranscription);
        };
    }, [pitchState, setPitchState, sessionRef]);

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || !sessionRef.current) return;
        setInputText("");
        try { await sessionRef.current.message(text); } catch (e) { console.error(e); }
    };

    const getOverlayClass = (state: PitchState) => {
        return `absolute inset-0 transition-all duration-1000 ease-in-out ${
            pitchState === state ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-105 pointer-events-none"
        }`;
    };

    return (
        <div className="relative w-full h-full bg-black">
            {/* STATE 1: AVATAR */}
            <div className={getOverlayClass("zoomCall")}>
                <AvatarStage videoRef={videoRef} inputText={inputText} setInputText={setInputText} onSend={handleSend} />
            </div>

            {/* STATE 2: TYPING */}
            <div className={`${getOverlayClass("typing")} transition-all duration-[2000ms]`}>
                <TypingStage 
                    isActive={pitchState === "typing"} 
                    onComplete={() => setPitchState("splitScreen")}
                />
            </div>

            {/* STATE 3: MELD */}
            <div className={getOverlayClass("splitScreen")}>
                <MeldStage isActive={pitchState === "splitScreen"} onComplete={() => setPitchState("finalCover")} />
            </div>

            {/* STATE 4: REVEAL */}
            <div className={getOverlayClass("finalCover")}>
                <RevealStage onReset={onReset} />
            </div>
        </div>
    );
}

/**
 * ENTRY POINT
 */
export default function InteractiveAvatar() {
    const [sessionToken, setSessionToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [pitchState, setPitchState] = useState<PitchState>("zoomCall");

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === "1") setPitchState("zoomCall");
            if (e.key === "2") setPitchState("typing");
            if (e.key === "3") setPitchState("splitScreen");
        };
        window.addEventListener("keydown", handleKeys);
        return () => window.removeEventListener("keydown", handleKeys);
    }, []);

    const start = async () => {
        if (isLoading || sessionToken) return;
        setIsLoading(true);
        try {
            const res = await fetch("/api/session-token", { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    avatar_id: process.env.NEXT_PUBLIC_AVATAR_ID,
                }),
            });
            if (!res.ok) throw new Error("Token request failed");
            const data = await res.json();
            setSessionToken(data.session_token);
        } catch (e) { 
            console.error("Auth Error:", e);
            alert("Session Init failed: Ensure HEYGEN_API_KEY is correct."); 
        } finally { 
            setIsLoading(false); 
        }
    };

    if (!sessionToken) return (
        <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_center,_#111827_0%,_#000_100%)]">
            <div className="flex flex-col items-center gap-12 max-w-2xl text-center">
                <div className="flex flex-col gap-4">
                    <span className="text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.8em] font-bold">The AuthorMeld Protocol</span>
                    <h1 className="text-6xl text-white font-serif tracking-tight leading-none">Assemble your Life's Work.</h1>
                </div>
                <button onClick={start} disabled={isLoading} className="group relative px-16 py-6 border border-[#D4AF37]/30 bg-black text-[#D4AF37] font-extrabold uppercase tracking-[0.3em] text-xs hover:bg-[#D4AF37] hover:text-black active:scale-95 transition-all shadow-[0_0_80px_rgba(212,175,55,0.1)] cursor-pointer">
                    {isLoading ? <Loader2 className="animate-spin" /> : "Initiate Mentor Session"}
                </button>
                <p className="text-white/20 font-serif text-sm italic italic leading-relaxed">"Opportunity often comes disguised in the form of misfortune, or temporary defeat."</p>
            </div>
        </div>
    );

    return (
        <LiveAvatarContextProvider sessionAccessToken={sessionToken}>
            <SessionView pitchState={pitchState} setPitchState={setPitchState} onReset={() => { setSessionToken(""); setPitchState("zoomCall"); }} />
        </LiveAvatarContextProvider>
    );
}
