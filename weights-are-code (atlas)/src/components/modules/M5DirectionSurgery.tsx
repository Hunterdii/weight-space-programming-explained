"use client";

import { useEffect, useMemo, useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { mulberry32, useReducedMotion } from "./utils";

const D_FF = 64;

function buildW(dModel: number) {
  const rng = mulberry32(100 + dModel);
  const W: number[][] = [];
  for (let i = 0; i < dModel; i++) {
    const row: number[] = [];
    for (let j = 0; j < D_FF; j++) row.push(rng() * 2 - 1);
    W.push(row);
  }
  // embed a strong "loop direction": columns 20..24 all carry a shared direction
  const u0: number[] = [];
  for (let i = 0; i < dModel; i++) u0.push(rng() * 2 - 1);
  const nrm = Math.sqrt(u0.reduce((a, b) => a + b * b, 0));
  for (let j = 20; j < 25; j++) for (let i = 0; i < dModel; i++) W[i][j] += u0[i] / nrm * 3.2;
  return W;
}

export default function M5DirectionSurgery() {
  const [dModel, setDModel] = useState(16);
  const [k, setK] = useState(24);
  const [loopT, setLoopT] = useState(0);
  const [playing, setPlaying] = useState(true);
  const reduced = useReducedMotion();

  const model = useMemo(() => {
    const W = buildW(dModel);
    // u = the shared direction we want gone
    const rng = mulberry32(100 + dModel);
    const u: number[] = [];
    for (let i = 0; i < dModel; i++) u.push(rng() * 2 - 1);
    const nrm = Math.sqrt(u.reduce((a, b) => a + b * b, 0));
    const un = u.map((x) => x / nrm);
    // uᵀW per column
    const uW = Array.from({ length: D_FF }, (_, j) => un.reduce((a, ui, i) => a + ui * W[i][j], 0));
    const totalE = Math.sqrt(uW.reduce((a, b) => a + b * b, 0));
    const order = uW.map((v, j) => [j, Math.abs(v)] as const).sort((a, b) => b[1] - a[1]);
    const editedCols = new Set(order.slice(0, k).map(([j]) => j));
    const remE = Math.sqrt(uW.reduce((a, v, j) => a + (editedCols.has(j) ? 0 : v * v), 0)) / (totalE || 1);
    return { uW, editedCols, remE, totalE };
  }, [dModel, k]);

  const escaped = model.remE < 0.45;

  useEffect(() => {
    if (!playing || reduced) return;
    const id = setInterval(() => setLoopT((t) => t + 1), 40);
    return () => clearInterval(id);
  }, [playing, reduced]);

  const angle = loopT * (escaped ? 0.05 : 0.13);
  const radius = escaped ? 26 + 26 * (1 - Math.exp(-(loopT % 260) / 90)) : 26;
  const cx = 150 + Math.cos(angle * Math.PI) * radius;
  const cy = 120 + Math.sin(angle * Math.PI) * radius * 0.9;

  return (
    <ModuleChrome
      id="m5-direction-surgery"
      badge="schematic"
      title="M5 · Direction Surgery"
      blurb="subtract one direction u from W, column by column"
      transport
      playing={playing && !reduced}
      progress={1 - model.remE}
      onPlayPause={() => {
        if (reduced) {
          setLoopT((t) => t + 30); // reduced motion: play becomes step-through
          return;
        }
        setPlaying((p) => !p);
      }}
      onStep={(d) => setK((v) => Math.max(1, Math.min(D_FF, v + d * 4)))}
      onReset={() => {
        setDModel(16);
        setK(24);
        setLoopT(0);
      }}
      caption={`Editing the top-${k} of ${D_FF} columns removes ${(100 * (1 - model.remE)).toFixed(0)}% of u’s energy in W - remaining u-energy ${model.remE.toFixed(2)}. The loop ${escaped ? "escapes" : "keeps spinning"} (toy animation).`}
      levelCaptions={{
        1: "The machine kept repeating itself. We unscrewed one part - the bit that says “repeat” - and it stopped. Only a few screws, not the whole machine.",
        2: "A “direction” is one pattern the model re-injects. Subtract it from a few columns of the big number-table and the repetition loses its fuel.",
        3: "W′ = (I − uuᵀ)W on selected columns; uᵀW′ ≈ 0 after full projection. This interactive demonstration selects the k highest |uᵀW| columns to illustrate the sparsity/energy trade-off; the CSAIL post applied surgery to 64 columns in each of layers 15 and 19 per its released logs.",
        4: "Exp 8 edited 2 layers × 64 columns = 131,072 weights (0.016% of Qwen3.5-0.8B). lab/02 reproduces the math in 10 lines; the post’s exact update lives in its released logs.",
        5: "The single-direction story is a simplification - real refusal/looping circuits are distributed. The Gemma control (no effect) is the honest control this toy lacks.",
      }}
      note="TEACHING SCHEMATIC - invented W and u. The escape animation is a cartoon of “the token loop loses its direction”."
      extra={
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-2 font-sans text-sm">
            d_model
            <input type="range" min={4} max={32} step={4} value={dModel} onChange={(e) => setDModel(parseInt(e.target.value))} className="wsp-slider w-28" aria-label="Model width d_model" />
            <span className="mono w-7 text-xs">{dModel}</span>
          </label>
          <label className="flex items-center gap-2 font-sans text-sm">
            k columns
            <input type="range" min={1} max={64} step={1} value={k} onChange={(e) => setK(parseInt(e.target.value))} className="wsp-slider w-36" aria-label="Number of columns edited" />
            <span className="mono w-7 text-xs">{k}</span>
          </label>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_340px] items-start">
        <div>
          <svg viewBox="0 0 64 32" className="w-full rounded-xl border bg-card" role="img" aria-label="Per-column magnitude of u transpose W, before and after the edit">
            {model.uW.map((v, j) => {
              const h = Math.min(1, Math.abs(v) / (model.totalE * 0.42)) * 12;
              const edited = model.editedCols.has(j);
              return (
                <g key={j}>
                  <rect x={j} y={16 - h} width={0.92} height={h} fill="var(--wsp-blue)" opacity={0.85} rx={0.2} />
                  {edited && <rect x={j} y={16} width={0.92} height={Math.max(0.4, h * model.remE)} fill="var(--wsp-green)" opacity={0.9} rx={0.2} />}
                  {edited && <rect x={j} y={16 - h - 1.2} width={0.92} height={0.9} fill="var(--wsp-amber)" rx={0.25} />}
                </g>
              );
            })}
            <line x1="0" y1="16" x2="64" y2="16" stroke="var(--border)" strokeWidth="0.35" />
          </svg>
          <p className="mt-1.5 font-sans text-xs text-muted-foreground">
            blue: |uᵀW| before · green (down): what remains after · amber caps mark the {k} edited columns
          </p>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div className="rounded-lg border bg-accent px-2 py-2">
              <p className="mono text-lg font-bold" style={{ color: "var(--wsp-amber)" }}>
                {((k / D_FF) * 100).toFixed(0)}%
              </p>
              <p className="font-sans text-[11px] text-muted-foreground">columns edited here (toy)</p>
            </div>
            <div className="rounded-lg border bg-accent px-2 py-2">
              <p className="mono text-lg font-bold" style={{ color: "var(--wsp-green)" }}>
                {(model.remE * 100).toFixed(0)}%
              </p>
              <p className="font-sans text-[11px] text-muted-foreground">u-energy remaining</p>
            </div>
            <div className="rounded-lg border bg-accent px-2 py-2">
              <p className="mono text-lg font-bold" style={{ color: "var(--wsp-blue)" }}>
                0.016%
              </p>
              <p className="font-sans text-[11px] text-muted-foreground">of weights, in the real Exp 8 (🟦)</p>
            </div>
          </div>
        </div>
        <div>
          <svg viewBox="0 0 300 240" className="w-full rounded-xl border bg-card" role="img" aria-label={escaped ? "Dot escaping the loop after the edit" : "Dot stuck in a loop"}>
            <ellipse cx="150" cy="120" rx="26" ry="23" fill="none" stroke={escaped ? "var(--wsp-green)" : "var(--wsp-red)"} strokeWidth="2" strokeDasharray="5 5" />
            <path d="M150,120 m-3,0 a3,3 0 1,0 6,0 a3,3 0 1,0 -6,0" fill="var(--muted-foreground)" />
            <text x="150" y="163" fontSize="10" textAnchor="middle" className="mono" fill="var(--muted-foreground)">
              {escaped ? "loop broken → model escapes" : "u-energy feeds the loop"}
            </text>
            <circle cx={cx} cy={cy} r="6.5" fill={escaped ? "var(--wsp-green)" : "var(--wsp-red)"} />
            <path
              d={`M${cx},${cy} Q${150 + (cx - 150) * 0.4},${cy - 24} 150,120`}
              fill="none"
              stroke={escaped ? "var(--wsp-green)" : "var(--wsp-red)"}
              strokeWidth="1.2"
              opacity="0.5"
            />
          </svg>
          <p className="mt-2 font-sans text-xs leading-relaxed text-muted-foreground">
            The “thinking loop” cartoon: before the edit the state keeps re-entering itself (as Qwen3.5-0.8B did -
            93% of math answers hit the token limit 🟦). After the direction is subtracted from enough columns,
            the loop loses its engine (33% at 50 passes).
          </p>
        </div>
      </div>
    </ModuleChrome>
  );
}
