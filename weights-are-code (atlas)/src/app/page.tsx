import Link from "next/link";
import {
  ArrowRight,
  FileDown,
  FlaskConical,
  ListChecks,
  BookOpen,
  AlertTriangle,
  Layers,
  CheckCircle2,
  Cpu,
  Sparkles,
  Zap,
  Activity,
  ShieldCheck,
  Terminal,
  HelpCircle,
  Binary,
  Code2,
  GitBranch,
  Gauge,
  Sliders,
  TrendingUp,
} from "lucide-react";
import WeightHero from "@/components/site/WeightHero";
import WallChart from "@/components/site/WallChart";
import PersonaNavigator from "@/components/site/PersonaNavigator";
import FingerprintLab from "@/components/modules/FingerprintLab";
import SurgeryInteractivePreview from "@/components/modules/SurgeryInteractivePreview";
import { BadgeChip, BadgeLegend } from "@/components/content/Badge";
import { CHAPTERS, PARTS } from "@/content/chapters";
import { EXPERIMENTS } from "@/content/facts";

const PART_COLORS: Record<number, string> = {
  1: "var(--wsp-chrome)",
  2: "var(--wsp-blue)",
  3: "var(--wsp-green)",
  4: "var(--wsp-red)",
};

const PART_BORDER: Record<number, string> = {
  1: "color-mix(in oklab, var(--wsp-chrome) 30%, var(--border))",
  2: "color-mix(in oklab, var(--wsp-blue) 30%, var(--border))",
  3: "color-mix(in oklab, var(--wsp-green) 30%, var(--border))",
  4: "color-mix(in oklab, var(--wsp-red) 30%, var(--border))",
};

