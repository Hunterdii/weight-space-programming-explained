import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  Layers,
  ArrowRight,
  Calendar,
  Sparkles,
  Activity,
  ExternalLink,
} from "lucide-react";
import { BadgeChip } from "@/components/content/Badge";
import FingerprintLab from "@/components/modules/FingerprintLab";

export const metadata: Metadata = {
  title: "Prologue: The Story So Far · The Weight Atlas",
  description:
    "Where Weight-Space Programming came from, the first experiment in slow motion, the eight-step experiment ladder, and week-one reactions and critiques.",
};

const LADDER_STEPS = [
  {
    step: "1 → 2",
    from: "Exp 1 · Read",
    to: "Exp 2 · Read",
    question: "One task family only?",
    whatChanged: "A diffusion model instead of an Atari game policy",
    pricePaid: "None (both small MLPs without tools)",
    verdict: "Passes",
  },
  {
    step: "2 → 3",
    from: "Exp 2 · Read",
    to: "Exp 3 · Read",
    question: "First and last layers give it away?",
    whatChanged: "Input and output layers removed; middle transformer blocks only (7.16M params)",
    pricePaid: "Python script access allowed; running the network banned",
    verdict: "Mixed (heuristics needed)",
  },
  {
    step: "3 → 4",
    from: "Exp 3 · Read",
    to: "Exp 4 · Fix",
    question: "Can it act, not just read?",
    whatChanged: "Diagnose and repair a failing Kinetix car physics policy (0/256 → 1,024/1,024)",
    pricePaid: "Scene description and one recorded episode provided",
    verdict: "Strong (huge effect size)",
  },
  {
    step: "4 → 5",
    from: "Exp 4 · Fix",
    to: "Exp 5 · Write",
    question: "Fixing starts from a trained network - what about scratch?",
    whatChanged: "Synthesize complete working policies from all-zero initial weights across 3 MinAtar games",
    pricePaid: "Game rules and Python source code provided in prompt",
    verdict: "Strong (one-shot)",
  },
  {
    step: "5 → 6",
    from: "Exp 5 · Write",
    to: "Exp 6 · Write",
    question: "MinAtar weights fit in context - what about 1.48M parameters?",
    whatChanged: "Write Go policy (1.48M params) using code execution and up to 50 forward passes",
    pricePaid: "Forward passes become the currency; search loop introduced",
    verdict: "Strong (win rate rises with budget)",
  },
  {
    step: "6 → 7",
    from: "Exp 6 · Write",
    to: "Exp 7 · Read",
    question: "Can it diagnose behavioural traits like sycophancy?",
    whatChanged: "Distinguish sycophantic vs non-sycophantic LMs",
    pricePaid: "Weights alone failed; attention activation patterns were required",
    verdict: "Weaker (weights insufficient)",
  },
  {
    step: "7 → 8",
    from: "Exp 7 · Read",
    to: "Exp 8 · Fix",
    question: "Can it repair a real, full-scale language model?",
    whatChanged: "Qwen3.5-0.8B overthinking loop repaired by subtracting one direction from 64 columns (0.016%)",
    pricePaid: "Python kernel + 50 forward passes + practice math problems",
    verdict: "Flagship (48.1% MATH-500)",
  },
  {
    step: "8 → Ctrl",
    from: "Exp 8 · Fix",
    to: "Gemma Control",
    question: "Is it adding ability or clearing an obstacle?",
    whatChanged: "Identical surgery applied to Gemma 3 270M (which had no thought loops)",
    pricePaid: "Zero gain (6.8% → 7.0%)",
    verdict: "Proves obstacle-removal, not magic capability addition",
  },
];

