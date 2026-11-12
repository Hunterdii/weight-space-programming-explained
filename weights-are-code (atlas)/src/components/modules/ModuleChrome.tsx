"use client";

import { useEffect, type ReactNode } from "react";
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
import type { Badge } from "@/content/types";
import { BadgeChip } from "@/components/content/Badge";
import { LEVELS, type Level } from "@/content/levels";
import { useReading } from "@/state/store";

export function badgeTf(badge: string): string {
  return badge === "schematic" ? "tf-schematic" : badge === "speculation" ? "tf-speculation" : "";
}

export interface ModuleChromeProps {
  id: string;
  title: string;
  badge: Badge;
  blurb?: string;
  playing?: boolean;
  progress?: number;
  caption?: string;
  levelCaptions?: Partial<Record<Level, string>>;
  onPlayPause?: () => void;
  onStep?: (dir: number) => void;
  onReset?: () => void;
  transport?: boolean;
  extra?: ReactNode;
  children: ReactNode;
  note?: string;
}

function ProgressDial({ v }: { v: number }) {
  const r = 11;
  const c = 2 * Math.PI * r;
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden className="shrink-0">
      <circle cx="14" cy="14" r={r} fill="none" stroke="var(--border)" strokeWidth="3" />
      <circle
        cx="14"
        cy="14"
        r={r}
        fill="none"
        stroke="var(--wsp-chrome)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - Math.min(1, Math.max(0, v)))}
        transform="rotate(-90 14 14)"
      />
    </svg>
  );
}

export default function ModuleChrome({
  id,
  title,
  badge,
  blurb,
  playing,
  progress = 0,
  caption,
  levelCaptions,
  onPlayPause,
  onStep,
  onReset,
  transport = false,
  extra,
  children,
  note,
}: ModuleChromeProps) {
  const setActiveModule = useReading((s) => s.setActiveModule);
  const level = useReading((s) => s.level);

  useEffect(() => {
    const el = document.querySelector(`[data-module='${id}']`);
    if (!el) return;
    const onKey = (e: Event) => {
      const key = (e as CustomEvent<{ key: string }>).detail.key;
      if (key === " ") onPlayPause?.();
      else if (key === "ArrowRight") onStep?.(1);
      else if (key === "ArrowLeft") onStep?.(-1);
      else if (key === "r" || key === "R") onReset?.();
    };
    el.addEventListener("wsp-module-key", onKey);
    return () => el.removeEventListener("wsp-module-key", onKey);
  }, [id, onPlayPause, onStep, onReset]);

  const levelCaption = levelCaptions?.[level];

  return (
    <section
      data-module={id}
      aria-label={`Interactive module: ${title}`}
      className={`module my-10 ${badgeTf(badge)}`}
      onMouseEnter={() => setActiveModule(id)}
      onFocus={() => setActiveModule(id)}
    >
      <div className="module-bar flex flex-wrap items-center gap-2.5 px-4 py-3 sm:px-5">
        <BadgeChip b={badge} />
        <h3 className="font-sans text-sm font-bold tracking-tight">{title}</h3>
        {blurb && (
          <span className="hidden font-sans text-xs text-muted-foreground md:inline">- {blurb}</span>
        )}
        <span className="ml-auto flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{id}</span>
          {transport && <ProgressDial v={progress} />}
        </span>
      </div>
      <div className="module-stage px-4 py-5 sm:px-5">{children}</div>
      {(transport || extra) && (
        <div className="module-ctl flex flex-wrap items-center gap-2 px-4 py-3 sm:px-5">
          {transport && (
            <>
              <button
                onClick={onPlayPause}
                aria-label={playing ? "Pause" : "Play"}
                className="flex h-11 items-center gap-2 rounded-lg border bg-card px-4 font-sans text-sm font-semibold hover:bg-accent"
              >
                {playing ? <Pause className="size-4" /> : <Play className="size-4" />}
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => onStep?.(-1)}
                aria-label="Step back"
                className="flex size-11 items-center justify-center rounded-lg border bg-card hover:bg-accent"
              >
                <ChevronLeft className="size-4" />
              </button>
              <button
                onClick={() => onStep?.(1)}
                aria-label="Step forward"
                className="flex size-11 items-center justify-center rounded-lg border bg-card hover:bg-accent"
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                onClick={onReset}
                aria-label="Reset module"
                className="flex h-11 items-center gap-2 rounded-lg border bg-card px-4 font-sans text-sm hover:bg-accent"
              >
                <RotateCcw className="size-4" /> Reset
              </button>
              <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
                Space · ← → · R
              </span>
            </>
          )}
          {extra}
        </div>
      )}
      <div className="module-ctl px-4 py-3 sm:px-5">
        {caption && (
          <p className="live-caption" aria-live="polite">
            {caption}
          </p>
        )}
        {levelCaption && (
          <p className="mt-1 font-sans text-xs leading-relaxed text-muted-foreground/80">
            <span className="font-semibold text-[var(--wsp-chrome)]">
              {LEVELS[level - 1].short} view:
            </span>{" "}
            {levelCaption}
          </p>
        )}
        {note && <p className="mt-1.5 font-sans text-xs text-muted-foreground/70">{note}</p>}
      </div>
    </section>
  );
}
