"use client";

import React, { useState, useMemo } from "react";
import { PersonalityAssessment } from "@/lib/personality";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookProps {
  data: PersonalityAssessment | null;
  isOpen: boolean;
  onClick: () => void;
}

const PageRenderer = ({ type, data }: { type: string, data: PersonalityAssessment }) => {
  const cursiveClass = "font-['Lovers_Quarrel'] text-5xl text-[#bc6c25] block mb-2 px-2";
  
  switch (type) {
    case "classification":
      return (
        <div className="w-full h-full p-10 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col border-r-4 border-black/5 overflow-hidden">
          <span className={cursiveClass}>Masterwork Analysis</span>
          <div className="border-b-2 border-[#bc6c25] pb-4 mb-6">
            <h1 className="text-4xl font-extrabold tracking-tighter uppercase leading-none mb-1">{data.primaryClassification.type}</h1>
            <p className="text-xs text-[#bc6c25] font-bold tracking-widest uppercase">Primary Personality Pattern</p>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            <h2 className="text-lg font-bold mb-4 text-[#bc6c25] uppercase tracking-widest border-b border-[#bc6c25]/10 pb-1">Executive Summary</h2>
            <p className="text-xl leading-relaxed italic text-[#3a5a40] font-medium border-l-4 border-[#bc6c25]/20 pl-4 py-2 mb-6">
              {data.primaryClassification.summary}
            </p>
            <div className="inline-block px-4 py-2 bg-[#bc6c25]/10 rounded-full border border-[#bc6c25]/20">
                <p className="text-xs font-bold text-[#bc6c25] uppercase tracking-widest">Confidence: {data.primaryClassification.confidence}</p>
            </div>
          </div>
          <p className="text-[10px] font-mono opacity-30 mt-4 text-center uppercase tracking-[0.4em]">Authormeld Meld Manuscript</p>
        </div>
      );
    case "dimensions":
      return (
        <div className="w-full h-full p-10 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col border-l-4 border-black/5 overflow-hidden">
          <span className={cursiveClass}>The Measure of Mind</span>
          <h2 className="text-xl font-bold mb-6 border-b border-[#bc6c25] pb-2 uppercase tracking-wider text-[#bc6c25]">Dimension Statistics</h2>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {data.dimensionScores.map((score, i) => (
              <div key={i} className="relative">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-bold tracking-tight uppercase">{score.dimension}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 h-2">
                  {['producer', 'director', 'actor', 'writer'].map((key, idx) => {
                    const colors = ['#bc6c25', '#283618', '#606c38', '#dda15e'];
                    return (
                      <div key={key} className="bg-black/5 rounded-full overflow-hidden h-full">
                        <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(score as any)[key] * 10}%`, backgroundColor: colors[idx] }} />
                      </div>
                    );
                  })}
                </div>
                <p className="mt-1 text-[10px] italic opacity-60 leading-tight">{score.notes}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t border-[#bc6c25]/20 flex justify-between gap-2 text-[8px] font-mono uppercase tracking-tighter opacity-70">
                <span>P: Producer</span><span>D: Director</span><span>A: Actor</span><span>W: Writer</span>
          </div>
        </div>
      );
    case "evidence":
      return (
        <div className="w-full h-full p-10 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col border-r-4 border-black/5 overflow-hidden">
          <span className={cursiveClass}>Behavioral Proof</span>
          <h2 className="text-xl font-bold mb-6 border-b border-[#bc6c25] pb-2 uppercase tracking-wider text-[#bc6c25]">Observations</h2>
          <div className="flex-1 space-y-8 overflow-y-auto pr-4 custom-scrollbar">
            {data.evidence.map((ev, i) => (
              <div key={i} className="relative pl-6 border-l-2 border-[#bc6c25]/20 py-2">
                <p className="text-[10px] font-mono uppercase tracking-widest text-[#bc6c25] mb-2 font-bold">{ev.description}</p>
                <p className="text-lg leading-relaxed italic font-medium mb-3 text-[#1a1a1a]">&quot;{ev.quote}&quot;</p>
                <p className="text-sm opacity-70 leading-relaxed font-serif">{ev.impact}</p>
              </div>
            ))}
          </div>
        </div>
      );
    case "strategy":
      return (
        <div className="w-full h-full p-10 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col border-l-4 border-black/5 overflow-hidden">
          <span className={cursiveClass}>Strategic Roadmap</span>
          <div className="mb-6">
              <h3 className="text-xs font-mono uppercase tracking-widest text-[#bc6c25] mb-2 font-bold">Secondary Driver</h3>
              <p className="text-2xl font-extrabold mb-1 uppercase leading-none">{data.secondaryType.type}</p>
              <p className="text-sm leading-relaxed opacity-80 italic border-l-2 border-[#bc6c25]/10 pl-4">{data.secondaryType.explanation}</p>
          </div>
          <div className="flex-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
              <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-[#bc6c25]/5 rounded-xl border border-[#bc6c25]/10">
                      <h4 className="text-[8px] font-mono uppercase tracking-widest text-[#bc6c25] mb-2 font-bold leading-none">Recommended Tone</h4>
                      <p className="text-xs font-medium leading-tight">{data.personalityTemplate.tone}</p>
                  </div>
                  <div className="p-4 bg-[#283618]/5 rounded-xl border border-[#283618]/10">
                      <h4 className="text-[8px] font-mono uppercase tracking-widest text-[#283618] mb-2 font-bold leading-none">Linguistic Style</h4>
                      <p className="text-xs font-medium leading-tight">{data.personalityTemplate.languageStyle}</p>
                  </div>
              </div>
              <div className="space-y-4">
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-[#bc6c25] mb-3 font-bold flex items-center gap-2 border-b border-[#bc6c25]/10 pb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#bc6c25]"></div> Motivational Hooks
                    </h4>
                    <ul className="space-y-2 text-xs opacity-80 pl-4">
                        {data.personalityTemplate.motivationalHooks.map((h, i) => <li key={i}>• {h}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-red-800/60 mb-3 font-bold flex items-center gap-2 border-b border-red-800/10 pb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-800/40"></div> What to Avoid
                    </h4>
                    <ul className="space-y-2 text-xs opacity-70 text-red-950 pl-4">
                        {data.personalityTemplate.whatToAvoid.map((a, i) => <li key={i}>• {a}</li>)}
                    </ul>
                  </div>
              </div>
          </div>
        </div>
      );
    case "limitations":
      return (
        <div className="w-full h-full p-10 bg-[#fefae0] text-[#283618] font-serif shadow-inner flex flex-col border-r-4 border-black/5 overflow-hidden">
          <span className={cursiveClass}>Analyst Certification</span>
          <h2 className="text-xl font-bold mb-8 border-b border-[#bc6c25] pb-2 uppercase tracking-wider text-[#bc6c25]">Data Integrity</h2>
          <div className="flex-1 space-y-8 overflow-y-auto pr-2 custom-scrollbar">
            <div>
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-[#bc6c25] mb-4 font-bold border-b border-[#bc6c25]/10 pb-1">Contextual Limitations</h3>
              <p className="text-lg leading-relaxed italic text-[#3a5a40] opacity-90 p-6 bg-black/5 rounded-2xl border border-black/5">
                {data.dataLimitations}
              </p>
            </div>
            <div className="mt-auto p-8 border-2 border-dashed border-[#bc6c25]/20 rounded-full text-center aspect-square flex flex-col justify-center items-center max-w-[200px] mx-auto opacity-30 grayscale rotate-[-15deg]">
                <p className="text-[8px] font-mono uppercase tracking-[0.6em] mb-2 leading-none">Authentication Seal</p>
                <div className="text-xl font-black uppercase tracking-widest leading-none">{data.primaryClassification.type}</div>
                <p className="text-[6px] mt-2 opacity-60 font-mono">1937 Masterwork Protocol</p>
            </div>
          </div>
        </div>
      );
    default:
      return null;
  }
};

const CSSPage = ({ 
  index, 
  total, 
  flipped, 
  onFlip, 
  frontContent, 
  backContent, 
  coverImage 
}: { 
  index: number, 
  total: number, 
  flipped: boolean, 
  onFlip: () => void, 
  frontContent?: React.ReactNode, 
  backContent?: React.ReactNode,
  coverImage?: string
}) => {
  const zIndex = flipped ? index : total - index;
  
  return (
    <div 
      className={`absolute top-0 right-0 w-full h-full transition-transform duration-1000 origin-left preserve-3d cursor-pointer ${flipped ? "flipped-css-page" : ""}`}
      style={{ 
        zIndex: zIndex,
        transform: flipped ? "rotateY(-180deg)" : "rotateY(0deg)"
      }}
      onClick={onFlip}
    >
      {/* FRONT OF PAGE */}
      <div className="absolute inset-0 backface-hidden shadow-[-10px_0_30px_rgba(0,0,0,0.1)] overflow-hidden rounded-r-lg">
        {coverImage ? (
          <div 
            className="w-full h-full bg-cover bg-center" 
            style={{ backgroundImage: `url(${coverImage})` }}
          />
        ) : (
          <div className="w-full h-full bg-[#fefae0]">
            {frontContent}
          </div>
        )}
      </div>

      {/* BACK OF PAGE */}
      <div className="absolute inset-0 backface-hidden shadow-[10px_0_30px_rgba(0,0,0,0.1)] overflow-hidden rounded-l-lg rotate-y-180">
        <div className="w-full h-full bg-[#fefae0]">
          {backContent}
        </div>
      </div>
    </div>
  );
};

export default function Book3D({ data, isOpen, onClick }: BookProps) {
  const [flippedPages, setFlippedPages] = useState<boolean[]>([false, false, false, false]);

  // Auto-flip the cover when the book is opened for the first time
  React.useEffect(() => {
    if (isOpen && !flippedPages[0]) {
      // Small delay to let the initial "open" scale transition start
      const timer = setTimeout(() => {
        setFlippedPages(prev => [true, prev[1], prev[2], prev[3]]);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const togglePage = (index: number) => {
    const newFlipped = [...flippedPages];
    if (!newFlipped[index]) {
        for (let i = 0; i <= index; i++) newFlipped[i] = true;
    } else {
        for (let i = index; i < newFlipped.length; i++) newFlipped[i] = false;
    }
    setFlippedPages(newFlipped);
  };

  if (!isOpen) {
    return (
      <div className="w-full h-full flex items-center justify-center cursor-pointer group" onClick={onClick}>
        <div className="relative w-64 h-96 shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:rotate-y-[-10deg] preserve-3d">
            <div 
              className="absolute inset-0 bg-cover bg-center rounded-r-lg shadow-[-20px_20px_50px_rgba(0,0,0,0.5)] border-l-8 border-black/40" 
              style={{ backgroundImage: "url('/cover.jpg')" }}
            />
            <div className="absolute inset-y-4 -left-2 w-4 bg-black/60 rounded-l-lg blur-[1px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-4 md:p-12 bg-transparent overflow-visible">
      {/* Styles for CSS 3D Transforms */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Lovers+Quarrel&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap');
        
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .perspective-container {
          perspective: 2500px;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.05);
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(188, 108, 37, 0.2);
          border-radius: 4px;
        }
      `}</style>
      
      <div className="relative w-full max-w-[90vw] md:max-w-5xl aspect-[3/2] perspective-container flex items-center justify-center overflow-visible scale-90 sm:scale-100">
        {/* THE BOOK WRAPPER */}
        <div 
          className="relative w-[42%] h-full preserve-3d shadow-2xl transition-transform duration-1000"
          style={{ transform: `translateX(${isOpen ? "50%" : "0"}) rotateY(0deg)` }}
        >
          
          {/* FIXED SPINE / BACK CLOTH */}
          <div className="absolute top-0 -left-1 w-[40px] h-full bg-[#111] -translate-x-full shadow-2xl z-0 rounded-l-sm" />

          {/* PAGE STACK (THE STYLIZED PAGES EDGES) */}
          <div className="absolute inset-0 bg-white shadow-xl rounded-r-lg z-0" />

          {/* DYNAMIC PAGES */}
          
          {/* PAGE 0: Cover & Inside Cover */}
          <CSSPage 
            index={0} total={4} 
            flipped={flippedPages[0]} 
            onFlip={() => togglePage(0)}
            coverImage="/cover.jpg"
            backContent={
              <div className="w-full h-full flex items-center justify-center bg-[#fefae0] border-r-8 border-black/5">
                <span className="font-['Lovers_Quarrel'] text-9xl text-black/5 rotate-[-15deg]">Meld</span>
              </div>
            }
          />

          {/* PAGE 1: Classification & Dimensions */}
          {data && (
            <CSSPage 
                index={1} total={4} 
                flipped={flippedPages[1]} 
                onFlip={() => togglePage(1)}
                frontContent={<PageRenderer type="classification" data={data} />}
                backContent={<PageRenderer type="dimensions" data={data} />}
            />
          )}

          {/* PAGE 2: Evidence & Strategy */}
          {data && (
            <CSSPage 
                index={2} total={4} 
                flipped={flippedPages[2]} 
                onFlip={() => togglePage(2)}
                frontContent={<PageRenderer type="evidence" data={data} />}
                backContent={<PageRenderer type="strategy" data={data} />}
            />
          )}

          {/* PAGE 3: Limitations & Final Seal */}
          <CSSPage 
            index={3} total={4} 
            flipped={flippedPages[3]} 
            onFlip={() => togglePage(3)}
            frontContent={data ? <PageRenderer type="limitations" data={data} /> : undefined}
            backContent={
              <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center border-l-8 border-black/40">
                <p className="text-white/20 font-mono tracking-[0.5em] uppercase text-xs rotate-90">Manuscript End</p>
              </div>
            }
          />
          
        </div>
      </div>
    </div>
  );
}