export default function Home() {
  return (
    <div className="w-full overflow-hidden">
      {/* ========================================================
          HERO: FULL-BLEED BLENDED WEBGL SCENE & EDITORIAL SUITE
          ======================================================== */}
      <WeightHero />

      {/* ========================================================
          POST-HERO: ARCHITECTURAL SHIFT + PERSONA NAVIGATOR
          ======================================================== */}
      <section className="border-b border-border/70 bg-background py-6 sm:py-8">
        <div className="relative mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10 space-y-8">

          {/* Architectural Shift Callout Banner */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1.5 max-w-3xl">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--wsp-chrome)] bg-[color-mix(in_oklab,var(--wsp-chrome)_10%,transparent)] px-2 py-0.5 rounded-md">
                    Architectural Shift
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">From Black-Box SGD to Parameter Surgery</span>
                </div>
                <h2 className="font-sans text-base sm:text-lg font-bold text-foreground">
                  Treating Neural Network Weights as Human-Readable, Modifiable Source Code
                </h2>
                <p className="font-serif text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Bypassing gradient backpropagation by projecting out defective reasoning directions:{" "}
                  <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">W&apos; = (I - u·uᵀ)W</code>{" "}
                  modifies only 0.016% of weights to unlock latent capabilities without retraining.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
                <Link
                  href="/prologue#architectural-shift"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-foreground text-background px-4 font-sans text-xs font-bold transition-all hover:opacity-90 shadow-2xs whitespace-nowrap"
                >
                  <BookOpen className="size-3.5" />
                  <span>Read Full Shift in Prologue</span>
                  <ArrowRight className="size-3.5" />
                </Link>
                <Link
                  href="/faq"
                  className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border/80 bg-card px-4 font-sans text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent transition-all whitespace-nowrap"
                >
                  <HelpCircle className="size-3.5 text-[var(--wsp-chrome)]" />
                  <span>Explore FAQs</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Adaptive Learning Pathways */}
          <div className="pt-2 border-t border-border/60">
            <PersonaNavigator />
          </div>
        </div>
      </section>

      {/* ========================================================
          THREE VERBS: READ · FIX · WRITE
          ======================================================== */}
      <section aria-labelledby="spotlight" className="py-8 sm:py-10 lg:py-12 border-b border-border/70">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">
                <Activity className="size-3.5 text-[var(--wsp-chrome)]" />
                <span>The Core Methodology</span>
              </div>
              <h2 id="spotlight" className="font-sans text-2xl font-black tracking-tight sm:text-4xl text-foreground">
                Three Verbs That Define It
              </h2>
              <p className="mt-1 font-serif text-sm sm:text-base text-muted-foreground max-w-[80ch]">
                Read the Weights. Fix and Write into Weights. Audit the Artifact. Each verb carries distinct empirical verification criteria, mechanisms, and architectural bounds.
              </p>
            </div>
            <Link
              href="/experiments"
              prefetch={false}
              className="inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-bold hover:underline shrink-0 text-[var(--wsp-chrome)]"
            >
              <span>Inspect All 8 Experiments</span>
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              {
                verb: "READ",
                badge: "review" as const,
                color: "var(--wsp-blue)",
                title: "Read the Weights",
                expChip: "Exp 1–3",
                summary:
                  "Locate exact copying attention heads and identify game policies and visual diffusion targets simply by inspecting weight matrices-zero model execution required.",
                evidence:
                  "Demonstrated on toy MLPs and 4-layer transformers (17K–7.16M weights). Proves structured semantic information is legible to reasoning models.",
                href: "/read/4-read",
                chLabel: "Chapter 4",
                spec: "Takehi et al. · Static Analysis",
              },
              {
                verb: "WRITE",
                badge: "paper" as const,
                color: "var(--wsp-chrome)",
                title: "Write into Weights",
                expChip: "Exp 4–6, 8",
                summary:
                  "Apply targeted rank-1 weight surgeries (ΔW = u·vᵀ) to fix neural pathways or synthesize working parameters from scratch. A 0.016% edit lifted MATH-500 from 7.9% to 48.1%.",
                evidence:
                  "Strongest finding: negative control verified an architectural reasoning stall was excised, preserving general model capabilities.",
                href: "/read/5-fix",
                chLabel: "Chapters 5 & 6",
                spec: "0.016% Surgery & Synthesis",
              },
              {
                verb: "AUDIT",
                badge: "review" as const,
                color: "var(--wsp-green)",
                title: "Audit the Artifact",
                expChip: "Exp 7–8 · Scoreboard",
                summary:
                  "De-bias claims through academic scrutiny. Separates verified zero-gradient breakthroughs from single-run narrative extrapolation and establishes the WSP-Bench-Lite standard.",
                evidence:
                  "Catalogued all 8 experiments into three empirical tiers: 3 Strong, 3 Moderate, 2 Weak. Identified single-seed variance and budget curve gaps.",
                href: "/about",
                chLabel: "Scoreboard & Audit",
                spec: "Maier Academic Review",
              },
            ].map((item) => (
              <Link
                key={item.verb}
                href={item.href}
                prefetch={false}
                className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 sm:p-7 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:shadow-2xl hover:ring-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring overflow-hidden"
                style={{
                  borderColor: `color-mix(in oklab, ${item.color} 28%, var(--border))`,
                  // @ts-expect-error Tailwind custom property
                  "--tw-ring-color": `color-mix(in oklab, ${item.color} 35%, transparent)`,
                }}
              >
                {/* Accent top line with hover expansion */}
                <div
                  className="absolute top-0 left-0 right-0 h-1 transition-all duration-300 group-hover:h-1.5"
                  style={{ background: item.color }}
                />

                {/* Ambient radial sheen on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15"
                  style={{ background: item.color }}
                />

                {/* Corner indicator */}
                <div className="absolute top-2.5 right-2.5 font-mono text-[9px] text-muted-foreground opacity-30 group-hover:opacity-80 transition-opacity">
                  +
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-mono text-lg font-black tracking-widest"
                        style={{ color: item.color }}
                      >
                        {item.verb}
                      </span>
                      {/* Interactive Experiment Chip */}
                      <span
                        className="inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider tabular-nums transition-all duration-200 group-hover:scale-105 group-hover:brightness-110"
                        style={{
                          borderColor: `color-mix(in oklab, ${item.color} 40%, var(--border))`,
                          background: `color-mix(in oklab, ${item.color} 12%, transparent)`,
                          color: item.color,
                        }}
                      >
                        <span className="size-1.5 rounded-full animate-pulse" style={{ background: item.color }} />
                        {item.expChip}
                      </span>
                    </div>
                    <BadgeChip b={item.badge} />
                  </div>

                  <h3 className="font-sans text-xl font-bold text-foreground group-hover:text-foreground transition-colors duration-200">
                    {item.title}
                  </h3>

                  <p className="mt-3 font-serif text-sm leading-relaxed text-foreground/85">
                    {item.summary}
                  </p>

                  <div className="mt-4 border-t border-border/50 pt-3">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                      Empirical Standing:
                    </span>
                    <p className="font-serif text-xs leading-relaxed text-muted-foreground">
                      {item.evidence}
                    </p>
                  </div>
                </div>

                <div
                  className="mt-6 flex items-center justify-between font-sans text-xs font-semibold pt-3.5 border-t border-border/40"
                  style={{ color: item.color }}
                >
                  <span className="font-mono text-[11px] text-muted-foreground">{item.spec}</span>
                  <span className="flex items-center gap-1.5 transition-transform duration-200 group-hover:translate-x-1.5 font-bold">
                    <span>{item.chLabel}</span>
                    <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          LIVE INTERACTIVE SURGERY SIMULATOR: HOMEPAGE LAB PREVIEW
          ======================================================== */}
      <section aria-labelledby="surgery-simulator" className="py-8 sm:py-10 lg:py-12 border-b border-border/70 bg-card/20">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10 space-y-6">
          <SurgeryInteractivePreview />
        </div>
      </section>

      {/* ========================================================
          PROLOGUE & FINGERPRINT LAB: REAL RECOMPUTED EXP 1 DATA
          ======================================================== */}
      <section aria-labelledby="fingerprints-hero" className="py-8 sm:py-10 lg:py-12 border-b border-border/70 bg-card/10">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] uppercase tracking-wider">
                  Prologue Spotlight · Exp 1 In Slow Motion
                </span>
                <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-border/80 bg-accent/60 text-muted-foreground">
                  Empirical Data
                </span>
              </div>
              <h2 id="fingerprints-hero" className="font-sans text-2xl sm:text-4xl font-black tracking-tight text-foreground">
                The Atari Weight Fingerprints
              </h2>
              <p className="font-serif text-sm sm:text-base text-muted-foreground max-w-[75ch]">
                Takehi et al. gave an LLM four policies with 17,253 identical weights and asked it to name each game with zero tools. Explore the real weights recomputed live from the authors’ published GitHub prompts.
              </p>
            </div>

            <Link
              href="/prologue"
              prefetch={false}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground text-background px-5 font-sans text-xs font-bold transition-all hover:opacity-90 shrink-0 shadow-2xs"
            >
              <span>Explore The Story So Far</span>
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <FingerprintLab />
        </div>
      </section>

      {/* ========================================================
          THE LIVING RESEARCH LEDGER: FULL INTERACTIVE TIMELINE
          ======================================================== */}
      <section aria-labelledby="wallchart" className="py-8 sm:py-10 lg:py-12 border-b border-border/70">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground uppercase tracking-wider mb-1">
                <Cpu className="size-3.5 text-[var(--wsp-green)]" />
                <span>Replication &amp; Audit Log</span>
              </div>
              <h2 id="wallchart" className="font-sans text-2xl font-black tracking-tight sm:text-4xl text-foreground">
                The Living Research Ledger
              </h2>
              <p className="mt-1 font-serif text-sm sm:text-base text-muted-foreground max-w-[80ch]">
                Interactive timeline tracing discovery from first-principles static reading through laptop replication, 0.016% surgical repair, and academic auditing.
              </p>
            </div>
            <Link
              href="/about"
              prefetch={false}
              className="inline-flex items-center gap-1.5 font-sans text-xs sm:text-sm font-bold hover:underline shrink-0 text-[var(--wsp-chrome)]"
            >
              <span>Full Audit Protocol</span> <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <WallChart />
        </div>
      </section>

      {/* ========================================================
          TRUTH CONTRACT: RADAR INTEGRITY
          ======================================================== */}
      <section aria-labelledby="truth-contract" className="py-8 sm:py-10 lg:py-12 border-b border-border/70 bg-card/30">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
          <div className="grid gap-8 lg:grid-cols-12 items-start">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground uppercase tracking-wider">
                <ShieldCheck className="size-4 text-[var(--wsp-green)]" />
                <span>Zero Hallucination Protocol</span>
              </div>
              <h2 id="truth-contract" className="font-sans text-2xl font-black tracking-tight sm:text-4xl text-foreground">
                The Truth Contract
              </h2>
              <p className="font-serif text-sm sm:text-base leading-relaxed text-muted-foreground">
                Every single metric, parameter table, and schematic diagram carries exactly one provenance badge. Press <kbd className="kbd font-bold">T</kbd> anywhere on this guide to strip away speculation and toy schematics, leaving only empirical paper facts and independent replications.
              </p>

              <div className="rounded-2xl border border-border/80 bg-card/60 p-5 font-serif text-xs sm:text-sm leading-relaxed text-muted-foreground space-y-2.5 shadow-xs">
                <p>
                  <strong className="text-foreground">Why this matters:</strong> AI research has an epidemic of narrative exaggeration. This site strictly distinguishes between claims verified by formal benchmarks versus pedagogical toy illustrations.
                </p>
                <div className="pt-2 border-t border-border/50 flex items-center justify-between font-mono text-xs text-foreground">
                  <span>Toggle Filter: <kbd className="kbd">T</kbd></span>
                  <span>Shortcut Guide: <kbd className="kbd">?</kbd></span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3.5 shadow-sm">
                <h3 className="font-sans text-sm font-bold text-foreground flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[var(--wsp-chrome)]" />
                  Provenance Badging Hierarchy
                </h3>
                <BadgeLegend />
              </div>

              <div className="rounded-2xl border border-border/80 bg-card p-6 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--wsp-chrome)]">
                      Flagship Empirical Record
                    </span>
                    <BadgeChip b="paper" />
                  </div>
                  <h3 className="font-sans text-lg font-bold text-foreground">
                    The 0.016% Surgery (Exp 8)
                  </h3>
                  <p className="mt-2.5 font-serif text-xs leading-relaxed text-muted-foreground">
                    Modifying just <strong className="text-foreground tabular-nums">131,072 parameters out of 800 million</strong> in Qwen3.5-0.8B restored reasoning accuracy on MATH-500 from <strong className="text-foreground tabular-nums">7.9% to 48.1%</strong>.
                  </p>
                  <p className="mt-2 font-serif text-[11px] text-muted-foreground border-t border-border/50 pt-2">
                    Negative control edit (perturbed same size in arbitrary direction) yielded zero gain, confirming surgical precision.
                  </p>
                </div>
                <div className="pt-3 mt-4 border-t border-border/50 flex items-center justify-between">
                  <span className="font-mono text-xs text-muted-foreground">Takehi et al. · CSAIL</span>
                  <Link
                    href="/read/5-fix"
                    prefetch={false}
                    className="font-sans text-xs font-bold flex items-center gap-1 hover:underline text-[var(--wsp-chrome)]"
                  >
                    Read Surgery Breakdown <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          CURRICULUM: FOUR PARTS, THIRTEEN CHAPTERS
          ======================================================== */}
      <section aria-labelledby="map" className="py-8 sm:py-10 lg:py-12 border-b border-border/70">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
          <div className="mb-6 flex items-start gap-3.5">
            <BookOpen className="size-6 mt-1 shrink-0 text-[var(--wsp-chrome)]" />
            <div>
              <h2 id="map" className="font-sans text-2xl font-black tracking-tight sm:text-4xl text-foreground">
                Field Guide Curriculum
              </h2>
              <p className="mt-1 font-serif text-sm sm:text-base text-muted-foreground max-w-[80ch]">
                Four parts spanning 13 canonical chapters. Every paragraph can be read across 5 audience rungs-from intuitive conceptual metaphors to frontier mathematical rigor.
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {PARTS.map((p) => (
              <div
                key={p.n}
                className="rounded-2xl border bg-card p-5 sm:p-6 flex flex-col gap-4 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5"
                style={{ borderColor: PART_BORDER[p.n] }}
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2.5 rounded-full shrink-0"
                      style={{ background: PART_COLORS[p.n] }}
                      aria-hidden="true"
                    />
                    <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">
                      Part {p.n}: {p.title}
                    </h3>
                  </div>
                  <p className="font-serif text-xs text-muted-foreground leading-relaxed">
                    {p.blurb}
                  </p>
                </div>

                <ol className="space-y-1 border-t border-border/50 pt-3">
                  {CHAPTERS.filter((c) => c.part === p.n).map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/read/${c.slug}`}
                        prefetch={false}
                        className="group flex items-center justify-between gap-2.5 rounded-lg px-2.5 py-1.5 transition-all hover:bg-accent/60"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className="font-mono text-xs font-bold shrink-0 w-5 tabular-nums"
                            style={{ color: PART_COLORS[p.n] }}
                          >
                            {String(c.number).padStart(2, "0")}
                          </span>
                          <span className="font-serif text-xs font-medium text-foreground/85 group-hover:text-foreground transition-colors truncate">
                            {c.title}
                          </span>
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground shrink-0 tabular-nums">
                          {c.minutes}m
                        </span>
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          RESEARCH INSTRUMENTATION & TOOLS
          ======================================================== */}
      <section aria-labelledby="resources" className="pt-8 pb-6 sm:pt-10 sm:pb-8 border-b border-border/60">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
          <div className="mb-6">
            <h2 id="resources" className="font-sans text-2xl font-black tracking-tight sm:text-4xl text-foreground">
              Research Instruments
            </h2>
            <p className="mt-1 font-serif text-sm sm:text-base text-muted-foreground max-w-[80ch]">
              Directly interact with empirical material through runnable Python scripts, cognitive quizzes, and verified citation ledgers.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {[
              {
                icon: <FlaskConical className="size-5 text-[var(--wsp-amber)]" />,
                accent: "var(--wsp-amber)",
                title: "Runnable Python Labs",
                text: "Three self-contained scripts: hand-compile a policy, perform direction surgery, and compute blast radii with zero external dependencies.",
                href: "/lab",
                cta: "Open Lab Scripts",
              },
              {
                icon: <ListChecks className="size-5 text-[var(--wsp-chrome)]" />,
                accent: "var(--wsp-chrome)",
                title: "Cognitive Mastery Quiz",
                text: "Fifteen challenging questions testing your grasp from weight representations to ablation design and empirical critiques.",
                href: "/quiz",
                cta: "Take the Quiz",
              },
              {
                icon: <HelpCircle className="size-5 text-[var(--wsp-green)]" />,
                accent: "var(--wsp-green)",
                title: "Technical FAQs",
                text: "12 searchable answers: zero-gradient hardware needs, LoRA vs WSP, Qwen 0.8B direction surgery, and replication bounds.",
                href: "/faq",
                cta: "Explore FAQs",
              },
              {
                icon: <FileDown className="size-5 text-[var(--wsp-blue)]" />,
                accent: "var(--wsp-blue)",
                title: "Whitepaper",
                text: "Complete scholarly PDF with every derivation, parameter tensor matrices, full bibliography, and mathematical proofs.",
                href: "/whitepaper.pdf",
                cta: "Download PDF",
              },
              {
                icon: <AlertTriangle className="size-5 text-[var(--wsp-red)]" />,
                accent: "var(--wsp-red)",
                title: "The Honesty Ledger",
                text: "44 bibliography references tagged by verification tier, plus the complete catalogue of unconfirmed research bounds.",
                href: "/references",
                cta: "Audit the Ledger",
              },
            ].map((r) => (
              <div
                key={r.title}
                className="group relative flex flex-col justify-between rounded-2xl border bg-card p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  borderColor: `color-mix(in oklab, ${r.accent} 25%, var(--border))`,
                }}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-0.5"
                  style={{ background: r.accent }}
                />

                <div>
                  <div
                    className="size-10 rounded-xl border flex items-center justify-center mb-4"
                    style={{
                      borderColor: `color-mix(in oklab, ${r.accent} 35%, var(--border))`,
                      background: `color-mix(in oklab, ${r.accent} 12%, var(--card))`,
                    }}
                  >
                    {r.icon}
                  </div>
                  <h3 className="font-sans text-base font-bold text-foreground">{r.title}</h3>
                  <p className="mt-2 font-serif text-xs leading-relaxed text-muted-foreground">
                    {r.text}
                  </p>
                </div>
                <Link
                  href={r.href}
                  prefetch={false}
                  className="mt-6 inline-flex items-center gap-1 font-sans text-xs font-bold hover:underline"
                  style={{ color: r.accent }}
                >
                  <span>{r.cta}</span>
                  <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          START READING CTA
          ======================================================== */}
      <section className="py-12 sm:py-16 border-t border-border/80 bg-muted/20">
        <div className="mx-auto max-w-[1680px] px-4 sm:px-6 lg:px-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xs">
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--wsp-chrome)] font-bold">
                Open Curriculum · 13 Chapters
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-black text-foreground">
                Ready to dive inside the weights?
              </h2>
              <p className="font-serif text-xs sm:text-sm text-muted-foreground">
                Explore the complete field guide from first principles to zero-gradient directional surgery.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/read/1-pile-of-numbers"
                className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground text-background px-5 font-sans text-xs sm:text-sm font-bold transition-all hover:opacity-90 shadow-sm"
              >
                <span>Start with Chapter 1</span>
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/read"
                className="inline-flex h-11 items-center gap-2 rounded-xl border border-border bg-card px-4 font-sans text-xs sm:text-sm font-semibold text-foreground transition-all hover:bg-accent"
              >
                <BookOpen className="size-4 text-[var(--wsp-chrome)]" />
                <span>Curriculum Index</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
