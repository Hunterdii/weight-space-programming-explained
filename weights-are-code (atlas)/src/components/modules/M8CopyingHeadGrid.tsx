"use client";

import { useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { CheckCircle2, Layers, Cpu } from "lucide-react";

/** Ground truth from the paper (Exp 3): copying heads per language - and the reader matched them exactly (🟦). */
const HEADS: Record<string, { layer: number; head: number }[]> = {
  Python: [
    { layer: 2, head: 1 },
    { layer: 3, head: 1 },
    { layer: 3, head: 5 },
  ],
  Romaji: [{ layer: 3, head: 3 }],
  English: [{ layer: 3, head: 1 }],
};
const LANGS = Object.keys(HEADS);
const LAYERS = 4;
const HEADS_PER = 6;

type ViewMode = "read" | "truth" | "compare";

export default function M8CopyingHeadGrid() {
  const [lang, setLang] = useState("Python");
  const [mode, setMode] = useState<ViewMode>("read");

  const isCopy = (l: number, h: number) =>
    HEADS[lang].some((x) => x.layer === l && x.head === h);

  const getModeColor = () => {
    switch (mode) {
      case "read":
        return "var(--wsp-blue)";
      case "truth":
        return "var(--wsp-green)";
      case "compare":
        return "var(--wsp-amber)";
    }
  };

  const modeColor = getModeColor();

  return (
    <ModuleChrome
      id="m8-head-grid"
      badge="paper"
      title="M8 · The Copying-Head Grid"
      blurb="which attention heads copy? - read from weights vs measured by running"
      transport={false}
      caption={
        mode === "read"
          ? `What Astra READ from raw weights (${lang}): ${HEADS[lang].map((h) => `L${h.layer}·H${h.head}`).join(", ")} via induction-head composition scores alone.`
          : mode === "truth"
          ? `GROUND TRUTH, measured by running the model (${lang}): ${HEADS[lang].map((h) => `L${h.layer}·H${h.head}`).join(", ")}. The match is 100% exact.`
          : `1:1 COMPARISON (${lang}): Astra weight predictions exactly match empirical runtime activations across all 24 heads.`
      }
      levelCaptions={{
        1: "Some parts of a language machine become “copiers” - they repeat what they just saw. Finding which parts, from their numbers alone, is genuinely impressive.",
        2: "A “head” is one attention unit. The paper knew (by running the models) which heads copy. The reader found the same ones by reading the weights only - a perfect match.",
        3: "Induction heads implement [A][B]…[A]→B. Composition score ∥W_QK⁽²⁾W_OV⁽¹⁾∥_F / (∥W_QK⁽²⁾∥·∥W_OV⁽¹⁾∥) finds head pairs whose circuits chain - readable without a forward pass (formula pack §10).",
        4: "Same technique as Elhage et al. 2021, applied by the LLM to raw middle-block weights - 4L×6H×384d, 7.16M params, running banned. Language ID at 0.48–0.62 confidence; head ID exact.",
        5: "Why exact here but fuzzy elsewhere? Head circuits are composition-shaped - engineered for discovery. Language ID is diffuse. The pattern: WSP succeeds where structure is compositional, struggles with distributed behaviour (see Exp 7).",
      }}
      note="🟦 Head positions verbatim from Exp 3 (tables in the post). Confidence on language ID: 0.48–0.62 among 3 options."
      extra={
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          {/* Language Selector Tabs */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 p-1">
            <span className="px-2 font-mono text-[11px] text-muted-foreground uppercase">Lang:</span>
            {LANGS.map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`h-8 rounded-lg px-3 font-sans text-xs font-semibold transition-all ${
                  lang === l
                    ? "bg-card text-foreground border border-border shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* View Mode Segmented Controls */}
          <div className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-background/80 p-1">
            <button
              onClick={() => setMode("read")}
              aria-pressed={mode === "read"}
              className={`h-8 rounded-lg px-3 font-sans text-xs font-semibold transition-all ${
                mode === "read"
                  ? "bg-[color-mix(in_oklab,var(--wsp-blue)_20%,transparent)] border border-[var(--wsp-blue)] text-[var(--wsp-blue)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Astra Weights-Only
            </button>
            <button
              onClick={() => setMode("truth")}
              aria-pressed={mode === "truth"}
              className={`h-8 rounded-lg px-3 font-sans text-xs font-semibold transition-all ${
                mode === "truth"
                  ? "bg-[color-mix(in_oklab,var(--wsp-green)_20%,transparent)] border border-[var(--wsp-green)] text-[var(--wsp-green)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Empirical Ground Truth
            </button>
            <button
              onClick={() => setMode("compare")}
              aria-pressed={mode === "compare"}
              className={`h-8 rounded-lg px-3 font-sans text-xs font-semibold transition-all ${
                mode === "compare"
                  ? "bg-[color-mix(in_oklab,var(--wsp-amber)_20%,transparent)] border border-[var(--wsp-amber)] text-[var(--wsp-amber)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              1:1 Comparison
            </button>
          </div>
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_360px] items-start w-full">
        <div className="space-y-3">
          <svg
            viewBox="0 0 520 320"
            className="w-full rounded-2xl border bg-card/60 shadow-sm"
            role="img"
            aria-label={`4 by 6 grid of attention heads for ${lang}; copying heads highlighted`}
          >
            {/* Column Headers: Attention Heads (0-indexed per CSAIL post: H0 … H5) */}
            <text x="286" y="22" textAnchor="middle" fontSize="11" fontWeight="600" className="mono" fill="var(--muted-foreground)">
              Attention Heads (H0 … H5)
            </text>
            {Array.from({ length: HEADS_PER }, (_, hi) => {
              const x = 76 + hi * 68 + 27;
              return (
                <text key={hi} x={x} y="42" textAnchor="middle" fontSize="11" fontWeight="600" className="mono" fill="var(--muted-foreground)">
                  H{hi}
                </text>
              );
            })}

            {/* Row Headers: Layers (0-indexed per CSAIL post: L0 … L3) */}
            <text x="20" y="176" fontSize="11" fontWeight="600" className="mono" fill="var(--muted-foreground)" transform="rotate(-90 20 176)">
              Layers (L0 … L3)
            </text>
            {Array.from({ length: LAYERS }, (_, li) => {
              const y = 54 + li * 62 + 31;
              return (
                <text key={li} x="54" y={y} textAnchor="end" fontSize="11" fontWeight="600" className="mono" fill="var(--muted-foreground)">
                  L{li}
                </text>
              );
            })}

            {/* Grid Cells */}
            {Array.from({ length: LAYERS }, (_, li) =>
              Array.from({ length: HEADS_PER }, (_, hi) => {
                const x = 76 + hi * 68;
                const y = 54 + li * 62;
                const copy = isCopy(li, hi);
                return (
                  <g key={`${li}-${hi}`}>
                    <rect
                      x={x}
                      y={y}
                      width="54"
                      height="50"
                      rx="8"
                      fill={copy ? `color-mix(in oklab, ${modeColor} 25%, transparent)` : "var(--muted)"}
                      stroke={copy ? modeColor : "var(--border)"}
                      strokeWidth={copy ? 2.2 : 1}
                      strokeDasharray={copy ? "0" : "4 3"}
                    />
                    <text
                      x={x + 27}
                      y={y + 30}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight={copy ? "600" : "normal"}
                      className="mono"
                      fill={copy ? modeColor : "var(--muted-foreground)"}
                    >
                      L{li}·H{hi}
                    </text>
                  </g>
                );
              })
            )}
          </svg>

          {/* 100% Agreement Match Celebration Banner */}
          {(mode === "truth" || mode === "compare") && (
            <div className="rounded-xl border border-[var(--wsp-green)]/70 bg-[color-mix(in_oklab,var(--wsp-green)_12%,transparent)] p-3 text-xs flex items-center gap-3">
              <CheckCircle2 className="size-4 shrink-0 text-[var(--wsp-green)]" />
              <div>
                <span className="font-semibold text-foreground">100% Agreement Match: </span>
                <span className="text-muted-foreground">
                  Astra identified all {HEADS[lang].length} copying head{HEADS[lang].length > 1 ? "s" : ""} ({HEADS[lang].map((h) => `L${h.layer}·H${h.head}`).join(", ")}) from raw weights alone without running a single forward pass.
                </span>
              </div>
            </div>
          )}

          <p className="text-center font-sans text-xs text-muted-foreground">
            {mode === "read"
              ? "Highlighted = heads Astra claimed are copiers, inferred strictly from weight composition."
              : mode === "truth"
              ? "Highlighted = heads measured to copy by empirical activation traces. Identical cells = exact match."
              : "Comparison overlay: predicted circuit positions directly align with empirical ground truth."}
          </p>
        </div>

        {/* Sidebar Information Card */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="size-4 text-[var(--wsp-chrome)]" />
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[var(--wsp-chrome)]">
                Circuit Identification: {lang}
              </span>
            </div>
            <p className="font-serif text-sm text-foreground/90 leading-relaxed">
              Target heads:{" "}
              <span className="font-mono font-bold text-foreground">
                {HEADS[lang].map((h) => `L${h.layer}·H${h.head}`).join(", ")}
              </span>
            </p>
            <p className="font-sans text-xs text-muted-foreground leading-relaxed">
              {mode === "read"
                ? "Discovered by reading induction-head composition scores without running forward inference passes."
                : "Empirically verified by recording activation traces across all 24 attention heads."}
            </p>
          </div>

          <div className="rounded-2xl border border-dashed border-border/80 bg-accent/20 p-4 font-sans text-xs leading-relaxed text-muted-foreground space-y-2">
            <div className="flex items-center gap-1.5 text-foreground font-semibold">
              <Layers className="size-3.5" />
              <span>Why “composition score” finds copiers:</span>
            </div>
            <p>
              A copying head is two heads in series: one moves the previous token forward, the next uses it to find the
              repeat. Their weight matrices <em>multiply</em>, so their product’s norm reveals the chain - visible
              directly in the weights, no forward pass needed.
            </p>
          </div>
        </div>
      </div>
    </ModuleChrome>
  );
}
