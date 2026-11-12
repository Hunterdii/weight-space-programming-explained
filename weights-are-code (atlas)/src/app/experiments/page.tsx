import type { Metadata } from "next";
import Link from "next/link";
import M7ExperimentGallery from "@/components/modules/M7ExperimentGallery";
import M6BudgetDial from "@/components/modules/M6BudgetDial";
import M8CopyingHeadGrid from "@/components/modules/M8CopyingHeadGrid";
import M11BlastRadius from "@/components/modules/M11BlastRadius";
import M14Scoreboard from "@/components/modules/M14Scoreboard";
import { BadgeLegend } from "@/components/content/Badge";
import { RECENT_FINDINGS } from "@/content/facts";
import {
  Layers,
  ShieldCheck,
  Scale,
  Cpu,
  Sliders,
  Grid3X3,
  Target,
  ArrowRight,
  Sparkles,
  GitCompare,
  TrendingUp,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Experiments & Evidence Room - 8 Empirical Tests",
  description: "All eight experiments from the Weight-Space Programming findings: task setups, measured results, parameter counts, and independent evidence audits.",
};

export default function ExperimentsPage() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-12 sm:px-6 lg:px-10 space-y-12">
      {/* Header & Orientation */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md">
          <Layers className="size-3.5 text-[var(--wsp-blue)]" />
          <span>EVIDENCE AUDIT · 8 EMPIRICAL EXPERIMENTS · VERIFIED PROVENANCE</span>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          The Experiments &amp; Evidence Room
        </h1>

        <p className="max-w-[85ch] font-serif text-lg leading-relaxed text-muted-foreground">
          Eight canonical experiments deconstructed across three fundamental modalities: <strong className="text-foreground">reading</strong> representations, <strong className="text-foreground">fixing</strong> broken weights, and <strong className="text-foreground">writing</strong> working models from scratch. Every experiment compares original paper-reported metrics against independent third-party replication audits.
        </p>

        {/* Quick jump instrument subnav */}
        <div className="mt-8 flex flex-wrap gap-2 pt-2 border-t border-border/70">
          {[
            { href: "#m7-gallery", label: "M7 · Experiment Gallery", icon: Layers },
            { href: "#m6-budget", label: "M6 · Surgery Budget Dial", icon: Sliders },
            { href: "#m8-copying", label: "M8 · Copying Head Grid", icon: Grid3X3 },
            { href: "#m11-blast", label: "M11 · Blast Radius Meter", icon: Target },
            { href: "#m14-scoreboard", label: "M14 · Evidence Scoreboard", icon: Scale },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/70 px-3 py-2 font-sans text-xs font-semibold text-muted-foreground transition-all hover:bg-accent hover:text-foreground hover:border-foreground/30"
              >
                <Icon className="size-3.5 text-[var(--wsp-chrome)]" />
                {item.label}
              </a>
            );
          })}
        </div>
      </div>

      {/* Truth Contract Legend Callout */}
      <div className="rounded-2xl border border-border/80 bg-card/50 p-6 backdrop-blur-sm">
        <div className="grid gap-6 md:grid-cols-12 items-center">
          <div className="md:col-span-4 space-y-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-4 text-[var(--wsp-green)]" />
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">
                Evidence Honesty Key
              </h3>
            </div>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              We separate empirical claims stated in the original CSAIL post from independent review ratings. Schematics and speculation are distinctly badged.
            </p>
          </div>
          <div className="md:col-span-8">
            <BadgeLegend />
          </div>
        </div>
      </div>

      {/* Interactive Tool Suite */}
      <div className="space-y-16">
        <section id="m7-gallery">
          <M7ExperimentGallery />
        </section>

        <section id="m6-budget">
          <M6BudgetDial />
        </section>

        <section id="m8-copying">
          <M8CopyingHeadGrid />
        </section>

        <section id="m11-blast">
          <M11BlastRadius />
        </section>

        {/* Recent Research Frontiers & Empirical Replications */}
        <section id="recent-replications" className="rounded-2xl border border-border/80 bg-card/60 p-6 sm:p-8 backdrop-blur-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-[var(--wsp-chrome)]" />
                <span className="font-mono text-xs uppercase font-bold tracking-wider text-[var(--wsp-chrome)]">
                  Research Frontiers (November 2026 Updates)
                </span>
              </div>
              <h2 className="font-serif text-2xl font-black text-foreground">
                Independent Replications &amp; Mechanistic Insights
              </h2>
            </div>
            <span className="font-mono text-xs text-muted-foreground bg-card px-3 py-1 rounded-full border border-border/60">
              Community Cross-Verification
            </span>
          </div>

          {/* 4 Finding Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RECENT_FINDINGS.map((f, i) => (
              <div
                key={i}
                className="flex flex-col justify-between rounded-xl border border-border/70 bg-card/80 p-4 transition-all hover:border-[var(--wsp-chrome)]/60 hover:shadow-xs"
              >
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--wsp-chrome)] block mb-1">
                    Finding {i + 1}
                  </span>
                  <h3 className="font-sans text-sm font-bold text-foreground mb-2">
                    {f.topic}
                  </h3>
                  <p className="font-serif text-xs leading-relaxed text-muted-foreground mb-3">
                    {f.detail}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-border/50 space-y-1 font-mono text-[11px]">
                  <span className="text-[var(--wsp-green)] font-semibold block">{f.metric}</span>
                  <span className="text-[10px] text-muted-foreground block font-serif italic">{f.significance}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Comparative Paradigm Matrix */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-2">
              <GitCompare className="size-4 text-[var(--wsp-blue)]" />
              <h3 className="font-sans text-sm font-bold uppercase tracking-wider text-foreground">
                The Four Control Paradigms Compared
              </h3>
            </div>
            <div className="overflow-x-auto rounded-xl border border-border/70">
              <table className="w-full text-left font-serif text-xs">
                <thead className="bg-muted/60 font-sans text-[11px] font-bold uppercase tracking-wider text-muted-foreground border-b border-border/70">
                  <tr>
                    <th className="p-3">Paradigm</th>
                    <th className="p-3">Optimization Method</th>
                    <th className="p-3">Data / Forward Budget</th>
                    <th className="p-3">Weight Permanence</th>
                    <th className="p-3">Inference Overhead</th>
                    <th className="p-3">Primary Failure Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  <tr className="bg-card/40">
                    <td className="p-3 font-sans font-bold text-[var(--wsp-chrome)]">Weight-Space Programming (WSP)</td>
                    <td className="p-3">Symbolic deduction over raw tensors</td>
                    <td className="p-3">0 data · 0–50 forward passes</td>
                    <td className="p-3 text-[var(--wsp-green)] font-semibold">Permanent (static delta)</td>
                    <td className="p-3 text-[var(--wsp-green)] font-semibold">0% (identical architecture)</td>
                    <td className="p-3 text-muted-foreground">Context capacity &amp; representation undecidability</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-bold text-foreground">Gradient Descent / SFT</td>
                    <td className="p-3">Backpropagation &amp; SGD/Adam</td>
                    <td className="p-3">Thousands to millions of examples</td>
                    <td className="p-3 text-[var(--wsp-green)] font-semibold">Permanent</td>
                    <td className="p-3 text-[var(--wsp-green)] font-semibold">0%</td>
                    <td className="p-3 text-muted-foreground">Catastrophic forgetting &amp; compute cost</td>
                  </tr>
                  <tr className="bg-card/40">
                    <td className="p-3 font-sans font-bold text-foreground">Activation Steering / RepEng</td>
                    <td className="p-3">Dynamic activation addition during forward pass</td>
                    <td className="p-3">Contrastive pair extraction set</td>
                    <td className="p-3 text-amber-500 font-semibold">Transient (runtime injection)</td>
                    <td className="p-3 text-amber-500 font-semibold">+VRAM &amp; hook latency</td>
                    <td className="p-3 text-muted-foreground">Inference drift &amp; hook fragility</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-sans font-bold text-foreground">Model Editing (ROME / MEMIT)</td>
                    <td className="p-3">Closed-form least-squares key-value insertion</td>
                    <td className="p-3">Explicit factual triples (s, r, o)</td>
                    <td className="p-3 text-[var(--wsp-green)] font-semibold">Permanent (rank-1 delta)</td>
                    <td className="p-3 text-[var(--wsp-green)] font-semibold">0%</td>
                    <td className="p-3 text-muted-foreground">Locality leakage &amp; inability to edit reasoning</td>
                  </tr>
                  <tr className="bg-card/40">
                    <td className="p-3 font-sans font-bold text-foreground">Compilation (Tracr / RASP)</td>
                    <td className="p-3">Deterministic compiler mapping DSL to weights</td>
                    <td className="p-3">Formal algorithm specification</td>
                    <td className="p-3 text-[var(--wsp-green)] font-semibold">Permanent</td>
                    <td className="p-3 text-[var(--wsp-green)] font-semibold">0%</td>
                    <td className="p-3 text-muted-foreground">Narrow DSL expressivity; cannot edit pre-trained nets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section id="m14-scoreboard">
          <M14Scoreboard />
        </section>
      </div>
    </div>
  );
}
