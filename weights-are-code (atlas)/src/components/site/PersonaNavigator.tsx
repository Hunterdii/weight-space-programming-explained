"use client";

import { useState } from "react";
import Link from "next/link";
import { useReading, type Level } from "@/state/store";
import {
  Compass,
  Cpu,
  ShieldAlert,
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  FlaskConical,
  FileDown,
  Layers,
  Radar,
  SlidersHorizontal,
} from "lucide-react";
import { toast } from "sonner";

interface Persona {
  id: string;
  role: string;
  targetLevel: Level;
  badge: string;
  tagline: string;
  description: string;
  color: string;
  icon: typeof Compass;
  curatedLinks: { label: string; href: string; icon: typeof ArrowRight }[];
}

const PERSONAS: Persona[] = [
  {
    id: "executive",
    role: "Curious Observer & Executive",
    targetLevel: 1,
    badge: "Intuitive Foundation",
    tagline: "High-level intuition with zero mathematical barrier.",
    description:
      "Understand what it means for an AI to inspect and fix neural network weights directly without training runs, why this alters compute economics, and what risks matter.",
    color: "var(--wsp-chrome)",
    icon: Compass,
    curatedLinks: [
      { label: "Ch 01 · Pile of Numbers", href: "/read/1-pile-of-numbers", icon: ArrowRight },
      { label: "M12 · Tactical Risk Radar", href: "/read/11-the-severe-stuff", icon: Radar },
      { label: "The Three Verbs Explained", href: "#spotlight", icon: Layers },
    ],
  },
  {
    id: "engineer",
    role: "ML Engineer & Builder",
    targetLevel: 4,
    badge: "Applied Code & Tensors",
    tagline: "Rank-1 weight surgery, tensor dimensions, and Python labs.",
    description:
      "Drill into mathematical mechanics: ΔW = u·vᵀ, single-direction excision, parameter counts (131k params out of 800M in Qwen), and runnable zero-dependency scripts.",
    color: "var(--wsp-blue)",
    icon: Cpu,
    curatedLinks: [
      { label: "Python Labs (3 Scripts)", href: "/lab", icon: FlaskConical },
      { label: "Ch 05 · The 0.016% Surgery", href: "/read/5-fix", icon: ArrowRight },
      { label: "Exp 6 · Go Policy Generation", href: "/experiments", icon: Layers },
    ],
  },
  {
    id: "auditor",
    role: "AI Safety & Security Auditor",
    targetLevel: 4,
    badge: "Threat Atlas & Defences",
    tagline: "Backdoors, guardrail stripping, and compute evasion.",
    description:
      "Explore the 10 threat vectors: why FLOP-based governance fails against 0.016% edits, anomaly detection power limits, and the cryptographic provenance stack.",
    color: "var(--wsp-red)",
    icon: ShieldAlert,
    curatedLinks: [
      { label: "M12 · The Risk Radar", href: "/read/11-the-severe-stuff", icon: Radar },
      { label: "Ch 11 · The Severe Stuff", href: "/read/11-the-severe-stuff", icon: ArrowRight },
      { label: "Truth Filter (Paper Only)", href: "#truth-contract", icon: CheckCircle2 },
    ],
  },
  {
    id: "scholar",
    role: "Academic Researcher & Scholar",
    targetLevel: 5,
    badge: "Frontier Rigor & Proofs",
    tagline: "Empirical audit, scoreboard, and WSP-Bench-Lite.",
    description:
      "Academic scrutiny based on the Andreas Maier audit. Distinguishes verified breakthroughs from single-seed variance, reviewability bounds, and open research problems.",
    color: "var(--wsp-green)",
    icon: GraduationCap,
    curatedLinks: [
      { label: "Whitepaper PDF", href: "/whitepaper.pdf", icon: FileDown },
      { label: "Full Audit Scoreboard", href: "/about", icon: Layers },
      { label: "44 Provenance Citations", href: "/references", icon: ArrowRight },
    ],
  },
];

