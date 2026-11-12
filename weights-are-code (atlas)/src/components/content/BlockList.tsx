"use client";

import type { Block } from "@/content/types";
import { BadgeChip } from "./Badge";
import { inline } from "./Inline";
import Formula from "./Formula";
import DataTable, { badgeTf } from "./DataTable";
import CodeBlock from "./CodeBlock";
import { MODULES } from "@/components/modules/registry";
import { FIGURES } from "@/components/figures/registry";
import { Layers, SlidersHorizontal } from "lucide-react";

/**
 * Formula cluster container: renders formulas in natural, balanced responsive grids
 * (1 full width, 2 in 2-col, 3 in 3-col, 4 in 4-col).
 * Employs wide breakout layout (max-w-5xl breakout-wide) to avoid KaTeX clipping.
 */
function FormulaCluster({ ids, anchorId }: { ids: string[]; anchorId?: string }) {
  if (ids.length === 0) return null;

  // Single formula -> full-width balanced card
  if (ids.length === 1) {
    return (
      <div id={anchorId} className="my-8 w-full max-w-5xl mx-auto breakout-wide">
        <Formula id={ids[0]} layout="full" />
      </div>
    );
  }

  // 2 formulas -> 2 equal columns
  if (ids.length === 2) {
    return (
      <div id={anchorId} className="my-8 w-full max-w-5xl mx-auto breakout-wide">
        <div className="mb-3.5 flex items-center justify-between border-b border-border/50 pb-2 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-foreground/85">
            <Layers className="size-3.5 text-[var(--wsp-chrome)]" />
            Mathematical Formulations (2)
          </span>
          <span className="text-[11px] text-muted-foreground">Comparative Analysis</span>
        </div>
        <div className="grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          <Formula id={ids[0]} layout="column" />
          <Formula id={ids[1]} layout="column" />
        </div>
      </div>
    );
  }

  // 3 formulas -> 3 equal columns
  if (ids.length === 3) {
    return (
      <div id={anchorId} className="my-8 w-full max-w-5xl mx-auto breakout-wide">
        <div className="mb-3.5 flex items-center justify-between border-b border-border/50 pb-2 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-foreground/85">
            <Layers className="size-3.5 text-[var(--wsp-chrome)]" />
            Mathematical Formulations (3)
          </span>
          <span className="text-[11px] text-muted-foreground">Tripartite System</span>
        </div>
        <div className="grid w-full grid-cols-1 items-stretch gap-6 md:grid-cols-3">
          <Formula id={ids[0]} layout="column" />
          <Formula id={ids[1]} layout="column" />
          <Formula id={ids[2]} layout="column" />
        </div>
      </div>
    );
  }

  // 4 formulas -> 2x2 / 4-column balanced grid
  if (ids.length === 4) {
    return (
      <div id={anchorId} className="my-8 w-full max-w-5xl mx-auto breakout-wide">
        <div className="mb-3.5 flex items-center justify-between border-b border-border/50 pb-2 font-mono text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-foreground/85">
            <Layers className="size-3.5 text-[var(--wsp-chrome)]" />
            Mathematical Formulations (4)
          </span>
          <span className="text-[11px] text-muted-foreground">Full Formulation Suite</span>
        </div>
        <div className="grid w-full grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ids.map((id) => (
            <Formula key={id} id={id} layout="column" />
          ))}
        </div>
      </div>
    );
  }

  // Fallback: responsive multi-column grid
  return (
    <div id={anchorId} className="my-8 grid w-full max-w-5xl mx-auto breakout-wide grid-cols-1 items-stretch gap-6 md:grid-cols-2 lg:grid-cols-3">
      {ids.map((id) => (
        <Formula key={id} id={id} layout="column" />
      ))}
    </div>
  );
}

/**
 * Callout cluster container: groups consecutive callout cards into balanced grids
 * rather than stacking narrow boxes with dead space.
 */
