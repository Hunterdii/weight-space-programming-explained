import type { Metadata } from "next";
import Link from "next/link";
import { Download, Terminal, Play, ArrowRight, FileCode, CheckCircle2, FlaskConical } from "lucide-react";
import CodeBlock from "@/components/content/CodeBlock";
import { LABS, BENCH_SPEC } from "@/content/labs";
import { BadgeChip } from "@/components/content/Badge";
import DataTable from "@/components/content/DataTable";

export const metadata: Metadata = {
  title: "Runnable Labs - 4 Self-Contained Python Experiments",
  description: "Four runnable Python scripts reproducing the mechanistic principles of Weight-Space Programming, plus the WSP-Bench-Lite benchmark proposal.",
};

export default function LabPage() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-12 sm:px-6 lg:px-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md">
          <FlaskConical className="size-3.5 text-[var(--wsp-amber)]" />
          <span>RUNNABLE CODE WORKSHOP · 4 SELF-CONTAINED PYTHON EXPERIMENTS · ZERO DEPENDENCIES</span>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Execute the Mechanisms Yourself
        </h1>

        <p className="max-w-[85ch] font-serif text-lg leading-relaxed text-muted-foreground">
          Four standalone, lightweight Python scripts designed to take the paper’s mathematical assertions off the page and directly into your terminal. Each script runs in milliseconds with standard Python and NumPy, demonstrating rank-1 low-rank perturbation updates, policy compilation, and raw Atari weight fingerprinting.
        </p>

        {/* Quick run box */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-4 font-mono text-xs text-muted-foreground flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="size-4 text-[var(--wsp-chrome)] shrink-0" />
            <span>Terminal run: <code className="text-foreground bg-accent/60 px-2 py-0.5 rounded">python lab/01_compile_a_rule.py</code></span>
          </div>
          <span className="text-[11px] opacity-75">All labs run offline without GPU requirements</span>
        </div>
      </div>

      {/* 3 Runnable Labs */}
      <div className="space-y-12">
        {LABS.map((l, index) => (
          <section
            key={l.id}
            aria-labelledby={l.id}
            className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-5 shadow-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] size-7 rounded-lg border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_10%,transparent)] flex items-center justify-center">
                  0{index + 1}
                </span>
                <div>
                  <h2 id={l.id} className="font-sans text-lg font-bold text-foreground">
                    {l.title}
                  </h2>
                  <span className="font-mono text-xs text-muted-foreground">{l.file}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <BadgeChip b={l.badge} />
                <span className="font-mono text-xs text-muted-foreground bg-accent/50 px-2 py-1 rounded-md">
                  {l.runs}
                </span>
              </div>
            </div>

            <p className="font-serif text-sm leading-relaxed text-foreground/90">
              {l.blurb}
            </p>

            <CodeBlock
              source={l.code}
              caption={`${l.file} - complete self-contained implementation`}
            />

            <div className="flex items-center justify-between pt-2">
              <a
                href={`/labs/${l.file}`}
                download
                className="inline-flex h-10 items-center gap-2 rounded-xl border border-border/80 bg-card px-4 font-sans text-xs font-semibold text-foreground transition-all hover:bg-accent hover:border-foreground/30"
              >
                <Download className="size-3.5 text-[var(--wsp-chrome)]" /> Download {l.file}
              </a>

              <span className="font-mono text-[11px] text-muted-foreground hidden sm:inline">
                Pure Python 3 standard library
              </span>
            </div>
          </section>
        ))}
      </div>

      {/* WSP-Bench-Lite Section */}
      <section aria-labelledby="bench" className="rounded-3xl border border-border/80 bg-card/40 p-6 sm:p-8 space-y-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BadgeChip b="speculation" />
            <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Proposed Benchmark Protocol
            </span>
          </div>

          <h2 id="bench" className="font-sans text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            WSP-Bench-Lite: Community Benchmark Proposal
          </h2>

          <p className="font-serif text-base leading-relaxed text-muted-foreground max-w-[70ch]">
            {BENCH_SPEC.intro}
          </p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-card p-5">
          <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground mb-3">
            Core Evaluation Protocol
          </h3>
          <ol className="list-decimal space-y-2.5 pl-5 font-serif text-sm leading-relaxed text-foreground/90">
            {BENCH_SPEC.rules.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ol>
        </div>

        <div className="space-y-2">
          <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Target Task Specifications
          </h3>
          <DataTable id="wsp-bench" />
        </div>

        <div className="rounded-2xl border border-dashed border-[var(--wsp-amber)]/60 bg-[color-mix(in_oklab,var(--wsp-amber)_8%,transparent)] p-5 text-xs font-serif leading-relaxed text-foreground/90 space-y-2">
          <p>
            <strong>Author Disclosure &amp; Scope:</strong> WSP-Bench-Lite is an independent educational proposal authored by Het Patel (Hunterdii), not an official MIT CSAIL benchmark. It is designated as <span className="font-bold text-[var(--wsp-red)]">Speculation (🟥)</span> because empirical community evaluation runs remain open.
          </p>
          <p className="font-sans text-[11px] text-muted-foreground">
            Read the complete technical specification and design arguments in{" "}
            <Link href="/read/12-hets-lab" prefetch={false} className="font-semibold text-[var(--wsp-chrome)] underline">
              Chapter 12: Het’s Lab &amp; WSP-Bench-Lite
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}

