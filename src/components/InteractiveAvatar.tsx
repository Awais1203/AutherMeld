"use client";

import React, { useEffect, useRef, useState } from "react";
import { LiveAvatarContextProvider, useLiveAvatarContext } from "../liveavatar/context";
import { useSession } from "../liveavatar/useSession";
import { Loader2, Send, BookOpen, Mic2 } from "lucide-react";
import { SessionState, AgentEventsEnum } from "@heygen/liveavatar-web-sdk";
import Book3D from "./Book3D";
import { PersonalityAssessment } from "@/lib/personality";
import { DUMMY_TRANSCRIPT } from "@/lib/constants";

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
                    &quot;Truly, thoughts are things, and powerful things at that, when they are mixed with definiteness of purpose, persistence, and a burning desire for their translation into riches, or other material objects.&quot;
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
const RevealStage = ({ 
    onReset, 
    assessment 
}: { 
    onReset: () => void, 
    assessment: PersonalityAssessment | null 
}) => {
    const [isBookOpen, setIsBookOpen] = useState(false);

    return (
        <div className="w-full h-full bg-black flex items-center justify-center p-12 relative animate-in zoom-in-95 fade-in duration-1000">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#D4AF3715_0%,_transparent_70%)] opacity-30"></div>
            <div className="relative z-10 flex flex-col items-center gap-6 w-full h-full">
                <div className="flex-1 w-full max-h-[85vh]">
                    <Book3D 
                        data={assessment} 
                        isOpen={isBookOpen} 
                        onClick={() => setIsBookOpen(!isBookOpen)} 
                    />
                </div>
                
                <div className="flex flex-col items-center gap-4">
                    {!isBookOpen && (
                        <p className="text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
                            Click the Manuscript to reveal your profile
                        </p>
                    )}
                    <button onClick={onReset} className="px-10 py-4 border border-white/10 text-white/30 font-mono text-[9px] uppercase tracking-[0.4em] hover:text-[#D4AF37] hover:border-[#D4AF37] transition-all cursor-pointer">
                        Reset AuthorMeld Session
                    </button>
                </div>
            </div>
        </div>
    );
};

/**
 * THE SESSION VIEW ORCHESTRATOR
 */
