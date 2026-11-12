"use client";

import { useState } from "react";
import { FORMULA_BY_ID } from "@/content/formulas";
import { FORMULA_HTML } from "@/content/formulaHtml";
import { BadgeChip } from "./Badge";
import { inline } from "./Inline";
import { badgeTf } from "./DataTable";
import { Copy, Check } from "lucide-react";

export interface FormulaProps {
  id: string;
  layout?: "full" | "column";
  isSubplotFeatured?: boolean;
}

const BADGE_ACCENT: Record<string, { border: string; bg: string; text: string; glow: string }> = {
  paper: {
    border: "border-[var(--wsp-blue)] border-[1.5px] border-solid",
    bg: "bg-[color-mix(in_oklab,var(--wsp-blue)_4%,var(--card))]",
    text: "var(--wsp-blue)",
    glow: "rgba(59, 130, 246, 0.12)",
  },
  review: {
    border: "border-[var(--wsp-green)] border-2 border-double",
    bg: "bg-[color-mix(in_oklab,var(--wsp-green)_4%,var(--card))]",
    text: "var(--wsp-green)",
    glow: "rgba(16, 185, 129, 0.12)",
  },
  schematic: {
    border: "border-[var(--wsp-amber)] border-[1.5px] border-dashed",
    bg: "bg-[color-mix(in_oklab,var(--wsp-amber)_4%,var(--card))]",
    text: "var(--wsp-amber)",
    glow: "rgba(245, 158, 11, 0.12)",
  },
  speculation: {
    border: "border-[var(--wsp-red)] border-[1.5px] border-dotted",
    bg: "bg-[color-mix(in_oklab,var(--wsp-red)_4%,var(--card))]",
    text: "var(--wsp-red)",
    glow: "rgba(239, 68, 68, 0.12)",
  },
};

/**
 * Pre-rendered KaTeX formula card with clean, lab-grade scientific styling.
 * Natural readable flow matching the authoritative monograph design.
 */
