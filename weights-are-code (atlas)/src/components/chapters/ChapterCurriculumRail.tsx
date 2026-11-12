"use client";

import { useState } from "react";
import Link from "next/link";
import { PARTS, CHAPTERS } from "@/content/chapters";
import { BookOpen, ChevronDown, ChevronRight, Clock, Compass, CheckCircle2 } from "lucide-react";

const PART_COLORS: Record<number, string> = {
  1: "var(--wsp-chrome)",
  2: "var(--wsp-blue)",
  3: "var(--wsp-green)",
  4: "var(--wsp-red)",
};

interface ChapterCurriculumRailProps {
  currentSlug: string;
  currentPart: number;
  currentChapterNumber: number;
}

export default function ChapterCurriculumRail({
  currentSlug,
  currentPart,
  currentChapterNumber,
}: ChapterCurriculumRailProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const totalChapters = CHAPTERS.length;
  const progressPercent = Math.round((currentChapterNumber / totalChapters) * 100);

  // Group chapters by part
  const partsWithChapters = PARTS.map((part) => ({
    ...part,
    chapters: CHAPTERS.filter((c) => c.part === part.n),
  }));

  const navContent = (
    <div className="space-y-6">
      {/* Header & Overall Telemetry */}
      <div className="border-b border-border/70 pb-4">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          <Compass className="size-3.5 text-[var(--wsp-chrome)]" />
          <span>Curriculum Rail</span>
        </div>
        <div className="mt-2 flex items-baseline justify-between">
          <span className="font-serif text-sm font-bold text-foreground">
            13-Chapter Sequence
          </span>
          <span className="font-mono text-xs text-muted-foreground">
            {currentChapterNumber}/{totalChapters} ({progressPercent}%)
          </span>
        </div>
        {/* Progress track */}
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-border/40">
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progressPercent}%`,
              backgroundColor: PART_COLORS[currentPart] || "var(--wsp-chrome)",
            }}
          />
        </div>
      </div>

      {/* Parts & Chapters list */}
      <nav aria-label="Curriculum Navigation" className="space-y-5">
        {partsWithChapters.map((part) => {
          const isPartActive = part.n === currentPart;
          const partColor = PART_COLORS[part.n];

          return (
            <div key={part.n} className="space-y-2">
              {/* Part Heading */}
              <div className="flex items-center gap-1.5 px-2">
                <span
                  className="size-1.5 rounded-full"
                  style={{ backgroundColor: partColor }}
                />
                <span
                  className="font-mono text-[11px] font-bold uppercase tracking-wider"
                  style={{ color: partColor }}
                >
                  Part {part.n}
                </span>
                <span className="text-[11px] text-muted-foreground truncate">
                  · {part.title.replace(/^Part [IVX]+ · /, "")}
                </span>
              </div>

              {/* Chapters in this part */}
              <ul className="space-y-1">
                {part.chapters.map((ch) => {
                  const isActive = ch.slug === currentSlug;
                  const isPast = ch.number < currentChapterNumber;

                  return (
                    <li key={ch.slug}>
                      <Link
                        href={`/read/${ch.slug}`}
                        prefetch={false}
                        onClick={() => setIsMobileOpen(false)}
                        className={`group relative flex items-start gap-2.5 rounded-xl px-2.5 py-2 text-xs transition-all ${
                          isActive
                            ? "bg-card font-semibold text-foreground border border-border/80 shadow-xs"
                            : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                        }`}
                        aria-current={isActive ? "page" : undefined}
                      >
                        {/* Status Icon / Number */}
                        <span
                          className={`mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full font-mono text-[10px] ${
                            isActive
                              ? "bg-foreground text-background font-bold"
                              : isPast
                              ? "bg-border/60 text-muted-foreground"
                              : "border border-border/60 text-muted-foreground"
                          }`}
                        >
                          {isPast ? (
                            <CheckCircle2 className="size-3 text-[var(--wsp-green)]" />
                          ) : (
                            ch.number
                          )}
                        </span>

                        {/* Title & Reading Time */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`truncate leading-snug ${
                              isActive ? "text-foreground" : "group-hover:text-foreground"
                            }`}
                          >
                            {ch.title}
                          </p>
                          <span className="mt-0.5 flex items-center gap-1 font-mono text-[10px] text-muted-foreground/75">
                            <Clock className="size-2.5" />
                            {ch.minutes} min
                          </span>
                        </div>

                        {/* Active Indicator Arrow */}
                        {isActive && (
                          <span
                            className="mt-1 size-1.5 shrink-0 rounded-full animate-pulse"
                            style={{ backgroundColor: partColor }}
                          />
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* Footer Navigation Link */}
      <div className="border-t border-border/70 pt-4 px-2">
        <Link
          href="/read"
          prefetch={false}
          className="flex items-center justify-between text-xs font-mono text-muted-foreground hover:text-foreground transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <BookOpen className="size-3" />
            Curriculum Index
          </span>
          <ChevronRight className="size-3" />
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Rail */}
      <aside
        aria-label="Chapter Curriculum Rail"
        className="w-64 shrink-0 hidden xl:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 pb-8 scrollbar-thin"
      >
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm shadow-xs">
          {navContent}
        </div>
      </aside>

      {/* Mobile / Tablet Collapsible Pill Drawer */}
      <div className="xl:hidden w-full mb-6 order-1 xl:order-none">
        <div className="rounded-2xl border border-border/80 bg-card/70 p-3 shadow-xs">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex w-full items-center justify-between text-xs font-mono font-bold text-foreground"
            aria-expanded={isMobileOpen}
          >
            <div className="flex items-center gap-2 min-w-0">
              <Compass className="size-3.5 text-[var(--wsp-chrome)] shrink-0" />
              <span className="truncate">Guide Curriculum</span>
              <span className="rounded-md bg-border/40 px-1.5 py-0.5 text-[10px] text-muted-foreground shrink-0">
                Ch {currentChapterNumber}/13 ({progressPercent}%)
              </span>
            </div>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform duration-200 ${
                isMobileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMobileOpen && (
            <div className="mt-4 border-t border-border/70 pt-4">
              {navContent}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
