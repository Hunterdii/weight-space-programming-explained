"use client";

import { useState } from "react";
import { Zap, CheckCircle2, RotateCcw, ArrowRight, Gauge, Sliders, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function SurgeryInteractivePreview() {
  const [alpha, setAlpha] = useState(1.0); // Projection coefficient [0, 1]
  const [activeTab, setActiveTab] = useState<"surgery" | "spectrum">("surgery");

  // Math-500 accuracy function based on Exp 8 empirical data
  // alpha=0 -> 7.9% (defective state)
  // alpha=1 -> 48.1% (surgically repaired state)
  const mathAccuracy = (7.9 + 40.2 * Math.min(1, alpha * 1.05)).toFixed(1);
  const runawayThinking = Math.max(33, Math.round(93 - 60 * alpha));
  const blastRadius = "131,072 / 800M";
  const sparsityPercent = "0.016%";

  return (
    <div className="w-full rounded-2xl border border-border/80 bg-card p-6 sm:p-8 shadow-xl transition-all duration-300">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-border/70">
        <div>
          <div className="inline-flex items-center gap-2 font-mono text-xs font-bold text-[var(--wsp-chrome)] uppercase tracking-wider mb-1.5">
            <span className="size-2 rounded-full bg-[var(--wsp-green)] animate-ping" />
            <span>Interactive Parameter Simulator · Exp 8</span>
          </div>
          <h3 className="font-sans text-2xl font-black text-foreground tracking-tight">
            Perform Rank-1 Surgery on Qwen-0.8B
          </h3>
          <p className="font-serif text-sm text-muted-foreground mt-1 max-w-[70ch]">
            Drag the surgery projection slider to adjust <code className="font-mono text-xs bg-muted px-1.5 py-0.5 rounded text-foreground">W&apos; = (I - α·uuᵀ)W</code> across 64 MLP columns in Layer 15 without running backpropagation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setAlpha(1.0)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              alpha === 1.0
                ? "bg-[var(--wsp-green)] text-slate-950 shadow-sm"
                : "border border-border/80 bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            Optimal Cut (α = 1.0)
          </button>
          <button
            onClick={() => setAlpha(0.0)}
            className={`px-3 py-1.5 rounded-xl font-mono text-xs font-bold transition-all ${
              alpha === 0.0
                ? "bg-[var(--wsp-red)] text-white shadow-sm"
                : "border border-border/80 bg-background text-muted-foreground hover:text-foreground"
            }`}
          >
            Defective (α = 0.0)
          </button>
          <button
            onClick={() => setAlpha(0.5)}
            className="p-1.5 rounded-xl border border-border/80 text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
            title="Half Cut (α = 0.5)"
          >
            <RotateCcw className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid gap-8 lg:grid-cols-12 pt-6 items-center">
        {/* Left Column (7 cols): Surgery Control & Metric Gauges */}
        <div className="lg:col-span-7 space-y-6">
          {/* Slider Control */}
          <div className="space-y-2.5 rounded-xl border border-border/70 bg-background/60 p-4">
            <div className="flex items-center justify-between font-mono text-xs">
              <span className="font-bold text-foreground flex items-center gap-1.5">
                <Sliders className="size-3.5 text-[var(--wsp-chrome)]" />
                Projection Coefficient α:
              </span>
              <span className="font-bold text-[var(--wsp-chrome)] text-sm tabular-nums">
                {alpha.toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.02"
              value={alpha}
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-[var(--wsp-chrome)]"
            />
            <div className="flex justify-between font-mono text-[10px] text-muted-foreground">
              <span>0.0 (Unpatched / Runaway Loop)</span>
              <span>0.5 (Partial Damping)</span>
              <span>1.0 (Full Singular Orthogonalization)</span>
            </div>
          </div>

          {/* Real-time Empirical Readouts */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 space-y-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">
                MATH-500 ACCURACY
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-[var(--wsp-green)] tabular-nums block">
                {mathAccuracy}%
              </span>
              <span className="font-sans text-[11px] text-muted-foreground block">
                {alpha >= 0.9 ? "+40.2% Gain" : alpha <= 0.1 ? "Baseline" : "Partial"}
              </span>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 space-y-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">
                RUNAWAY THINKING
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-[var(--wsp-red)] tabular-nums block">
                {runawayThinking}%
              </span>
              <span className="font-sans text-[11px] text-muted-foreground block">
                {alpha >= 0.9 ? "-60% Stalls" : "Infinite Repeat"}
              </span>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 space-y-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">
                EDIT SPARSITY s
              </span>
              <span className="font-mono text-xl sm:text-2xl font-black text-[var(--wsp-chrome)] tabular-nums block">
                {sparsityPercent}
              </span>
              <span className="font-sans text-[11px] text-muted-foreground block">
                1 Knob in 6,000
              </span>
            </div>

            <div className="rounded-xl border border-border/80 bg-background/80 p-3.5 space-y-1">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider block">
                PARAMETERS EDITED
              </span>
              <span className="font-mono text-sm sm:text-base font-black text-foreground tabular-nums block pt-1">
                {blastRadius}
              </span>
              <span className="font-sans text-[11px] text-muted-foreground block">
                Zero Retraining
              </span>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols): Live Matrix Heatmap Representation */}
        <div className="lg:col-span-5 rounded-xl border border-border/80 bg-background/80 p-4 space-y-3">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="font-bold text-foreground">Layer 15 MLP Matrix Columns (0..63)</span>
            <span className="text-[10px] text-muted-foreground">Orthogonal Cut</span>
          </div>

          {/* Matrix column blocks */}
          <div className="grid grid-cols-16 gap-1 p-2 rounded-lg bg-card border border-border/60">
            {Array.from({ length: 64 }).map((_, idx) => {
              // Columns 16 to 48 represent the core surgical region in Exp 8
              const isTargeted = idx >= 14 && idx <= 49;
              const opacity = isTargeted
                ? Math.max(0.2, 0.95 - alpha * 0.7)
                : 0.15;
              const bg = isTargeted
                ? alpha > 0.5
                  ? "var(--wsp-green)"
                  : "var(--wsp-red)"
                : "var(--wsp-chrome)";

              return (
                <div
                  key={idx}
                  className="aspect-square rounded-xs transition-all duration-300"
                  style={{
                    backgroundColor: bg,
                    opacity: opacity,
                  }}
                  title={`Column ${idx + 1}: ${isTargeted ? `Targeted (Damped by α=${alpha})` : "Untouched"}`}
                />
              );
            })}
          </div>

          <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground pt-1">
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-[var(--wsp-green)]" />
              <span>Excised Reasoning Stall</span>
            </span>
            <Link
              href="/read/5-fix"
              prefetch={false}
              className="inline-flex items-center gap-1 font-bold text-[var(--wsp-chrome)] hover:underline"
            >
              <span>Full Derivation</span>
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

