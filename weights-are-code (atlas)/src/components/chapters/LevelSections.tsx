"use client";

import { useState } from "react";
import { ChevronDown, ArrowUpRight, HelpCircle } from "lucide-react";
import type { Block } from "@/content/types";
import { LEVELS, type Level } from "@/content/levels";
import { useReading } from "@/state/store";
import BlockList from "@/components/content/BlockList";

/**
 * Audience ladder: The chosen level renders in full typography;
 * lower rungs fold into an interactive "Need a refresher?" accordion;
 * higher rungs tease deeper mathematical / frontier analysis.
 */
export default function LevelSections({
  levels,
  shared,
}: {
  levels: Record<Level, Block[]>;
  shared: Block[];
}) {
  const level = useReading((s) => s.level);
  const setLevel = useReading((s) => s.setLevel);
  const [refreshersOpen, setRefreshersOpen] = useState<Set<number>>(new Set());

  const toggleRefresher = (n: number) =>
    setRefreshersOpen((s) => {
      const next = new Set(s);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });

  const below: { n: Level; blocks: Block[] }[] = [];
  for (let n = 1; n < level; n++) {
    if (levels[n as Level]?.length) below.push({ n: n as Level, blocks: levels[n as Level] });
  }

  const nextLevel = (level + 1) as Level;
  const hasHigher = level < 5 && (levels[nextLevel]?.length ?? 0) > 0;

  return (
    <div className="space-y-10 w-full">
      {/* Higher-rung elevation prompt */}
      {hasHigher && (
        <div className="w-full">
          <button
            onClick={() => setLevel(nextLevel)}
            className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-dashed border-[var(--wsp-chrome)]/60 bg-[color-mix(in_oklab,var(--wsp-chrome)_8%,transparent)] p-4 text-left transition-all hover:bg-[color-mix(in_oklab,var(--wsp-chrome)_15%,transparent)] hover:border-[var(--wsp-chrome)]"
          >
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--wsp-chrome)] block">
                Ascend to Next Rung →
              </span>
              <span className="font-serif text-sm font-semibold text-foreground">
                Ready for deeper rigor? Climb to Level {nextLevel}: {LEVELS[nextLevel - 1].short} · {LEVELS[nextLevel - 1].name}
              </span>
              <span className="block font-serif text-xs text-muted-foreground mt-0.5">
                {LEVELS[nextLevel - 1].blurb}
              </span>
            </div>
            <ArrowUpRight className="size-5 shrink-0 text-[var(--wsp-chrome)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      )}

      {/* The Active Content Layer */}
      <section aria-label={`${LEVELS[level - 1].short} - ${LEVELS[level - 1].name}`} className="level-current w-full">
        {level === 5 ? (
          <div className="space-y-8 w-full">
            {shared.length > 0 && <BlockList blocks={shared} />}
            <div className="frontier-synthesis-card w-full rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 shadow-sm">
              <div className="mb-4 flex items-center gap-2.5 border-b border-border/60 pb-3">
                <span className="size-2 rounded-full bg-[var(--wsp-chrome)]" />
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Frontier Synthesis &amp; Strategic Review
                </h3>
              </div>
              <BlockList blocks={levels[5]} isFrontierSynthesis={true} />
            </div>
          </div>
        ) : (
          <BlockList blocks={[...shared, ...levels[level]]} />
        )}
      </section>

      {/* Lower Rungs Collapsed into Refresher Drawers */}
      <div
        id="foundational-refreshers"
        className={below.length > 0 ? "w-full border-t border-border/80 pt-8 space-y-3" : "hidden"}
      >
        {below.length > 0 && (
          <>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Foundational Refreshers ({below.length})
            </p>
            {below
              .slice()
              .reverse()
              .map(({ n, blocks }) => {
                const open = refreshersOpen.has(n);
                const info = LEVELS[n - 1];
                return (
                  <div
                    key={n}
                    className="rounded-2xl border border-border/70 bg-card/50 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => toggleRefresher(n)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between px-5 py-3.5 font-sans text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <ChevronDown
                          className={`size-4 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                        />
                        <span>
                          Need simpler foundations? Rung {n}: {info.short} ({info.name})
                        </span>
                      </div>
                      <span className="font-mono text-xs opacity-70 hidden sm:inline">
                        {info.blurb}
                      </span>
                    </button>
                    {open && (
                      <div className="border-t border-border/60 bg-background/50 px-5 py-4">
                        <BlockList blocks={blocks} idPrefix={`refresher-${n}-`} />
                      </div>
                    )}
                  </div>
                );
              })}
          </>
        )}
      </div>
    </div>
  );
}
