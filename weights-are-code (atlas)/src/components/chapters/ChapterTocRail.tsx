"use client";

import { useState, useEffect } from "react";
import type { Chapter, Block, Badge } from "@/content/types";
import { BADGE_META } from "@/content/types";
import { useReading } from "@/state/store";
import {
  AlignLeft,
  ShieldCheck,
  Clock,
  ArrowUp,
  ChevronDown,
  Layers,
  Sparkles,
  Filter,
  CheckCircle,
} from "lucide-react";

interface ChapterTocRailProps {
  chapter: Chapter;
}

interface TocItem {
  id: string;
  label: string;
  kind?: string;
}

function countBadges(chapter: Chapter): Record<Badge, number> {
  const counts: Record<Badge, number> = {
    paper: 0,
    review: 0,
    schematic: 0,
    speculation: 0,
  };

  const tally = (blocks: Block[]) => {
    for (const b of blocks) {
      if (b.kind === "callout" && b.badge) counts[b.badge]++;
      if (b.kind === "quote" && b.badge) counts[b.badge]++;
      if (b.kind === "code" && b.badge) counts[b.badge]++;
    }
  };

  tally(chapter.shared);
  Object.values(chapter.levels).forEach((lvlBlocks) => tally(lvlBlocks));

  return counts;
}

