"use client";

import { useState, useEffect } from "react";
import Link from "@/components/ui/Link";
import { BadgeChip } from "@/components/content/Badge";
import type { Badge } from "@/content/types";
import {
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Radio,
  Clock,
  ArrowRight,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Terminal,
  FileCode2,
  ExternalLink,
  Cpu,
  Layers,
  FlaskConical,
  Scale,
} from "lucide-react";

interface TimelineMilestone {
  id: string;
  stage: string;
  date: string;
  title: string;
  subtitle: string;
  author: string;
  affiliation: string;
  badge: Badge;
  category: "launch" | "replication" | "surgery" | "review" | "standard";
  question: string;
  protocol: string[];
  metrics: {
    label: string;
    before?: string;
    after: string;
    delta?: string;
    note: string;
  }[];
  critique: string;
  labScript?: string;
  artifactLink?: {
    label: string;
    href: string;
  };
}

const MILESTONES: TimelineMilestone[] = [
  {
    id: "m1-discovery",
    stage: "Stage 01",
    date: "2 Nov 2026",
    title: "Static Weight Extraction & Induction-Circuit Discovery",
    subtitle: "Proving LLMs read raw neural network coordinates without forward inference",
    author: "Rikiya Takehi, Jayden Teoh, Alex Zhang, Omar Khattab",
    affiliation: "MIT CSAIL",
    badge: "paper",
    category: "launch",
    question: "Can an LLM inspect weights as purely symbolic matrices and deduce functional behavior?",
    protocol: [
      "Presented first-layer weights of 4 PPO policies as a 10×10 coordinate grid; forward passes banned.",
      "Provided middle transformer blocks only (embedding and output heads excised to block token-frequency leakage).",
      "Model computed induction-head Frobenius norm products W_QK^(2) W_OV^(1) without executing inference passes.",
    ],
    metrics: [
      {
        label: "Atari Policy Identification",
        after: "4 / 4 Games (100%)",
        note: "Breakout identified with 99% stated confidence",
      },
      {
        label: "Copying Head Identification",
        after: "Exact Match (3/3 Languages)",
        note: "Python 2.1, 3.1, 3.5 · Romaji 3.3 · English 3.1 identified directly",
      },
      {
        label: "Language ID Confidence",
        after: "0.48 – 0.62",
        note: "Marginal confidence above 0.33 baseline (honest reporting)",
      },
    ],
    critique:
      "Reading succeeds where circuit geometry is strictly compositional (induction chains). Fails or wobbles where skills are diffusely distributed across layers.",
    labScript: "python lab/01_weight_diff_inspector.py",
    artifactLink: {
      label: "Read Chapter 4 Breakdown",
      href: "/read/4-read",
    },
  },
  {
    id: "m2-replication",
    stage: "Stage 02",
    date: "3 Nov 2026",
    title: "Independent Laptop-Class Replication Signal",
    subtitle: "Validating weight inspection on local, consumer-grade open-weights",
    author: "Simon Willison",
    affiliation: "Independent Systems Researcher",
    badge: "review",
    category: "replication",
    question: "Is weight-space reading exclusive to closed, proprietary frontier models?",
    protocol: [
      "Executed local inference of Qwen 3.8 27B quantized locally on an Apple Silicon laptop.",
      "Provided stripped coordinate tensors of small MLP blocks under identical zero-inference constraints.",
      "Tested whether structural pattern recognition emerges in sub-30B parameter architectures.",
    ],
    metrics: [
      {
        label: "Local Hardware Footprint",
        after: "MacBook Laptop (M-Series)",
        note: "No cloud API dependencies or distributed clusters required",
      },
      {
        label: "Weight Inversion Signal",
        after: "Reproduced (Anecdotal)",
        note: "Demonstrated parameter geometry is readable by open models",
      },
    ],
    critique:
      "Important qualitative proof that weight-space reading is not a vendor artifact. However, remains an uncalibrated single-seed trial without statistical baselines.",
    artifactLink: {
      label: "Simon Willison Field Notes",
      href: "https://simonwillison.net",
    },
  },
  {
    id: "m3-surgery",
    stage: "Stage 03",
    date: "4 Nov 2026",
    title: "The 0.016% Surgical Direction Removal (Exp 8)",
    subtitle: "Zero-gradient repair of runaway reasoning loops in Qwen3.5-0.8B",
    author: "Takehi et al.",
    affiliation: "MIT CSAIL",
    badge: "paper",
    category: "surgery",
    question: "Can an LLM diagnose and physically excise a pathological thought loop from weights?",
    protocol: [
      "Identified looping vector u in residual stream re-injected by MLPs of layers 15 and 19.",
      "Computed projection operator: W' = (I - u u^T)W on 64 output columns per layer.",
      "Modified exactly 131,072 parameters out of 800,000,000 (0.016% total blast radius).",
      "Executed negative control edit: perturbed identical parameter count in random direction.",
    ],
    metrics: [
      {
        label: "MATH-500 Accuracy",
        before: "7.9%",
        after: "48.1%",
        delta: "+40.2%",
        note: "At 50 symbolic iteration passes",
      },
      {
        label: "GSM8K Arithmetic",
        before: "13.8%",
        after: "67.1%",
        delta: "+53.3%",
        note: "Substantial benchmark restoration",
      },
      {
        label: "Token-Limit Exceeded Hits",
        before: "93.0%",
        after: "33.1%",
        delta: "-59.9%",
        note: "Direct mechanical proof that loop was broken",
      },
    ],
    critique:
      "The strongest result in the literature. Crucially, the negative control on Gemma 3 yielded 0% improvement, proving the surgery removed a real obstacle rather than injecting magical ability.",
    labScript: "python lab/02_direction_surgery.py",
    artifactLink: {
      label: "View Chapter 5 Surgery Protocol",
      href: "/read/5-fix",
    },
  },
  {
    id: "m4-audit",
    stage: "Stage 04",
    date: "5 Nov 2026",
    title: "Academic Evidence De-biasing & Scoreboard Audit",
    subtitle: "Rigorous separation of solid empirical evidence from narrative extrapolation",
    author: "Andreas Maier",
    affiliation: "University of Erlangen-Nuremberg",
    badge: "review",
    category: "review",
    question: "Which of the paper's eight claims withstand strict scientific scrutiny?",
    protocol: [
      "Catalogued all 8 experiments into three empirical tiers: Strong, Moderate, and Weak.",
      "Identified that budget curves were plotted from single runs (n=1) with non-monotonic dips.",
      "Flagged that sycophancy detection (Exp 7) failed on weights alone and only passed after relaxing rules.",
      "Established verified ground-truth scoreboard for the research community.",
    ],
    metrics: [
      {
        label: "Solid Evidence Tiers",
        after: "3 of 8 Experiments",
        note: "Exp 3 copying heads, Exp 8 Qwen surgery, Exp 5 paddle compilation",
      },
      {
        label: "Methodology Gaps Tagged",
        after: "3 Critical Deficits",
        note: "Lack of human baseline, missing multi-seed budgets, relaxed protocol in Exp 7",
      },
    ],
    critique:
      "Crucial guard against AI hype. Directs field researchers away from overclaiming and toward reproducible benchmarks with statistical power.",
    artifactLink: {
      label: "View 44 Verified References",
      href: "/references",
    },
  },
  {
    id: "m5-bench",
    stage: "Stage 05",
    date: "Ongoing 2026",
    title: "The WSP-Bench-Lite Standard & Living Open Ledger",
    subtitle: "Establishing peer-registered protocols for weight-space engineering",
    author: "Independent Open Science Working Group",
    affiliation: "Community Audit Initiative",
    badge: "schematic",
    category: "standard",
    question: "How do we transform weight editing from artisanal demonstrations into engineering?",
    protocol: [
      "Preregistered task suites on held-out architectures unknown to the authoring team.",
      "Mandatory requirement: >= 5 random seeds per curve point to separate signal from variance.",
      "Bounding functional drift (D) across non-target capabilities via automated behavioral sweeps.",
      "Releasing open verification checkpoints on Hugging Face with verifiable git-commit hashes.",
    ],
    metrics: [
      {
        label: "Seed Requirement",
        after: "n >= 5 Seeds",
        note: "Eliminates cherry-picked single-run trajectory artifacts",
      },
      {
        label: "Functional Containment",
        after: "Drift D < 0.05",
        note: "Guarantees surgical edits do not erode unrelated knowledge",
      },
    ],
    critique:
      "The definitive path forward. Until held-out multi-seed evaluations land, every WSP result must be treated with appropriate scientific humility.",
    labScript: "python lab/03_synthetic_rule_compiler.py",
    artifactLink: {
      label: "Inspect Open Verification Ledger",
      href: "/about",
    },
  },
];

