"use client";

import React, { useState, useEffect } from "react";
import { PersonalityAssessment } from "@/lib/personality";
import { ChevronLeft, ChevronRight, BookOpen, Star, BarChart2, Search, Map, Shield, BookMarked } from "lucide-react";

interface BookProps {
  data: PersonalityAssessment | null;
  isOpen: boolean;
  onClick: () => void;
}

const PAGE_ICONS = [BookOpen, Star, BarChart2, Search, Map, Shield, BookMarked];

// ─── Confidence Badge ─────────────────────────────────────────────────────────
const ConfidenceBadge = ({ level }: { level: string }) => {
  const map: Record<string, { color: string; bg: string; border: string }> = {
    High:   { color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-300" },
    Medium: { color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-300" },
    Low:    { color: "text-rose-700",    bg: "bg-rose-50",     border: "border-rose-300" },
  };
  const s = map[level] ?? map.Medium;
  const dotColor = level === "High" ? "bg-emerald-500" : level === "Medium" ? "bg-amber-500" : "bg-rose-500";
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest border ${s.bg} ${s.border} ${s.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor} animate-pulse`} />
      {level} Confidence
    </span>
  );
};

// ─── Animated Score Bar ───────────────────────────────────────────────────────
const ScoreBar = ({ value, color, label, delay = 0 }: { value: number; color: string; label: string; delay?: number }) => {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value * 10), delay + 100);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <div className="flex items-center gap-2 group">
      <span className="text-[9px] font-mono uppercase tracking-widest w-7 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
        <div className="h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${width}%`, backgroundColor: color }} />
      </div>
      <span className="text-[9px] font-mono opacity-50 w-5 text-right">{value}</span>
    </div>
  );
};