function CalloutCluster({
  callouts,
  isFrontierSynthesis = false,
}: {
  callouts: Extract<Block, { kind: "callout" }>[];
  isFrontierSynthesis?: boolean;
}) {
  if (callouts.length === 0) return null;

  if (callouts.length === 1) {
    const b = callouts[0];
    return (
      <aside
        className={`callout co-${b.badge} w-full ${
          isFrontierSynthesis ? "max-w-none" : "max-w-5xl mx-auto breakout-wide"
        }`}
      >
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <BadgeChip b={b.badge} />
          {b.title && <span className="font-sans text-sm font-semibold text-foreground">{inline(b.title)}</span>}
        </div>
        <p className="prose-wsp m-0 text-[0.95rem] leading-relaxed text-foreground/90 w-full max-w-none">{inline(b.text)}</p>
      </aside>
    );
  }

  if (callouts.length === 2) {
    return (
      <div
        className={`my-6 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch w-full ${
          isFrontierSynthesis ? "max-w-none" : "max-w-5xl mx-auto breakout-wide"
        }`}
      >
        {callouts.map((b, idx) => (
          <aside key={idx} className={`callout co-${b.badge} m-0 h-full flex flex-col justify-between`}>
            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <BadgeChip b={b.badge} />
                {b.title && <span className="font-sans text-sm font-semibold text-foreground">{inline(b.title)}</span>}
              </div>
              <p className="prose-wsp m-0 text-[0.95rem] leading-relaxed text-foreground/90 w-full max-w-none">{inline(b.text)}</p>
            </div>
          </aside>
        ))}
      </div>
    );
  }

  return (
    <div
      className={`my-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch w-full ${
        isFrontierSynthesis ? "max-w-none" : "max-w-5xl mx-auto breakout-wide"
      }`}
    >
      {callouts.map((b, idx) => (
        <aside key={idx} className={`callout co-${b.badge} m-0 h-full flex flex-col justify-between`}>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <BadgeChip b={b.badge} />
              {b.title && <span className="font-sans text-sm font-semibold text-foreground">{inline(b.title)}</span>}
            </div>
            <p className="prose-wsp m-0 text-[0.95rem] leading-relaxed text-foreground/90 w-full max-w-none">{inline(b.text)}</p>
          </div>
        </aside>
      ))}
    </div>
  );
}

/**
 * Table cluster container: groups consecutive tables (e.g. Exp 8 budget + Gemma control)
 * into a balanced side-by-side comparative grid with wide breakout (max-w-5xl breakout-wide).
 */
function TableCluster({ ids, anchorId }: { ids: string[]; anchorId?: string }) {
  if (ids.length === 0) return null;
  if (ids.length === 1) {
    return (
      <div id={anchorId} className="my-8 w-full max-w-5xl mx-auto breakout-wide">
        <DataTable id={ids[0]} />
      </div>
    );
  }
  return (
    <div id={anchorId} className="my-8 w-full max-w-5xl mx-auto breakout-wide">
      <div className="mb-3.5 flex items-center justify-between font-mono text-xs text-muted-foreground border-b border-border/50 pb-2">
        <span className="uppercase tracking-wider flex items-center gap-1.5 font-bold text-foreground/85">
          <SlidersHorizontal className="size-3.5 text-[var(--wsp-chrome)]" />
          Comparative Empirical Benchmarks ({ids.length})
        </span>
        <span className="text-[11px] text-muted-foreground">Experiment vs Control Analysis</span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start w-full">
        {ids.map((id) => (
          <div key={id} className="w-full">
            <DataTable id={id} />
          </div>
        ))}
      </div>
    </div>
  );
}

type GroupedItem =
  | { type: "single"; block: Block }
  | { type: "formula-cluster"; ids: string[] }
  | { type: "callout-cluster"; callouts: Extract<Block, { kind: "callout" }>[] }
  | { type: "table-cluster"; ids: string[] };