const WEEK_ONE_LOG = [
  {
    date: "2 Nov 2026",
    source: "MIT CSAIL (Takehi, Teoh, Zhang, Khattab)",
    badge: "paper" as const,
    summary:
      "Published 'Sparks of Weight-Space Programming'. Released all prompt transcripts, evaluation logs, and the edited Qwen3.5-0.8B checkpoint on Hugging Face.",
    link: "https://rikiyat.github.io/blog/weight-space-programming/",
  },
  {
    date: "2–3 Nov 2026",
    source: "Ahsen Khaliq (Hugging Face)",
    badge: "paper" as const,
    summary:
      "Re-evaluated the edited Qwen checkpoint from released logs; launched public interactive demo verifying MATH-500 jump from 7.9% to 48.1%.",
    link: "https://huggingface.co/RikiyaT/Qwen3.5-0.8B-weight-space-programming",
  },
  {
    date: "3 Nov 2026",
    source: "Simon Willison (Independent Replication)",
    badge: "review" as const,
    summary:
      "Successfully reproduced Exp. 1 weight reading on an offline laptop running Qwen 2.5 7B / 3.8 27B. Breakout named at 88% confidence in 52m. Urged separating zero-tool reading from tool-assisted editing.",
    link: "https://simonwillison.net/",
  },
  {
    date: "3 Nov 2026",
    source: "Matthew Honnibal (spaCy / Explosion)",
    badge: "review" as const,
    summary:
      "Noted the post blends disparate techniques: only Exps 1, 2, and 4 inspect raw float arrays directly; all large model experiments rely on Python code execution. Credited Qwen result as genuine engineering.",
    link: "https://github.com/Hunterdii/weight-space-programming-explained",
  },
  {
    date: "3 Nov 2026",
    source: "Sean Goedecke (Technical Essay)",
    badge: "review" as const,
    summary:
      "Argued LLMs reading weights is analogous to emitting raw machine code: an impressive feat of spatial reasoning, but conventional training remains the primary tool for updating weights.",
    link: "https://www.seangoedecke.com/",
  },
  {
    date: "5 Nov 2026",
    source: "Andreas Maier (Monograph Review)",
    badge: "review" as const,
    summary:
      "Published 'What is Measured and What is Anecdote': established empirical evidence tiers for all 8 experiments. Outlined required baselines and proposed community benchmark protocols.",
    link: "/about",
  },
];

