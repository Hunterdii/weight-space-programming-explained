import Link from "next/link";
import type { Metadata } from "next";
import { CHAPTERS, PARTS } from "@/content/chapters";
import { LEVELS } from "@/content/levels";
import { ArrowRight, BookOpen, Clock, Layers, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "The Guide - 13 Chapters Across 5 Audience Rungs",
  description: "From 'what is a neural network weight?' to auditing CSAIL's rank-1 weight surgeries and proposing the next benchmark.",
};

const PART_COLORS: Record<number, string> = {
  1: "var(--wsp-chrome)",
  2: "var(--wsp-blue)",
  3: "var(--wsp-green)",
  4: "var(--wsp-red)",
};

export default function ReadIndex() {
  const totalMinutes = CHAPTERS.reduce((acc, c) => acc + c.minutes, 0);

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-12 sm:px-6 lg:px-10 space-y-12">
      {/* Header / Orientation */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md">
            <BookOpen className="size-3.5 text-[var(--wsp-chrome)]" />
            <span>CURRICULUM · 13 CHAPTERS · 5 AUDIENCE LEVELS · ~{totalMinutes} MIN TOTAL READ</span>
          </div>
          <div className="hidden sm:inline-flex items-center gap-2 font-mono text-[11px] text-muted-foreground bg-accent/40 px-3 py-1 rounded-full border border-border/60">
            <span>Jump: <kbd className="kbd">1</kbd>–<kbd className="kbd">9</kbd></span>
            <span className="opacity-40">·</span>
            <span>Truth: <kbd className="kbd">T</kbd></span>
            <span className="opacity-40">·</span>
            <span>Shortcuts: <kbd className="kbd">?</kbd></span>
          </div>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl lg:leading-tight">
          The Field Guide Curriculum
        </h1>

        <p className="max-w-[85ch] font-serif text-lg leading-relaxed text-muted-foreground">
          From first principles to the empirical research frontier. Each chapter is authored across five parallel audience rungs-switch at any time using the header controls or keyboard shortcuts.
        </p>

        {/* 5 Rungs Explainer Strip */}
        <div className="mt-8 rounded-2xl border border-border/80 bg-card/60 p-5 shadow-sm">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
            Audience Rigor Ladder:
          </p>
          <div className="grid gap-3 sm:grid-cols-5">
            {LEVELS.map((l) => (
              <div
                key={l.n}
                className="rounded-xl border border-border/70 bg-card/80 p-4 flex flex-col justify-between hover:border-[var(--wsp-chrome)]/50 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)]">
                      Level {l.n}
                    </span>
                    <span className="font-sans text-xs font-semibold text-foreground">
                      {l.short}
                    </span>
                  </div>
                  <p className="mt-1.5 font-serif text-xs text-foreground/80 leading-snug">
                    {l.name}
                  </p>
                </div>
                <span className="mt-3 text-[11px] text-muted-foreground font-mono opacity-80 border-t border-border/50 pt-2">
                  {l.blurb}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Prologue Feature Card */}
      <section aria-labelledby="prologue-banner" className="rounded-3xl border border-[var(--wsp-chrome)]/50 bg-[color-mix(in_oklab,var(--wsp-chrome)_8%,transparent)] p-6 sm:p-8 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] uppercase tracking-wider">
                Prologue · Part 00
              </span>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-[var(--wsp-chrome)]/40 bg-card text-foreground">
                P1 – P4
              </span>
            </div>
            <h2 id="prologue-banner" className="font-sans text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              The Story So Far
            </h2>
            <p className="font-serif text-sm leading-relaxed text-muted-foreground max-w-[75ch]">
              Where the idea originated, Experiment 1 in slow motion with real recomputed Atari weight fingerprints, the eight-step experiment ladder, and what the community discovered in week one.
            </p>
          </div>

          <Link
            href="/prologue"
            prefetch={false}
            className="inline-flex h-11 items-center gap-2.5 rounded-xl bg-foreground text-background px-6 font-sans text-xs font-bold transition-all hover:opacity-90 shrink-0 shadow-2xs"
          >
            <span>Read Prologue</span>
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-border/50 font-mono text-[11px] text-muted-foreground">
          <div><strong className="text-foreground">P1:</strong> Origins &amp; Lineage</div>
          <div><strong className="text-foreground">P2:</strong> Exp 1 Fingerprints</div>
          <div><strong className="text-foreground">P3:</strong> 8-Step Ladder</div>
          <div><strong className="text-foreground">P4:</strong> Week-One Reactions</div>
        </div>
      </section>

      {/* Chapters by Part */}
      <div className="space-y-16">
        {PARTS.map((p) => {
          const partChapters = CHAPTERS.filter((c) => c.part === p.n);
          const partMinutes = partChapters.reduce((acc, c) => acc + c.minutes, 0);

          return (
            <section key={p.n} aria-labelledby={`part-${p.n}`} className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-border/80 pb-3">
                <div className="flex items-center gap-3">
                  <span
                    className="size-3.5 rounded-full"
                    style={{ background: PART_COLORS[p.n] }}
                    aria-hidden="true"
                  />
                  <h2 id={`part-${p.n}`} className="font-sans text-2xl font-black tracking-tight text-foreground">
                    Part {p.n}: {p.title}
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {partChapters.length} Chapters · ~{partMinutes} min read
                </span>
              </div>

              <p className="font-serif text-base leading-relaxed text-muted-foreground max-w-[85ch]">
                {p.blurb}
              </p>

              <div className="grid gap-4 md:grid-cols-2">
                {partChapters.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/read/${c.slug}`}
                    prefetch={false}
                    className="card-3d group flex flex-col justify-between gap-4 rounded-2xl border border-border/80 bg-card p-6 shadow-sm hover:border-[var(--wsp-chrome)]/60"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className="font-mono text-xl font-black pt-0.5 w-8 shrink-0"
                        style={{ color: PART_COLORS[p.n] }}
                      >
                        {String(c.number).padStart(2, "0")}
                      </span>
                      <div>
                        <h3 className="font-sans text-lg font-bold text-foreground group-hover:text-[var(--wsp-chrome)] transition-colors">
                          {c.title}
                        </h3>
                        <p className="mt-1.5 font-serif text-sm text-muted-foreground leading-relaxed">
                          {c.kicker}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-border/40 pt-3 text-xs text-muted-foreground">
                      <span className="font-mono flex items-center gap-1.5">
                        <Clock className="size-3" />
                        {c.minutes} min
                      </span>
                      <span className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-[var(--wsp-chrome)] group-hover:translate-x-1 transition-transform">
                        Read Chapter <ArrowRight className="size-3.5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
