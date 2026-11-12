"use client";

import { useMemo, useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { mulberry32 } from "./utils";
import { useReading } from "@/state/store";

const N = 10;
/** Three invented channels: paddle row (bright row 8), ball (sparse bright cells), wall (edges). */
function makeChannel(kind: "paddle" | "ball" | "wall", seed: number): number[][] {
  const rng = mulberry32(seed);
  const g: number[][] = [];
  for (let r = 0; r < N; r++) {
    const row: number[] = [];
    for (let c = 0; c < N; c++) {
      let v = (rng() - 0.5) * 0.3;
      if (kind === "paddle" && r === 7) v = 0.55 + rng() * 0.35;
      if (kind === "ball" && ((r === 2 && c === 3) || (r === 4 && c === 6) || (r === 9 && c === 1)))
        v = 0.7 + rng() * 0.25;
      if (kind === "wall" && (c === 0 || r === 0)) v = 0.45 + rng() * 0.3;
      row.push(v);
    }
    g.push(row);
  }
  return g;
}
const CHANNELS = {
  paddle: { grid: makeChannel("paddle", 11), label: "Input channel 7 - a row of identical weights" },
  ball: { grid: makeChannel("ball", 23), label: "Input channel 12 - a few isolated bright cells" },
  wall: { grid: makeChannel("wall", 37), label: "Input channel 42 - bright along the edges" },
};
type ChKey = keyof typeof CHANNELS;

function cellColor(v: number): string {
  if (v >= 0) {
    const t = Math.min(1, v / 0.9);
    return `rgba(76,157,255,${0.06 + t * 0.94})`;
  }
  const t = Math.min(1, -v / 0.5);
  return `rgba(255,107,107,${0.05 + t * 0.6})`;
}

export default function M3ReadTheNumbers() {
  const [ch, setCh] = useState<ChKey>("paddle");
  const [stage, setStage] = useState(0); // 0 raw, 1 averages, 2 labelled
  const [hover, setHover] = useState<string | null>(null);
  const labels = useReading((s) => s.labels);

  const rowAvg = useMemo(() => {
    const g = CHANNELS[ch].grid;
    return g.map((row) => row.reduce((a, b) => a + b, 0) / row.length);
  }, [ch]);

  const pattern =
    ch === "paddle"
      ? "One row lights up: something reacts to a horizontal band of the screen - like a paddle."
      : ch === "ball"
        ? "A few isolated cells: something reacting to sparse dots - like a ball."
        : "Bright edges: something watching the borders - like walls.";

  return (
    <ModuleChrome
      id="m3-read-numbers"
      badge="schematic"
      title="M3 · Read the Numbers"
      blurb="stare at raw weights until a shape talks to you"
      transport
      progress={stage / 2}
      playing={false}
      onPlayPause={() => setStage((s) => (s + 1) % 3)}
      onStep={(d) => setStage((s) => Math.max(0, Math.min(2, s + d)))}
      onReset={() => setStage(0)}
      caption={
        [
          "Raw 10×10 grid of one input channel’s weights. Squint - do you see anything?",
          `Row averages appear (right sparkline). Row 7-ish is brightest: ${rowAvg.indexOf(Math.max(...rowAvg)) === 7 ? "confirmed" : "look for the peak"}.`,
          `Label it: ${pattern}`,
        ][stage]
      }
      levelCaptions={{
        1: "These are 100 dials of one machine. Some dials work together in a line - spot the line, and you can guess what the machine watches.",
        2: "Each cell is one weight from the first layer of a game-playing network. A bright row means “this row of pixels matters a lot”.",
        3: "First layer W ∈ ℝ^{32×500}: reshaping one column to 10×50 gives pixel-space receptive fields. This toy shows one channel at 10×10.",
        4: "Real Exp 1 grids were 10×10 with tanh activations - weights in roughly [-1,1], and the reader had NO forward passes to sanity-check patterns.",
        5: "Pattern-matching on heatmaps is exactly how human interpretability started (and where it fooled us). The review’s point: toy-readable layouts ≠ general weight reading.",
      }}
      note="ILLUSTRATIVE, NOT REAL DATA - invented grids inspired by Experiment 1. In the real experiment the model named all four games (🟦)."
    >
      <div className="grid gap-5 md:grid-cols-[auto_1fr]">
        <div className="mx-auto">
          <svg viewBox="0 0 340 340" className="w-full max-w-[340px] rounded-xl border bg-card" role="img" aria-label={`10 by 10 weight heatmap: ${CHANNELS[ch].label}`}>
            {CHANNELS[ch].grid.map((row, r) =>
              row.map((v, c) => {
                const isPeak = stage >= 2 && ch === "paddle" && r === 7;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={8 + c * 32}
                    y={8 + r * 32}
                    width="30"
                    height="30"
                    rx="4"
                    fill={cellColor(v)}
                    stroke={isPeak ? "var(--wsp-blue)" : "transparent"}
                    strokeWidth={isPeak ? 2 : 0}
                    onMouseEnter={() => setHover(`row ${r}, col ${c} → ${v.toFixed(2)}`)}
                    onMouseLeave={() => setHover(null)}
                  />
                );
              })
            )}
            {stage >= 2 && ch === "paddle" && (
              <rect x="4" y={8 + 7 * 32 - 4} width="308" height="38" fill="none" stroke="var(--wsp-blue)" strokeWidth="2" strokeDasharray="6 4" rx="8" />
            )}
          </svg>
          <p className="mono mt-1.5 h-5 text-center text-xs text-muted-foreground">{hover ?? CHANNELS[ch].label}</p>
        </div>
        <div>
          <div className="mb-4 flex flex-wrap gap-2" role="group" aria-label="Pick an input channel">
            {(Object.keys(CHANNELS) as ChKey[]).map((k) => (
              <button
                key={k}
                onClick={() => {
                  setCh(k);
                  setStage(0);
                }}
                aria-pressed={ch === k}
                className={`h-11 rounded-lg border px-4 font-sans text-sm capitalize ${
                  ch === k ? "border-[var(--wsp-chrome)] bg-[color-mix(in_oklab,var(--wsp-chrome)_15%,transparent)] font-semibold" : "bg-card text-muted-foreground"
                }`}
              >
                {k} channel
              </button>
            ))}
          </div>
          <p className="font-sans text-sm text-muted-foreground">
            Stage {stage + 1}/3 - {["raw weights", "row averages", "labelled pattern"][stage]}
          </p>
          {stage >= 1 && (
            <svg viewBox="0 0 320 130" className="mt-3 w-full max-w-[320px]" role="img" aria-label="Average weight per row sparkline">
              {rowAvg.map((v, r) => {
                const h = Math.max(2, (v + 0.2) * 80);
                return (
                  <g key={r}>
                    <rect x={12 + r * 30} y={110 - h} width="16" height={h} rx="3" fill={r === rowAvg.indexOf(Math.max(...rowAvg)) ? "var(--wsp-blue)" : "var(--border)"} />
                    {labels && (
                      <text x={20 + r * 30} y={122} fontSize="9" textAnchor="middle" className="mono" fill="var(--muted-foreground)">
                        {r}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          )}
          {stage >= 2 && (
            <div className="mt-3 rounded-lg border border-dashed border-[var(--wsp-blue)] p-3 font-sans text-sm">
              <span className="font-bold text-[var(--wsp-blue)]">Astra’s real call (🟦):</span> shown a grid like
              this from an actual Breakout policy, it named the game - at 99% confidence - without a single
              forward pass.
            </div>
          )}
        </div>
      </div>
    </ModuleChrome>
  );
}