export default function ProloguePage() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-12 sm:px-6 lg:px-10 space-y-16">
      {/* Top Breadcrumb & Hero */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md">
          <BookOpen className="size-3.5 text-[var(--wsp-chrome)]" />
          <span>PROLOGUE · THE STORY SO FAR · MIT CSAIL &amp; WEEK-ONE REPLICATIONS</span>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
          The Story So Far
        </h1>

        <p className="font-serif text-lg sm:text-xl leading-relaxed text-muted-foreground">
          Where Weight-Space Programming came from, how the first experiment worked in slow motion, how one result led directly to the next, and what the machine-learning community uncovered in the first seven days.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <a
            href="#architectural-shift"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-card px-4 font-sans text-xs font-semibold text-foreground transition-all hover:bg-accent shadow-2xs"
          >
            <Activity className="size-3.5 text-[var(--wsp-chrome)]" />
            <span>The Architectural Shift</span>
          </a>
          <a
            href="#ladder"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-card px-4 font-sans text-xs font-semibold text-foreground transition-all hover:bg-accent shadow-2xs"
          >
            <Layers className="size-3.5 text-[var(--wsp-blue)]" />
            <span>The Experiment Ladder</span>
          </a>
          <a
            href="#fingerprints"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-card px-4 font-sans text-xs font-semibold text-foreground transition-all hover:bg-accent shadow-2xs"
          >
            <Sparkles className="size-3.5 text-[var(--wsp-chrome)]" />
            <span>Interactive Fingerprint Lab</span>
          </a>
          <a
            href="#week-one"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-card px-4 font-sans text-xs font-semibold text-muted-foreground transition-all hover:text-foreground hover:bg-accent shadow-2xs"
          >
            <Calendar className="size-3.5 text-[var(--wsp-blue)]" />
            <span>Week-One Reactions</span>
          </a>
        </div>
      </div>

      {/* ========================================================
          P0: THE ARCHITECTURAL SHIFT (FOUNDATIONAL TREATISE)
          ======================================================== */}
      <section
        id="architectural-shift"
        className="space-y-8 border-t border-border/70 pt-12"
      >
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] uppercase tracking-wider">
            P0 · Architectural Foundations
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            The Architectural Shift: From Black-Box Training to Parameter Surgery
          </h2>
          <p className="font-serif text-base text-muted-foreground max-w-3xl leading-relaxed">
            How frontier reasoning models inspect, navigate, and edit neural network weights directly without gradient descent-bridging mechanistic interpretability, sparse autoencoders, and parameter surgery.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 shadow-xs">
            <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_12%,transparent)] font-mono text-xs font-bold text-[var(--wsp-chrome)]">
              01
            </div>
            <h3 className="font-sans text-base font-bold text-foreground">
              Direct Parameter Surgery
            </h3>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              For decades, deep learning treated neural networks as opaque numerical artifacts forged through SGD. Weight-Space Programming treats weights as modifiable source code, diagnosing bottlenecks symbolically and writing targeted parameter patches without training loops.
            </p>
            <span className="font-mono text-[11px] text-[var(--wsp-chrome)] block pt-2 border-t border-border/50">
              Core Principle: Zero-gradient symbolic parameter manipulation
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 shadow-xs">
            <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--wsp-blue)]/40 bg-[color-mix(in_oklab,var(--wsp-blue)_12%,transparent)] font-mono text-xs font-bold text-[var(--wsp-blue)]">
              02
            </div>
            <h3 className="font-sans text-base font-bold text-foreground">
              Directional Isolation &amp; Projection
            </h3>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              Complements sparse autoencoders by isolating the singular direction vector <code className="font-mono text-xs bg-accent px-1 py-0.5 rounded text-foreground">u</code> responsible for failure modes, computing the orthogonal projection operator <code className="font-mono text-xs bg-accent px-1 py-0.5 rounded text-foreground">W&apos; = (I - u·uᵀ)W</code> across targeted MLP down-projections.
            </p>
            <span className="font-mono text-[11px] text-[var(--wsp-blue)] block pt-2 border-t border-border/50">
              Core Formula: Subspace nullification without catastrophic forgetting
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 shadow-xs">
            <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--wsp-green)]/40 bg-[color-mix(in_oklab,var(--wsp-green)_12%,transparent)] font-mono text-xs font-bold text-[var(--wsp-green)]">
              03
            </div>
            <h3 className="font-sans text-base font-bold text-foreground">
              Empirical Containment (0.016%)
            </h3>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              Modifying only 131,072 weights out of 800M in Qwen3.5-0.8B unlocked latent math abilities (MATH-500: 7.9% → 48.1%) by excising runaway thinking loops. Negative controls on Gemma showed zero spurious capability movement.
            </p>
            <span className="font-mono text-[11px] text-[var(--wsp-green)] block pt-2 border-t border-border/50">
              Flagship Result: Obstacle removal over raw capability injection
            </span>
          </div>
        </div>

        {/* Synthesis Callout Banner */}
        <div className="rounded-2xl border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_8%,transparent)] p-5 sm:p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-[var(--wsp-chrome)]" />
            <h4 className="font-sans text-sm font-bold text-foreground">
              From Statistical Optimisation to Programmatic Surgery
            </h4>
          </div>
          <p className="font-serif text-xs sm:text-sm leading-relaxed text-foreground">
            Weight-Space Programming shifts the locus of neural modification from statistical gradient averages across millions of training steps to programmatic diagnosis: observing activations, isolating contrastive direction vectors, and applying targeted matrix projections in memory.
          </p>
        </div>
      </section>

      {/* ========================================================
          P1: WHERE THE IDEA CAME FROM
          ======================================================== */}
      <section className="space-y-8 border-t border-border/70 pt-12">
        <div className="space-y-2">
          <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] uppercase tracking-wider">
            P1 · Intellectual Lineage
          </span>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Where the Idea Came From
          </h2>
          <p className="font-serif text-base text-muted-foreground max-w-3xl leading-relaxed">
            Weight-Space Programming did not emerge in a vacuum. It sits squarely at the intersection of three long-running research questions in machine learning.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 shadow-xs">
            <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--wsp-blue)]/40 bg-[color-mix(in_oklab,var(--wsp-blue)_12%,transparent)] font-mono text-xs font-bold text-[var(--wsp-blue)]">
              01
            </div>
            <h3 className="font-sans text-base font-bold text-foreground">
              Reading the Network
            </h3>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              Mechanistic interpretability has mapped neural networks from the inside out: induction heads (Elhage et al.), refusal directions (Arditi et al.), and circuit tracing. Historically, humans interpreted these representations using probes and activation patching.
            </p>
            <span className="font-mono text-[11px] text-[var(--wsp-blue)] block pt-2 border-t border-border/50">
              Core Question: Can an LLM read circuits directly?
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 shadow-xs">
            <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--wsp-green)]/40 bg-[color-mix(in_oklab,var(--wsp-green)_12%,transparent)] font-mono text-xs font-bold text-[var(--wsp-green)]">
              02
            </div>
            <h3 className="font-sans text-base font-bold text-foreground">
              Writing Weights Without Training
            </h3>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              Hypernetworks (Ha et al.), fast weights (Schmidhuber), Tracr compilation (Lindner et al.), and weight diffusion models have generated parameters without gradient descent. However, each system was either domain-specific or required massive pre-training on existing weight datasets.
            </p>
            <span className="font-mono text-[11px] text-[var(--wsp-green)] block pt-2 border-t border-border/50">
              Core Question: Can general reasoning synthesize weights?
            </span>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-3 shadow-xs">
            <div className="flex size-9 items-center justify-center rounded-xl border border-[var(--wsp-amber)]/40 bg-[color-mix(in_oklab,var(--wsp-amber)_12%,transparent)] font-mono text-xs font-bold text-[var(--wsp-amber)]">
              03
            </div>
            <h3 className="font-sans text-base font-bold text-foreground">
              LLMs as General Optimisers
            </h3>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              Reasoning models have successfully written code, debugged programs, formulated scientific hypotheses, and designed reinforcement learning reward functions (Eureka).
            </p>
            <span className="font-mono text-[11px] text-[var(--wsp-amber)] block pt-2 border-t border-border/50">
              Core Question: Can weights be treated as code?
            </span>
          </div>
        </div>

        {/* Synthesis Callout Banner */}
        <div className="rounded-2xl border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_8%,transparent)] p-5 sm:p-6 space-y-2">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-[var(--wsp-chrome)]" />
            <h4 className="font-sans text-sm font-bold text-foreground">
              The 2 November 2026 Convergence
            </h4>
          </div>
          <p className="font-serif text-xs sm:text-sm leading-relaxed text-foreground">
            On 2 November 2026, Takehi, Teoh, Zhang, and Khattab (MIT CSAIL) demonstrated that these three questions converge: a general-purpose reasoning model (equipped with a Python interpreter for scale) can inspect raw parameter matrices, diagnose algorithmic failure modes, compute low-rank corrections, and synthesize working policy weights from scratch without backpropagation.
          </p>
        </div>
      </section>

      {/* ========================================================
          P2: THE FIRST EXPERIMENT IN SLOW MOTION & INTERACTIVE LAB
          ======================================================== */}
      <section id="fingerprints" className="space-y-8 border-t border-border/70 pt-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] uppercase tracking-wider">
              P2 · Experiment 1 in Slow Motion
            </span>
            <BadgeChip b="paper" />
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            How an LLM Identified Four Games from Raw Numbers
          </h2>
          <p className="font-serif text-base text-muted-foreground max-w-3xl leading-relaxed">
            Four policies trained with PPO on grid versions of Breakout, Pong, Pac-Man, and Freeway shared identical wiring: 500 inputs → 32 hidden → 32 hidden → 5 actions (17,253 parameters). The weights alone differed.
          </p>
        </div>

        {/* Real Weights Breakdown Table */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-bold text-foreground">
              Empirical Weight Fingerprints (Recomputed from Released GitHub Prompts)
            </h3>
            <span className="font-mono text-[11px] text-muted-foreground">
              L2 Norm Across 32 First-Layer Units
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs">
              <thead>
                <tr className="border-b border-border/70 text-muted-foreground font-mono text-[10px] uppercase">
                  <th className="pb-2">Game</th>
                  <th className="pb-2">Primary Row Peak</th>
                  <th className="pb-2">Primary Col Peak</th>
                  <th className="pb-2">Spatial Architecture Signature</th>
                  <th className="pb-2">What the LLM Inferred</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50 font-mono text-xs">
                <tr>
                  <td className="py-2.5 font-bold text-foreground">Breakout</td>
                  <td className="py-2.5 text-[var(--wsp-amber)] font-bold">Row 8 (57.7%)</td>
                  <td className="py-2.5 text-muted-foreground">Col 8 (17.0%)</td>
                  <td className="py-2.5 font-serif text-foreground/90">Horizontal bottom-row strip</td>
                  <td className="py-2.5 font-serif text-muted-foreground">Paddle constrained to horizontal boundary</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-foreground">Pong</td>
                  <td className="py-2.5 text-muted-foreground">Row 2 (14.0%)</td>
                  <td className="py-2.5 text-[var(--wsp-amber)] font-bold">Col 1 (54.9%)</td>
                  <td className="py-2.5 font-serif text-foreground/90">Vertical left-column strip</td>
                  <td className="py-2.5 font-serif text-muted-foreground">Paddle constrained to vertical edge</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-foreground">Pac-Man</td>
                  <td className="py-2.5 text-muted-foreground">Row 8 (15.7%)</td>
                  <td className="py-2.5 text-muted-foreground">Col 1 (15.9%)</td>
                  <td className="py-2.5 font-serif text-foreground/90">Uniformly dispersed (&lt;16%)</td>
                  <td className="py-2.5 font-serif text-muted-foreground">Free 2D maze exploration</td>
                </tr>
                <tr>
                  <td className="py-2.5 font-bold text-foreground">Freeway</td>
                  <td className="py-2.5 text-muted-foreground">Row 6 (20.1%)</td>
                  <td className="py-2.5 text-[var(--wsp-amber)] font-bold">Col 4 (22.2%)</td>
                  <td className="py-2.5 font-serif text-foreground/90">Central corridor band</td>
                  <td className="py-2.5 font-serif text-muted-foreground">Linear multi-lane traffic crossing</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Live In-Browser Fingerprint Lab */}
        <div className="space-y-4">
          <FingerprintLab />
        </div>
      </section>

      {/* ========================================================
          P3: FROM ONE EXPERIMENT TO EIGHT: THE LADDER
          ======================================================== */}
      <section id="ladder" className="space-y-8 border-t border-border/70 pt-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] uppercase tracking-wider">
              P3 · The Narrative Spine
            </span>
            <BadgeChip b="review" />
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            From One Experiment to Eight: The Ladder
          </h2>
          <p className="font-serif text-base text-muted-foreground max-w-3xl leading-relaxed">
            Each experiment answers the exact limitation of the one before it. Read in sequence, the CSAIL monograph constitutes a cumulative argument rather than isolated demonstrations.
          </p>
        </div>

        {/* Ladder Steps Cards */}
        <div className="space-y-3">
          {LADDER_STEPS.map((step, idx) => (
            <div
              key={step.step}
              className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 transition-all hover:border-foreground/30 shadow-2xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg border border-border/80 bg-accent/60 text-foreground">
                    Step {step.step}
                  </span>
                  <div>
                    <span className="font-sans text-xs font-bold text-foreground block">
                      {step.from} → {step.to}
                    </span>
                    <span className="font-serif text-xs text-muted-foreground">
                      <strong>Limitation Addressed:</strong> {step.question}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:text-right">
                  <div>
                    <span className="block font-mono text-[11px] text-foreground font-semibold">
                      {step.whatChanged}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground">
                      Cost: {step.pricePaid}
                    </span>
                  </div>
                  <span className="font-mono text-[10px] px-2 py-0.5 rounded-full border border-border/80 bg-card shrink-0">
                    {step.verdict}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          P4: WEEK-ONE REACTIONS & CRITIQUES
          ======================================================== */}
      <section id="week-one" className="space-y-8 border-t border-border/70 pt-12">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] uppercase tracking-wider">
              P4 · Scientific Discourse
            </span>
            <BadgeChip b="review" />
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Week One: Reactions, Replications, and Critiques
          </h2>
          <p className="font-serif text-base text-muted-foreground max-w-3xl leading-relaxed">
            Within seven days of publication, the paper was replicated on laptop hardware, subjected to rigorous mechanistic critique, and sorted into measured facts versus exploratory demonstrations.
          </p>
        </div>

        {/* Chronological Table */}
        <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
            <div>
              <h3 className="font-sans text-sm font-bold text-foreground">
                Living Chronology: 2 Nov 2026 → Present
              </h3>
              <p className="font-serif text-xs text-muted-foreground mt-0.5">
                Every primary release, independent replication, critique, and audit milestone in chronological order.
              </p>
            </div>
            <span className="font-mono text-[10px] text-muted-foreground shrink-0">
              Verified 8 Nov 2026
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-border/70 text-muted-foreground font-mono text-[10px] uppercase tracking-wider">
                  <th scope="col" className="py-2.5 pr-4 font-bold whitespace-nowrap min-w-[100px]">Date</th>
                  <th scope="col" className="py-2.5 px-3 font-bold whitespace-nowrap min-w-[155px]">Evidence Tier</th>
                  <th scope="col" className="py-2.5 px-3 font-bold whitespace-nowrap min-w-[170px]">Source / Voice</th>
                  <th scope="col" className="py-2.5 px-3 font-bold min-w-[340px]">Empirical Event &amp; Finding</th>
                  <th scope="col" className="py-2.5 pl-3 text-right font-bold whitespace-nowrap min-w-[80px]">Artifact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {WEEK_ONE_LOG.map((item, idx) => (
                  <tr key={idx} className="hover:bg-accent/25 transition-colors">
                    <td className="py-3.5 pr-4 align-top font-mono text-xs font-bold text-foreground whitespace-nowrap">
                      {item.date}
                    </td>
                    <td className="py-3.5 px-3 align-top whitespace-nowrap">
                      <BadgeChip b={item.badge} />
                    </td>
                    <td className="py-3.5 px-3 align-top font-sans text-xs font-semibold text-foreground whitespace-nowrap">
                      {item.source}
                    </td>
                    <td className="py-3.5 px-3 align-top font-serif text-xs text-muted-foreground leading-relaxed">
                      {item.summary}
                    </td>
                    <td className="py-3.5 pl-3 align-top text-right whitespace-nowrap">
                      {item.link ? (
                        <a
                          href={item.link}
                          target={item.link.startsWith("http") ? "_blank" : undefined}
                          rel={item.link.startsWith("http") ? "noopener noreferrer" : undefined}
                          className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[var(--wsp-chrome)] hover:underline"
                        >
                          <span>Inspect</span>
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <span className="font-mono text-[11px] text-muted-foreground/50">-</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Three Viewpoints Summary */}
        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">
              Narrower Than Framing
            </h4>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              <strong>Honnibal &amp; Willison:</strong> The post blurs two separate questions: reading raw float arrays without tools is surprising, but tool-assisted parameter updates with a Python interpreter resemble known automated interpretability pipelines.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">
              Impressive Trick, Wrong Tool
            </h4>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              <strong>Sean Goedecke:</strong> Comparing weight generation to emitting raw assembly: a striking demonstration of LLM capability, but standard gradient training remains far more scalable and reliable for broad model updates.
            </p>
          </div>

          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-2">
            <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">
              Empirical &amp; Checkable
            </h4>
            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              <strong>Maier &amp; Authors:</strong> Because all prompt logs and checkpoints are public, the field can build standard benchmarks with mandatory baselines (WSP-Bench-Lite) to test real generalization.
            </p>
          </div>
        </div>
      </section>

      {/* Navigation Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border/70 pt-8">
        <Link
          href="/"
          className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Return to Field Guide Homepage
        </Link>
        <Link
          href="/read/1-pile-of-numbers"
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-foreground text-background px-6 font-sans text-xs font-bold transition-all hover:opacity-90 shadow-2xs"
        >
          <span>Continue to Chapter 1: A Network is a Pile of Numbers</span>
          <ArrowRight className="size-4" />
        </Link>
      </div>
    </div>
  );
}

