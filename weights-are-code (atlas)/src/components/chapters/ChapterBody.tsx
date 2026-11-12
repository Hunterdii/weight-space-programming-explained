"use client";

import type { Chapter } from "@/content/types";
import { LEVELS } from "@/content/levels";
import { useReading } from "@/state/store";
import LevelSections from "./LevelSections";
import { Sparkles, SlidersHorizontal } from "lucide-react";

export default function ChapterBody({ chapter }: { chapter: Chapter }) {
  const level = useReading((s) => s.level);
  const setLevel = useReading((s) => s.setLevel);
  const cur = LEVELS[level - 1];

  return (
    <div className="w-full">
      {/* Dynamic Audience Level Control Strip */}
      <div id="audience-level" className="w-full mb-10 rounded-2xl border border-border/80 bg-card/60 p-4 backdrop-blur-sm shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <SlidersHorizontal className="size-4 text-[var(--wsp-chrome)] shrink-0" />
            <div>
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block">
                Reading Audience Level
              </span>
              <span className="font-sans text-xs font-bold text-foreground">
                Rung {cur.n}: {cur.short} · {cur.name}
              </span>
            </div>
          </div>

          {/* Quick Rung Switcher */}
          <div className="flex items-center gap-1 rounded-xl border border-border/80 bg-background/80 p-1" role="group" aria-label="Switch level">
            {LEVELS.map((l) => (
              <button
                key={l.n}
                onClick={() => setLevel(l.n)}
                aria-pressed={level === l.n}
                title={`${l.short} · ${l.name}: ${l.blurb}`}
                className={`flex h-7 px-2.5 items-center justify-center rounded-lg font-mono text-xs font-bold transition-all ${level === l.n
                    ? "bg-[var(--wsp-chrome)] text-[#090c12] shadow-sm scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-card"
                  }`}
              >
                L{l.n}
              </button>
            ))}
          </div>
        </div>

        <p className="mt-2.5 font-serif text-xs leading-relaxed text-muted-foreground italic border-t border-border/60 pt-2.5">
          {cur.blurb} - Step up or down anytime with keyboard shortcuts <kbd className="kbd text-[10px]">bracket keys</kbd> or the buttons above.
        </p>
      </div>

      {/* Chapter Overview Synopsis */}
      <div className="mb-10 rounded-2xl border border-border/70 bg-card/30 p-5 font-serif text-base leading-relaxed text-foreground/90 shadow-xs">
        <p className="italic text-muted-foreground">{chapter.intro}</p>
      </div>

      {/* Level-Specific Blocks & Shared Interactive Modules */}
      <LevelSections levels={chapter.levels} shared={chapter.shared} />
    </div>
  );
}
