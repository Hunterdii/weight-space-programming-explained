"use client";

import { useState } from "react";
import Link from "next/link";
import ModuleChrome from "./ModuleChrome";
import { EXPERIMENTS } from "@/content/facts";
import { BadgeChip } from "@/components/content/Badge";
import { ChevronDown, ArrowRight, CheckCircle2 } from "lucide-react";

const EV_STYLE: Record<string, string> = {
  strong: "var(--wsp-green)",
  moderate: "var(--wsp-blue)",
  weak: "var(--wsp-amber)",
  "negative-control": "var(--wsp-red)",
};

const VERB_COLOR: Record<string, string> = {
  Read: "var(--wsp-blue)",
  Fix: "var(--wsp-chrome)",
  Write: "var(--wsp-green)",
};

const CHAPTER_LINK: Record<number, string> = {
  1: "/read/4-read",
  2: "/read/4-read",
  3: "/read/4-read",
  4: "/read/5-fix",
  5: "/read/6-write",
  6: "/read/6-write",
  7: "/read/4-read",
  8: "/read/5-fix",
};

export default function M7ExperimentGallery() {
  const [verb, setVerb] = useState<"All" | "Read" | "Fix" | "Write">("All");
  const [open, setOpen] = useState<number | null>(null);
  const shown = EXPERIMENTS.filter((e) => verb === "All" || e.verb === verb);

  return (
    <ModuleChrome
      id="m7-gallery"
      badge="paper"
      title="M7 · The Experiment Gallery"
      blurb="eight experiments: setup → result → evidence audit"
      caption={`${shown.length} experiment${shown.length === 1 ? "" : "s"} shown. Click any card to expand its experimental setup, measured delta, and independent review audit.`}
      levelCaptions={{
        1: "Eight distinct experiments. In each, the large model inspected a smaller machine's numbers-and either identified its task, repaired broken behaviors, or synthesized a working policy.",
        2: "Each card shows the target model, the editor's intervention, and the outcome. The colored evidence tags distinguish empirical measurements from anecdotal demos.",
        3: "Note the parameter scale progression: 17K → 1.5M parameters across five orders of magnitude. Reading grew increasingly challenging as spatial geometry diverged.",
        4: "Filter by verb: READ evaluates static weight representation mapping; FIX requires localized causal surgery; WRITE tackles direct synthesis compared against PPO baselines.",
        5: "The evidence classification follows Maier's independent review. Key critique criteria: what baseline would equal this? Decoding heuristics? Random ablations? Single-trial constraints.",
      }}
      note="🟦 Setups & results from CSAIL paper · 🟩 Evidence assessments from Maier's independent review (5 Nov 2026)."
      extra={
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-border/80 bg-background/80 p-1" role="group" aria-label="Filter by verb">
          {(["All", "Read", "Fix", "Write"] as const).map((v) => (
            <button
              key={v}
              onClick={() => setVerb(v)}
              aria-pressed={verb === v}
              className={`h-8 rounded-lg px-3.5 font-sans text-xs font-semibold transition-all ${verb === v
                  ? "bg-[var(--wsp-chrome)] text-[#090c12] shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-card"
                }`}
            >
              {v}
            </button>
          ))}
        </div>
      }
    >
      <div className="grid gap-4 lg:grid-cols-2">
        {shown.map((e) => {
          const isOpen = open === e.n;
          const verbColor = VERB_COLOR[e.verb];

          return (
            <article
              key={e.n}
              className="card-hover overflow-hidden rounded-2xl border border-border/80 bg-card transition-all"
            >
              <button
                onClick={() => setOpen(isOpen ? null : e.n)}
                aria-expanded={isOpen}
                className="w-full p-5 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="font-mono text-xs font-bold px-2 py-0.5 rounded-md border"
                      style={{
                        borderColor: `color-mix(in oklab, ${verbColor} 40%, transparent)`,
                        backgroundColor: `color-mix(in oklab, ${verbColor} 12%, transparent)`,
                        color: verbColor,
                      }}
                    >
                      Exp {e.n} · {e.verb}
                    </span>
                    <span className="font-mono text-[11px] text-muted-foreground">
                      Params: {e.params}
                    </span>
                  </div>

                  <h4 className="mt-3 font-sans text-base font-bold text-foreground leading-snug">
                    {e.task}
                  </h4>

                  <p className="mt-1.5 font-serif text-xs leading-relaxed text-muted-foreground">
                    {e.setup}
                  </p>

                  <p className="mt-2.5 font-serif text-sm font-semibold text-foreground/90 leading-snug">
                    {e.headline}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
                  <span
                    className="badge-frame"
                    style={{
                      borderStyle: "solid",
                      borderWidth: 1.5,
                      borderColor: EV_STYLE[e.evidence],
                      color: EV_STYLE[e.evidence],
                      backgroundColor: `color-mix(in oklab, ${EV_STYLE[e.evidence]} 10%, transparent)`,
                    }}
                  >
                    Evidence: {e.evidence.replace("-", " ")}
                  </span>

                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border/70 bg-accent/25 px-5 py-4 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center gap-2">
                    <BadgeChip b="review" />
                    <span className="font-mono text-[11px] text-muted-foreground font-semibold">Independent Review Verdict</span>
                  </div>
                  <p className="font-serif text-xs leading-relaxed text-muted-foreground">
                    {e.evidenceNote}
                  </p>
                  <ul className="list-disc space-y-1.5 pl-5 font-serif text-xs leading-relaxed text-foreground/90">
                    {e.details.map((d, i) => (
                      <li key={i}>{d}</li>
                    ))}
                  </ul>
                  <div className="pt-2 border-t border-border/50">
                    <Link
                      href={CHAPTER_LINK[e.n]}
                      prefetch={false}
                      className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold text-[var(--wsp-chrome)] hover:underline"
                    >
                      Read full walkthrough in Chapter {CHAPTER_LINK[e.n].match(/\/read\/(\d+)/)?.[1]} <ArrowRight className="size-3" />
                    </Link>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </ModuleChrome>
  );
}