export default function BlockList({
  blocks,
  idPrefix = "",
  isFrontierSynthesis = false,
}: {
  blocks: Block[];
  idPrefix?: string;
  isFrontierSynthesis?: boolean;
}) {
  const seen = new Set<string>();

  let formulaClusterCount = 0;
  let tableClusterCount = 0;
  let moduleCount = 0;
  let figureCount = 0;

  // Pre-process blocks into clusters
  const grouped: GroupedItem[] = [];
  let pendingFormulas: string[] = [];
  let pendingCallouts: Extract<Block, { kind: "callout" }>[] = [];
  let pendingTables: string[] = [];

  const flushFormulas = () => {
    if (pendingFormulas.length > 0) {
      grouped.push({ type: "formula-cluster", ids: pendingFormulas });
      pendingFormulas = [];
    }
  };

  const flushCallouts = () => {
    if (pendingCallouts.length > 0) {
      grouped.push({ type: "callout-cluster", callouts: pendingCallouts });
      pendingCallouts = [];
    }
  };

  const flushTables = () => {
    if (pendingTables.length > 0) {
      grouped.push({ type: "table-cluster", ids: pendingTables });
      pendingTables = [];
    }
  };

  for (const b of blocks) {
    if (b.kind === "formula") {
      flushCallouts();
      flushTables();
      if (!seen.has("f:" + b.id)) {
        seen.add("f:" + b.id);
        pendingFormulas.push(b.id);
      }
    } else if (b.kind === "callout") {
      flushFormulas();
      flushTables();
      pendingCallouts.push(b);
    } else if (b.kind === "table") {
      flushFormulas();
      flushCallouts();
      if (!seen.has("t:" + b.id)) {
        seen.add("t:" + b.id);
        pendingTables.push(b.id);
      }
    } else {
      flushFormulas();
      flushCallouts();
      flushTables();
      grouped.push({ type: "single", block: b });
    }
  }

  flushFormulas();
  flushCallouts();
  flushTables();

  return (
    <div className="space-y-6 w-full">
      {grouped.map((item, idx) => {
        if (item.type === "formula-cluster") {
          formulaClusterCount++;
          const anchorId = idPrefix
            ? `${idPrefix}mathematical-formulations-${formulaClusterCount}`
            : formulaClusterCount === 1
            ? "mathematical-formulations"
            : `mathematical-formulations-${formulaClusterCount}`;
          return <FormulaCluster key={`fc-${idx}`} ids={item.ids} anchorId={anchorId} />;
        }

        if (item.type === "callout-cluster") {
          return <CalloutCluster key={`cc-${idx}`} callouts={item.callouts} isFrontierSynthesis={isFrontierSynthesis} />;
        }

        if (item.type === "table-cluster") {
          tableClusterCount++;
          const anchorId = idPrefix
            ? `${idPrefix}empirical-benchmarks-${tableClusterCount}`
            : tableClusterCount === 1
            ? "empirical-benchmarks"
            : `empirical-benchmarks-${tableClusterCount}`;
          return <TableCluster key={`tc-${idx}`} ids={item.ids} anchorId={anchorId} />;
        }

        const b = item.block;
        switch (b.kind) {
          case "p":
            return (
              <p
                key={idx}
                className={`prose-wsp w-full ${
                  isFrontierSynthesis ? "max-w-none" : "max-w-5xl mx-auto breakout-wide"
                } leading-relaxed`}
              >
                {inline(b.text)}
              </p>
            );
          case "h": {
            const headingSlug = b.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
            return (
              <h3
                key={idx}
                id={headingSlug || `heading-${idx}`}
                className={`font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground pt-4 w-full ${
                  isFrontierSynthesis ? "max-w-none" : "max-w-5xl mx-auto breakout-wide"
                }`}
              >
                {inline(b.text)}
              </h3>
            );
          }
          case "list":
            return (
              <div
                key={idx}
                className={`w-full ${
                  isFrontierSynthesis ? "max-w-none" : "max-w-5xl mx-auto breakout-wide"
                } my-6`}
              >
                <ul className="space-y-3 w-full">
                  {b.items.map((it, j) => (
                    <li
                      key={j}
                      className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/50 p-4 transition-all hover:bg-card hover:border-border shadow-2xs"
                    >
                      <span className="mt-1.5 size-2 rounded-full bg-[var(--wsp-chrome)] shrink-0" />
                      <div className="prose-wsp text-[0.95rem] leading-relaxed text-foreground/90 flex-1 min-w-0 max-w-none">
                        {inline(it)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            );
          case "table": {
            if (seen.has("t:" + b.id)) return null;
            seen.add("t:" + b.id);
            tableClusterCount++;
            const anchorId = idPrefix
              ? `${idPrefix}empirical-benchmarks-${tableClusterCount}`
              : tableClusterCount === 1
              ? "empirical-benchmarks"
              : `empirical-benchmarks-${tableClusterCount}`;
            return (
              <div key={idx} id={anchorId} className="w-full max-w-5xl mx-auto breakout-wide my-6">
                <DataTable id={b.id} />
              </div>
            );
          }
          case "figure": {
            if (seen.has("g:" + b.id)) return null;
            seen.add("g:" + b.id);
            figureCount++;
            const anchorId = idPrefix
              ? `${idPrefix}schematic-figures-${figureCount}`
              : figureCount === 1
              ? "schematic-figures"
              : `schematic-figures-${figureCount}`;
            const F = FIGURES[b.id];
            return F ? (
              <div key={idx} id={anchorId} className="w-full max-w-5xl mx-auto breakout-wide my-8">
                {F}
              </div>
            ) : null;
          }
          case "module": {
            if (seen.has("m:" + b.id)) return null;
            seen.add("m:" + b.id);
            moduleCount++;
            const anchorId = idPrefix
              ? `${idPrefix}interactive-modules-${moduleCount}`
              : moduleCount === 1
              ? "interactive-modules"
              : `interactive-modules-${moduleCount}`;
            const M = MODULES[b.id];
            return M ? (
              <div key={idx} id={anchorId} data-module={b.id} className="w-full max-w-7xl mx-auto breakout-full my-10">
                {M}
              </div>
            ) : null;
          }
          case "code":
            return (
              <div key={idx} className={`w-full max-w-5xl mx-auto breakout-wide my-6 ${b.badge ? badgeTf(b.badge) : ""}`}>
                <CodeBlock source={b.source} lang={b.lang} caption={b.caption} />
              </div>
            );
          case "quote":
            return (
              <blockquote
                key={idx}
                className={`callout co-${b.badge} w-full ${
                  isFrontierSynthesis ? "max-w-none" : "max-w-5xl mx-auto breakout-wide"
                } my-6`}
              >
                <div className="mb-2">
                  <BadgeChip b={b.badge} />
                </div>
                <p className="prose-wsp m-0 text-base italic leading-relaxed text-foreground w-full max-w-none">
                  “{inline(b.text)}”
                </p>
                <cite className="mt-2 block font-sans text-xs text-muted-foreground not-italic">
                  - {b.source}
                </cite>
              </blockquote>
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
