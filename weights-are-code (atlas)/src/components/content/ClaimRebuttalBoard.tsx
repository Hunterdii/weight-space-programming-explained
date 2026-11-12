"use client";

import { useState } from "react";
import { BadgeChip } from "@/components/content/Badge";
import { ShieldCheck, Scale, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";

interface ClaimItem {
  id: string;
  claim: string;
  category: string;
  authorEvidence: string;
  criticRebuttal: string;
  guideVerdict: string;
  badge: "paper" | "review" | "schematic" | "speculation";
}

const CLAIMS: ClaimItem[] = [
  {
    id: "raw-weights",
    category: "Inspection Fidelity",
    claim: "“The model reads raw neural network weights with zero tools.”",
    authorEvidence:
      "Experiments 1, 2, and 4 passed raw floating-point strings directly into prompt context. Astra identified all four Atari policies (Breakout 99%) and repaired the Kinetix ramp policy without tool calls.",
    criticRebuttal:
      "Matthew Honnibal noted that this only applies to small networks (17K–172K parameters). Every experiment with a real language model (Exp. 6 Go, Exp. 8 Qwen) utilized an interactive Python kernel.",
    guideVerdict:
      "True for small MLPs; false for large models. Tool-free reading and tool-assisted editing are structurally different tasks and must not be conflated.",
    badge: "review",
  },
  {
    id: "superhuman",
    category: "Cognitive Capability",
    claim: "“Weight-space programming is superhuman at writing networks.”",
    authorEvidence:
      "Synthesized a 1.48M parameter Go policy in 50 forward passes beating PPO trained on 20M games, and repaired Qwen3.5-0.8B with a 0.016% edit.",
    criticRebuttal:
      "Sean Goedecke argued this is analogous to emitting raw assembly: an impressive spatial trick, but standard gradient training remains far more scalable and reliable for general tasks.",
    guideVerdict:
      "Impressive symbolic compilation, but not superhuman. The compiled policies implement known heuristics (liberties, edge tracking) that human engineers routinely code.",
    badge: "review",
  },
  {
    id: "understanding",
    category: "Epistemic Status",
    claim: "“Astra genuinely understood the geometry of weight space.”",
    authorEvidence:
      "The model produced articulate reasoning traces explaining why specific MLP layers were chosen and how the weight projections would behave.",
    criticRebuttal:
      "Andreas Maier highlighted that reasoning traces are generative rationalizations, not verifiable introspection. Models frequently hallucinate explanations for updates that happen to work.",
    guideVerdict:
      "Unverified speculation. The scientific evidence rests exclusively on the measured ΔW and benchmark changes. Traces are data for study, never proof of understanding.",
    badge: "speculation",
  },
  {
    id: "magical-math",
    category: "Capability Acquisition",
    claim: "“The 0.016% edit magically gifted the model math ability.”",
    authorEvidence:
      "MATH-500 competition scores surged from 7.9% to 48.1%, and GSM8K climbed from 13.8% to 67.1% with only 131,072 parameters modified.",
    criticRebuttal:
      "The authors’ own negative control on Gemma 3 270M showed zero gain (6.8% → 7.0%). Token-limit hits dropped from 93% to 33.1%, confirming the edit merely broke an infinite thought loop.",
    guideVerdict:
      "Firmly established by negative control: the edit excised an architectural looping obstacle, revealing underlying pre-trained competence without adding new skills.",
    badge: "paper",
  },
];

export default function ClaimRebuttalBoard() {
  const [activeClaim, setActiveClaim] = useState<string>("raw-weights");
  const selected = CLAIMS.find((c) => c.id === activeClaim) || CLAIMS[0];

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Scale className="size-4 text-[var(--wsp-chrome)]" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Dialectical Audit Board
            </span>
          </div>
          <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Claim vs. Rebuttal Scorecard
          </h3>
          <p className="font-serif text-xs sm:text-sm text-muted-foreground max-w-[70ch]">
            Every public claim evaluated side-by-side: what the CSAIL authors demonstrated, what critics rebutted, and this monograph’s evidential verdict.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {CLAIMS.map((item) => {
          const active = activeClaim === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveClaim(item.id)}
              className={`rounded-xl border p-3 text-left transition-all ${
                active
                  ? "border-foreground bg-accent/60 shadow-2xs font-semibold"
                  : "border-border/70 bg-card/60 text-muted-foreground hover:bg-accent/30 hover:border-foreground/30"
              }`}
            >
              <span className="font-mono text-[10px] uppercase text-muted-foreground block mb-0.5">
                {item.category}
              </span>
              <span className="font-sans text-xs text-foreground line-clamp-1">
                {item.claim.replace(/“|”/g, "")}
              </span>
            </button>
          );
        })}
      </div>

      {/* Detail Card */}
      <div className="rounded-2xl border border-border/80 bg-background/50 p-5 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-3">
          <h4 className="font-sans text-base sm:text-lg font-bold text-foreground">
            {selected.claim}
          </h4>
          <BadgeChip b={selected.badge} />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Author Claim */}
          <div className="rounded-xl border border-[var(--wsp-blue)]/30 bg-[color-mix(in_oklab,var(--wsp-blue)_8%,transparent)] p-4 space-y-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--wsp-blue)] block">
              1. The Authors' Evidence (CSAIL Post)
            </span>
            <p className="font-serif text-xs leading-relaxed text-foreground">
              {selected.authorEvidence}
            </p>
          </div>

          {/* Critic Rebuttal */}
          <div className="rounded-xl border border-[var(--wsp-amber)]/30 bg-[color-mix(in_oklab,var(--wsp-amber)_8%,transparent)] p-4 space-y-2">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--wsp-amber)] block">
              2. The Critic's Counter-Perspective
            </span>
            <p className="font-serif text-xs leading-relaxed text-foreground">
              {selected.criticRebuttal}
            </p>
          </div>
        </div>

        {/* Monograph Verdict */}
        <div className="rounded-xl border border-[var(--wsp-green)]/40 bg-[color-mix(in_oklab,var(--wsp-green)_10%,transparent)] p-4 space-y-1.5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-[var(--wsp-green)]" />
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              Monograph Audit Verdict
            </span>
          </div>
          <p className="font-serif text-xs leading-relaxed text-foreground">
            {selected.guideVerdict}
          </p>
        </div>
      </div>
    </div>
  );
}

