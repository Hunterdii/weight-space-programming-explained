"use client";

import { useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { ChevronDown, Scale } from "lucide-react";

const CLAIMS = [
  { claim: "“LLMs can read small networks”", strength: 55, why: "Experiments 1–3 prove basic identity mapping, but sample size is limited, models are toy size (<400K), and baselines are absent." },
  { claim: "“Copying heads identified directly from weights”", strength: 80, why: "Exact correspondence to ground-truth induction heads established via mechanistic interpretability circuits (Elhage et al.)." },
  { claim: "“One-shot repair of broken policies”", strength: 72, why: "Exp 4 achieved deterministic 0/256 → 1,024/1,024 ramp clearance. Strongly positive, though limited to n=1 task setup." },
  { claim: "“Synthesizing working policies from scratch”", strength: 75, why: "Experiments 5–6 beat trained PPO baselines on 9×9 Go. Impressive proof of concept, though comparative training budget remains an open question." },
  { claim: "“0.016% edit resolves reasoning loops”", strength: 88, why: "Exp 8: Multi-benchmark validation, verified token-limit mechanism, and a strict negative control demonstrating targeted excision." },
  { claim: "“Reading generalizes across arbitrary models”", strength: 20, why: "Tested on one proprietary frontier model with preliminary local laptop checks (Willison). Broad cross-architecture generalization is unverified." },
  { claim: "“Autonomous weight-level auditing is ready”", strength: 15, why: "Pure speculation. Exp 7 showed that static weights alone failed to detect backdoors without dynamic activation traces." },
  { claim: "“WSP outperforms classical heuristics”", strength: 30, why: "Critical control gap: Classical decoding modifications, random direction ablations, and code-based heuristics were not run as baselines." },
];

const COLOR = (s: number) =>
  s >= 75 ? "var(--wsp-green)" : s >= 45 ? "var(--wsp-blue)" : s >= 25 ? "var(--wsp-amber)" : "var(--wsp-red)";

const LABEL = (s: number) =>
  s >= 75 ? "Strongly Backed" : s >= 45 ? "Promising Evidence" : s >= 25 ? "Anecdotal / Thin" : "Speculative / Unproven";

export default function M14Scoreboard() {
  const [open, setOpen] = useState<number | null>(4);

  return (
    <ModuleChrome
      id="m14-scoreboard"
      badge="review"
      title="M14 · Evidence vs Hype Scoreboard"
      blurb="calibrated empirical strength vs popular claims"
      caption="Calibration of prominent claims against Maier's independent review (🟩). Click any claim to inspect the evidentiary rationale. Note: Scores are qualitative editorial indicators, not meta-analytic absolutes."
      levelCaptions={{
        1: "Distinguishing hard findings from marketing hype. Some claims have rigorous experimental backing; others are early stories awaiting rigorous proof.",
        2: "Green bars represent careful empirical measurements with controls; blue indicates solid demonstrations; amber highlights anecdotal findings; red marks untested speculation.",
        3: "Evidence hierarchy follows independent review criteria: Multi-benchmark results + negative controls (Exp 8) > single large-effect fixes (Exp 4) > toy readouts (Exps 1–2) > unverified generalizations.",
        4: "Notice the 30% row: Without comparing against lightweight classical baselines (e.g., simple direction ablation or temperature tuning), 'it works' does not equal 'WSP is uniquely required'.",
        5: "Convert each row into an empirical challenge: select a claim, formulate the null baseline, register the protocol, and test under WSP-Bench-Lite specifications (Chapter 12).",
      }}
      note="🟩 Qualitative assessment calibrated against Maier's independent review (5 Nov 2026)."
    >
      <div className="space-y-3">
        {CLAIMS.map((c, i) => {
          const isOpen = open === i;
          const barColor = COLOR(c.strength);
          const label = LABEL(c.strength);

          return (
            <div
              key={i}
              className="card-hover overflow-hidden rounded-2xl border border-border/80 bg-card transition-all"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 text-left"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-sans text-sm font-bold text-foreground">
                      {c.claim}
                    </span>
                  </div>

                  {/* Horizontal Confidence Bar */}
                  <div className="mt-3 flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-border/60 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500 ease-out"
                        style={{
                          width: `${c.strength}%`,
                          backgroundColor: barColor,
                        }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold w-12 text-right" style={{ color: barColor }}>
                      {c.strength}%
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                  <span
                    className="font-mono text-[11px] font-semibold px-2 py-0.5 rounded-md border"
                    style={{
                      borderColor: `color-mix(in oklab, ${barColor} 40%, transparent)`,
                      backgroundColor: `color-mix(in oklab, ${barColor} 10%, transparent)`,
                      color: barColor,
                    }}
                  >
                    {label}
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-border/70 bg-accent/25 px-5 py-3.5 text-xs font-serif leading-relaxed text-muted-foreground animate-in fade-in duration-150">
                  <span className="font-sans font-bold" style={{ color: barColor }}>
                    Evidentiary Audit:{" "}
                  </span>
                  {c.why}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </ModuleChrome>
  );
}
