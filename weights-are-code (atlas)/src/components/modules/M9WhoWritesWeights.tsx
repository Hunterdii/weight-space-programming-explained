"use client";

import { useState } from "react";
import ModuleChrome from "./ModuleChrome";

interface Row {
  method: string;
  data: 0 | 1 | 2; // 0 = yes/lots, 1 = some, 2 = no
  grads: 0 | 1 | 2;
  compute: 0 | 1 | 2;
  readable: 0 | 1 | 2;
  mode: string;
  wsp?: boolean;
}

const ROWS: Row[] = [
  { method: "Training (SGD / Adam / Muon)", data: 0, grads: 0, compute: 0, readable: 2, mode: "writes" },
  { method: "Fine-tuning", data: 0, grads: 0, compute: 1, readable: 2, mode: "writes" },
  { method: "LoRA", data: 1, grads: 0, compute: 1, readable: 1, mode: "writes" },
  { method: "Task arithmetic", data: 2, grads: 2, compute: 2, readable: 0, mode: "writes" },
  { method: "Model merging (TIES etc.)", data: 2, grads: 2, compute: 2, readable: 1, mode: "writes" },
  { method: "Model editing (ROME)", data: 1, grads: 2, compute: 2, readable: 0, mode: "writes" },
  { method: "Activation steering", data: 1, grads: 2, compute: 2, readable: 0, mode: "steers" },
  { method: "Mechanistic interpretability", data: 2, grads: 2, compute: 2, readable: 0, mode: "reads" },
  { method: "Tracr (compile a program)", data: 2, grads: 2, compute: 2, readable: 0, mode: "writes" },
  { method: "Hypernetworks / fast weights", data: 0, grads: 0, compute: 0, readable: 2, mode: "writes" },
  { method: "Neural network diffusion", data: 0, grads: 0, compute: 0, readable: 2, mode: "writes" },
  { method: "Weight-space programming", data: 2, grads: 2, compute: 1, readable: 0, mode: "reads + writes", wsp: true },
];

const AXES: { key: keyof Row; label: string; good: "low" | "high" }[] = [
  { key: "data", label: "Needs data?", good: "low" },
  { key: "grads", label: "Needs gradients?", good: "low" },
  { key: "compute", label: "Training compute?", good: "low" },
  { key: "readable", label: "Human-readable diff?", good: "high" },
];

const GLYPH: Record<number, { t: string; c: string }> = {
  0: { t: "●●", c: "var(--wsp-red)" },
  1: { t: "●○", c: "var(--wsp-amber)" },
  2: { t: "○○", c: "var(--wsp-green)" },
};

export default function M9WhoWritesWeights() {
  const [sort, setSort] = useState<keyof Row | null>("readable");
  const sorted = sort
    ? [...ROWS].sort((a, b) => (a[sort] as number) - (b[sort] as number) || a.method.localeCompare(b.method))
    : ROWS;

  return (
    <ModuleChrome
      id="m9-who-writes"
      badge="schematic"
      title="M9 · Who Writes the Weights?"
      blurb="click an axis to sort every method by it"
      caption={
        sort
          ? `Sorted by “${AXES.find((a) => a.key === sort)?.label}”. Weight-space programming is the only row that reads AND writes while keeping the edit human-readable.`
          : "Twelve ways weights change hands. Click a column heading to sort."
      }
      levelCaptions={{
        1: "A table of recipe cards: which recipes need lots of examples? Which need huge cooking time? Which can you read afterwards? The new one needs almost nothing and stays readable.",
        2: "“Needs data?” is about examples; “needs gradients?” about the learning rule; “compute” about cost; “readable” about whether a human could review the change like a code diff.",
        3: "The cousins: fine-tuning (data+grads), LoRA (low-rank, still grads), task arithmetic (vector ops, post-hoc), ROME (closed-form rank-1), steering (runtime, not weights), mech-interp (read-only), Tracr (compile).",
        4: "Sort by “Needs gradients?”: everything gradient-based inherits training’s failure modes (data hunger, compute, no interpretability). WSP’s Δ is produced by reasoning - that is the discontinuity worth testing, not assuming.",
        5: "Caveats the table hides: ROME/steering are also surgery-like but target ONE fact/direction with known machinery. WSP’s claimed novelty is the generality of the reasoner - the very thing current evidence tests weakest.",
      }}
      note="TEACHING SCHEMATIC - the ●○ ratings are my qualitative summary for sorting, not a measured comparison from the literature."
    >
      <div className="table-scroll">
        <table className="wsp">
          <caption>Click a column to sort · ●● = heavy, ●○ = some, ○○ = none</caption>
          <thead>
            <tr>
              <th scope="col">Method</th>
              {AXES.map((a) => (
                <th key={a.key} scope="col" className="text-center">
                  <button
                    onClick={() => setSort(sort === a.key ? null : a.key)}
                    aria-label={`Sort by ${a.label}`}
                    className={`rounded-md px-2 py-1 font-sans hover:text-foreground ${sort === a.key ? "text-foreground font-bold" : ""}`}
                  >
                    {a.label} {sort === a.key ? "▾" : ""}
                  </button>
                </th>
              ))}
              <th scope="col">Role</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((r) => (
              <tr key={r.method} className={r.wsp ? "bg-[color-mix(in_oklab,var(--wsp-chrome)_10%,transparent)]" : ""}>
                <td className="txt font-semibold" style={r.wsp ? { color: "var(--wsp-chrome)" } : undefined}>
                  {r.method}
                </td>
                {AXES.map((a) => {
                  const v = r[a.key] as number;
                  return (
                    <td key={a.key} className="text-center">
                      <span className="mono text-xs" style={{ color: GLYPH[v].c }}>
                        {GLYPH[v].t}
                      </span>
                    </td>
                  );
                })}
                <td className="txt">{r.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ModuleChrome>
  );
}
