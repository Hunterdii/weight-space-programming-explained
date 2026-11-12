import type { Metadata } from "next";
import { BadgeLegend, BadgeChip } from "@/components/content/Badge";
import { UPDATE_LOG, SOURCE } from "@/content/facts";
import CitationBox from "@/components/site/CitationBox";
import ClaimRebuttalBoard from "@/components/content/ClaimRebuttalBoard";
import {
  Info,
  ShieldCheck,
  Scale,
  Keyboard,
  Clock,
  FileDown,
  CheckCircle2,
  UserCheck,
  ExternalLink,
  Github,
  Layers,
  Binary,
  Award,
  ArrowUpRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "About the Guide - Methodology, Author, Disclosures & Updates",
  description:
    "How this independent field guide was built: the truth contract, the audience ladder, credits, license, and the post-launch update ledger.",
};

const SHORTCUTS: [string, string][] = [
  ["Space", "Play / pause active interactive simulation module"],
  ["→ / ←", "Step active simulation forward or backward"],
  ["R", "Reset the active simulation module to t=0"],
  ["1 – 9", "Jump directly to field guide chapter 1 … 9"],
  ["[ / ]", "Step down / climb up the audience ladder (5 levels)"],
  ["T", "Toggle Truth Filter: isolate peer-reported & reviewed facts"],
  ["L", "Toggle numerical labels on data charts"],
  ["D", "Toggle dark / light observatory theme"],
  ["?", "Open interactive keyboard shortcuts modal"],
  ["Esc", "Dismiss active modals and sheets"],
];

const PROVENANCE_TIERS = [
  {
    badge: "paper" as const,
    title: "Paper-Reported",
    borderClass: "border-[var(--wsp-blue)]/50",
    bgClass: "bg-[color-mix(in_oklab,var(--wsp-blue)_8%,transparent)]",
    dotColor: "var(--wsp-blue)",
    criteria:
      "Direct empirical results from Takehi et al. (MIT CSAIL, Nov 2026). Exact measurements, benchmark scores, and reported model weights from primary experimental logs.",
  },
  {
    badge: "review" as const,
    title: "Independent Review",
    borderClass: "border-[var(--wsp-green)]/50",
    bgClass: "bg-[color-mix(in_oklab,var(--wsp-green)_8%,transparent)]",
    dotColor: "var(--wsp-green)",
    criteria:
      "Claims independently evaluated by third parties, including Andreas Maier’s evidence scoreboard, Simon Willison’s laptop replication, and community Hugging Face seed runs.",
  },
  {
    badge: "schematic" as const,
    title: "Teaching Schematic",
    borderClass: "border-[var(--wsp-amber)]/50",
    bgClass: "bg-[color-mix(in_oklab,var(--wsp-amber)_8%,transparent)]",
    dotColor: "var(--wsp-amber)",
    criteria:
      "Pedagogical diagrams, circuit approximations, and interactive simulations designed to build mechanistic intuition. Watermarked to prevent confusion with empirical data.",
  },
  {
    badge: "speculation" as const,
    title: "Speculation & Horizon",
    borderClass: "border-[var(--wsp-red)]/50",
    bgClass: "bg-[color-mix(in_oklab,var(--wsp-red)_8%,transparent)]",
    dotColor: "var(--wsp-red)",
    criteria:
      "Extrapolations, reachability conjectures, and prospective AI governance forecasts. Strictly quarantined from empirical observations to eliminate false certainty.",
  },
];