export default function WallChart() {
  const [activeIdx, setActiveIdx] = useState(2); // Default to Exp 8 Surgery (Stage 03)
  const [isPlaying, setIsPlaying] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const current = MILESTONES[activeIdx];

  // Auto-play walkthrough timer
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % MILESTONES.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePrev = () => {
    setActiveIdx((prev) => (prev > 0 ? prev - 1 : MILESTONES.length - 1));
  };

  const handleNext = () => {
    setActiveIdx((prev) => (prev + 1) % MILESTONES.length);
  };

  return (
    <div className="w-full space-y-8">
      {/* HUD Telemetry Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_14%,transparent)] text-[var(--wsp-chrome)] shadow-xs">
            <Cpu className="size-4" />
          </div>
          <div>
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Research Progression &amp; Methodology Timeline
            </span>
            <span className="block font-mono text-[11px] text-muted-foreground">
              Tracing discovery from first-principles static reading to verifiable benchmarks
            </span>
          </div>
        </div>

        {/* Filter Pills & Walkthrough Controls */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Pills */}
          <div className="flex items-center rounded-xl border border-border/80 bg-card/60 p-1 gap-1" role="group" aria-label="Milestone Category Filters">
            {[
              { id: "all", label: "All Stages" },
              { id: "paper", label: "Paper" },
              { id: "review", label: "Audits" },
            ].map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setFilter(btn.id);
                  const match = MILESTONES.findIndex((m) => {
                    if (btn.id === "all") return true;
                    if (btn.id === "paper") return m.badge === "paper";
                    return m.badge === "review" || m.category === "replication" || m.category === "review";
                  });
                  if (match !== -1) setActiveIdx(match);
                }}
                className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                  filter === btn.id
                    ? "border border-[var(--wsp-chrome)]/80 bg-[color-mix(in_oklab,var(--wsp-chrome)_16%,transparent)] text-foreground font-bold shadow-xs"
                    : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                }`}
                aria-pressed={filter === btn.id}
              >
                {btn.label}
              </button>
            ))}
          </div>

          {/* Autoplay & Step Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 font-mono text-xs font-bold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                isPlaying
                  ? "border-[var(--wsp-green)] bg-[color-mix(in_oklab,var(--wsp-green)_15%,transparent)] text-[var(--wsp-green)] shadow-xs"
                  : "border-border/80 bg-card/80 text-foreground hover:bg-accent"
              }`}
              title={isPlaying ? "Pause timeline walkthrough" : "Auto-play timeline walkthrough"}
            >
              {isPlaying ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
              <span>{isPlaying ? "Autoplay Active" : "Play Timeline"}</span>
            </button>

            <div className="flex items-center rounded-xl border border-border/80 bg-card/60 p-0.5">
              <button
                onClick={handlePrev}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                aria-label="Previous milestone"
              >
                <ChevronLeft className="size-4" />
              </button>
              <span className="px-2 font-mono text-xs font-bold text-foreground tabular-nums">
                {activeIdx + 1} / {MILESTONES.length}
              </span>
              <button
                onClick={handleNext}
                className="p-1.5 text-muted-foreground hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
                aria-label="Next milestone"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Horizontal Timeline Track (Forge-Inspired HUD Rail with High-Contrast Connectors) */}
      <div className="relative pt-4 pb-2">
        {/* Continuous background rail line */}
        <div className="absolute top-9 left-0 right-0 h-[3px] bg-border/90 -translate-y-1/2 rounded-full" aria-hidden="true" />

        {/* Progress accent line connecting up to active index */}
        <div
          className="absolute top-9 left-0 h-[3px] -translate-y-1/2 bg-gradient-to-r from-[var(--wsp-blue)] via-[var(--wsp-chrome)] to-[var(--wsp-green)] transition-all duration-500 rounded-full"
          style={{ width: `${(activeIdx / (MILESTONES.length - 1)) * 100}%` }}
          aria-hidden="true"
        />

        {/* Milestone Steps Buttons */}
        <div className="relative grid grid-cols-5 gap-2 sm:gap-4">
          {MILESTONES.map((m, idx) => {
            const isActive = idx === activeIdx;
            const isPassed = idx < activeIdx;
            const isMatch =
              filter === "all" ||
              (filter === "paper" && m.badge === "paper") ||
              (filter === "review" && (m.badge === "review" || m.category === "replication" || m.category === "review"));

            return (
              <button
                key={m.id}
                onClick={() => {
                  setActiveIdx(idx);
                  setIsPlaying(false);
                }}
                className={`group flex flex-col items-center text-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-xl p-1 transition-opacity duration-200 ${
                  isMatch ? "opacity-100" : "opacity-40 hover:opacity-80"
                }`}
                aria-pressed={isActive}
                aria-label={`Milestone 0${idx + 1}: ${m.title}`}
              >
                {/* Node Pill with Distinct State Colors & Ring Highlights */}
                <div
                  className={`relative flex size-11 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "scale-110 border-[var(--wsp-chrome)] bg-card text-[var(--wsp-chrome)] font-black shadow-[0_0_22px_-2px_var(--wsp-chrome)] ring-4 ring-[var(--wsp-chrome)]/25"
                      : isPassed
                      ? "border-[var(--wsp-blue)] bg-[color-mix(in_oklab,var(--wsp-blue)_12%,var(--card))] text-[var(--wsp-blue)] font-bold shadow-xs hover:border-[var(--wsp-blue)] hover:brightness-110"
                      : "border-border bg-card/90 text-foreground/70 group-hover:border-foreground/60 group-hover:text-foreground hover:bg-card"
                  }`}
                >
                  <span className="font-mono text-xs font-black tabular-nums">
                    0{idx + 1}
                  </span>
                  {isActive && (
                    <span className="absolute -inset-1 rounded-full border border-[var(--wsp-chrome)]/60 animate-ping pointer-events-none" />
                  )}
                </div>

                {/* Step Metadata Under Node with Crisp WCAG AA Contrast */}
                <div className="mt-3.5 hidden sm:block text-center">
                  <span
                    className={`block font-mono text-[10px] font-bold uppercase tracking-wider transition-colors ${
                      isActive
                        ? "text-[var(--wsp-chrome)]"
                        : isPassed
                        ? "text-foreground/80"
                        : "text-muted-foreground"
                    }`}
                  >
                    {m.date}
                  </span>
                  <span
                    className={`block font-sans text-xs font-semibold line-clamp-1 mt-0.5 transition-colors ${
                      isActive ? "text-foreground font-bold" : "text-foreground/85"
                    }`}
                  >
                    {m.stage}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Featured Active Milestone Dossier Card (ForgeUI-Grade Tactile Enclosure) */}
      <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/90 p-6 sm:p-8 shadow-xl backdrop-blur-md transition-all duration-300">
        {/* Subtle decorative corner tick */}
        <div className="absolute top-0 right-0 h-16 w-16 overflow-hidden pointer-events-none">
          <div className="absolute top-2 right-2 font-mono text-[10px] text-muted-foreground opacity-40">
            [REC-0{activeIdx + 1}]
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-12 items-start">
          {/* Left Column: Context, Author, Hypothesis */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <BadgeChip b={current.badge} />
                <span className="font-mono text-xs text-muted-foreground tabular-nums">
                  {current.date} · {current.stage}
                </span>
              </div>
              <h3 className="font-sans text-xl sm:text-2xl font-black text-foreground tracking-tight leading-snug">
                {current.title}
              </h3>
              <p className="font-serif text-sm text-muted-foreground leading-relaxed italic">
                {current.subtitle}
              </p>
            </div>

            {/* Attribution Meta Box with Crisp Contrast */}
            <div className="rounded-xl border border-border/80 bg-secondary/35 p-3.5 space-y-1.5 font-mono text-xs shadow-2xs">
              <div className="flex items-center justify-between text-foreground">
                <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Authors:</span>
                <span className="font-bold truncate ml-2 text-foreground">{current.author}</span>
              </div>
              <div className="flex items-center justify-between text-foreground">
                <span className="text-muted-foreground uppercase text-[10px] tracking-wider font-semibold">Affiliation:</span>
                <span className="font-medium text-foreground/90">{current.affiliation}</span>
              </div>
            </div>

            {/* Research Hypothesis Callout */}
            <div className="space-y-1.5 border-l-2 border-[var(--wsp-chrome)] pl-3.5 py-0.5">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--wsp-chrome)]">
                Core Research Question
              </span>
              <p className="font-serif text-sm sm:text-base font-semibold text-foreground leading-relaxed italic">
                “{current.question}”
              </p>
            </div>

            {/* Scientific Critique Callout (Balanced in Left Column) */}
            <div className="rounded-xl border border-dashed border-[var(--wsp-amber)]/60 bg-[color-mix(in_oklab,var(--wsp-amber)_8%,transparent)] p-4 shadow-2xs">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--wsp-amber)] block mb-1.5 flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 shrink-0" />
                Empirical Honesty &amp; Limitations
              </span>
              <p className="font-serif text-xs sm:text-sm text-foreground/90 leading-relaxed">
                {current.critique}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="pt-1 flex flex-wrap items-center gap-3">
              {current.artifactLink && (
                <Link
                  href={current.artifactLink.href}
                  prefetch={false}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--wsp-chrome)]/60 bg-[color-mix(in_oklab,var(--wsp-chrome)_12%,transparent)] px-4 py-2 font-sans text-xs font-bold text-foreground transition-all hover:bg-[color-mix(in_oklab,var(--wsp-chrome)_22%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <span>{current.artifactLink.label}</span>
                  <ArrowRight className="size-3.5" />
                </Link>
              )}
              {current.labScript && (
                <div className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-background/80 px-3 py-2 font-mono text-[11px] text-muted-foreground">
                  <Terminal className="size-3.5 text-[var(--wsp-green)] shrink-0" />
                  <code>{current.labScript}</code>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Exact Protocol & Verified Numbers */}
          <div className="lg:col-span-7 space-y-6">
            {/* Protocol Steps */}
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5 flex items-center gap-1.5">
                <FlaskConical className="size-3.5 text-[var(--wsp-blue)]" />
                Methodological Procedure
              </span>
              <ol className="space-y-2.5 font-sans text-xs sm:text-sm text-foreground/90">
                {current.protocol.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/75 p-3 shadow-2xs transition-colors hover:border-border hover:bg-card"
                  >
                    <span className="font-mono text-xs font-black text-[var(--wsp-blue)] shrink-0 tabular-nums mt-0.5">
                      0{idx + 1}.
                    </span>
                    <span className="leading-relaxed font-normal text-foreground/90">{step}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* Key Empirical Metrics Grid */}
            <div>
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2.5 flex items-center gap-1.5">
                <Scale className="size-3.5 text-[var(--wsp-green)]" />
                Measured Empirical Deliverables
              </span>
              <div className="grid gap-3 sm:grid-cols-2">
                {current.metrics.map((m, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-border/80 bg-background/85 p-3.5 space-y-1 shadow-2xs transition-all hover:border-[var(--wsp-green)]/40 hover:-translate-y-0.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="block font-mono text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        {m.label}
                      </span>
                      {m.delta && (
                        <span className="font-mono text-[10px] font-bold text-[var(--wsp-green)] bg-[color-mix(in_oklab,var(--wsp-green)_12%,transparent)] px-1.5 py-0.5 rounded tabular-nums">
                          {m.delta}
                        </span>
                      )}
                    </div>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      {m.before && (
                        <span className="font-mono text-xs text-muted-foreground line-through tabular-nums">
                          {m.before}
                        </span>
                      )}
                      <span className="font-mono text-base font-black text-foreground tabular-nums">
                        {m.after}
                      </span>
                    </div>
                    <span className="block font-serif text-[11px] text-muted-foreground italic leading-tight">
                      {m.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Audit Summary Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 rounded-xl border border-border/70 bg-card/40 px-5 py-3 font-mono text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <Clock className="size-3.5 text-[var(--wsp-amber)]" />
          <span>Continuous peer ledger. Methodological updates logged in order of empirical release.</span>
        </div>
        <div className="flex items-center gap-4 shrink-0 text-[11px]">
          <span className="text-foreground">
            Status: <strong className="text-[var(--wsp-green)] font-bold">Verified Attribution</strong>
          </span>
          <Link href="/about" prefetch={false} className="text-[var(--wsp-chrome)] hover:underline flex items-center gap-1">
            <span>Audit Protocol</span>
            <ExternalLink className="size-3" />
          </Link>
        </div>
      </div>
    </div>
  );
}