export default function ChapterTocRail({ chapter }: ChapterTocRailProps) {
  const [activeId, setActiveId] = useState<string>("overview");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const truthFilter = useReading((s) => s.truthFilter);
  const toggleTruthFilter = useReading((s) => s.toggleTruthFilter);

  // Derive static list of TOC anchors based on chapter content
  const tocItems: TocItem[] = [
    { id: "overview", label: "Overview & Orientation" },
    { id: "audience-level", label: "Reading Audience Rigor" },
  ];

  // Inspect shared blocks for key clusters
  const hasModule = chapter.shared.some((b) => b.kind === "module");
  const hasFormula = chapter.shared.some((b) => b.kind === "formula");
  const hasTable = chapter.shared.some((b) => b.kind === "table");
  const hasFigure = chapter.shared.some((b) => b.kind === "figure");

  if (hasModule) {
    tocItems.push({ id: "interactive-modules", label: "Interactive Simulation", kind: "module" });
  }
  if (hasFormula) {
    tocItems.push({ id: "mathematical-formulations", label: "Formulations Suite", kind: "formula" });
  }
  if (hasTable) {
    tocItems.push({ id: "empirical-benchmarks", label: "Empirical Benchmarks", kind: "table" });
  }
  if (hasFigure) {
    tocItems.push({ id: "schematic-figures", label: "Teaching Schematics", kind: "figure" });
  }

  // Include shared section headings if present
  for (const b of chapter.shared) {
    if (b.kind === "h") {
      const headingSlug = b.text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (headingSlug) {
        tocItems.push({ id: headingSlug, label: b.text });
      }
    }
  }

  tocItems.push({ id: "foundational-refreshers", label: "Refresher Ladder" });
  tocItems.push({ id: "chapter-navigation", label: "Chapter Navigation" });

  // Badge statistics for the plaque
  const badgeCounts = countBadges(chapter);
  const totalBadges = Object.values(badgeCounts).reduce((a, b) => a + b, 0);

  // Setup scroll spy with IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find visible section
        const visible = entries.find((e) => e.isIntersecting);
        if (visible && visible.target.id) {
          setActiveId(visible.target.id);
        }
      },
      {
        rootMargin: "-80px 0px -60% 0px",
        threshold: 0.1,
      }
    );

    const idsToObserve = tocItems.map((item) => item.id);
    idsToObserve.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
      if (history.pushState) {
        history.pushState(null, "", `#${id}`);
      }
    }
    setIsMobileOpen(false);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const content = (
    <div className="space-y-6">
      {/* Table of Contents Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-muted-foreground border-b border-border/70 pb-3">
          <AlignLeft className="size-3.5 text-[var(--wsp-chrome)]" />
          <span>On this page</span>
        </div>

        {/* TOC Links */}
        <nav aria-label="Table of Contents" className="mt-3 space-y-1">
          {tocItems.map((item) => {
            const isActive = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => scrollToSection(e, item.id)}
                className={`group flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs transition-all ${
                  isActive
                    ? "bg-card font-semibold text-foreground border-l-2 border-[var(--wsp-chrome)] shadow-xs"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground"
                }`}
              >
                <span
                  className={`size-1.5 rounded-full shrink-0 ${
                    isActive ? "bg-[var(--wsp-chrome)] scale-125" : "bg-border/60"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Truth Contract Plaque */}
      <div className="rounded-xl border border-border/70 bg-card/60 p-3.5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-foreground">
            <ShieldCheck className="size-3.5 text-[var(--wsp-green)]" />
            <span>Truth Contract</span>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            {totalBadges} verified
          </span>
        </div>

        <p className="font-serif text-[11px] leading-relaxed text-muted-foreground italic">
          Every statement and schematic carries empirical provenance.
        </p>

        {/* Badge breakdown chips */}
        <div className="grid grid-cols-2 gap-1.5 pt-1">
          {(["paper", "review", "schematic", "speculation"] as Badge[]).map((badgeKey) => {
            const count = badgeCounts[badgeKey];
            const meta = BADGE_META[badgeKey];
            if (count === 0) return null;

            return (
              <div
                key={badgeKey}
                className="flex items-center gap-1.5 rounded-md border border-border/60 bg-background/80 px-2 py-1 text-[10px]"
                title={meta.desc}
              >
                <span>{meta.icon}</span>
                <span className="font-mono font-medium text-foreground">{count}</span>
                <span className="truncate text-muted-foreground">{badgeKey}</span>
              </div>
            );
          })}
        </div>

        {/* Quick Truth Filter Toggle Button */}
        <div className="border-t border-border/60 pt-2.5">
          <button
            type="button"
            onClick={() => toggleTruthFilter()}
            className={`flex w-full items-center justify-between rounded-lg border px-2.5 py-1.5 text-[11px] font-mono font-bold transition-all ${
              truthFilter
                ? "bg-[var(--wsp-blue)] text-white border-[var(--wsp-blue)] shadow-xs"
                : "bg-background/90 text-foreground border-border/80 hover:bg-card"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Filter className="size-3" />
              <span>{truthFilter ? "Truth Filter Active" : "Filter Paper Facts"}</span>
            </span>
            <kbd className="rounded bg-black/20 px-1 py-0.5 text-[9px] uppercase font-mono">T</kbd>
          </button>
        </div>
      </div>

      {/* Reading Telemetry */}
      <div className="rounded-xl border border-border/60 bg-card/40 p-3 space-y-2 text-[11px] font-mono text-muted-foreground">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Clock className="size-3" /> Reading time
          </span>
          <span className="font-bold text-foreground">{chapter.minutes} min</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Curriculum spot</span>
          <span className="font-bold text-foreground">Ch {chapter.number} of 13</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Section Part</span>
          <span className="font-bold text-foreground">Part {chapter.part} of IV</span>
        </div>
      </div>

      {/* Back to Top Quick Action */}
      <div className="border-t border-border/70 pt-2">
        <button
          type="button"
          onClick={scrollToTop}
          className="flex w-full items-center justify-center gap-1.5 rounded-lg py-1.5 text-xs font-mono text-muted-foreground hover:bg-card hover:text-foreground transition-colors"
        >
          <ArrowUp className="size-3" />
          <span>Back to Top</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Rail */}
      <aside
        aria-label="Table of Contents & Chapter Telemetry"
        className="w-64 shrink-0 hidden xl:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pl-2 pb-8 scrollbar-thin"
      >
        <div className="rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm shadow-xs">
          {content}
        </div>
      </aside>

      {/* Mobile / Tablet Collapsible Pill Drawer */}
      <div className="xl:hidden w-full mb-6 order-1 xl:order-none">
        <div className="rounded-2xl border border-border/80 bg-card/70 p-3 shadow-xs">
          <button
            type="button"
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="flex w-full items-center justify-between text-xs font-mono font-bold text-foreground"
            aria-expanded={isMobileOpen}
          >
            <div className="flex items-center gap-2 min-w-0">
              <AlignLeft className="size-3.5 text-[var(--wsp-chrome)] shrink-0" />
              <span className="truncate">On this page <span className="hidden sm:inline">(TOC)</span></span>
              <span className="rounded-md bg-border/40 px-1.5 py-0.5 text-[10px] text-muted-foreground shrink-0">
                {chapter.minutes}m read
              </span>
            </div>
            <ChevronDown
              className={`size-4 text-muted-foreground transition-transform duration-200 ${
                isMobileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isMobileOpen && (
            <div className="mt-4 border-t border-border/70 pt-4">
              {content}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