export default function PersonaNavigator() {
  const currentLevel = useReading((s) => s.level);
  const setLevel = useReading((s) => s.setLevel);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>("executive");

  const currentPersona =
    PERSONAS.find((p) => p.id === selectedPersonaId) ?? PERSONAS[0];

  const handleSelect = (p: Persona) => {
    setSelectedPersonaId(p.id);
    setLevel(p.targetLevel);
    toast.success(`Adapted reading experience for: ${p.role} (Rigor: Level ${p.targetLevel})`);
  };

  return (
    <section aria-labelledby="persona-nav" className="w-full my-8">
      <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-7 shadow-sm backdrop-blur-xs">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground mb-1">
              <SlidersHorizontal className="size-3.5 text-[var(--wsp-chrome)]" />
              <span>Adaptive Experience Pathways</span>
            </div>
            <h2 id="persona-nav" className="font-sans text-xl sm:text-2xl font-black text-foreground">
              Choose How You Want to Explore Weight-Space Programming
            </h2>
            <p className="font-serif text-xs sm:text-sm text-muted-foreground mt-1 max-w-[75ch]">
              Select your background to instantly tailor the curriculum rigor, highlight relevant tooling, and reveal curated starting points.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground shrink-0">
            <span className="rounded-full border border-border/70 bg-background/80 px-3 py-1">
              Active Rigor: <strong className="text-foreground">Level {currentLevel} of 5</strong>
            </span>
          </div>
        </div>

        {/* 4 Persona Cards Grid */}
        <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p) => {
            const isSelected = selectedPersonaId === p.id;
            const Icon = p.icon;

            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleSelect(p)}
                className={`group relative flex flex-col justify-between rounded-xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-accent/80 border-foreground shadow-md ring-2 ring-foreground/20 scale-[1.02]"
                    : "bg-background/60 border-border/70 hover:border-foreground/30 hover:bg-card/90"
                }`}
                style={
                  isSelected
                    ? {
                        borderColor: p.color,
                        boxShadow: `0 8px 24px -4px color-mix(in oklab, ${p.color} 20%, transparent)`,
                      }
                    : undefined
                }
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className="size-8 rounded-lg border flex items-center justify-center transition-transform group-hover:scale-110"
                      style={{
                        borderColor: `color-mix(in oklab, ${p.color} 40%, var(--border))`,
                        backgroundColor: `color-mix(in oklab, ${p.color} 15%, transparent)`,
                        color: p.color,
                      }}
                    >
                      <Icon className="size-4" />
                    </div>

                    <span
                      className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider"
                      style={{
                        borderColor: `color-mix(in oklab, ${p.color} 30%, var(--border))`,
                        color: p.color,
                      }}
                    >
                      L{p.targetLevel} Rigor
                    </span>
                  </div>

                  <h3 className="font-sans text-sm font-bold text-foreground leading-snug">
                    {p.role}
                  </h3>
                  <p className="font-serif text-[11px] text-muted-foreground mt-1 line-clamp-2">
                    {p.tagline}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between font-mono text-[10px]">
                  <span className="text-muted-foreground">{p.badge}</span>
                  <span
                    className="font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform"
                    style={{ color: p.color }}
                  >
                    {isSelected ? "Active Path" : "Select Path"} →
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Persona Deep Dive & Curated Links */}
        <div className="mt-5 rounded-xl border border-border/70 bg-background/50 p-4 sm:p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="max-w-[85ch]">
            <div className="flex items-center gap-2 mb-1">
              <span
                className="size-2 rounded-full animate-pulse"
                style={{ backgroundColor: currentPersona.color }}
              />
              <span
                className="font-mono text-xs font-bold uppercase tracking-wider"
                style={{ color: currentPersona.color }}
              >
                Curated Focus for {currentPersona.role}
              </span>
            </div>
            <p className="font-serif text-xs sm:text-sm text-foreground/90 leading-relaxed">
              {currentPersona.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mr-1 hidden sm:inline">
              Recommended:
            </span>
            {currentPersona.curatedLinks.map((link, idx) => {
              const LinkIcon = link.icon;
              return (
                <Link
                  key={idx}
                  href={link.href}
                  prefetch={false}
                  className="flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 py-1.5 font-sans text-xs font-semibold text-foreground hover:bg-accent hover:border-foreground/40 transition-colors shadow-2xs"
                >
                  <LinkIcon className="size-3 text-[var(--wsp-chrome)]" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

