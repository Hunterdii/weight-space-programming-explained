"use client";

import { useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { QWEN_BUDGET, GEMMA_CONTROL } from "@/content/facts";
import { useReading } from "@/state/store";

const METRICS = ["MATH-500 %", "GSM8K %", "IFEval %", "Hit token limit %"] as const;
type Metric = (typeof METRICS)[number];

const QWEN: { passes: number; vals: Record<Metric, number> }[] = QWEN_BUDGET.rows.map((r) => ({
  passes: r[0].includes("Base") ? 0 : parseInt(r[0].replace(/\D/g, "")),
  vals: {
    "MATH-500 %": parseFloat(r[1]),
    "GSM8K %": parseFloat(r[2]),
    "IFEval %": parseFloat(r[3]),
    "Hit token limit %": parseFloat(r[4]),
  },
}));

const GEMMA: { passes: number; val: number }[] = GEMMA_CONTROL.rows.map((r) => ({
  passes: r[0].includes("Base") ? 0 : parseInt(r[0].replace(/\D/g, "")),
  val: parseFloat(r[1]),
}));

const DIP: Partial<Record<Metric, string>> = {
  "IFEval %": "the dip: 49.0 at 10 passes → 39.9 at 25 - non-monotonic, n=1 per point",
  "MATH-500 %": "the cliff: 14.1 at 25 passes → 48.1 at 50 - a jump, not a slope",
};

export default function M6BudgetDial() {
  const [metric, setMetric] = useState<Metric>("MATH-500 %");
  const [panel, setPanel] = useState<"qwen" | "gemma">("qwen");
  const [focus, setFocus] = useState(3);
  const labels = useReading((s) => s.labels);

  const isQwen = panel === "qwen";
  const data = isQwen ? QWEN.map((q) => ({ passes: q.passes, val: q.vals[metric] })) : GEMMA.map((g) => ({ passes: g.passes, val: g.val }));
  const maxV = Math.max(...data.map((d) => d.val)) * 1.12;

  return (
    <ModuleChrome
      id="m6-budget-dial"
      badge="paper"
      title="M6 · The Budget Dial"
      blurb="how good is the edit as the editor gets more forward passes?"
      transport
      playing={false}
      progress={focus / (data.length - 1)}
      onPlayPause={() => setFocus((f) => (f + 1) % data.length)}
      onStep={(d) => setFocus((f) => Math.max(0, Math.min(data.length - 1, f + d)))}
      onReset={() => {
        setFocus(0);
        setPanel("qwen");
        setMetric("MATH-500 %");
      }}
      caption={
        isQwen
          ? `Qwen3.5-0.8B, ${metric}: ${data.map((d) => `${d.passes}→${d.val}`).join(" · ")}. ${DIP[metric] ?? ""} Reported points only - no curve drawn through them.`
          : `Gemma 3 270M control (MATH-500 %): ${data.map((d) => `${d.passes}→${d.val}`).join(" · ")}. It barely moves - and only 8.5% of its answers ever hit the token limit (vs 93% for Qwen).`
      }
      levelCaptions={{
        1: "The editor was allowed 0, 10, 25, then 50 “practice tries”. More tries, better math - but one dip along the way shows it isn’t magic, it’s noisy.",
        2: "Each bar is one measured score. The jump at 50 tries is huge (7.9% → 48.1% on MATH-500) - but each bar is a single run, so treat wiggles gently.",
        3: "fidelity(n): quality vs forward-pass budget n ∈ {0,10,25,50}. Non-monotonic at n=25 (IFEval 49.0 → 39.9) - inconsistent ordering across metrics.",
        4: "Read the token-limit column as the mechanism check: 93.0 → 33.1 tracks the math gains - the edit removed a looping obstacle rather than adding skill. The Gemma panel is the negative control.",
        5: "What would settle it: ≥5 seeds per point, confidence intervals, and a standard direction-ablation baseline. The released logs give n=1 - flag every claim accordingly.",
      }}
      note="🟦 All values verbatim from the paper’s tables (Exp 8). Chart: reported points as bars, focus ring controlled by Play/Step."
      extra={
        <div className="flex flex-wrap items-center gap-2">
          {METRICS.map((m) => (
            <button
              key={m}
              onClick={() => {
                setMetric(m);
                setPanel("qwen");
              }}
              aria-pressed={metric === m && isQwen}
              className={`h-11 rounded-lg border px-3 font-sans text-sm ${metric === m && isQwen ? "border-[var(--wsp-blue)] bg-[color-mix(in_oklab,var(--wsp-blue)_14%,transparent)] font-semibold" : "bg-card text-muted-foreground"}`}
            >
              {m.replace(" %", "")}
            </button>
          ))}
          <button
            onClick={() => setPanel((p) => (p === "qwen" ? "gemma" : "qwen"))}
            aria-pressed={!isQwen}
            className={`h-11 rounded-lg border px-3 font-sans text-sm ${!isQwen ? "border-[var(--wsp-amber)] bg-[color-mix(in_oklab,var(--wsp-amber)_14%,transparent)] font-semibold" : "bg-card text-muted-foreground"}`}
          >
            Gemma control
          </button>
        </div>
      }
    >
      <div className="flex items-end justify-center gap-4 sm:gap-8" style={{ height: 240 }}>
        {data.map((d, i) => {
          const h = (d.val / maxV) * 190;
          const isFocus = i === focus;
          const isDip = isQwen && metric === "IFEval %" && d.passes === 25;
          return (
            <div key={d.passes} className="flex w-14 flex-col items-center sm:w-20">
              <div className="relative flex w-full flex-1 items-end justify-center">
                <button
                  onClick={() => setFocus(i)}
                  aria-label={`Focus ${d.passes} passes: ${d.val}`}
                  className="w-full"
                  tabIndex={-1}
                >
                  <div
                    className={`mx-auto w-full rounded-t-lg transition-all ${isFocus ? "ring-2 ring-[var(--wsp-blue)]" : ""}`}
                    style={{
                      height: h,
                      background: isDip
                        ? "var(--wsp-amber)"
                        : d.passes === 0
                          ? "var(--border)"
                          : isQwen
                            ? "var(--wsp-blue)"
                            : "var(--wsp-amber)",
                      opacity: isFocus ? 1 : 0.72,
                    }}
                  />
                </button>
                {labels && (
                  <span className="mono absolute -top-1 left-1/2 -translate-x-1/2 text-xs font-bold">{d.val}</span>
                )}
              </div>
              <span className={`mono mt-2 text-xs ${isFocus ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                {d.passes} passes
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center font-sans text-xs text-muted-foreground">
        {isQwen ? "Qwen3.5-0.8B · thinking mode on · up to 32,768 tokens" : "Gemma 3 270M · negative control"} - one
        measurement per bar, reported points only
      </p>
    </ModuleChrome>
  );
}
