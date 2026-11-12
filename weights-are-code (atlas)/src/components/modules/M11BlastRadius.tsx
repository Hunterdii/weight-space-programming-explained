"use client";

import { useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { clamp } from "./utils";

const PRESETS = [
  { name: "Exp 8 · Qwen3.5-0.8B", P: 0.8e9, edited: 131_072, badge: "paper" as const, note: "0.016% - the paper’s flagship edit" },
  { name: "Exp 4 · Kinetix actor", P: 171_664, edited: Math.round(171_664 * 0.035), badge: "paper" as const, note: "3.5% - the ramp fix" },
  { name: "LoRA r=8 on 1024×1024", P: 1_048_576, edited: 16_384 + 16, badge: "schematic" as const, note: "rank-8 factors A (8×1024) + B (1024×8)" },
  { name: "Full fine-tune", P: 0.8e9, edited: 0.8e9, badge: "schematic" as const, note: "every parameter moves" },
];

export default function M11BlastRadius() {
  const [P, setP] = useState(0.8e9);
  const [edited, setEdited] = useState(131_072);
  const [active, setActive] = useState(0);

  const frac = clamp(edited / P, 0, 1);
  const pct = edited / P;
  // log-scale position: 1e-8 .. 1e0 over the meter
  const pos = (v: number) => {
    const lo = -8;
    const lg = Math.log10(Math.max(v, 1e-9));
    return clamp((lg - lo) / (0 - lo), 0.015, 1);
  };

  const apply = (i: number) => {
    setActive(i);
    setP(PRESETS[i].P);
    setEdited(PRESETS[i].edited);
  };

  return (
    <ModuleChrome
      id="m11-blast-radius"
      badge="paper"
      title="M11 · The Blast-Radius Meter"
      blurb="what fraction of the model did the edit touch?"
      caption={`Editing ${edited.toLocaleString()} of ${P.toLocaleString()} weights = ${(pct * 100).toPrecision(3)}% - the “blast radius” s = ‖Δ‖₀ / P.`}
      levelCaptions={{
        1: "A surgeon removed a splinter, not a lung. This meter shows how tiny the splinter was compared with the body.",
        2: "Compare: a full re-train touches 100% of the numbers. The Qwen math fix touched 0.016% - about 1 in 6,000 - and changed the model’s exam score by 40 points.",
        3: "s = ‖Δ‖₀/P. Log scale: each gridline is ×100. LoRA (rank 8) and the Exp-8 edit sit at similar orders of magnitude - but LoRA needed a training set and gradients.",
        4: "Type any P and edit count. Beware: sparsity says nothing about functional drift D - a 0.016% edit can still change global behaviour if it hits a hub (the token-limit pathway).",
        5: "Sparsity is a necessary-not-sufficient claim of surgical-ness. The right control - a random 131k-weight direction ablation - was not reported. That gap is exactly what WSP-Bench-Lite mandates.",
      }}
      note="🟦 preset values from the paper · 🟨 LoRA & full-FT rows are teaching comparisons. Your custom input is your own."
      extra={
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p, i) => (
            <button
              key={p.name}
              onClick={() => apply(i)}
              aria-pressed={active === i}
              className={`h-11 rounded-lg border px-3 font-sans text-xs ${active === i ? "border-[var(--wsp-blue)] bg-[color-mix(in_oklab,var(--wsp-blue)_14%,transparent)] font-semibold" : "bg-card text-muted-foreground"}`}
            >
              {p.name}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-5 grid gap-3 sm:grid-cols-2">
        <label className="flex items-center gap-3 font-sans text-sm">
          total weights P
          <input
            type="number"
            min={100}
            value={P}
            onChange={(e) => {
              setActive(-1);
              setP(Math.max(100, parseFloat(e.target.value) || 100));
            }}
            className="mono h-11 w-40 rounded-lg border bg-card px-3 text-sm"
            aria-label="Total parameter count"
          />
        </label>
        <label className="flex items-center gap-3 font-sans text-sm">
          weights edited ‖Δ‖₀
          <input
            type="number"
            min={0}
            value={edited}
            onChange={(e) => {
              setActive(-1);
              setEdited(Math.max(0, parseFloat(e.target.value) || 0));
            }}
            className="mono h-11 w-40 rounded-lg border bg-card px-3 text-sm"
            aria-label="Edited weight count"
          />
        </label>
      </div>
      <div className="relative h-28">
        <div className="absolute inset-x-0 top-12 h-3 rounded-full border bg-accent" />
        <div
          className="absolute top-12 h-3 rounded-full transition-all"
          style={{ left: 0, width: `${pos(frac) * 100}%`, background: "var(--wsp-blue)" }}
        />
        {[1e-6, 1e-4, 1e-2].map((v) => (
          <div key={v} className="absolute top-9 h-8 w-px bg-[var(--border)]" style={{ left: `${pos(v) * 100}%` }} />
        ))}
        {[
          { v: 1 / 1_000_000, l: "1 ppm" },
          { v: 1 / 10_000, l: "0.01%" },
          { v: 1 / 100, l: "1%" },
        ].map((t) => (
          <span key={t.l} className="mono absolute top-[72px] -translate-x-1/2 text-[10px] text-muted-foreground" style={{ left: `${pos(t.v) * 100}%` }}>
            {t.l}
          </span>
        ))}
        <div
          className="absolute top-[26px] -translate-x-1/2"
          style={{ left: `${pos(frac) * 100}%` }}
          aria-hidden
        >
          <div className="mx-auto h-6 w-6 rounded-full border-2 border-[var(--wsp-blue)] bg-card" />
        </div>
        <p className="mono absolute top-0 -translate-x-1/2 whitespace-nowrap text-sm font-bold text-[var(--wsp-blue)]" style={{ left: `${clamp(pos(frac), 0.06, 0.94) * 100}%` }}>
          {(pct * 100).toPrecision(3)}%
        </p>
      </div>
      <p className="mono mt-1 text-xs text-muted-foreground">
        log scale ← 1-in-a-billion · · · · · · · · 100% → (Exp 8 sits at 0.016%, ~2 dots from the left)
      </p>
      {active >= 0 && (
        <p className="mt-3 font-sans text-xs text-muted-foreground">
          {PRESETS[active].name}: {PRESETS[active].note} {PRESETS[active].badge === "paper" ? "🟦" : "🟨"}
        </p>
      )}
    </ModuleChrome>
  );
}