function SessionView({ 
    pitchState, 
    setPitchState, 
    onReset,
    assessment,
    setAssessment,
    transcriptRef 
}: { 
    pitchState: PitchState, 
    setPitchState: (s: PitchState) => void, 
    onReset: () => void,
    assessment: PersonalityAssessment | null,
    setAssessment: (a: PersonalityAssessment) => void,
    transcriptRef: React.RefObject<string>
}) {
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

    // Sequential Cleanup: STOP AVATAR when leaving Zoom stage
    useEffect(() => {
        if (pitchState !== "zoomCall" && sessionRef.current) {
            console.log("SDK: Leaving Zoom Stage - Stopping Avatar Session...");
            sessionRef.current.stop();
        }
    }, [pitchState, sessionRef]);


    // Background Assessment Trigger
    useEffect(() => {
        if (pitchState === "typing" && !assessment) {
            console.log("Starting Personality Assessment process...");
            
            // Read the ref directly — always has the latest value regardless of closure age
            const currentTranscript = transcriptRef.current ?? "";
            const wordCount = currentTranscript.trim().split(/\s+/).filter(Boolean).length;
            console.log(`Transcript word count: ${wordCount}`);
            console.log(`Transcript preview: ${currentTranscript.slice(0, 200)}`);

            const effectiveTranscript = wordCount < 100 ? DUMMY_TRANSCRIPT : currentTranscript;
            
            if (wordCount < 100) {
                console.log(`Short transcript (${wordCount} words) — using Napoleon Hill dummy fallback.`);
            }

            // 2. Call the Stop API (for logging/cleanup)
            fetch("/api/stop", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: effectiveTranscript }),
            }).catch(err => console.error("Stop API failed:", err));

            // 3. Call the Assessment API
            console.log("Triggering Personality Assessment API...");
            fetch("/api/assessment", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ transcript: effectiveTranscript }),
            })
            .then(res => res.json())
            .then(data => {
                console.log("Assessment Complete:", data);
                setAssessment(data);
            })
            .catch(err => console.error("Assessment Failed:", err));
        }
    }, [pitchState, assessment, transcriptRef, setAssessment]);

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
                <RevealStage onReset={onReset} assessment={assessment} />
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
    const [transcript, setTranscript] = useState("");
    // Keep a ref so effects always see the latest transcript without going stale
    const transcriptRef = useRef("");
    const [assessment, setAssessment] = useState<PersonalityAssessment | null>(null);

    const updateTranscript = (updater: string | ((prev: string) => string)) => {
        setTranscript(prev => {
            const next = typeof updater === "function" ? updater(prev) : updater;
            transcriptRef.current = next;
            return next;
        });
    };

    useEffect(() => {
        const handleKeys = (e: KeyboardEvent) => {
            if (e.key === "1") setPitchState("zoomCall");
            if (e.key === "2") {
                console.log("Manual Stop Triggered (Key 2)");
                setPitchState("typing");
            }
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
                <p className="text-white/20 font-serif text-sm italic italic leading-relaxed">&quot;Opportunity often comes disguised in the form of misfortune, or temporary defeat.&quot;</p>
            </div>
        </div>
    );

    return (
        <LiveAvatarContextProvider sessionAccessToken={sessionToken}>
            <TranscriptTracker 
                setTranscript={updateTranscript} 
                onTrigger={() => {
                    console.log("Trigger phrase callback executed. Waiting 2s before transition...");
                    setTimeout(() => {
                        setPitchState("typing");
                    }, 2000);
                }}
            />
            <SessionView 
                pitchState={pitchState} 
                setPitchState={setPitchState} 
                assessment={assessment}
                setAssessment={setAssessment}
                transcriptRef={transcriptRef}
                onReset={() => { 
                    setSessionToken(""); 
                    setPitchState("zoomCall"); 
                    setTranscript("");
                    transcriptRef.current = "";
                    setAssessment(null);
                }} 
            />
        </LiveAvatarContextProvider>
    );
}

/**
 * HELPER: Component to track transcript within the Context
 * Uses a polling interval to wait for sessionRef.current to be available
 * (on production/Vercel the session is set asynchronously after mount)
 */
function TranscriptTracker({ 
    setTranscript,
    onTrigger
}: { 
    setTranscript: (t: string | ((prev: string) => string)) => void,
    onTrigger: () => void
}) {
    const { sessionRef } = useLiveAvatarContext();
    const attachedRef = useRef(false);

    useEffect(() => {
        // Retry attaching until the session object exists
        const tryAttach = () => {
            const session = sessionRef.current;
            if (!session || attachedRef.current) return;

            attachedRef.current = true;
            console.log("TranscriptTracker: Session found, attaching listeners.");

            const handleTalk = (event: { text?: string; event_type: string }) => {
                if (event.text) {
                    const prefix = event.event_type === AgentEventsEnum.USER_TRANSCRIPTION ? "User: " : "Avatar: ";
                    const text = event.text;
                    setTranscript(prev => prev + "\n" + prefix + text);

                    // If it's the avatar talking, check for the transition trigger
                    if (event.event_type === AgentEventsEnum.AVATAR_TRANSCRIPTION) {
                        const lowerText = text.toLowerCase();
                        if (lowerText.includes("integrate your profile")) {
                            console.log("Speech Trigger Detected: 'integrate your profile'");
                            onTrigger();
                        }
                    }
                }
            };

            session.on(AgentEventsEnum.AVATAR_TRANSCRIPTION, handleTalk);
            session.on(AgentEventsEnum.USER_TRANSCRIPTION, handleTalk);

            // Store cleanup on the interval stop
            return () => {
                session.off(AgentEventsEnum.AVATAR_TRANSCRIPTION, handleTalk);
                session.off(AgentEventsEnum.USER_TRANSCRIPTION, handleTalk);
            };
        };

        // Try immediately
        const cleanup = tryAttach();
        if (cleanup) return cleanup;

        // If session isn't ready yet, poll every 500ms (handles Vercel cold starts)
        const interval = setInterval(() => {
            const done = tryAttach();
            if (done) clearInterval(interval);
        }, 500);

        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionRef]);

    return null;
}
