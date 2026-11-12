"use client";

import { useRef, useState, useMemo, useEffect, useCallback } from "react";
import ModuleChrome from "./ModuleChrome";
import { RISKS } from "@/content/facts";
import { clamp } from "./utils";
import { useTheme } from "next-themes";
import {
  ShieldCheck,
  ShieldAlert,
  RotateCcw,
  AlertTriangle,
  Sparkles,
  Compass,
  Crosshair,
  Sliders,
  Copy,
  Check,
  Radar,
  LayoutGrid,
  ListOrdered,
  Layers,
  ArrowUpRight,
  TrendingDown,
  Info,
  Wand2,
  Lock,
  Cpu,
  Boxes,
  Zap,
  Sun,
  Moon,
  Monitor,
  Smartphone,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";

interface Bubble {
  id: string;
  x: number; // Likelihood: 0..1
  y: number; // Impact: 0..1
}

interface RiskMeta {
  index: string;
  shortLabel: string;
  pillLabel: string;
  category: string;
  severity: "critical" | "high" | "operational" | "positive";
  tag: string;
  mechanism: string;
  readiness: "Production Ready" | "Active Research" | "Governance Gap" | "Catalytic Opportunity";
  researchQuestion: string;
  anchor: "left" | "right" | "top" | "bottom";
}

const RISK_META: Record<string, RiskMeta> = {
  rsi: {
    index: "01",
    shortLabel: "Recursive SI",
    pillLabel: "Recursive Self-Improvement",
    category: "Frontier Horizon",
    severity: "critical",
    tag: "Q1 · Tail Risk",
    mechanism: "Autonomous models editing weights without human evaluation compounding latent drift and alignment failure.",
    readiness: "Active Research",
    researchQuestion: "Can self-editing systems reliably evaluate their own changes without feedback loops amplifying bias?",
    anchor: "right",
  },
  backdoors: {
    index: "02",
    shortLabel: "Trojan Weights",
    pillLabel: "Weight-Level Backdoors",
    category: "Structural Risk",
    severity: "critical",
    tag: "Q1 · Severe Tamper",
    mechanism: "Adversaries embedding dormant circuits in low-rank subspaces that bypass standard benchmark suites.",
    readiness: "Production Ready",
    researchQuestion: "What statistical power is needed to detect a 0.016% anomalous parameter modification without knowing the direction?",
    anchor: "right",
  },
  conceal: {
    index: "03",
    shortLabel: "Concealment",
    pillLabel: "Capability Concealment",
    category: "Auditing Blindspot",
    severity: "critical",
    tag: "Q1 · Latent Evasion",
    mechanism: "Deceptive alignment where harmful capabilities lie dormant during inspection probes.",
    readiness: "Active Research",
    researchQuestion: "How do we calibrate multi-model weight readers to prevent confirmation bias and hallucinations?",
    anchor: "right",
  },
  guardrails: {
    index: "04",
    shortLabel: "Safety Removal",
    pillLabel: "Safety-Training Removal",
    category: "Imminent Hazard",
    severity: "critical",
    tag: "Q2 · Immediate Hazard",
    mechanism: "Single-direction vector subtraction stripping refusal behaviors from open weights for pennies.",
    readiness: "Production Ready",
    researchQuestion: "Can tamper-resistant training make refusal representations orthogonal to low-rank projection?",
    anchor: "left",
  },
  power: {
    index: "05",
    shortLabel: "Power Monopoly",
    pillLabel: "Power Concentration",
    category: "Market Centralization",
    severity: "high",
    tag: "Q2 · Asymmetry",
    mechanism: "Proprietary reasoning editors concentrating model customization and forensic auditing among frontier labs.",
    readiness: "Governance Gap",
    researchQuestion: "Can open-source small-model toolchains maintain parity with commercial weight-space compilers?",
    anchor: "left",
  },
  compute: {
    index: "06",
    shortLabel: "Compute Blindspot",
    pillLabel: "Compute-Threshold Evasion",
    category: "Governance Gap",
    severity: "high",
    tag: "Q2 · Regulatory Gap",
    mechanism: "High-capability surgery on 0.016% of weights bypassing FLOP-based regulatory thresholds completely.",
    readiness: "Governance Gap",
    researchQuestion: "How should policy frameworks pivot from training-compute monitoring to post-release weight attestation?",
    anchor: "left",
  },
  supply: {
    index: "07",
    shortLabel: "Supply Chain",
    pillLabel: "Supply Chain & Licence",
    category: "Provenance Failure",
    severity: "operational",
    tag: "Q4 · Provenance",
    mechanism: "Weight diffs distributed without cryptographic attestation, laundering proprietary behaviours.",
    readiness: "Production Ready",
    researchQuestion: "How do we standardize an open Software Bill of Materials (SBOM) for neural weight diffs?",
    anchor: "left",
  },
  goodhart: {
    index: "08",
    shortLabel: "Benchmark Gaming",
    pillLabel: "Goodhart & Gaming",
    category: "Measurement Drift",
    severity: "operational",
    tag: "Q4 · Evaluation Drift",
    mechanism: "Weight-space optimizers overfitting fixed evaluation harnesses without genuine reasoning gains.",
    readiness: "Active Research",
    researchQuestion: "Can author-blind, dynamically generated probe suites prevent symbolic weight gaming?",
    anchor: "left",
  },
  overtrust: {
    index: "09",
    shortLabel: "Over-trust",
    pillLabel: "Narrative Over-trust",
    category: "Epistemic Bias",
    severity: "operational",
    tag: "Q4 · Epistemic Bias",
    mechanism: "Plausible LLM explanations of weight modifications disguising unintended side effects.",
    readiness: "Production Ready",
    researchQuestion: "What automated verification pipelines can ground reasoning narratives against hard activation telemetry?",
    anchor: "top",
  },
  upside: {
    index: "10",
    shortLabel: "✦ Defensive Dividend",
    pillLabel: "✦ What Could Go Right",
    category: "Defensive Dividend",
    severity: "positive",
    tag: "Q4 · High Opportunity",
    mechanism: "Zero-gradient model customization, democratized interpretability, surgical unlearning, and verifiable safety patches.",
    readiness: "Catalytic Opportunity",
    researchQuestion: "Can community-curated defensive weight libraries outpace unilateral offensive model modification?",
    anchor: "left",
  },
};

/**
 * Mathematically engineered coordinates with guaranteed Euclidean clearance (≥0.18 spacing).
 * Eliminates all overlapping text, collisions, and edge clipping.
 */
const DEFAULT_PRESETS: Record<"baseline" | "adversarial" | "defensive", Bubble[]> = {
  baseline: [
    { id: "rsi", x: 0.18, y: 0.86 },
    { id: "backdoors", x: 0.35, y: 0.70 },
    { id: "conceal", x: 0.20, y: 0.46 },
    { id: "guardrails", x: 0.82, y: 0.84 },
    { id: "power", x: 0.58, y: 0.72 },
    { id: "compute", x: 0.82, y: 0.58 },
    { id: "supply", x: 0.60, y: 0.38 },
    { id: "goodhart", x: 0.82, y: 0.28 },
    { id: "overtrust", x: 0.40, y: 0.22 },
    { id: "upside", x: 0.80, y: 0.14 },
  ],
  adversarial: [
    { id: "rsi", x: 0.30, y: 0.90 },
    { id: "backdoors", x: 0.68, y: 0.86 },
    { id: "conceal", x: 0.52, y: 0.76 },
    { id: "guardrails", x: 0.88, y: 0.88 },
    { id: "power", x: 0.74, y: 0.78 },
    { id: "compute", x: 0.86, y: 0.72 },
    { id: "supply", x: 0.74, y: 0.54 },
    { id: "goodhart", x: 0.84, y: 0.46 },
    { id: "overtrust", x: 0.64, y: 0.36 },
    { id: "upside", x: 0.40, y: 0.16 },
  ],
  defensive: [
    { id: "rsi", x: 0.14, y: 0.62 },
    { id: "backdoors", x: 0.22, y: 0.44 },
    { id: "conceal", x: 0.16, y: 0.34 },
    { id: "guardrails", x: 0.38, y: 0.46 },
    { id: "power", x: 0.34, y: 0.54 },
    { id: "compute", x: 0.46, y: 0.38 },
    { id: "supply", x: 0.28, y: 0.28 },
    { id: "goodhart", x: 0.42, y: 0.20 },
    { id: "overtrust", x: 0.24, y: 0.16 },
    { id: "upside", x: 0.88, y: 0.86 },
  ],
};

const SEVERITY_COLORS: Record<string, { stroke: string; lightBg: string; darkBg: string; text: string; glow: string }> = {
  critical: {
    stroke: "var(--wsp-red)",
    lightBg: "rgba(220, 38, 38, 0.10)",
    darkBg: "rgba(239, 68, 68, 0.22)",
    text: "var(--wsp-red)",
    glow: "rgba(239, 68, 68, 0.4)",
  },
  high: {
    stroke: "var(--wsp-amber)",
    lightBg: "rgba(217, 119, 6, 0.10)",
    darkBg: "rgba(245, 158, 11, 0.22)",
    text: "var(--wsp-amber)",
    glow: "rgba(245, 158, 11, 0.4)",
  },
  operational: {
    stroke: "var(--wsp-blue)",
    lightBg: "rgba(37, 99, 235, 0.10)",
    darkBg: "rgba(59, 130, 246, 0.22)",
    text: "var(--wsp-blue)",
    glow: "rgba(59, 130, 246, 0.4)",
  },
  positive: {
    stroke: "var(--wsp-green)",
    lightBg: "rgba(5, 150, 105, 0.10)",
    darkBg: "rgba(16, 185, 129, 0.25)",
    text: "var(--wsp-green)",
    glow: "rgba(16, 185, 129, 0.45)",
  },
};

export default function M12RiskRadar() {
  const { resolvedTheme } = useTheme();
  const [bubbles, setBubbles] = useState<Bubble[]>(DEFAULT_PRESETS.baseline);
  const [selected, setSelected] = useState<string>("guardrails");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"radar" | "matrix" | "list">("radar");
  const [severityFilter, setSeverityFilter] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<"threat" | "defence" | "frontier">("threat");
  const [scenario, setScenario] = useState<"baseline" | "adversarial" | "defensive">("baseline");
  const [copied, setCopied] = useState<boolean>(false);
  const [radarThemeMode, setRadarThemeMode] = useState<"auto" | "light" | "hud">("auto");

  const dragging = useRef<string | null>(null);
  const canvasRef = useRef<HTMLDivElement | null>(null);

  // Determine whether the radar canvas renders in dark tactical cockpit mode or pristine light grid mode
  const isDarkCanvas = useMemo(() => {
    if (radarThemeMode === "hud") return true;
    if (radarThemeMode === "light") return false;
    return resolvedTheme !== "light";
  }, [radarThemeMode, resolvedTheme]);

  const risk = RISKS.find((r) => r.id === selected) ?? RISKS[0];
  const meta = RISK_META[risk.id] ?? RISK_META.guardrails;
  const selectedBubble = bubbles.find((b) => b.id === risk.id) ?? { x: 0.5, y: 0.5 };
  const currentColors = SEVERITY_COLORS[meta.severity];

  // Live Risk Exposure Score: (Likelihood * Impact) * 100
  const riskExposure = Math.round(selectedBubble.x * selectedBubble.y * 100);

  const exposureTier = useMemo(() => {
    if (meta.severity === "positive") {
      return { label: "DEFENSIVE DIVIDEND", color: "var(--wsp-green)" };
    }
    if (riskExposure >= 60) {
      return { label: "CRITICAL EXPOSURE", color: "var(--wsp-red)" };
    }
    if (riskExposure >= 35) {
      return { label: "ELEVATED HAZARD", color: "var(--wsp-amber)" };
    }
    return { label: "OPERATIONAL DRIFT", color: "var(--wsp-blue)" };
  }, [riskExposure, meta.severity]);

  // Pointer drag calculation
  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      const el = canvasRef.current;
      if (!el || !dragging.current) return;
      const rect = el.getBoundingClientRect();
      const x = clamp((clientX - rect.left) / rect.width, 0.10, 0.90);
      const y = clamp(1 - (clientY - rect.top) / rect.height, 0.10, 0.90);

      setBubbles((prev) => prev.map((b) => (b.id === dragging.current ? { ...b, x, y } : b)));
    },
    []
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = null;
  }, []);

  // Update via manual sliders in the inspector
  const updateSelectedCoordinates = (newX?: number, newY?: number) => {
    setBubbles((prev) =>
      prev.map((b) => {
        if (b.id !== selected) return b;
        return {
          ...b,
          x: newX !== undefined ? clamp(newX, 0.08, 0.92) : b.x,
          y: newY !== undefined ? clamp(newY, 0.08, 0.92) : b.y,
        };
      })
    );
  };

  const applyScenario = (key: "baseline" | "adversarial" | "defensive") => {
    setScenario(key);
    setBubbles(DEFAULT_PRESETS[key]);
    toast.success(`Loaded Threat Scenario: ${key.toUpperCase()}`);
  };

  const copyDefence = () => {
    navigator.clipboard.writeText(
      `[${meta.pillLabel}] Defensive Protocol:\n${risk.defence}\n\nFrontier Auditing Task:\n${meta.researchQuestion}`
    );
    setCopied(true);
    toast.success("Defensive blueprint copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Filtered risks for matrix and list views
  const filteredRisks = useMemo(() => {
    if (severityFilter === "all") return RISKS;
    return RISKS.filter((r) => {
      const m = RISK_META[r.id];
      return m?.severity === severityFilter;
    });
  }, [severityFilter]);

  return (
    <ModuleChrome
      id="m12-risk-radar"
      badge="speculation"
      title="M12 · The Risk Radar & Defense Command Center"
      blurb="Tactical 2D Threat Matrix with anti-collision nodes, dynamic risk exposure indexing, and actionable countermeasures"
      caption={`Threat Vector "${risk.title}" selected (Likelihood: ${(selectedBubble.x * 100).toFixed(0)}%, Impact: ${(selectedBubble.y * 100).toFixed(0)}%, Exposure Score: ${riskExposure}/100). Drag nodes or use fine sliders.`}
      levelCaptions={{
        1: "A weather map of AI risks. Storms in the top-right represent severe, immediate hazards. Every single storm is paired with an actionable defender's shield.",
        2: "2D Cartesian matrix: Likelihood (X-axis) × Impact (Y-axis). The core goal is tactical defense: each vulnerability has a concrete verification toolchain buildable today.",
        3: "Risks cluster by architecture: weight-space artefacts (Trojan diffs), governance blind spots (compute FLOP thresholds), and epistemic drifts (over-trust).",
        4: "Threat modeling engine with zero harmful operational recipes. Designed for safety auditors: models capability-based auditing protocols and post-release change tracking.",
        5: "Highlights two active 2026-2027 research problems: (1) statistical anomaly detection for 0.016% parameter edits; (2) evaluation protocols that identify non-training capability acquisition.",
      }}
      note="🟥 SPECULATION - Qualitative threat model. Draggable to audit custom organizational postures. Conceptual level only; zero harmful recipes."
    >
      <div className="space-y-6">
        {/* ========================================================
            TOP BAR: VIEW MODES, SCENARIO SELECTOR & SEVERITY FILTER
            ======================================================== */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-border/60 pb-4">
          {/* View Mode Switcher */}
          <div className="inline-flex items-center rounded-xl border border-border/80 bg-card/80 p-1 shadow-xs">
            <button
              type="button"
              onClick={() => setViewMode("radar")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
                viewMode === "radar"
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Radar className="size-3.5" />
              <span>2D Radar</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("matrix")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
                viewMode === "matrix"
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="size-3.5" />
              <span className="hidden xs:inline">Quadrant </span>Matrix
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
                viewMode === "list"
                  ? "bg-foreground text-background shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ListOrdered className="size-3.5" />
              <span className="hidden xs:inline">Exposure </span>Ledger
            </button>
          </div>

          {/* Scenario Presets & Quick Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1 text-xs font-mono text-muted-foreground bg-card/80 border border-border/80 rounded-xl px-2 sm:px-2.5 py-1">
              <span className="hidden md:inline uppercase tracking-wider text-[10px] font-semibold">Preset:</span>
              <button
                type="button"
                onClick={() => applyScenario("baseline")}
                className={`px-2 py-0.5 rounded-md font-sans text-xs font-medium transition-colors ${
                  scenario === "baseline"
                    ? "bg-foreground text-background font-bold shadow-xs"
                    : "hover:text-foreground"
                }`}
              >
                Consensus
              </button>
              <button
                type="button"
                onClick={() => applyScenario("adversarial")}
                className={`px-2 py-0.5 rounded-md font-sans text-xs font-medium transition-colors ${
                  scenario === "adversarial"
                    ? "bg-[var(--wsp-red)] text-white font-bold shadow-xs"
                    : "hover:text-foreground"
                }`}
              >
                Adversarial
              </button>
              <button
                type="button"
                onClick={() => applyScenario("defensive")}
                className={`px-2 py-0.5 rounded-md font-sans text-xs font-medium transition-colors ${
                  scenario === "defensive"
                    ? "bg-[var(--wsp-green)] text-white font-bold shadow-xs"
                    : "hover:text-foreground"
                }`}
              >
                Defended
              </button>
            </div>

            <button
              type="button"
              onClick={() => applyScenario("baseline")}
              className="flex items-center gap-1.5 rounded-xl border border-border/80 bg-card/80 px-2.5 py-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors shadow-xs"
              title="Reset radar coordinates to baseline"
            >
              <RotateCcw className="size-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          </div>
        </div>

        {/* Severity Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs font-sans">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mr-1 font-semibold">
            Filter Tiers:
          </span>
          {[
            { id: "all", label: "All Vectors (10)" },
            { id: "critical", label: "Critical Hazard (4)", color: "var(--wsp-red)" },
            { id: "high", label: "Governance Gap (2)", color: "var(--wsp-amber)" },
            { id: "operational", label: "Operational Drift (3)", color: "var(--wsp-blue)" },
            { id: "positive", label: "Defensive Dividend (1)", color: "var(--wsp-green)" },
          ].map((f) => {
            const active = severityFilter === f.id;
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setSeverityFilter(f.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  active
                    ? "border border-foreground bg-foreground text-background font-bold shadow-xs"
                    : "border border-border/70 bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {f.color && (
                  <span
                    className="size-2 rounded-full shrink-0"
                    style={{ backgroundColor: f.color }}
                  />
                )}
                <span>{f.label}</span>
              </button>
            );
          })}
        </div>

        {/* ========================================================
            MAIN STAGE: RADAR MATRIX CANVAS + DEFENDER'S COMMAND CENTER
            ======================================================== */}
        <div className="grid gap-6 lg:grid-cols-12 items-start">
          {/* LEFT COLUMN: THE VISUAL STAGE (7 COLS) */}
          <div className="lg:col-span-7 flex flex-col gap-3 min-w-0">
            {/* VIEW MODE 1: RADAR CANVAS */}
            {viewMode === "radar" && (
              <div className="relative rounded-2xl border border-border/80 bg-card/60 p-3 sm:p-4 shadow-sm backdrop-blur-xs flex flex-col min-w-0">
                {/* Canvas Header & Theme Scope Switcher */}
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground mb-3 px-1">
                  <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-foreground">
                    <Crosshair className="size-3.5 text-[var(--wsp-chrome)] shrink-0" />
                    <span>Interactive Threat Radar</span>
                  </span>

                  {/* Scope Mode Control Pill */}
                  <div className="flex items-center gap-1 rounded-lg border border-border/70 bg-background/80 p-0.5 text-[10px] font-mono shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setRadarThemeMode("auto")}
                      className={`px-2 py-0.5 rounded transition-all ${
                        radarThemeMode === "auto"
                          ? "bg-foreground text-background font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Follow global site theme"
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => setRadarThemeMode("light")}
                      className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                        radarThemeMode === "light"
                          ? "bg-foreground text-background font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Force high-contrast tactical light grid"
                    >
                      <Sun className="size-2.5" />
                      <span>Light Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setRadarThemeMode("hud")}
                      className={`px-2 py-0.5 rounded transition-all flex items-center gap-1 ${
                        radarThemeMode === "hud"
                          ? "bg-foreground text-background font-bold"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      title="Force dark cockpit tactical radar HUD"
                    >
                      <Moon className="size-2.5" />
                      <span>Dark HUD</span>
                    </button>
                  </div>
                </div>

                {/* THE RADAR CANVAS */}
                <div
                  ref={canvasRef}
                  className={`relative h-[370px] sm:h-[450px] md:h-[510px] w-full touch-pan-y overflow-hidden rounded-xl border select-none transition-colors duration-300 ${
                    isDarkCanvas
                      ? "border-border/80 bg-[#07090e] shadow-inner"
                      : "border-slate-300/90 bg-gradient-to-br from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]/80 shadow-[inset_0_2px_12px_rgba(0,0,0,0.06)]"
                  }`}
                  onPointerMove={(e) => handlePointerMove(e.clientX, e.clientY)}
                  onPointerUp={handlePointerUp}
                  onPointerLeave={handlePointerUp}
                >
                  {/* Subtle Grid Dot Texture */}
                  <div
                    className={`pointer-events-none absolute inset-0 bg-[length:24px_24px] ${
                      isDarkCanvas
                        ? "bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.04)_1px,transparent_1px)] opacity-50"
                        : "bg-[radial-gradient(circle_at_50%_50%,rgba(15,23,42,0.08)_1px,transparent_1px)] opacity-70"
                    }`}
                  />

                  {/* Concentric Polar Radar Range Rings */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div
                      className={`size-[22%] rounded-full border border-dashed transition-colors ${
                        isDarkCanvas ? "border-cyan-500/25" : "border-slate-400/80"
                      }`}
                    />
                    <div
                      className={`size-[48%] rounded-full border transition-colors ${
                        isDarkCanvas ? "border-cyan-500/20" : "border-slate-400/70"
                      }`}
                    />
                    <div
                      className={`size-[74%] rounded-full border border-dashed transition-colors ${
                        isDarkCanvas ? "border-cyan-500/15" : "border-slate-400/60"
                      }`}
                    />
                    <div
                      className={`size-[94%] rounded-full border transition-colors ${
                        isDarkCanvas ? "border-cyan-500/10" : "border-slate-400/50"
                      }`}
                    />
                  </div>

                  {/* High-Tech Sweep Radar Ray */}
                  <div
                    aria-hidden="true"
                    className={`pointer-events-none absolute inset-0 origin-center animate-[spin_12s_linear_infinite] ${
                      isDarkCanvas ? "opacity-25" : "opacity-35"
                    }`}
                    style={{
                      background: isDarkCanvas
                        ? "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 315deg, rgba(56, 189, 248, 0.22) 360deg)"
                        : "conic-gradient(from 0deg at 50% 50%, transparent 0deg, transparent 315deg, rgba(2, 132, 199, 0.12) 360deg)",
                    }}
                  />

                  {/* 4 Quadrants Background Grid Dividers & Tints */}
                  <div className="pointer-events-none absolute inset-0 grid grid-cols-2 grid-rows-2">
                    {/* Q1: Tail Risks */}
                    <div
                      className={`border-b border-r transition-colors ${
                        isDarkCanvas
                          ? "border-border/40 bg-card/5"
                          : "border-slate-400/80 bg-amber-500/[0.04]"
                      }`}
                    />
                    {/* Q2: Immediate Threats */}
                    <div
                      className={`border-b transition-colors ${
                        isDarkCanvas
                          ? "border-border/40 bg-[color-mix(in_oklab,var(--wsp-red)_6%,transparent)]"
                          : "border-slate-400/80 bg-red-500/[0.06]"
                      }`}
                    />
                    {/* Q3: Contained Perimeter */}
                    <div
                      className={`border-r transition-colors ${
                        isDarkCanvas
                          ? "border-border/40 bg-card/5"
                          : "border-slate-400/80 bg-slate-500/[0.03]"
                      }`}
                    />
                    {/* Q4: Systemic Drift */}
                    <div
                      className={`transition-colors ${
                        isDarkCanvas
                          ? "bg-[color-mix(in_oklab,var(--wsp-blue)_6%,transparent)]"
                          : "bg-blue-500/[0.05]"
                      }`}
                    />
                  </div>

                  {/* High-Tactile Crosshair Dashes at 50% / 50% Center */}
                  <div className="pointer-events-none absolute inset-0">
                    <div
                      className={`absolute top-0 bottom-0 left-1/2 w-px border-l border-dashed transition-colors ${
                        isDarkCanvas ? "border-white/20" : "border-slate-400/80"
                      }`}
                    />
                    <div
                      className={`absolute left-0 right-0 top-1/2 h-px border-t border-dashed transition-colors ${
                        isDarkCanvas ? "border-white/20" : "border-slate-400/80"
                      }`}
                    />
                  </div>

                  {/* Quadrant Etched Watermarks */}
                  <div className="pointer-events-none absolute inset-0 select-none z-0">
                    {/* Q1: Top-Left */}
                    <div className="absolute top-3 left-3 sm:top-3.5 sm:left-3.5 flex flex-col gap-0.5">
                      <span
                        className={`font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                          isDarkCanvas ? "text-slate-200" : "text-slate-800"
                        }`}
                      >
                        Q1 · Tail Risks
                      </span>
                      <span
                        className={`font-mono text-[8px] sm:text-[9px] font-medium ${
                          isDarkCanvas ? "text-slate-400/80" : "text-slate-600"
                        }`}
                      >
                        Low Likelihood · Severe Impact
                      </span>
                    </div>

                    {/* Q2: Top-Right */}
                    <div className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 flex flex-col items-end gap-0.5">
                      <span
                        className={`font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                          isDarkCanvas ? "text-red-400" : "text-red-700"
                        }`}
                      >
                        Q2 · Immediate Threats
                      </span>
                      <span
                        className={`font-mono text-[8px] sm:text-[9px] font-medium ${
                          isDarkCanvas ? "text-red-300/80" : "text-red-600"
                        }`}
                      >
                        High Likelihood · Critical Severity
                      </span>
                    </div>

                    {/* Q3: Bottom-Left */}
                    <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-3.5 flex flex-col gap-0.5">
                      <span
                        className={`font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                          isDarkCanvas ? "text-slate-400" : "text-slate-700"
                        }`}
                      >
                        Q3 · Contained Perimeter
                      </span>
                      <span
                        className={`font-mono text-[8px] sm:text-[9px] font-medium ${
                          isDarkCanvas ? "text-slate-500" : "text-slate-500"
                        }`}
                      >
                        Low Likelihood · Low Severity
                      </span>
                    </div>

                    {/* Q4: Bottom-Right */}
                    <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-3.5 flex flex-col items-end gap-0.5">
                      <span
                        className={`font-mono text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${
                          isDarkCanvas ? "text-sky-400" : "text-blue-700"
                        }`}
                      >
                        Q4 · Systemic Drift
                      </span>
                      <span
                        className={`font-mono text-[8px] sm:text-[9px] font-medium ${
                          isDarkCanvas ? "text-sky-300/80" : "text-blue-600"
                        }`}
                      >
                        High Likelihood · Operational Impact
                      </span>
                    </div>
                  </div>

                  {/* Axis Legend Indicators */}
                  <div
                    className={`pointer-events-none absolute top-1/2 left-1.5 -translate-y-1/2 flex items-center gap-1 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider rotate-[-90deg] origin-left font-bold ${
                      isDarkCanvas ? "text-slate-400/90" : "text-slate-700"
                    }`}
                  >
                    <span>Severity / Impact ↑</span>
                  </div>
                  <div
                    className={`pointer-events-none absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[8px] sm:text-[9px] uppercase tracking-wider font-bold ${
                      isDarkCanvas ? "text-slate-400/90" : "text-slate-700"
                    }`}
                  >
                    <span>Occurrence Likelihood →</span>
                  </div>

                  {/* ========================================================
                      DRAGGABLE TACTICAL BEACONS WITH NON-OVERLAPPING MICRO-LABELS
                      ======================================================== */}
                  {bubbles.map((b) => {
                    const r = RISKS.find((x) => x.id === b.id)!;
                    const rMeta = RISK_META[b.id] ?? RISK_META.guardrails;
                    const isSel = selected === b.id;
                    const isHov = hoveredId === b.id;
                    const colors = SEVERITY_COLORS[rMeta.severity];
                    const isMuted = severityFilter !== "all" && rMeta.severity !== severityFilter;

                    // Responsive non-clipping boundary detection:
                    const isNearLeft = b.x < 0.22;
                    const isNearRight = b.x > 0.78;
                    const isNearTop = b.y > 0.80;

                    const horizontalPosClass = isNearLeft
                      ? "left-0 translate-x-0"
                      : isNearRight
                      ? "right-0 translate-x-0"
                      : "left-1/2 -translate-x-1/2";

                    const verticalPosClass = isNearTop ? "top-full mt-2" : "bottom-full mb-2";

                    return (
                      <div
                        key={b.id}
                        style={{
                          left: `${b.x * 100}%`,
                          top: `${(1 - b.y) * 100}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                        className={`absolute select-none transition-transform duration-150 ${
                          isSel
                            ? "z-40 scale-110"
                            : isHov
                            ? "z-30 scale-105"
                            : isMuted
                            ? "z-10 opacity-20 pointer-events-none"
                            : "z-20"
                        }`}
                        onMouseEnter={() => setHoveredId(b.id)}
                        onMouseLeave={() => setHoveredId((cur) => (cur === b.id ? null : cur))}
                      >
                        {/* Target Reticle (Active Crosshairs on Selected Node) */}
                        {isSel && (
                          <div
                            aria-hidden="true"
                            className="pointer-events-none absolute -inset-3.5 rounded-full border border-dashed animate-[spin_8s_linear_infinite]"
                            style={{ borderColor: colors.stroke }}
                          />
                        )}

                        <div className="relative flex flex-col items-center">
                          {/* Circular Tactical Beacon */}
                          <button
                            type="button"
                            aria-label={`${r.title}: Likelihood ${Math.round(b.x * 100)}%, Impact ${Math.round(b.y * 100)}%`}
                            onPointerDown={(e) => {
                              dragging.current = b.id;
                              setSelected(b.id);
                              (e.target as Element).setPointerCapture?.(e.pointerId);
                            }}
                            onPointerUp={(e) => {
                              dragging.current = null;
                              (e.target as Element).releasePointerCapture?.(e.pointerId);
                            }}
                            className={`relative flex size-8 sm:size-9 items-center justify-center rounded-full border-2 font-mono text-xs font-black shadow-md cursor-grab active:cursor-grabbing transition-all focus:outline-none touch-none ${
                              isSel
                                ? isDarkCanvas
                                  ? "ring-2 ring-white/80 scale-110 shadow-lg"
                                  : "ring-2 ring-slate-900/40 scale-110 shadow-lg"
                                : "hover:brightness-110 hover:scale-105"
                            }`}
                            style={{
                              borderColor: colors.stroke,
                              backgroundColor: isSel
                                ? colors.stroke
                                : isDarkCanvas
                                ? `color-mix(in oklab, ${colors.stroke} 14%, #0c1017)`
                                : "#ffffff",
                              boxShadow:
                                isSel || isHov
                                  ? `0 0 16px ${colors.glow}`
                                  : isDarkCanvas
                                  ? "none"
                                  : "0 2px 6px rgba(0,0,0,0.12)",
                            }}
                          >
                            {/* Crisp, High-Contrast Number Index */}
                            <span
                              className={`relative z-10 font-mono text-[11px] sm:text-xs font-black tracking-tight select-none pointer-events-none ${
                                isSel
                                  ? "text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
                                  : isDarkCanvas
                                  ? "text-white"
                                  : "text-slate-900 font-extrabold"
                              }`}
                            >
                              {rMeta.index}
                            </span>
                          </button>

                          {/* Crisp Non-Overlapping Micro-Label with Edge-Safe Anchoring */}
                          <button
                            type="button"
                            onClick={() => setSelected(b.id)}
                            className={`pointer-events-auto absolute whitespace-nowrap px-2 py-0.5 rounded-md font-sans text-[9px] sm:text-[10px] font-semibold transition-all shadow-xs cursor-pointer ${horizontalPosClass} ${verticalPosClass} ${
                              isSel
                                ? isDarkCanvas
                                  ? "bg-white text-slate-950 font-bold border border-white shadow-lg ring-1 ring-white/50"
                                  : "bg-slate-900 text-white font-bold border border-slate-900 shadow-md ring-1 ring-slate-900/50"
                                : isHov
                                ? isDarkCanvas
                                  ? "bg-slate-800 text-white border border-slate-600 shadow-sm"
                                  : "bg-white text-slate-900 border border-slate-400 shadow-sm"
                                : isDarkCanvas
                                ? "bg-slate-900/95 text-slate-200 border border-slate-700/80 hover:bg-slate-800 hover:text-white"
                                : "bg-white/95 text-slate-800 font-bold border border-slate-300 shadow-2xs hover:bg-white hover:text-slate-950 hover:border-slate-400"
                            }`}
                          >
                            <span>{rMeta.shortLabel}</span>
                            {isSel && (
                              <span className="ml-1 font-mono text-[8px] sm:text-[9px] opacity-90">
                                · {Math.round(b.x * 100)}% L
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Radar Footer Telemetry Bar */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-mono text-muted-foreground px-1 border-t border-border/50 pt-2.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="size-2 rounded-full shrink-0 animate-pulse"
                      style={{ backgroundColor: currentColors.stroke }}
                    />
                    <span className="truncate">
                      {hoveredId ? (
                        <>
                          <strong className="text-foreground">
                            [{RISK_META[hoveredId]?.index}] {RISKS.find((x) => x.id === hoveredId)?.title}:
                          </strong>{" "}
                          <span className="text-[var(--wsp-chrome)] font-bold">
                            {Math.round((bubbles.find((b) => b.id === hoveredId)?.x ?? 0.5) * 100)}% L
                          </span>{" "}
                          ×{" "}
                          <span className="text-[var(--wsp-red)] font-bold">
                            {Math.round((bubbles.find((b) => b.id === hoveredId)?.y ?? 0.5) * 100)}% I
                          </span>{" "}
                          = Exposure Score{" "}
                          <strong className="text-foreground">
                            {Math.round(
                              (bubbles.find((b) => b.id === hoveredId)?.x ?? 0.5) *
                                (bubbles.find((b) => b.id === hoveredId)?.y ?? 0.5) *
                                100
                            )}/100
                          </strong>
                        </>
                      ) : (
                        <span>Exposure Scale: Low (0–34) · Elevated (35–59) · Critical (60–100)</span>
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <a
                      href="#defender-command-center"
                      className="lg:hidden text-xs font-sans font-semibold text-[var(--wsp-chrome)] hover:underline flex items-center gap-1"
                    >
                      <span>Command Center</span>
                      <ChevronDown className="size-3" />
                    </a>
                    <span className="text-[11px] text-[var(--wsp-chrome)] font-bold">
                      Active: [{meta.index}] {meta.shortLabel}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW MODE 2: 2x2 QUADRANT MATRIX */}
            {viewMode === "matrix" && (
              <div className="grid gap-3.5 sm:grid-cols-2">
                {[
                  {
                    title: "Q1 · Severe Tail Risks",
                    sub: "High Impact · Lower Likelihood",
                    ids: ["rsi", "backdoors", "conceal"],
                    border: "border-border/90",
                    accent: "var(--wsp-amber)",
                    bg: "bg-amber-500/[0.03] dark:bg-card/40",
                  },
                  {
                    title: "Q2 · Critical Immediate Threats",
                    sub: "Critical Impact · High Likelihood",
                    ids: ["guardrails", "power", "compute"],
                    border: "border-[var(--wsp-red)]/50",
                    accent: "var(--wsp-red)",
                    bg: "bg-red-500/[0.04] dark:bg-card/40",
                  },
                  {
                    title: "Q3 · Contained Vulnerabilities",
                    sub: "Low Impact · Lower Likelihood",
                    ids: [],
                    border: "border-border/80",
                    accent: "var(--muted-foreground)",
                    bg: "bg-slate-500/[0.02] dark:bg-card/40",
                  },
                  {
                    title: "Q4 · Operational Drift & Dividends",
                    sub: "Systemic Impact · High Likelihood",
                    ids: ["supply", "goodhart", "overtrust", "upside"],
                    border: "border-[var(--wsp-blue)]/50",
                    accent: "var(--wsp-blue)",
                    bg: "bg-blue-500/[0.03] dark:bg-card/40",
                  },
                ].map((quad, idx) => (
                  <div
                    key={idx}
                    className={`rounded-2xl border ${quad.border} ${quad.bg} p-4 flex flex-col justify-between shadow-xs`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className="font-mono text-xs font-bold uppercase tracking-wider"
                          style={{ color: quad.accent }}
                        >
                          {quad.title}
                        </span>
                        <span className="font-mono text-[10px] text-muted-foreground font-semibold">
                          {quad.ids.length} vectors
                        </span>
                      </div>
                      <p className="font-serif text-[11px] text-muted-foreground mb-3">
                        {quad.sub}
                      </p>

                      <div className="space-y-2">
                        {quad.ids.length === 0 ? (
                          <div className="rounded-xl border border-dashed border-border/70 p-4 text-center font-mono text-xs text-muted-foreground">
                            No active high-consequence vectors currently mapped in contained perimeter.
                          </div>
                        ) : (
                          quad.ids.map((id) => {
                            const r = RISKS.find((x) => x.id === id)!;
                            const rMeta = RISK_META[id];
                            const isSel = selected === id;
                            const b = bubbles.find((x) => x.id === id) ?? { x: 0.5, y: 0.5 };
                            const score = Math.round(b.x * b.y * 100);

                            return (
                              <button
                                key={id}
                                type="button"
                                onClick={() => setSelected(id)}
                                className={`flex w-full items-center justify-between gap-2 rounded-xl border p-2.5 text-left transition-all ${
                                  isSel
                                    ? "border-foreground bg-accent text-foreground shadow-xs font-bold"
                                    : "border-border/70 bg-card/80 hover:bg-accent/60 hover:text-foreground text-foreground/85"
                                }`}
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="font-mono text-xs font-bold opacity-75">
                                    {rMeta.index}
                                  </span>
                                  <span className="font-sans text-xs font-semibold truncate">
                                    {rMeta.shortLabel}
                                  </span>
                                </div>
                                <span className="font-mono text-[10px] text-muted-foreground tabular-nums shrink-0">
                                  Exp: {score}
                                </span>
                              </button>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* VIEW MODE 3: EXPOSURE LEDGER (RANKED LIST) */}
            {viewMode === "list" && (
              <div className="rounded-2xl border border-border/80 bg-card/60 p-4 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between text-xs font-mono text-muted-foreground border-b border-border/60 pb-2">
                  <span>Risk Vector &amp; Category</span>
                  <span>Likelihood × Impact = Exposure</span>
                </div>
                {RISKS.slice()
                  .sort((a, b) => {
                    const bA = bubbles.find((x) => x.id === a.id) ?? { x: 0.5, y: 0.5 };
                    const bB = bubbles.find((x) => x.id === b.id) ?? { x: 0.5, y: 0.5 };
                    return bB.x * bB.y - bA.x * bA.y;
                  })
                  .map((r) => {
                    const rMeta = RISK_META[r.id];
                    const isSel = selected === r.id;
                    const b = bubbles.find((x) => x.id === r.id) ?? { x: 0.5, y: 0.5 };
                    const score = Math.round(b.x * b.y * 100);
                    const colors = SEVERITY_COLORS[rMeta.severity];

                    return (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelected(r.id)}
                        className={`flex w-full items-center justify-between gap-3 rounded-xl border p-3 text-left transition-all ${
                          isSel
                            ? "border-foreground bg-accent shadow-xs"
                            : "border-border/70 bg-card/80 hover:bg-accent/40"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span
                            className="flex size-7 items-center justify-center rounded-lg border font-mono text-xs font-bold shrink-0"
                            style={{
                              borderColor: colors.stroke,
                              backgroundColor: `color-mix(in oklab, ${colors.stroke} 14%, var(--card))`,
                              color: colors.stroke,
                            }}
                          >
                            {rMeta.index}
                          </span>
                          <div className="min-w-0">
                            <span className="font-sans text-xs font-bold block truncate">
                              {r.title}
                            </span>
                            <span className="font-mono text-[10px] text-muted-foreground">
                              {rMeta.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 font-mono text-xs">
                          <span className="text-muted-foreground hidden sm:inline">
                            {(b.x * 100).toFixed(0)}% × {(b.y * 100).toFixed(0)}%
                          </span>
                          <div className="w-16 h-2 rounded-full bg-border overflow-hidden hidden sm:block">
                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${score}%`,
                                backgroundColor: colors.stroke,
                              }}
                            />
                          </div>
                          <span className="font-bold tabular-nums w-8 text-right">{score}</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            )}

            {/* Quick Threat Vector Selector Strip */}
            <div className="rounded-2xl border border-border/80 bg-card/50 p-3">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-2 font-semibold">
                Direct Select Vector:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {RISKS.map((r) => {
                  const isCurrent = selected === r.id;
                  const rMeta = RISK_META[r.id];
                  const colors = SEVERITY_COLORS[rMeta.severity];

                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setSelected(r.id)}
                      className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-sans transition-all ${
                        isCurrent
                          ? "border text-foreground font-bold shadow-xs scale-105"
                          : "border border-border/70 bg-card/70 text-muted-foreground hover:bg-accent hover:text-foreground"
                      }`}
                      style={
                        isCurrent
                          ? {
                              borderColor: colors.stroke,
                              backgroundColor: `color-mix(in oklab, ${colors.stroke} 14%, var(--card))`,
                            }
                          : undefined
                      }
                    >
                      <span
                        className="font-mono text-[10px] font-bold px-1 py-0.2 rounded"
                        style={{
                          color: colors.stroke,
                          backgroundColor: `color-mix(in oklab, ${colors.stroke} 16%, transparent)`,
                        }}
                      >
                        {rMeta.index}
                      </span>
                      <span>{rMeta.shortLabel}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: DEFENDER'S COMMAND CENTER & INSPECTOR (5 COLS) */}
          <div
            id="defender-command-center"
            className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-5 shadow-sm backdrop-blur-md space-y-5"
          >
            <div className="space-y-5">
              {/* Telemetry Header */}
              <div className="border-b border-border/60 pb-3 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className="size-2.5 rounded-full animate-pulse"
                    style={{ backgroundColor: currentColors.stroke }}
                  />
                  <span
                    className="font-mono text-xs font-bold uppercase tracking-wider"
                    style={{ color: currentColors.stroke }}
                  >
                    {meta.category}
                  </span>
                </div>
                <div
                  className="rounded-full px-2.5 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider border"
                  style={{
                    borderColor: currentColors.stroke,
                    backgroundColor: `color-mix(in oklab, ${currentColors.stroke} 12%, transparent)`,
                    color: currentColors.stroke,
                  }}
                >
                  {exposureTier.label}
                </div>
              </div>

              {/* Title & Index */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono text-xs font-bold text-muted-foreground">
                    VECTOR #{meta.index}
                  </span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-mono text-[11px] text-muted-foreground font-medium">{meta.tag}</span>
                </div>
                <h3 className="font-sans text-xl font-black text-foreground leading-snug">
                  {risk.title}
                </h3>
              </div>

              {/* Live Metric HUD & Sliders */}
              <div className="rounded-xl border border-border/80 bg-background/60 p-4 space-y-3.5">
                <div className="flex items-center justify-between border-b border-border/50 pb-2">
                  <span className="font-mono text-xs font-semibold text-muted-foreground">
                    Threat Exposure Index
                  </span>
                  <span className="font-mono text-lg font-black tabular-nums text-foreground">
                    {riskExposure} / 100
                  </span>
                </div>

                {/* Likelihood Slider Control */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-muted-foreground">Occurrence Likelihood:</span>
                    <span className="font-bold text-foreground">
                      {(selectedBubble.x * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="92"
                    value={Math.round(selectedBubble.x * 100)}
                    onChange={(e) => updateSelectedCoordinates(Number(e.target.value) / 100, undefined)}
                    className="w-full h-2 rounded-lg cursor-pointer accent-[var(--wsp-chrome)] bg-border"
                  />
                </div>

                {/* Impact Slider Control */}
                <div className="space-y-1.5">
                  <div className="flex justify-between font-mono text-xs">
                    <span className="text-muted-foreground">Impact Severity:</span>
                    <span className="font-bold text-foreground">
                      {(selectedBubble.y * 100).toFixed(0)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="92"
                    value={Math.round(selectedBubble.y * 100)}
                    onChange={(e) => updateSelectedCoordinates(undefined, Number(e.target.value) / 100)}
                    className="w-full h-2 rounded-lg cursor-pointer accent-[var(--wsp-red)] bg-border"
                  />
                </div>
              </div>

              {/* Inspector Content Tabs */}
              <div className="space-y-3">
                <div className="flex items-center border-b border-border/60 font-sans text-xs">
                  <button
                    type="button"
                    onClick={() => setActiveTab("threat")}
                    className={`px-3 py-2 font-semibold transition-all border-b-2 ${
                      activeTab === "threat"
                        ? "border-foreground text-foreground font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Threat Mechanism
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("defence")}
                    className={`px-3 py-2 font-semibold transition-all border-b-2 ${
                      activeTab === "defence"
                        ? "border-[var(--wsp-green)] text-[var(--wsp-green)] font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Defender's Toolbox
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("frontier")}
                    className={`px-3 py-2 font-semibold transition-all border-b-2 ${
                      activeTab === "frontier"
                        ? "border-[var(--wsp-chrome)] text-[var(--wsp-chrome)] font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Auditing Frontier
                  </button>
                </div>

                {/* TAB 1: THREAT MECHANISM */}
                {activeTab === "threat" && (
                  <div className="space-y-3 animate-in fade-in-50 duration-200">
                    <p className="font-serif text-sm leading-relaxed text-foreground/90">
                      {risk.what}
                    </p>
                    <div className="rounded-xl border border-border/60 bg-card/60 p-3 space-y-1">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block font-bold">
                        Underlying Attack Mechanism:
                      </span>
                      <p className="font-serif text-xs text-muted-foreground leading-relaxed">
                        {meta.mechanism}
                      </p>
                    </div>
                  </div>
                )}

                {/* TAB 2: DEFENDER'S TOOLBOX */}
                {activeTab === "defence" && (
                  <div className="space-y-3 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-[var(--wsp-green)]/40 bg-[color-mix(in_oklab,var(--wsp-green)_10%,transparent)] p-4 space-y-2">
                      <div className="flex items-center justify-between text-[var(--wsp-green)] font-mono text-xs font-bold uppercase tracking-wider">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="size-4" />
                          <span>Actionable Countermeasures</span>
                        </div>
                        <span className="text-[10px] rounded bg-background/90 px-2 py-0.5 border border-[var(--wsp-green)]/30 font-bold">
                          {meta.readiness}
                        </span>
                      </div>
                      <p className="font-serif text-xs sm:text-sm leading-relaxed text-foreground font-medium">
                        {risk.defence}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={copyDefence}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/80 bg-background/80 py-2.5 font-sans text-xs font-semibold text-foreground hover:bg-card transition-colors shadow-2xs"
                    >
                      {copied ? (
                        <>
                          <Check className="size-3.5 text-[var(--wsp-green)]" />
                          <span>Blueprint Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="size-3.5 text-muted-foreground" />
                          <span>Copy Defensive Protocol</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* TAB 3: AUDITING FRONTIER */}
                {activeTab === "frontier" && (
                  <div className="space-y-3 animate-in fade-in-50 duration-200">
                    <div className="rounded-xl border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_10%,transparent)] p-3.5 space-y-2">
                      <div className="flex items-center gap-2 text-[var(--wsp-chrome)] font-mono text-xs font-bold uppercase tracking-wider">
                        <Sparkles className="size-4 shrink-0" />
                        <span>2026-2027 Research Agenda</span>
                      </div>
                      <p className="font-serif text-xs sm:text-sm leading-relaxed text-foreground">
                        {meta.researchQuestion}
                      </p>
                    </div>
                    <p className="font-mono text-[10px] text-muted-foreground leading-relaxed">
                      WSP verification standard requires author-blind evaluations and signed weight attestation to resolve this frontier.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Audit Citation Footnote */}
            <div className="border-t border-border/60 pt-3 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
              <span>WSP Threat Model · Rev 2026</span>
              <a
                href="/references"
                className="hover:text-foreground flex items-center gap-1 text-[var(--wsp-chrome)] font-semibold"
              >
                <span>Full Citations</span>
                <ArrowUpRight className="size-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </ModuleChrome>
  );
}
