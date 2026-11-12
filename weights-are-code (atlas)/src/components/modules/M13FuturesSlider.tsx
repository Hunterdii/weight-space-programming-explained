"use client";

import { useState, useMemo } from "react";
import ModuleChrome from "./ModuleChrome";
import { PREDICTIONS, HORIZON } from "@/content/facts";
import {
  Calendar,
  Layers,
  ShieldAlert,
  Cpu,
  CheckCircle2,
  Clock,
  Ban,
  ArrowRight,
  Info,
  HelpCircle,
  Sparkles,
} from "lucide-react";

interface Milestone {
  id: string;
  t: string;
  w: number;
  track: "ecosystem" | "steering" | "frontier";
  needsGeneral: boolean;
  predId?: string;
  summary: string;
  mechanism: string;
  falsifier: string;
}

const FUTURES: Milestone[] = [
  {
    id: "bench",
    t: "Benchmark + harness released",
    w: 2026.5,
    track: "ecosystem",
    needsGeneral: false,
    summary: "Standardized evaluation suite with author-blind tasks, multiple seeds, and baseline controls.",
    mechanism: "WSP-Bench-Lite or third-party harness testing Read, Fix, and Write modalities under controlled token and compute constraints.",
    falsifier: "No public author-blind benchmark by mid-2027 stalls empirical verification across the entire field.",
  },
  {
    id: "repl",
    t: "Replications on other LLMs",
    w: 2027.0,
    track: "ecosystem",
    needsGeneral: false,
    summary: "Independent verification of weight-reading and editing on open-weight architectures (LLaMA-3.1, Mistral, Gemma).",
    mechanism: "Reasoning models other than GPT-6 Astra (such as Claude 3.7 or open reasoning models) inspect and surgically edit transformer weights.",
    falsifier: "Replication failures on open models prove the effect was an idiosyncratic artifact of a single frontier reasoning model.",
  },
  {
    id: "patches",
    t: "Weight-diff patches shared like PRs",
    w: 2027.5,
    track: "ecosystem",
    needsGeneral: false,
    summary: "Small surgical weight-delta files (~1MB) distributed as signed patches against canonical model checkpoints.",
    mechanism: "Cryptographically signed sparse parameter deltas applied directly to Hugging Face or vLLM weight caches without full 16GB checkpoint downloads.",
    falsifier: "Patch ecosystems fail to emerge if provenance and automated regression testing tools cannot guarantee zero collateral damage.",
  },
  {
    id: "unlearn",
    t: "Zero-data unlearning trials",
    w: 2028.0,
    track: "steering",
    needsGeneral: false,
    predId: "zero-data",
    summary: "Removing hazardous or copyrighted capabilities by projecting out targeted directional vectors without data or training.",
    mechanism: "Closed-form projection W' = (I - uuᵀ)W on identified task subspaces, analogous to the Exp-8 math surgery.",
    falsifier: "Safety evaluations reveal high collateral capability regression across unrelated benchmark domains.",
  },
  {
    id: "interp",
    t: "LLM as circuit auditor",
    w: 2029.0,
    track: "steering",
    needsGeneral: false,
    summary: "Automated mechanistic interpretability: LLMs scan parameter matrices to localize backdoors, induction heads, and policy bugs.",
    mechanism: "Heuristic and symbolic pattern matchers reading attention matrices and MLP projections to compile high-level circuit diagrams.",
    falsifier: "Auditors produce unacceptable false-positive rates on ground-truth synthetic backdoor suites.",
  },
  {
    id: "init",
    t: "One-shot initialisation for small nets",
    w: 2029.5,
    track: "frontier",
    needsGeneral: true,
    predId: "cheap-opt",
    summary: "Pre-computing functional policy and transformer weights from natural language specifications to bypass cold-start training.",
    mechanism: "Direct tensor synthesis conditioned on problem topology, collapsing SGD optimization steps from millions to zero.",
    falsifier: "Hand-compiled weights cannot outperform random initialisation followed by standard short warmup schedules.",
  },
  {
    id: "audit",
    t: "Evaluation-free auditing",
    w: 2030.0,
    track: "steering",
    needsGeneral: true,
    predId: "audit",
    summary: "Certifying model safety invariants and compliance from static weight tensors alone, without dynamic test runs.",
    mechanism: "Formal weight-space static analysis proving absence of trigger circuits or prohibited behavior pathways.",
    falsifier: "Theoretical undecidability proofs show runtime behavioral bounds cannot be formally decided from parameter matrices alone.",
  },
  {
    id: "graft",
    t: "Cross-architecture grafting",
    w: 2031.0,
    track: "frontier",
    needsGeneral: true,
    predId: "merge",
    summary: "Transplanting functional computational circuits between disparate architectures (e.g. from a Dense Transformer to an MoE or RNN).",
    mechanism: "Coordinate transformation matrices that map activation spaces and weight symmetries across divergent model topologies.",
    falsifier: "Incompatible latent coordinate spaces and representation drift permanently degrade host model coherence.",
  },
  {
    id: "agents",
    t: "WSP agents in training pipelines",
    w: 2032.0,
    track: "frontier",
    needsGeneral: true,
    summary: "Autonomous supervisor agents inspecting checkpoints and executing surgical weight modifications during training runs.",
    mechanism: "Hybrid gradient-reasoning training where optimizers handle coarse learning while WSP agents eliminate pathological attractors.",
    falsifier: "Destructive interference between optimizer momentum buffers and discrete weight-space surgeries causes loss spikes.",
  },
  {
    id: "successors",
    t: "Models program their successors",
    w: 2033.0,
    track: "frontier",
    needsGeneral: true,
    predId: "rsi",
    summary: "Frontier models authoring the architectures, initial weight distributions, and surgical patches for next-generation systems.",
    mechanism: "Closed-loop recursive engineering where model designers act as supervisors over automated weight-generation harnesses.",
    falsifier: "Compounding errors and lack of un-modeled external truth lead to rapid capability degeneration across iterations.",
  },
  {
    id: "src",
    t: "Weights as reviewable source code",
    w: 2035.0,
    track: "frontier",
    needsGeneral: true,
    summary: "Neural network weights managed with git-like version control, unit tests, linters, and human-readable semantic diffs.",
    mechanism: "Decompilation of high-dimensional parameter tensors into symbolic functional modules with formal verification proofs.",
    falsifier: "Irreducible parameter polysemanticity and distributed entanglement prevent modular human comprehension.",
  },
];

