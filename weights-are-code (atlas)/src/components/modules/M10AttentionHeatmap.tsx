"use client";

import { useState } from "react";
import ModuleChrome from "./ModuleChrome";

const N = 8;
const SEQ = ["B", "A", "B", "C", "A", "B", "D", "E"];

export default function M10AttentionHeatmap() {
  const [stage, setStage] = useState(0);
  const [hover, setHover] = useState<string | null>(null);

  const canAttend = (q: number, k: number) => k <= q;
  const isInduction = (q: number, k: number) => SEQ[q] === "B" && SEQ[k] === "A" && k === q - 1;

  return (
    <ModuleChrome
      id="m10-attention"
      badge="schematic"
      title="M10 · Why Heads Look Back"
      blurb="the lower-triangular mask, and the diagonal a copier lives on"
      transport
      playing={false}
      progress={stage / 2}
      onPlayPause={() => setStage((s) => (s + 1) % 3)}
      onStep={(d) => setStage((s) => Math.max(0, Math.min(2, s + d)))}
      onReset={() => setStage(0)}
      caption={
        [
          "Every cell is “can token-in-row attend to token-in-column?” Causal masking: only the past is visible.",
          "Now the sequence is B·A·B - the diagonal [B₃ → A₂] lights up: the just-seen B asks about the A before it…",
          "…and copies what followed that earlier B. That one-step-back diagonal is the induction-head signature the reader found in Exp 3.",
        ][stage]
      }
      levelCaptions={{
        1: "Each word in a sentence can only look at words before it - never ahead. A copier looks exactly one step back, finds a rhyme, and repeats the pattern.",
        2: "Attention is a grid: rows ask, columns answer. The dark triangle is the “can’t see the future” rule. The marked diagonal is where copying heads hunt.",
        3: "Attn = softmax(QKᵀ/√d + M) with M the strict lower-triangular mask. Induction: layer-1 head moves [B] to position of [A]; layer-2 head attends [B₃]→[A₂] and outputs the token after the previous B.",
        4: "The mask is why “which heads copy” is readable from weights: the causal structure fixes candidate circuits to in-series compositions (see formula f-induction) - no forward pass needed to shortlist.",
        5: "Exp 3 banned running the model; the reader matched ground-truth copying heads exactly. But language ID - diffuse, distributed - came in at ~0.5 confidence. Readability tracks compositionality of the circuit, not model size.",
      }}
      note="TEACHING SCHEMATIC - invented 8-token sequence to make the mask and the diagonal visible."
    >
      <div className="grid gap-5 md:grid-cols-[auto_1fr] md:items-center">
        <svg viewBox="0 0 360 320" className="mx-auto w-full max-w-[360px] rounded-xl border bg-card" role="img" aria-label="Lower-triangular attention mask over an 8-token sequence; an induction diagonal is highlighted at stage 3">
          {Array.from({ length: N }, (_, q) =>
            Array.from({ length: N }, (_, k) => {
              const x = 56 + k * 36;
              const y = 56 + q * 36;
              const allowed = canAttend(q, k);
              const ind = stage >= 2 && isInduction(q, k);
              const fill = ind
                ? "var(--wsp-chrome)"
                : !allowed
                  ? "transparent"
                  : stage === 0
                    ? "color-mix(in oklab, var(--wsp-blue) 40%, transparent)"
                    : `color-mix(in oklab, var(--wsp-blue) ${18 + (q - k) * 14}%, transparent)`;
              return (
                <rect
                  key={`${q}-${k}`}
                  x={x}
                  y={y}
                  width="30"
                  height="30"
                  rx="4"
                  fill={fill}
                  stroke={allowed ? "var(--border)" : "var(--border)"}
                  strokeWidth={ind ? 2.5 : 1}
                  strokeDasharray={allowed ? "0" : "3 3"}
                  onMouseEnter={() => setHover(`${SEQ[q]} (pos ${q + 1}) ${allowed ? `→ ${SEQ[k]} (pos ${k + 1})` : "✗ future"}`)}
                  onMouseLeave={() => setHover(null)}
                />
              );
            })
          )}
          {SEQ.map((s, i) => (
            <g key={i}>
              <text x={71 + i * 36} y="44" textAnchor="middle" fontSize="12" className="mono" fill="var(--muted-foreground)">
                {s}
              </text>
              <text x="44" y={75 + i * 36} textAnchor="end" fontSize="12" className="mono" fill="var(--muted-foreground)">
                {s}
              </text>
            </g>
          ))}
          {stage >= 2 && (
            <line x1={56 + 1 * 36 + 4} y1={56 + 2 * 36 + 34} x2={56 + 6 * 36 + 4} y2={56 + 7 * 36 - 34} stroke="var(--wsp-chrome)" strokeWidth="1.5" strokeDasharray="5 4" opacity="0.6" />
          )}
          <text x="14" y="200" fontSize="11" className="mono" fill="var(--muted-foreground)" transform="rotate(-90 14 200)">
            queries (look back)
          </text>
          <text x="60" y="310" fontSize="11" className="mono" fill="var(--muted-foreground)">
            keys (can be seen)
          </text>
        </svg>
        <div className="space-y-3 font-sans text-sm leading-relaxed">
          <p className="mono text-xs text-muted-foreground">{hover ?? "hover a cell to decode it"}</p>
          <p>
            A transformer head can only attend <strong>backwards</strong>. The dark upper-right triangle is the
            future - forever invisible. This one rule is what makes circuits like “copiers” structurally
            findable in the weights.
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
            <li>The sequence contains B·A·B early - a repeated bigram.</li>
            <li>The last B looks one step back at A…</li>
            <li>…and a two-head chain copies whatever followed the earlier B. That is in-context learning, seen as geometry.</li>
          </ol>
        </div>
      </div>
    </ModuleChrome>
  );
}