const RESEARCH_PILLARS = [
  {
    title: "The Truth Contract",
    icon: ShieldCheck,
    iconColor: "var(--wsp-amber)",
    desc: "Every single claim carries exactly one color-and-shape badge (Paper, Review, Schematic, Speculation). Schematics bear watermarks. Press 'T' to isolate empirical facts on demand.",
  },
  {
    title: "The 5-Tier Audience Ladder",
    icon: Layers,
    iconColor: "var(--wsp-blue)",
    desc: "All 13 chapters exist simultaneously across five technical depths (ELI12, High School, Undergrad, Graduate, Frontier Researcher) without breaking narrative coherence.",
  },
  {
    title: "Single Source of Truth",
    icon: Binary,
    iconColor: "var(--wsp-chrome)",
    desc: "Every chart, metric, and benchmark binds strictly to a single machine-readable fact sheet (facts.ts / fact-sheet.json), preventing contradictory numbers across views.",
  },
  {
    title: "WCAG 2.2 AA Accessibility",
    icon: Scale,
    iconColor: "var(--wsp-green)",
    desc: "Keyboard-first navigation, aria-live accessibility announcements on interactive simulations, high-contrast tokens (≥4.5:1), and reduced-motion fallbacks.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-10 sm:py-14 sm:px-6 lg:px-10 space-y-10 sm:space-y-14">
      {/* ========================================================
          EDITORIAL HEADER
          ======================================================== */}
      <header className="space-y-4 max-w-[95ch]">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md shadow-xs">
          <Info className="size-3.5 text-[var(--wsp-chrome)]" />
          <span>RESEARCH METHODOLOGY · AUTHOR DISCLOSURES · LICENSING</span>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
          About the Field Guide
        </h1>

        <p className="font-serif text-base sm:text-lg leading-relaxed text-muted-foreground">
          Weight-Space Programming is an independent educational product created to demystify, critique, and provide runnable reproductions of MIT CSAIL&apos;s landmark research on direct weight manipulation without gradient descent.
        </p>
      </header>

      {/* ========================================================
          EDITORIAL 2-COLUMN DOSSIER LAYOUT (Desktop lg:)
          Left: lg:col-span-4 (1/3 sticky sidebar)
          Right: lg:col-span-8 (2/3 research monograph dossier)
          ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
        {/* ========================================================
            LEFT COLUMN: DOSSIER SIDEBAR (lg:col-span-4, sticky top-24)
            ======================================================== */}
        <aside className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
          {/* Card 1: Author Profile & Credentials Dossier */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-xs">
            <div className="flex items-center gap-3.5 border-b border-border/60 pb-4">
              <div className="relative flex size-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--wsp-blue)]/40 bg-[color-mix(in_oklab,var(--wsp-blue)_12%,transparent)] font-mono text-sm font-bold text-[var(--wsp-blue)] shadow-xs">
                <span>HP</span>
                <span className="absolute -bottom-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[var(--wsp-green)] text-background">
                  <CheckCircle2 className="size-3 stroke-[2.5]" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-sans text-base font-bold text-foreground truncate">
                    Het Patel (Hunterdii)
                  </h2>
                </div>
                <p className="font-mono text-xs text-muted-foreground truncate">
                  Author &amp; Systems Designer
                </p>
                <span className="inline-block rounded-md border border-[var(--wsp-blue)]/30 bg-[color-mix(in_oklab,var(--wsp-blue)_8%,transparent)] px-1.5 py-0.5 font-mono text-[10px] font-semibold text-[var(--wsp-blue)] mt-1">
                  Independent Researcher
                </span>
              </div>
            </div>

            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              Independent AI systems researcher specializing in mechanistic interpretability, transformer circuits, and educational tooling. Creator and maintainer of the Weight-Space Programming interactive monograph.
            </p>

            <div className="space-y-2 border-t border-border/50 pt-3 font-mono text-xs">
              <a
                href="https://github.com/Hunterdii/weight-space-programming"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-border/70 bg-accent/20 px-3.5 py-2.5 text-foreground hover:bg-accent/60 hover:border-foreground/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <Github className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="font-semibold">GitHub Repository</span>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              <a
                href="https://github.com/Hunterdii"
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-between rounded-xl border border-border/70 bg-accent/20 px-3.5 py-2.5 text-foreground hover:bg-accent/60 hover:border-foreground/30 transition-all"
              >
                <div className="flex items-center gap-2.5">
                  <UserCheck className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <span className="font-semibold">Author GitHub Profile</span>
                </div>
                <ArrowUpRight className="size-3.5 text-muted-foreground group-hover:text-foreground transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>

            <div className="rounded-xl border border-border/60 bg-muted/30 p-3 text-[11px] font-serif text-muted-foreground leading-relaxed">
              <div className="flex items-center gap-1.5 font-sans font-semibold text-foreground mb-1">
                <Award className="size-3 text-[var(--wsp-green)]" />
                <span>Funding &amp; Non-Affiliation</span>
              </div>
              100% self-funded independent educational endeavor. Zero corporate or institutional grants. All code, analyses, and interactive modules authored independently.
            </div>
          </div>

          {/* Card 2: Executive Dossier & Quick Stats */}
          <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--wsp-chrome)]">
                Executive Dossier
              </span>
              <span className="rounded-full border border-border/70 bg-accent/40 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
                Atlas Edition · Nov 2026
              </span>
            </div>

            <div className="space-y-3 font-serif text-xs text-muted-foreground leading-relaxed">
              <p>
                <strong className="text-foreground font-sans text-sm block mb-1">
                  Weight-Space Programming Monograph
                </strong>
                An empirical deconstruction of symbolic neural parameter synthesis and surgical weight editing. Covers induction-head discovery, rank-1 low-rank surgery, and direct procedural parameter generation.
              </p>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 font-mono text-[11px]">
                <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Chapters</span>
                  <span className="font-bold text-foreground text-sm tabular-nums">13 Active</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Experiments</span>
                  <span className="font-bold text-[var(--wsp-blue)] text-sm tabular-nums">8 Verified</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Modules</span>
                  <span className="font-bold text-[var(--wsp-chrome)] text-sm tabular-nums">15 Interactive</span>
                </div>
                <div className="rounded-xl border border-border/60 bg-muted/30 p-2.5">
                  <span className="text-muted-foreground block text-[10px] uppercase tracking-wider">Truth Badges</span>
                  <span className="font-bold text-[var(--wsp-green)] text-sm">4 Badges</span>
                </div>
              </div>

              <div className="rounded-xl border border-border/50 bg-accent/20 p-2.5 font-mono text-[10px] text-muted-foreground flex items-center justify-between">
                <span>Edited Parameters:</span>
                <span className="font-bold text-foreground">131,072 (0.016%)</span>
              </div>
            </div>
          </div>

          {/* Card 3: BibTeX Citation Block */}
          <CitationBox />

          {/* Card 4: Prominent Whitepaper PDF Download CTA */}
          <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs">
            <div className="flex items-center gap-2 text-foreground">
              <FileDown className="size-4 text-[var(--wsp-green)]" />
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider">
                Full Research Whitepaper
              </h3>
            </div>
            <p className="font-serif text-xs text-muted-foreground leading-relaxed">
              Download the standalone PDF monograph with all formulas, proofs, and tabular benchmark comparisons for offline reading.
            </p>
            <a
              href="/whitepaper.pdf"
              download="weight-space-programming-whitepaper.pdf"
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 font-sans text-xs font-bold text-background shadow-md transition-all duration-200 hover:brightness-110 hover:-translate-y-0.5 active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <FileDown className="size-4" />
              <span>Download PDF</span>
            </a>
          </div>
        </aside>

        {/* ========================================================
            RIGHT COLUMN: EDITORIAL RESEARCH DOSSIER (lg:col-span-8)
            ======================================================== */}
        <main className="lg:col-span-8 space-y-12 sm:space-y-14">
          {/* Section 1: Academic Lineage & Research Credit */}
          <section aria-labelledby="credits" className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
              <UserCheck className="size-5 text-[var(--wsp-blue)]" />
              <h2 id="credits" className="font-sans text-xl font-black tracking-tight text-foreground">
                Credits, Lineage &amp; Non-Affiliation
              </h2>
            </div>

            <div className="callout co-paper space-y-4">
              <div className="flex items-center gap-2">
                <BadgeChip b="paper" />
                <span className="font-mono text-xs text-muted-foreground font-semibold">
                  Attribution Contract · Takehi et al. (2026)
                </span>
              </div>

              <p className="font-serif text-sm leading-relaxed text-foreground/95">
                <strong>Authored by Het Patel (Hunterdii)</strong>. Built on the MIT CSAIL research report <em>“Sparks of Weight-Space Programming: LLMs can natively read &amp; write neural network weights”</em> by <strong>Rikiya Takehi, Jayden Teoh, Alex Zhang, and Omar Khattab</strong>, published on {SOURCE.date}. All original empirical discoveries, model weights, and primary experiments belong entirely to the CSAIL authors.
              </p>

              <p className="font-serif text-xs leading-relaxed text-muted-foreground border-t border-border/50 pt-3">
                <strong>Explicit Non-Affiliation:</strong> This project is an independent educational initiative and is not affiliated with, endorsed by, or sponsored by MIT CSAIL, OpenAI, or the original authors. Modules and scripts designated as <em>Het’s Lab</em> are independent pedagogical additions.
              </p>

              {/* Primary Research Artifact Links */}
              <div className="grid gap-2 sm:grid-cols-2 border-t border-border/50 pt-3 font-mono text-xs">
                <a
                  href={SOURCE.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[var(--wsp-blue)] hover:bg-card hover:border-[var(--wsp-blue)]/50 transition-colors"
                >
                  <span className="truncate">Original CSAIL Publication</span>
                  <ExternalLink className="size-3.5 shrink-0 ml-1.5" />
                </a>
                <a
                  href="https://huggingface.co/RikiyaT/Qwen3.5-0.8B-weight-space-programming"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[var(--wsp-blue)] hover:bg-card hover:border-[var(--wsp-blue)]/50 transition-colors"
                >
                  <span className="truncate">Hugging Face Checkpoint</span>
                  <ExternalLink className="size-3.5 shrink-0 ml-1.5" />
                </a>
                <a
                  href="https://huggingface.co/spaces/akhaliq/weight-space-programming-demo"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[var(--wsp-blue)] hover:bg-card hover:border-[var(--wsp-blue)]/50 transition-colors"
                >
                  <span className="truncate">Ahsen Khaliq Space Demo</span>
                  <ExternalLink className="size-3.5 shrink-0 ml-1.5" />
                </a>
                <a
                  href="https://github.com/RikiyaT/lm_understand-logs"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-card/60 px-3 py-2 text-[var(--wsp-blue)] hover:bg-card hover:border-[var(--wsp-blue)]/50 transition-colors"
                >
                  <span className="truncate">Raw Experiment Logs</span>
                  <ExternalLink className="size-3.5 shrink-0 ml-1.5" />
                </a>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/50 pt-2 text-xs font-mono text-muted-foreground">
                <span>License: Code under MIT · Prose &amp; Diagrams under CC BY 4.0</span>
                <span>Fact-check date: 7 Nov 2026 (re-verified 8 Nov 2026)</span>
              </div>
            </div>
          </section>

          {/* Section 2: The Truth Contract Deep-Dive & Provenance Philosophy */}
          <section aria-labelledby="badges" className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
              <ShieldCheck className="size-5 text-[var(--wsp-amber)]" />
              <h2 id="badges" className="font-sans text-xl font-black tracking-tight text-foreground">
                The Truth Contract &amp; Provenance Philosophy
              </h2>
            </div>

            <p className="font-serif text-sm leading-relaxed text-muted-foreground">
              To defend against the epidemic of AI hype, benchmark overfitting, and narrative exaggeration, every claim, quantitative figure, and architectural schematic on this site carries exactly one provenance badge. Press <kbd className="kbd font-bold">T</kbd> anywhere on this guide to filter down to paper-verified facts.
            </p>

            {/* 4 Provenance Tiers Breakdown */}
            <div className="grid gap-3 sm:grid-cols-2">
              {PROVENANCE_TIERS.map((tier) => (
                <div
                  key={tier.badge}
                  className={`rounded-2xl border p-4 space-y-2.5 shadow-xs transition-all duration-200 hover:shadow-sm ${tier.borderClass} ${tier.bgClass}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <BadgeChip b={tier.badge} />
                    <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                      Contract Tier
                    </span>
                  </div>
                  <p className="font-serif text-xs leading-relaxed text-foreground/90">
                    {tier.criteria}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs">
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground mb-3">
                Master Badge Legend
              </h3>
              <BadgeLegend />
            </div>
          </section>

          {/* Dialectical Claim vs Rebuttal Scorecard */}
          <section aria-labelledby="claim-rebuttal-audit">
            <ClaimRebuttalBoard />
          </section>

          {/* Section 3: 4 Core Architectural Principles */}
          <section aria-labelledby="method" className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
              <Scale className="size-5 text-[var(--wsp-green)]" />
              <h2 id="method" className="font-sans text-xl font-black tracking-tight text-foreground">
                Core Architectural Principles
              </h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {RESEARCH_PILLARS.map((item) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border/80 bg-card p-5 space-y-3 shadow-xs transition-all duration-200 hover:border-foreground/30 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className="flex size-8 items-center justify-center rounded-lg border border-border/70 bg-accent/30"
                        style={{ color: item.iconColor }}
                      >
                        <IconComponent className="size-4" />
                      </div>
                      <h3 className="font-sans text-sm font-bold text-foreground">
                        {item.title}
                      </h3>
                    </div>
                    <p className="font-serif text-xs leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 4: Keyboard Console Navigation */}
          <section aria-labelledby="keyboard" className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
              <Keyboard className="size-5 text-[var(--wsp-chrome)]" />
              <h2 id="keyboard" className="font-sans text-xl font-black tracking-tight text-foreground">
                Keyboard Console Navigation
              </h2>
            </div>

            <p className="font-serif text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Power-user navigation console designed for mechanistic researchers and power readers. Access all features directly from your keyboard.
            </p>

            <div className="grid gap-2.5 sm:grid-cols-2">
              {SHORTCUTS.map(([k, d]) => (
                <div
                  key={k}
                  className="flex items-center justify-between gap-4 rounded-xl border border-border/70 bg-card/60 px-4 py-3 shadow-xs hover:border-foreground/20 transition-colors"
                >
                  <span className="font-serif text-xs text-foreground/90">{d}</span>
                  <kbd className="kbd shrink-0 font-bold">{k}</kbd>
                </div>
              ))}
            </div>
          </section>

          {/* Section 5: Chronological Update Ledger with Vertical Timeline Spine */}
          <section aria-labelledby="updates" className="space-y-6">
            <div className="flex items-center gap-2.5 border-b border-border/80 pb-3">
              <Clock className="size-5 text-muted-foreground" />
              <h2 id="updates" className="font-sans text-xl font-black tracking-tight text-foreground">
                Chronological Update Ledger
              </h2>
            </div>

            <p className="font-serif text-xs sm:text-sm text-muted-foreground leading-relaxed">
              A living research changelog logging peer reviews, replication signals, mechanistic proofs, and community updates in order of discovery.
            </p>

            {/* Sleek Vertical Timeline Spine */}
            <div className="relative space-y-6 sm:space-y-8 pl-8 sm:pl-10">
              {/* Continuous vertical timeline connector line */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute left-[14px] sm:left-[17px] top-3 bottom-3 w-[2px] bg-gradient-to-b from-[var(--wsp-chrome)] via-border to-border/40"
              />

              {UPDATE_LOG.map((u, idx) => {
                const tagStr = u.tag as string;
                const isVerdict = tagStr === "monograph verdict";
                const isHorizon = tagStr === "benchmark horizon" || tagStr === "watch";
                const isReplication = tagStr === "replication signal";
                const isReview = tagStr === "review";
                const isMechanistic = tagStr === "mechanistic insight";

                const dotColor = isVerdict
                  ? "var(--wsp-green)"
                  : isHorizon
                  ? "var(--wsp-amber)"
                  : isReplication
                  ? "var(--wsp-green)"
                  : isReview
                  ? "var(--wsp-blue)"
                  : isMechanistic
                  ? "var(--wsp-amber)"
                  : "var(--wsp-chrome)";

                return (
                  <div key={u.date + u.tag + idx} className="relative group">
                    {/* Node Dot on the Vertical Spine (Mathematically Centered) */}
                    <div className="absolute -left-[27px] sm:-left-[32px] top-3.5 flex size-5 items-center justify-center rounded-full border-2 border-border bg-card shadow-xs group-hover:scale-125 group-hover:border-foreground/50 transition-all duration-200 z-10">
                      <div
                        className="size-2 rounded-full transition-all duration-200"
                        style={{
                          backgroundColor: dotColor,
                          boxShadow: `0 0 6px ${dotColor}`,
                        }}
                      />
                    </div>

                    {/* Timeline Entry Card */}
                    <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-5 text-xs shadow-xs transition-all duration-200 hover:border-foreground/30 hover:shadow-md hover:-translate-y-0.5">
                      <div className="flex flex-wrap items-center gap-2.5 mb-2">
                        <span
                          className="font-mono font-bold text-xs tabular-nums"
                          style={{ color: dotColor }}
                        >
                          {u.date}
                        </span>
                        <span className="rounded-full border border-border/80 bg-accent/40 px-2.5 py-0.5 font-mono text-[9px] uppercase tracking-wider font-semibold text-muted-foreground">
                          {u.tag}
                        </span>
                      </div>
                      <p className="font-serif text-foreground/90 leading-relaxed text-xs sm:text-sm">
                        {u.text}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