const TRACKS = [
  { id: "all", label: "All Tracks", color: "var(--foreground)" },
  { id: "ecosystem", label: "Ecosystem & Tooling", color: "var(--wsp-blue)", icon: Layers },
  { id: "steering", label: "Steering & Auditing", color: "var(--wsp-amber)", icon: ShieldAlert },
  { id: "frontier", label: "Autonomous Frontier", color: "var(--wsp-red)", icon: Cpu },
] as const;

export default function M13FuturesSlider() {
  const [year, setYear] = useState<number>(2028);
  const [generalises, setGeneralises] = useState<boolean>(true);
  const [selectedTrack, setSelectedTrack] = useState<string>("all");
  const [activeMilestoneId, setActiveMilestoneId] = useState<string>("unlearn");

  const currentMilestone = useMemo(() => {
    return FUTURES.find((f) => f.id === activeMilestoneId) || FUTURES[0];
  }, [activeMilestoneId]);

  const filteredFutures = useMemo(() => {
    if (selectedTrack === "all") return FUTURES;
    return FUTURES.filter((f) => f.track === selectedTrack);
  }, [selectedTrack]);

  const activeCount = useMemo(() => {
    return FUTURES.filter((f) => f.w <= year && (generalises || !f.needsGeneral)).length;
  }, [year, generalises]);

  const blockedCount = useMemo(() => {
    return FUTURES.filter((f) => f.w <= year && !generalises && f.needsGeneral).length;
  }, [year, generalises]);

  return (
    <ModuleChrome
      id="m13-futures"
      badge="speculation"
      title="M13 · The Futures Slider"
      blurb="scrub 2026 → 2035 and inspect how the cross-model generalization hinge changes the horizon"
      caption={`Timeline: Year ${Math.floor(year)}. ${
        generalises
          ? "Generalization Active: Universal weight-reading allows all research tracks to unfold."
          : "Pessimistic Scenario: Weight-reading is frontier-only; cross-architecture and autonomous futures are blocked."
      } (🟥 Speculation - all milestones carry testable empirical falsifiers).`}
      levelCaptions={{
        1: "A guided roadmap of the next ten years. Scrub the timeline to watch discoveries unlock. The switch answers the core question: does weight-reading belong to everyone, or only one frontier lab?",
        2: "Near-term items (benchmarks, replications, signed patches) are viable today. Far-future items (evaluation-free auditing, models programming successors) hinge on cross-model generalisation.",
        3: "The hinge variable is cross-model generalization: can an LLM read and edit across different tokenizers, depths, and parameter scales? Flip the toggle to observe the effect on the research roadmap.",
        4: "Track falsifiers per track: no benchmark by mid-2027 stalls the entire ecosystem; open replication failures immediately invalidate universal reading claims.",
        5: "Policy and governance note: 0.016% weight edits circumvent compute-threshold regulations. Focus on post-release weight attestation and capability-based evaluation over speculative RSI fears.",
      }}
      note="🟥 SPECULATION - Based on MIT CSAIL predictions and extended horizon mapping. Positions are qualitative and paired with empirical falsifiers."
    >
      <div className="w-full space-y-6">
        {/* Interactive Scrub & Parameter Control Header */}
        <div className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-xs backdrop-blur-sm space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-border/60 pb-4">
            {/* Year Slider */}
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="size-3.5 text-[var(--wsp-chrome)]" />
                  Chronological Scrubber: <strong className="text-foreground font-bold">{Math.floor(year)}</strong>
                </span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  Active Milestones: <strong className="text-[var(--wsp-green)]">{activeCount}</strong> of {FUTURES.length}
                  {blockedCount > 0 && <span className="text-[var(--wsp-red)] ml-1">({blockedCount} blocked)</span>}
                </span>
              </div>
              <input
                type="range"
                min={2026}
                max={2035}
                step={0.5}
                value={year}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setYear(val);
                  // Auto-select nearest milestone
                  const nearest = FUTURES.reduce((prev, curr) =>
                    Math.abs(curr.w - val) < Math.abs(prev.w - val) ? curr : prev
                  );
                  setActiveMilestoneId(nearest.id);
                }}
                className="wsp-slider w-full cursor-pointer"
                aria-label="Timeline Year Slider"
              />
              <div className="flex justify-between font-mono text-[10px] text-muted-foreground px-0.5">
                <span>2026 (Now)</span>
                <span>2028 (Unlearning)</span>
                <span>2030 (Auditing)</span>
                <span>2032 (Agents)</span>
                <span>2035 (Code)</span>
              </div>
            </div>

            {/* Generalization Hinge Toggle */}
            <div className="lg:border-l lg:border-border/60 lg:pl-5 flex flex-col justify-center">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1 block">
                The Hinge Variable:
              </span>
              <button
                onClick={() => setGeneralises((g) => !g)}
                aria-pressed={generalises}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 text-xs font-sans font-bold transition-all ${
                  generalises
                    ? "border-[var(--wsp-green)] bg-[color-mix(in_oklab,var(--wsp-green)_14%,transparent)] text-foreground shadow-xs"
                    : "border-[var(--wsp-red)] bg-[color-mix(in_oklab,var(--wsp-red)_14%,transparent)] text-foreground shadow-xs"
                }`}
              >
                <span
                  className="size-2 rounded-full animate-pulse"
                  style={{ background: generalises ? "var(--wsp-green)" : "var(--wsp-red)" }}
                />
                <span>Reading Generalises?</span>
                <span
                  className="rounded-md px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wider font-extrabold"
                  style={{
                    background: generalises ? "var(--wsp-green)" : "var(--wsp-red)",
                    color: "#090c12",
                  }}
                >
                  {generalises ? "YES · UNIVERSAL" : "NO · FRONTIER ONLY"}
                </span>
              </button>
            </div>
          </div>

          {/* Quick-Jump Milestone Filters */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="font-mono text-[10px] uppercase text-muted-foreground mr-1">Track Filter:</span>
              {TRACKS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTrack(t.id)}
                  className={`rounded-lg px-2.5 py-1 font-sans text-xs font-semibold transition-all ${
                    selectedTrack === t.id
                      ? "bg-accent text-foreground border border-border shadow-2xs font-bold"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/80"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1.5">
              {[2026.5, 2028, 2030, 2033, 2035].map((y) => (
                <button
                  key={y}
                  onClick={() => {
                    setYear(y);
                    const nearest = FUTURES.reduce((prev, curr) =>
                      Math.abs(curr.w - y) < Math.abs(prev.w - y) ? curr : prev
                    );
                    setActiveMilestoneId(nearest.id);
                  }}
                  className={`rounded-md border border-border/60 px-2 py-0.5 font-mono text-[10px] transition-colors ${
                    Math.floor(year) === Math.floor(y)
                      ? "bg-[var(--wsp-chrome)] text-[#090c12] font-bold"
                      : "bg-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {y === 2026.5 ? "2026" : y}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chronological Milestone Explorer Grid (Zero Overlaps!) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredFutures.map((f) => {
            const isReached = f.w <= year;
            const isBlocked = !generalises && f.needsGeneral;
            const isSelected = activeMilestoneId === f.id;

            let statusBadge = {
              text: "UPCOMING",
              className: "bg-muted text-muted-foreground border-border/60",
              icon: Clock,
            };

            if (isReached && !isBlocked) {
              statusBadge = {
                text: "REACHED",
                className: "bg-[color-mix(in_oklab,var(--wsp-green)_18%,transparent)] text-[var(--wsp-green)] border-[var(--wsp-green)]/40 font-bold",
                icon: CheckCircle2,
              };
            } else if (isReached && isBlocked) {
              statusBadge = {
                text: "BLOCKED",
                className: "bg-[color-mix(in_oklab,var(--wsp-red)_18%,transparent)] text-[var(--wsp-red)] border-[var(--wsp-red)]/40 font-bold",
                icon: Ban,
              };
            }

            const StatusIcon = statusBadge.icon;

            return (
              <div
                key={f.id}
                onClick={() => {
                  setActiveMilestoneId(f.id);
                  if (f.w > year) setYear(f.w);
                }}
                className={`group relative flex flex-col justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                  isSelected
                    ? "border-[var(--wsp-chrome)] bg-[color-mix(in_oklab,var(--wsp-chrome)_6%,var(--card))] shadow-sm ring-1 ring-[var(--wsp-chrome)]/40"
                    : "border-border/70 bg-card/60 hover:bg-card hover:border-border"
                } ${isBlocked ? "opacity-60" : "opacity-100"}`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] flex items-center gap-1">
                      <span className="size-1.5 rounded-full bg-[var(--wsp-chrome)]" />
                      {f.w}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-mono text-[9px] tracking-wider uppercase ${statusBadge.className}`}
                    >
                      <StatusIcon className="size-2.5" />
                      {statusBadge.text}
                    </span>
                  </div>

                  <h4
                    className={`font-sans text-sm font-bold leading-snug ${
                      isBlocked ? "line-through text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {f.t}
                  </h4>

                  <p className="mt-1.5 font-serif text-xs leading-relaxed text-muted-foreground line-clamp-2">
                    {f.summary}
                  </p>
                </div>

                <div className="mt-3.5 pt-2.5 border-t border-border/50 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                  <span className="capitalize">{f.track}</span>
                  <span className="text-[var(--wsp-chrome)] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    Inspect <ArrowRight className="size-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Milestone Spotlight Deep-Dive Card */}
        {currentMilestone && (
          <div className="rounded-2xl border border-[var(--wsp-chrome)]/60 bg-[color-mix(in_oklab,var(--wsp-chrome)_5%,var(--card))] p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)]">
                    Target Horizon: ~{currentMilestone.w}
                  </span>
                  <span className="font-mono text-xs uppercase px-2 py-0.5 rounded-full border border-border/70 bg-card text-muted-foreground">
                    Track: {currentMilestone.track}
                  </span>
                  {currentMilestone.needsGeneral && (
                    <span className="font-mono text-[10px] text-amber-500 font-semibold">
                      (Requires Universal Generalization)
                    </span>
                  )}
                </div>
                <h3 className="font-sans text-lg sm:text-xl font-black text-foreground">
                  {currentMilestone.t}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                {currentMilestone.w <= year && (!currentMilestone.needsGeneral || generalises) ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--wsp-green)]/40 bg-[color-mix(in_oklab,var(--wsp-green)_14%,transparent)] px-3 py-1 font-mono text-xs font-bold text-[var(--wsp-green)]">
                    <CheckCircle2 className="size-3.5" /> Reached in {Math.floor(year)}
                  </span>
                ) : currentMilestone.w <= year && currentMilestone.needsGeneral && !generalises ? (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--wsp-red)]/40 bg-[color-mix(in_oklab,var(--wsp-red)_14%,transparent)] px-3 py-1 font-mono text-xs font-bold text-[var(--wsp-red)]">
                    <Ban className="size-3.5" /> Blocked by Generalization Failure
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/70 bg-card px-3 py-1 font-mono text-xs text-muted-foreground">
                    <Clock className="size-3.5" /> Unlocks in {currentMilestone.w}
                  </span>
                )}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-card/60 p-4 space-y-1.5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--wsp-blue)] flex items-center gap-1.5">
                  <Sparkles className="size-3.5" />
                  Technical Implementation Mechanism
                </p>
                <p className="font-serif text-xs leading-relaxed text-foreground/90">
                  {currentMilestone.mechanism}
                </p>
              </div>

              <div className="rounded-xl border border-border/60 bg-card/60 p-4 space-y-1.5">
                <p className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--wsp-red)] flex items-center gap-1.5">
                  <ShieldAlert className="size-3.5" />
                  Empirical Falsifier (What Would Prove It Wrong)
                </p>
                <p className="font-serif text-xs leading-relaxed text-foreground/90">
                  {currentMilestone.falsifier}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* The Authors' Predictions vs Falsifiers Grounding Cards */}
        <div className="grid gap-5 md:grid-cols-2">
          {/* Card 1: Five Predictions */}
          <div className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <span className="size-2 rounded-full bg-[var(--wsp-red)]" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                The Authors’ Five Predictions (🟥 Speculation)
              </h4>
            </div>
            <ul className="space-y-2.5 font-serif text-xs leading-relaxed text-foreground/90">
              {PREDICTIONS.map((p) => (
                <li
                  key={p.id}
                  onClick={() => {
                    const match = FUTURES.find((f) => f.predId === p.id);
                    if (match) {
                      setActiveMilestoneId(match.id);
                      if (match.w > year) setYear(match.w);
                    }
                  }}
                  className="rounded-lg p-2 transition-colors hover:bg-accent/60 cursor-pointer border border-transparent hover:border-border/60"
                >
                  <strong className="text-foreground font-bold font-sans block mb-0.5">
                    {p.title}
                  </strong>
                  <span className="text-muted-foreground">{p.text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Card 2: Falsifiers */}
          <div className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-xs space-y-3">
            <div className="flex items-center gap-2 border-b border-border/60 pb-3">
              <span className="size-2 rounded-full bg-[var(--wsp-green)]" />
              <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Empirical Grounding: What Falsifies The Map
              </h4>
            </div>
            <ul className="space-y-2.5 font-serif text-xs leading-relaxed text-muted-foreground">
              <li className="rounded-lg border border-border/40 bg-card/40 p-2.5">
                <strong className="text-foreground font-sans block mb-0.5">
                  1. Mid-2027 Benchmark Deadline:
                </strong>
                If no independent third-party author-blind benchmark ships by mid-2027, the entire ecosystem band stalls.
              </li>
              <li className="rounded-lg border border-border/40 bg-card/40 p-2.5">
                <strong className="text-foreground font-sans block mb-0.5">
                  2. Open Model Replication Failure:
                </strong>
                If weight-reading fails on LLaMA-3.1 or Mistral under identical prompting, universal generalization is disproven.
              </li>
              <li className="rounded-lg border border-border/40 bg-card/40 p-2.5">
                <strong className="text-foreground font-sans block mb-0.5">
                  3. Direction-Ablation Baseline Equivalence:
                </strong>
                If traditional activation steering matches every surgical fix result, WSP’s unique value narrows strictly to Write.
              </li>
            </ul>
          </div>
        </div>

        <p className="font-mono text-[11px] text-muted-foreground text-center">
          Horizon bands catalogued: {HORIZON.map((h) => h.window).join(" · ")}
        </p>
      </div>
    </ModuleChrome>
  );
}