export default function Formula({ id, layout = "full" }: FormulaProps) {
  const f = FORMULA_BY_ID[id];
  const [copied, setCopied] = useState(false);
  if (!f) return null;
  const html = FORMULA_HTML[id];

  const accent = BADGE_ACCENT[f.badge] || {
    border: "border-border/80 border-[1px] border-solid",
    bg: "bg-card",
    text: "var(--wsp-chrome)",
    glow: "transparent",
  };

  const copyLatex = async () => {
    try {
      await navigator.clipboard.writeText(f.latex);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard write failures
    }
  };

  /* -------------------------------------------------------------
     LAYOUT: COLUMN (Used in 2-column, 3-column, or 4-column Grids)
     ------------------------------------------------------------- */
  if (layout === "column") {
    return (
      <figure className={`h-full w-full ${badgeTf(f.badge)}`}>
        <div
          className={`card-hover group relative flex h-full flex-col justify-between rounded-2xl border p-5 sm:p-6 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-lg ${accent.border} ${accent.bg}`}
        >
          <div>
            {/* Header: Badge + Title + ID */}
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3 mb-4">
              <div className="flex items-center gap-2 min-w-0">
                <BadgeChip b={f.badge} />
                <span className="font-sans text-sm font-bold text-foreground truncate" title={f.name}>
                  {f.name}
                </span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider shrink-0">
                {f.id}
              </span>
            </div>

            {/* KaTeX Math Box */}
            <div
              className="relative my-3 flex min-h-[78px] items-center justify-center overflow-x-auto rounded-xl border border-border/70 bg-background/85 p-3.5 shadow-2xs group-hover:border-foreground/20 transition-colors"
            >
              {html ? (
                <div
                  className="w-full text-center py-1 text-base sm:text-lg"
                  role="math"
                  aria-label={`${f.name}: ${f.plain}`}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <pre className="mono overflow-x-auto text-xs">
                  <code>{f.latex}</code>
                </pre>
              )}
            </div>

            {/* Plain explanation */}
            <p className="mt-3 font-serif text-sm leading-relaxed text-foreground/90">
              {inline(f.plain)}
            </p>

            {/* Parameter Legend */}
            {f.legend.length > 0 && (
              <dl className="mt-3.5 space-y-1 border-t border-border/50 pt-3 font-sans text-xs text-muted-foreground">
                {f.legend.map((l, i) => (
                  <div key={i} className="flex gap-2">
                    <dt className="shrink-0 font-bold" style={{ color: accent.text }}>
                      •
                    </dt>
                    <dd className="leading-snug">{inline(l)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Footer: Empirical Example & LaTeX Copy */}
          <div className="mt-4 border-t border-border/60 pt-3 text-xs font-sans text-muted-foreground">
            <p className="leading-relaxed">
              <span className="font-semibold text-foreground">Example:</span> {inline(f.example)}
            </p>
            <div className="mt-2.5 flex items-center justify-between">
              <details className="text-[11px]">
                <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                  LaTeX code
                </summary>
                <pre className="mono mt-1 max-w-full overflow-x-auto rounded border bg-background/90 p-2 text-[10px]">
                  <code>{f.latex}</code>
                </pre>
              </details>

              <button
                onClick={copyLatex}
                className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                title="Copy LaTeX formula"
              >
                {copied ? <Check className="size-3 text-[var(--wsp-green)]" /> : <Copy className="size-3" />}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>
      </figure>
    );
  }

  /* -------------------------------------------------------------
     LAYOUT: FULL (Single Featured Card)
     ------------------------------------------------------------- */
  return (
    <figure className={`my-8 w-full ${badgeTf(f.badge)}`}>
      <div
        className={`card-hover group relative rounded-2xl border p-6 sm:p-8 shadow-sm backdrop-blur-md transition-all duration-300 hover:shadow-xl ${accent.border} ${accent.bg}`}
      >
        {/* Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
          <div className="flex items-center gap-2.5">
            <BadgeChip b={f.badge} />
            <h4 className="font-sans text-base sm:text-lg font-bold text-foreground">
              {f.name}
            </h4>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={copyLatex}
              className="flex items-center gap-1.5 rounded-lg border border-border/70 bg-accent/30 px-2.5 py-1 font-mono text-xs text-muted-foreground hover:bg-accent/60 hover:text-foreground transition-colors"
              title="Copy LaTeX formula code"
            >
              {copied ? <Check className="size-3.5 text-[var(--wsp-green)]" /> : <Copy className="size-3.5" />}
              <span>{copied ? "LaTeX Copied!" : "Copy LaTeX"}</span>
            </button>
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              {f.id}
            </span>
          </div>
        </div>

        {/* KaTeX Math Box (Prominent & Centered) */}
        <div
          className="relative my-6 flex min-h-[92px] items-center justify-center overflow-x-auto rounded-xl border border-border/70 bg-background/85 p-5 shadow-2xs group-hover:border-foreground/20 transition-colors"
        >
          {html ? (
            <div
              className="w-full text-center py-2 text-lg sm:text-2xl"
              role="math"
              aria-label={`${f.name}: ${f.plain}`}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          ) : (
            <pre className="mono overflow-x-auto text-sm">
              <code>{f.latex}</code>
            </pre>
          )}
        </div>

        {/* Content Body: Translation + Legend + Example */}
        <div className="space-y-4">
          <p className="font-serif text-base sm:text-lg text-foreground/90 leading-relaxed">
            {inline(f.plain)}
          </p>

          {/* Parameter Legend */}
          {f.legend.length > 0 && (
            <dl className="space-y-1.5 border-t border-border/50 pt-3 font-sans text-xs text-muted-foreground">
              {f.legend.map((l, i) => (
                <div key={i} className="flex gap-2">
                  <dt className="shrink-0 font-bold" style={{ color: accent.text }}>
                    •
                  </dt>
                  <dd className="leading-snug">{inline(l)}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Example & Collapsible LaTeX */}
          <div className="border-t border-border/50 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
            <p className="leading-relaxed">
              <span className="font-semibold text-foreground">Example:</span> {inline(f.example)}
            </p>

            <details className="shrink-0 text-xs">
              <summary className="cursor-pointer text-[11px] text-muted-foreground hover:text-foreground transition-colors">
                Raw LaTeX (copy/paste)
              </summary>
              <pre className="mono mt-1 max-w-full overflow-x-auto rounded border bg-background/90 p-2 text-[11px]">
                <code>{f.latex}</code>
              </pre>
            </details>
          </div>
        </div>
      </div>
    </figure>
  );
}