// ─── Page Renderer ────────────────────────────────────────────────────────────
const PageRenderer = ({ type, data, side }: { type: string; data: PersonalityAssessment; side: "left" | "right" }) => {
  const cursiveClass = "font-['Lovers_Quarrel'] text-4xl text-[#bc6c25] block mb-1";
  const border = side === "right" ? "border-l-4 border-black/5" : "border-r-4 border-black/5";

  switch (type) {

    case "classification":
      return (
        <div className={`w-full h-full p-8 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col ${border} overflow-hidden relative`}>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
            <span className="text-[160px] font-black leading-none uppercase tracking-tighter" style={{ color: "rgba(0,0,0,0.022)" }}>{data.primaryClassification.type[0]}</span>
          </div>
          <div className="mb-4">
            <span className={cursiveClass}>Identity Profile</span>
            <div className="h-px mb-4" style={{ background: "linear-gradient(to right, #bc6c25, transparent)" }} />
            <div className="flex items-start justify-between gap-3">
              <h1 className="text-3xl font-extrabold tracking-tighter uppercase leading-none">{data.primaryClassification.type}</h1>
              <ConfidenceBadge level={data.primaryClassification.confidence} />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#bc6c25] mt-1 opacity-70">Primary Personality Pattern</p>
          </div>
          <div className="grid grid-cols-4 gap-1.5 mb-4">
            {["PRODUCER", "DIRECTOR", "ACTOR", "WRITER"].map((t) => {
              const isActive = data.primaryClassification.type.toUpperCase().includes(t);
              return (
                <div key={t} className={`rounded-lg p-2 text-center border transition-all ${isActive ? "bg-[#bc6c25] border-[#bc6c25] text-white" : "bg-black/5 border-black/5 text-black/30"}`}>
                  <p className="text-[8px] font-mono font-bold uppercase tracking-widest leading-none">{t}</p>
                </div>
              );
            })}
          </div>
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#bc6c25] mb-2 font-bold">Executive Summary</h2>
            <p className="text-base leading-relaxed italic text-[#3a5a40] font-medium border-l-4 border-[#bc6c25]/30 pl-4 py-2">{data.primaryClassification.summary}</p>
          </div>
          <p className="text-[9px] font-mono opacity-20 mt-4 text-center uppercase tracking-[0.4em]">AuthorMeld · Meld Manuscript · Page 1</p>
        </div>
      );

    case "dimensions":
      return (
        <div className={`w-full h-full p-8 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col ${border} overflow-hidden`}>
          <span className={cursiveClass}>Dimension Analysis</span>
          <div className="h-px mb-4" style={{ background: "linear-gradient(to right, #bc6c25, transparent)" }} />
          <div className="flex gap-3 mb-4 flex-wrap">
            {[["Producer","#bc6c25"],["Director","#283618"],["Actor","#606c38"],["Writer","#dda15e"]].map(([name, color]) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-[9px] font-mono uppercase tracking-wider opacity-70">{name}</span>
              </div>
            ))}
          </div>
          <div className="flex-1 space-y-5 overflow-y-auto pr-2 custom-scrollbar">
            {data.dimensionScores.map((score, i) => {
              const bars = [
                { key: "producer", color: "#bc6c25", label: "P", val: score.producer },
                { key: "director", color: "#283618", label: "D", val: score.director },
                { key: "actor",    color: "#606c38", label: "A", val: score.actor },
                { key: "writer",   color: "#dda15e", label: "W", val: score.writer },
              ];
              const dominant = bars.reduce((a, b) => a.val > b.val ? a : b);
              return (
                <div key={i} className="pb-4 border-b border-black/5 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold tracking-tight uppercase">{score.dimension}</span>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full border" style={{ borderColor: dominant.color, color: dominant.color }}>{dominant.label} dominant</span>
                  </div>
                  <div className="space-y-1.5">
                    {bars.map(({ key, color, label, val }) => <ScoreBar key={key} value={val} color={color} label={label} delay={i * 100} />)}
                  </div>
                  <p className="mt-2 text-[9px] italic opacity-50 leading-tight">{score.notes}</p>
                </div>
              );
            })}
          </div>
          <p className="text-[9px] font-mono opacity-20 mt-3 text-center uppercase tracking-[0.4em]">AuthorMeld · Meld Manuscript · Page 2</p>
        </div>
      );

    case "evidence":
      return (
        <div className={`w-full h-full p-8 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col ${border} overflow-hidden`}>
          <span className={cursiveClass}>Behavioral Evidence</span>
          <div className="h-px mb-4" style={{ background: "linear-gradient(to right, #bc6c25, transparent)" }} />
          <div className="flex-1 space-y-5 overflow-y-auto pr-3 custom-scrollbar">
            {data.evidence.map((ev, i) => (
              <div key={i} className="relative pl-6">
                <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#bc6c25] flex items-center justify-center shrink-0">
                  <span className="text-white text-[9px] font-bold">{i + 1}</span>
                </div>
                <p className="text-[9px] font-mono uppercase tracking-widest text-[#bc6c25] mb-1.5 font-bold">{ev.description}</p>
                <blockquote className="text-sm leading-relaxed italic font-medium mb-2 text-[#1a1a1a] bg-[#bc6c25]/5 border-l-2 border-[#bc6c25]/30 pl-3 py-1.5 rounded-r-sm">"{ev.quote}"</blockquote>
                <p className="text-xs opacity-60 leading-relaxed">{ev.impact}</p>
              </div>
            ))}
          </div>
          <p className="text-[9px] font-mono opacity-20 mt-3 text-center uppercase tracking-[0.4em]">AuthorMeld · Meld Manuscript · Page 3</p>
        </div>
      );

    case "strategy":
      return (
        <div className={`w-full h-full p-8 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col ${border} overflow-hidden`}>
          <span className={cursiveClass}>Strategic Blueprint</span>
          <div className="h-px mb-4" style={{ background: "linear-gradient(to right, #bc6c25, transparent)" }} />
          <div className="mb-4 p-3 bg-[#283618]/5 rounded-xl border border-[#283618]/10">
            <h3 className="text-[9px] font-mono uppercase tracking-widest text-[#283618] mb-1 font-bold">Secondary Driver</h3>
            <p className="text-xl font-extrabold uppercase leading-none mb-1">{data.secondaryType.type}</p>
            <p className="text-xs leading-relaxed opacity-70 italic">{data.secondaryType.explanation}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="p-3 rounded-xl border border-[#bc6c25]/15" style={{ background: "rgba(188,108,37,0.06)" }}>
              <h4 className="text-[8px] font-mono uppercase tracking-widest text-[#bc6c25] mb-1.5 font-bold">Recommended Tone</h4>
              <p className="text-xs font-medium leading-tight">{data.personalityTemplate.tone}</p>
            </div>
            <div className="p-3 rounded-xl border border-[#283618]/10 bg-[#283618]/5">
              <h4 className="text-[8px] font-mono uppercase tracking-widest text-[#283618] mb-1.5 font-bold">Linguistic Style</h4>
              <p className="text-xs font-medium leading-tight">{data.personalityTemplate.languageStyle}</p>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-4">
            <div>
              <h4 className="text-[9px] font-mono uppercase tracking-widest text-[#bc6c25] mb-2 font-bold border-b border-[#bc6c25]/10 pb-1 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#bc6c25]" /> Motivational Hooks
              </h4>
              <ul className="space-y-1.5">
                {data.personalityTemplate.motivationalHooks.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs opacity-80"><span className="text-[#bc6c25] shrink-0 mt-0.5">✦</span>{h}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[9px] font-mono uppercase tracking-widest mb-2 font-bold border-b pb-1 flex items-center gap-2" style={{ color: "rgba(153,27,27,0.7)", borderColor: "rgba(153,27,27,0.1)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-rose-700/50" /> What to Avoid
              </h4>
              <ul className="space-y-1.5">
                {data.personalityTemplate.whatToAvoid.map((a, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs opacity-70 text-rose-950"><span className="text-rose-600 shrink-0 mt-0.5">✕</span>{a}</li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-[9px] font-mono opacity-20 mt-3 text-center uppercase tracking-[0.4em]">AuthorMeld · Meld Manuscript · Page 4</p>
        </div>
      );

    case "limitations":
      return (
        <div className={`w-full h-full p-8 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col ${border} overflow-hidden`}>
          <span className={cursiveClass}>Data Integrity</span>
          <div className="h-px mb-4" style={{ background: "linear-gradient(to right, #bc6c25, transparent)" }} />
          <h2 className="text-[10px] font-mono uppercase tracking-widest text-[#bc6c25] mb-3 font-bold">Analyst Certification</h2>
          <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar">
            <h3 className="text-[9px] font-mono uppercase tracking-widest mb-3 font-bold border-b pb-1" style={{ color: "rgba(188,108,37,0.8)", borderColor: "rgba(188,108,37,0.1)" }}>Contextual Limitations</h3>
            <p className="text-sm leading-relaxed italic text-[#3a5a40] opacity-90 p-5 bg-black/5 rounded-xl border border-black/5">{data.dataLimitations}</p>
            <div className="flex items-center justify-center mt-6">
              <div className="relative w-36 h-36 flex flex-col items-center justify-center">
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-[#bc6c25]/20 rotate-[-15deg]" />
                <div className="absolute inset-2 rounded-full border border-[#bc6c25]/10 rotate-[5deg]" />
                <p className="text-[8px] font-mono uppercase tracking-[0.5em] mb-1 opacity-30 leading-none text-center">Authentication<br/>Seal</p>
                <div className="text-lg font-black uppercase tracking-widest opacity-20 leading-none text-center">{data.primaryClassification.type}</div>
                <p className="text-[6px] mt-1.5 opacity-20 font-mono">1937 Masterwork Protocol</p>
              </div>
            </div>
          </div>
          <p className="text-[9px] font-mono opacity-20 mt-3 text-center uppercase tracking-[0.4em]">AuthorMeld · Meld Manuscript · Page 5</p>
        </div>
      );

    default:
      return null;
  }
};

// ─── CSS Page (3D flip card) ──────────────────────────────────────────────────
const CSSPage = ({
  index, total, flipped, onFlip, frontContent, backContent, coverImage, isHinted,
}: {
  index: number; total: number; flipped: boolean; onFlip: () => void;
  frontContent?: React.ReactNode; backContent?: React.ReactNode;
  coverImage?: string; isHinted?: boolean;
}) => {
  const zIndex = flipped ? index : total - index;
  return (
    <div
      className="absolute top-0 right-0 w-full h-full cursor-pointer preserve-3d"
      style={{
        zIndex,
        transformOrigin: "left center",
        transition: "transform 900ms cubic-bezier(0.4, 0, 0.2, 1)",
        transform: flipped ? "rotateY(-180deg) translateZ(0)" : "rotateY(0deg) translateZ(0)",
        willChange: "transform",
      }}
      onClick={onFlip}
    >
      {/* FRONT */}
      <div className="absolute inset-0 backface-hidden overflow-hidden rounded-r-lg" style={{ boxShadow: "-10px 0 30px rgba(0,0,0,0.12)" }}>
        {isHinted && !flipped && (
          <div className="absolute right-0 top-0 h-full w-10 z-10 pointer-events-none animate-pulse" style={{ background: "linear-gradient(to left, rgba(188,108,37,0.15), transparent)" }} />
        )}
        {coverImage ? (
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url(${coverImage})` }}>
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
          </div>
        ) : (
          <div className="w-full h-full bg-[#fefae0]">{frontContent}</div>
        )}
      </div>
      {/* BACK */}
      <div className="absolute inset-0 backface-hidden overflow-hidden rounded-l-lg" style={{ transform: "rotateY(180deg)", boxShadow: "10px 0 30px rgba(0,0,0,0.12)" }}>
        <div className="w-full h-full bg-[#fefae0]">{backContent}</div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Book3D({ data, isOpen, onClick }: BookProps) {
  const [flippedPages, setFlippedPages] = useState<boolean[]>([false, false, false, false]);
  const [hovering, setHovering] = useState(false);

  const spreadLabels = ["Cover", "Profile", "Evidence", "Strategy", "End"];
  const currentSpread = flippedPages.filter(Boolean).length;

  // Auto-flip cover on open
  useEffect(() => {
    if (isOpen && !flippedPages[0]) {
      const t = setTimeout(() => setFlippedPages(prev => [true, prev[1], prev[2], prev[3]]), 400);
      return () => clearTimeout(t);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const togglePage = (index: number) => {
    const n = [...flippedPages];
    if (!n[index]) { for (let i = 0; i <= index; i++) n[i] = true; }
    else           { for (let i = index; i < n.length; i++) n[i] = false; }
    setFlippedPages(n);
  };

  const goForward = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = flippedPages.findIndex(f => !f);
    if (next !== -1) togglePage(next);
  };

  const goBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    const rev = [...flippedPages].reverse();
    const last = rev.findIndex(f => f);
    if (last !== -1) togglePage(flippedPages.length - 1 - last);
  };

  // ── CLOSED ───────────────────────────────────────────────────────────────────
  if (!isOpen) {
    return (
      <div
        className="w-full h-full flex flex-col items-center justify-center cursor-pointer group"
        onClick={onClick}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ perspective: "1200px" }}
      >
        <div
          className="relative transition-all duration-700"
          style={{ 
            transform: hovering ? "rotateY(-15deg) rotateX(4deg) scale(1.05) translateZ(0)" : "rotateY(0deg) rotateX(0deg) scale(1) translateZ(0)", 
            transformStyle: "preserve-3d",
            willChange: "transform"
          }}
        >
          <div
            className="w-52 h-[308px] bg-cover bg-center rounded-r-lg border-l-8 border-black/40 relative overflow-hidden"
            style={{ backgroundImage: "url('/cover.jpg')", boxShadow: "-20px 20px 50px rgba(0,0,0,0.7)" }}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-black/20" />
          </div>
          <div className="absolute top-0 -left-2 w-4 h-full rounded-l-sm shadow-2xl" style={{ background: "linear-gradient(to right, #000, #2a1a08)" }} />
          <div className="absolute top-1 -right-1.5 w-2 rounded-r-sm" style={{ height: "calc(100% - 8px)", background: "linear-gradient(to bottom, #fdf8e1, #e8dfc0)" }} />
        </div>

        <div className={`mt-6 flex flex-col items-center gap-2 transition-all duration-500 ${hovering ? "opacity-100 translate-y-0" : "opacity-60 translate-y-1"}`}>
          <p className="text-[#D4AF37] font-mono text-[10px] uppercase tracking-[0.4em] animate-pulse">
            Click to reveal your profile
          </p>
          <div className="flex items-center gap-2 text-white/20 text-[9px] font-mono uppercase tracking-widest">
            <BookOpen className="w-3 h-3" />
            <span>AuthorMeld Manuscript</span>
          </div>
        </div>
      </div>
    );
  }

  // ── OPEN ─────────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-4 px-2 bg-transparent">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lovers+Quarrel&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.04); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(188,108,37,0.25); border-radius: 4px; }
      `}</style>

      {/* Page label */}
      <div className="flex items-center justify-center gap-2 mb-3 shrink-0">
        {(() => {
          const Icon = PAGE_ICONS[Math.min(currentSpread, PAGE_ICONS.length - 1)] ?? BookOpen;
          return (
            <>
              <Icon className="w-3 h-3" style={{ color: "rgba(188,108,37,0.6)" }} />
              <span className="text-[10px] font-mono uppercase tracking-[0.5em]" style={{ color: "rgba(188,108,37,0.6)" }}>
                {spreadLabels[Math.min(currentSpread, spreadLabels.length - 1)]}
              </span>
            </>
          );
        })()}
      </div>

      {/* Prev | Book | Next */}
      <div className="flex items-center justify-center gap-4 flex-1 w-full min-h-0">

        {/* Prev */}
        <button onClick={goBack} disabled={currentSpread === 0}
          className="group flex flex-col items-center gap-1.5 transition-opacity shrink-0"
          style={{ opacity: currentSpread === 0 ? 0.2 : 1 }}>
          <div className="w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
            <ChevronLeft className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <span className="text-[8px] font-mono uppercase tracking-widest text-white/20 group-hover:text-white/40">Prev</span>
        </button>

        {/*
          PERSPECTIVE CONTAINER = 2 × one-page-width
          Book block = absolute, left 50%, width 50%
          → right half of the container is the current right page
          → flipped pages rotate left (rotateY -180°) around their left edge
            and their back face fills the left half = left page of spread
          The whole two-page spread is perfectly centered.
        */}
        <div
          className="relative shrink-0"
          style={{
            width:  "min(980px, 94vw)",
            height: "min(640px, 72vh)",
            perspective: "2800px",
            // Optimized box-shadow is significantly faster than drop-shadow filter
            boxShadow: "0 40px 100px -20px rgba(0,0,0,0.9), 0 0 60px -10px rgba(212,175,55,0.15)",
            transform: "translateZ(0)",
          }}
        >
          {/* Simplified Ambient glow - radial gradient is faster than blur filter */}
          <div className="absolute pointer-events-none rounded-full" 
            style={{ 
              inset: "0%", 
              background: "radial-gradient(circle at center, rgba(188,108,37,0.08) 0%, transparent 70%)",
              transform: "translateZ(-1px)" 
            }} 
          />

          {/* BOOK BLOCK — right half only */}
          <div
            className="absolute top-0 h-full preserve-3d"
            style={{ left: "50%", width: "50%" }}
          >
            {/* Spine — sits exactly at center, flush with both pages */}
            <div
              className="absolute top-0 h-full z-20 rounded-l-sm flex flex-col items-center justify-center"
              style={{ left: -20, width: 20, background: "linear-gradient(to right, #0a0a0a, #2a1a08)", boxShadow: "0 0 20px rgba(0,0,0,0.8)" }}
            >
              <span className="text-[6px] font-mono uppercase tracking-[0.4em] text-white/30 whitespace-nowrap" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
                AuthorMeld
              </span>
            </div>

            {/* Page-stack base - Visible on the right when everything is flipped */}
            <div className="absolute inset-0 rounded-r-lg z-0 overflow-hidden" style={{ background: "#f5efd8", boxShadow: "0 10px 40px rgba(0,0,0,0.4)" }}>
              {/* Final branding on the back base */}
              <div className="w-full h-full flex flex-col items-center justify-center opacity-[0.03] select-none pointer-events-none">
                <span className="font-['Lovers_Quarrel'] text-[120px] rotate-[-5deg]">AuthorMeld</span>
              </div>
            </div>

            {/* Page 0: Cover + Inside Cover */}
            <CSSPage index={0} total={4} flipped={flippedPages[0]} onFlip={() => togglePage(0)}
              coverImage="/cover.jpg" isHinted={!flippedPages[0]}
              backContent={
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#fefae0] gap-4">
                  <span className="font-['Lovers_Quarrel'] text-7xl rotate-[-12deg] select-none" style={{ color: "rgba(188,108,37,0.1)" }}>AuthorMeld</span>
                  <p className="text-[9px] font-mono uppercase tracking-[0.6em] px-8 text-center" style={{ color: "rgba(0,0,0,0.2)" }}>A Confidential Personality Integration Report</p>
                  <div className="w-16 h-px" style={{ background: "rgba(188,108,37,0.2)" }} />
                  <p className="text-[8px] font-mono uppercase tracking-widest" style={{ color: "rgba(0,0,0,0.15)" }}>1937 Masterwork Protocol</p>
                </div>
              }
            />

            {/* Page 1: Classification + Dimensions */}
            {data && <CSSPage index={1} total={4} flipped={flippedPages[1]} onFlip={() => togglePage(1)}
              isHinted={flippedPages[0] && !flippedPages[1]}
              frontContent={<PageRenderer type="classification" data={data} side="right" />}
              backContent={<PageRenderer type="dimensions" data={data} side="left" />}
            />}

            {/* Page 2: Evidence + Strategy */}
            {data && <CSSPage index={2} total={4} flipped={flippedPages[2]} onFlip={() => togglePage(2)}
              isHinted={flippedPages[1] && !flippedPages[2]}
              frontContent={<PageRenderer type="evidence" data={data} side="right" />}
              backContent={<PageRenderer type="strategy" data={data} side="left" />}
            />}

            {/* Page 3: Limitations + End */}
            <CSSPage index={3} total={4} flipped={flippedPages[3]} onFlip={() => togglePage(3)}
              isHinted={flippedPages[2] && !flippedPages[3]}
              frontContent={data ? <PageRenderer type="limitations" data={data} side="right" /> : undefined}
              backContent={
                <div className="w-full h-full flex flex-col items-center justify-center gap-6 border-l-8 border-black/40 px-12" style={{ background: "linear-gradient(135deg, #0a0a0a, #1a0f02)" }}>
                  <div className="w-16 h-px" style={{ background: "rgba(188,108,37,0.6)" }} />
                  
                  <div className="text-center space-y-2">
                    <p className="font-mono tracking-[0.5em] uppercase text-[11px] font-bold" style={{ color: "#bc6c25" }}>
                      Manuscript Complete
                    </p>
                    <p className="text-[9px] font-mono uppercase tracking-widest text-white/30">
                      Final Analysis Finalized
                    </p>
                  </div>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                       <span className="font-['Lovers_Quarrel'] text-6xl">Hill</span>
                    </div>
                    <p className="font-serif italic text-base text-center leading-relaxed relative z-10" style={{ color: "rgba(255,255,255,0.7)" }}>
                      "Whatever the mind can conceive and believe, it can achieve."
                    </p>
                  </div>

                  <div className="w-16 h-px" style={{ background: "rgba(188,108,37,0.6)" }} />
                  
                  <div className="text-center">
                    <p className="font-mono text-[10px] uppercase tracking-[0.3em] font-bold text-white/50">Napoleon Hill</p>
                    <p className="font-mono text-[8px] uppercase tracking-widest text-white/20 mt-1">Masterwork Protocol · 1937</p>
                  </div>

                  {/* Aesthetic certification seal bottom right */}
                  <div className="absolute bottom-6 right-6 opacity-20 rotate-[-15deg]">
                    <div className="w-16 h-16 rounded-full border border-dashed border-[#bc6c25]/40 flex items-center justify-center">
                       <span className="text-[6px] font-mono text-[#bc6c25] text-center">CERTIFIED<br/>MELD</span>
                    </div>
                  </div>
                </div>
              }
            />
          </div>
        </div>

        {/* Next */}
        <button onClick={goForward} disabled={flippedPages.every(Boolean)}
          className="group flex flex-col items-center gap-1.5 transition-opacity shrink-0"
          style={{ opacity: flippedPages.every(Boolean) ? 0.2 : 1 }}>
          <div className="w-10 h-10 rounded-full border border-white/10 bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/10 transition-all active:scale-95">
            <ChevronRight className="w-4 h-4 text-white/60 group-hover:text-white transition-colors" />
          </div>
          <span className="text-[8px] font-mono uppercase tracking-widest text-white/20 group-hover:text-white/40">Next</span>
        </button>
      </div>

      {/* Progress bar */}
      <div className="mt-4 flex items-center gap-4 shrink-0">
        {spreadLabels.map((label, i) => {
          const isActive = currentSpread === i;
          const isDone   = currentSpread > i;
          return (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="rounded-full transition-all duration-500" style={{
                height: isActive ? 6 : 4,
                width:  isActive ? 28 : isDone ? 20 : 12,
                background: isDone ? "#bc6c25" : isActive ? "rgba(188,108,37,0.6)" : "rgba(255,255,255,0.15)",
              }} />
              <span className="text-[7px] font-mono uppercase tracking-widest transition-colors duration-300" style={{
                color: isActive ? "rgba(188,108,37,0.7)" : isDone ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
              }}>
                {label}
              </span>
            </div>
          );
        })}
      </div>

      <p className="mt-2 text-[8px] font-mono uppercase tracking-widest shrink-0" style={{ color: "rgba(255,255,255,0.15)" }}>
        Click pages or use arrows to navigate
      </p>
    </div>
  );
}
