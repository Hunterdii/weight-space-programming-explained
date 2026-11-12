"use client";

import { useState, useMemo, useCallback } from "react";
import fingerprintDataRaw from "@/content/fingerprints_data.json";
import { BadgeChip } from "@/components/content/Badge";
import {
  Gamepad2,
  HelpCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Eye,
  Layers,
  Sparkles,
  Info,
  ChevronRight,
} from "lucide-react";

type GameKey = "breakout" | "pong" | "pacman" | "freeway";

interface GameInfo {
  name: string;
  architecture: string;
  description: string;
  fingerprintAnalysis: string;
  realInsight: string;
}

const GAMES: Record<GameKey, GameInfo> = {
  breakout: {
    name: "Breakout",
    architecture: "500 → 32 → 32 → 5 (17,253 params)",
    description: "Ball bouncing against breakable brick rows above a horizontal paddle.",
    fingerprintAnalysis: "Row 8 accounts for 57.7% of all Agent channel first-layer weight energy. The paddle is constrained to move along a single horizontal axis at the bottom.",
    realInsight: "A reader checking first-layer norms sees immediate concentration on row 8. The network only needs to track horizontal paddle translation at the bottom boundary.",
  },
  pong: {
    name: "Pong",
    architecture: "500 → 32 → 32 → 5 (17,253 params)",
    description: "Two-player tennis rally with a vertical paddle moving up and down.",
    fingerprintAnalysis: "Column 1 accounts for 54.9% of all Agent channel weight energy. The paddle moves strictly along the vertical left edge.",
    realInsight: "Unlike Breakout's horizontal row signature, Pong produces a razor-sharp vertical strip along column 1. The two games have orthogonal weight fingerprints despite sharing identical neural architectures.",
  },
  pacman: {
    name: "Pac-Man",
    architecture: "500 → 32 → 32 → 5 (17,253 params)",
    description: "Maze navigation collecting pellets and avoiding ghosts in 2D space.",
    fingerprintAnalysis: "No single row or column exceeds 16%. Agent weight energy is uniformly distributed across the entire 10×10 board grid.",
    realInsight: "Because the agent must roam freely across corridors in all directions, first-layer weights cannot concentrate into a line without catastrophic policy failure.",
  },
  freeway: {
    name: "Freeway",
    architecture: "500 → 32 → 32 → 5 (17,253 params)",
    description: "Chicken crossing multi-lane highway traffic moving horizontally.",
    fingerprintAnalysis: "Column 4 carries the highest weight energy (22.2%), with a dense central band across rows 4–7.",
    realInsight: "The agent crosses through a central traffic corridor. The network places heaviest observation weight on the lanes right before and during traversal.",
  },
};

const CHANNELS = [
  { id: 0, label: "Channel 0 · Agent (Paddle / Player)", color: "var(--wsp-chrome)" },
  { id: 1, label: "Channel 1 · Ball / Pellet / Dot", color: "var(--wsp-amber)" },
  { id: 2, label: "Channel 2 · Bricks / Walls / Obstacles", color: "var(--wsp-green)" },
  { id: 3, label: "Channel 3 · Secondary Dynamics", color: "var(--wsp-blue)" },
  { id: 4, label: "Channel 4 · Background / Floor", color: "var(--wsp-red)" },
];

export default function FingerprintLab({ className = "" }: { className?: string }) {
  const [selectedGame, setSelectedGame] = useState<GameKey>("breakout");
  const [selectedChannel, setSelectedChannel] = useState<number>(0);
  const [hoveredCell, setHoveredCell] = useState<{ r: number; c: number; val: number } | null>(null);

  // Blind Guessing Challenge State
  const [challengeMode, setChallengeMode] = useState<boolean>(false);
  const [mysteryGame, setMysteryGame] = useState<GameKey>("pong");
  const [userGuess, setUserGuess] = useState<GameKey | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [score, setScore] = useState<{ correct: number; total: number }>({ correct: 0, total: 0 });

  const activeKey = challengeMode && !revealed ? mysteryGame : challengeMode && revealed ? mysteryGame : selectedGame;
  const gameData = (fingerprintDataRaw as any)[activeKey];

  // Compute 10x10 matrix for selected channel
  const matrix10x10 = useMemo(() => {
    if (!gameData || !gameData.norms) return [];
    return gameData.norms.map((row: number[][]) =>
      row.map((cell: number[]) => cell[selectedChannel] || 0)
    );
  }, [gameData, selectedChannel]);

  // Marginal sums
  const rowSums = useMemo(() => {
    if (!matrix10x10.length) return [];
    return matrix10x10.map((row: number[]) => row.reduce((a, b) => a + b, 0));
  }, [matrix10x10]);

  const colSums = useMemo(() => {
    if (!matrix10x10.length) return [];
    const sums = new Array(10).fill(0);
    matrix10x10.forEach((row: number[]) => {
      row.forEach((val: number, cIdx: number) => {
        sums[cIdx] += val;
      });
    });
    return sums;
  }, [matrix10x10]);

  const totalEnergy = useMemo(() => {
    return rowSums.reduce((a, b) => a + b, 0) || 1;
  }, [rowSums]);

  const maxCellVal = useMemo(() => {
    let m = 0.001;
    matrix10x10.forEach((row: number[]) => {
      row.forEach((v: number) => {
        if (v > m) m = v;
      });
    });
    return m;
  }, [matrix10x10]);

  // Start new blind challenge round
  const startNewChallenge = useCallback(() => {
    const keys: GameKey[] = ["breakout", "pong", "pacman", "freeway"];
    const rand = keys[Math.floor(Math.random() * keys.length)];
    setMysteryGame(rand);
    setUserGuess(null);
    setRevealed(false);
  }, []);

  const handleGuess = (guess: GameKey) => {
    if (revealed) return;
    setUserGuess(guess);
    setRevealed(true);
    setScore((prev) => ({
      correct: prev.correct + (guess === mysteryGame ? 1 : 0),
      total: prev.total + 1,
    }));
  };

  return (
    <div className={`rounded-3xl border border-border/80 bg-card p-5 sm:p-7 space-y-6 shadow-sm ${className}`}>
      {/* Top Header & Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/70 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BadgeChip b="paper" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground">
              Exp 1 · Recomputed Raw Weights
            </span>
          </div>
          <h3 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            The Fingerprint Lab: Reading Atari Policies
          </h3>
          <p className="font-serif text-xs sm:text-sm text-muted-foreground max-w-[70ch]">
            An LLM was handed four lists of 17,253 numbers with zero labels or tools and asked: <em>Which game is which?</em> Recomputed in real-time from the authors’ published GitHub prompts.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-accent/30 p-1 self-start sm:self-center shrink-0">
          <button
            onClick={() => {
              setChallengeMode(false);
              setRevealed(false);
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
              !challengeMode
                ? "bg-foreground text-background shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye className="size-3.5" />
            <span>Inspect Games</span>
          </button>
          <button
            onClick={() => {
              setChallengeMode(true);
              startNewChallenge();
            }}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 font-sans text-xs font-semibold transition-all ${
              challengeMode
                ? "bg-foreground text-background shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Gamepad2 className="size-3.5" />
            <span>Blind Guessing Test</span>
            {score.total > 0 && (
              <span className="ml-1 font-mono text-[10px] bg-accent px-1.5 py-0.2 rounded text-foreground">
                {score.correct}/{score.total}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Interactive Workspace */}
      <div className="grid gap-6 lg:grid-cols-12 items-start">
        {/* Left Column (5 cols): Game / Channel Selection & Scientific Explanations */}
        <div className="lg:col-span-5 space-y-4">
          {!challengeMode ? (
            /* Inspect Game Controls */
            <div className="space-y-3">
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Select Trained Policy (Exp. 1)
              </label>
              <div className="grid grid-cols-2 gap-2">
                {(["breakout", "pong", "pacman", "freeway"] as GameKey[]).map((key) => {
                  const g = GAMES[key];
                  const active = selectedGame === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedGame(key)}
                      className={`flex flex-col text-left rounded-xl border p-3 transition-all ${
                        active
                          ? "border-foreground bg-accent/50 shadow-2xs"
                          : "border-border/70 bg-card/60 hover:border-foreground/30 hover:bg-accent/30 text-muted-foreground"
                      }`}
                    >
                      <span className="font-sans text-xs font-bold text-foreground">
                        {g.name}
                      </span>
                      <span className="font-mono text-[10px] text-muted-foreground truncate">
                        {key === "breakout" ? "Row 8: 58%" : key === "pong" ? "Col 1: 55%" : key === "pacman" ? "Spread ≤16%" : "Central 22%"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Game Profile Box */}
              <div className="rounded-2xl border border-border/70 bg-background/50 p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-sans text-sm font-bold text-foreground">
                    {GAMES[selectedGame].name} Architecture &amp; Task
                  </h4>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    PPO 1B Steps
                  </span>
                </div>
                <p className="font-serif text-xs leading-relaxed text-muted-foreground">
                  {GAMES[selectedGame].description}
                </p>
                <div className="pt-2 border-t border-border/50">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--wsp-chrome)] block mb-1">
                    Mechanistic Fingerprint:
                  </span>
                  <p className="font-serif text-xs leading-relaxed text-foreground">
                    {GAMES[selectedGame].fingerprintAnalysis}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            /* Blind Guessing Challenge Box */
            <div className="rounded-2xl border border-border/80 bg-background/60 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-[var(--wsp-amber)]" />
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                    Mystery Network Loaded
                  </span>
                </div>
                <button
                  onClick={startNewChallenge}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <RotateCcw className="size-3" />
                  <span>Next Mystery Net</span>
                </button>
              </div>

              <p className="font-serif text-xs leading-relaxed text-muted-foreground">
                Inspect the 10×10 first-layer L2 weight norm heatmap and marginal row/col distribution on the right. Can you deduce which Atari game this policy belongs to before revealing?
              </p>

              {/* Guess Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {(["breakout", "pong", "pacman", "freeway"] as GameKey[]).map((key) => {
                  const isUserGuess = userGuess === key;
                  const isCorrect = key === mysteryGame;
                  let btnStyle = "border-border/80 bg-card hover:bg-accent/50 text-foreground";

                  if (revealed) {
                    if (isCorrect) {
                      btnStyle = "border-[var(--wsp-green)] bg-[color-mix(in_oklab,var(--wsp-green)_15%,transparent)] text-foreground font-bold shadow-xs";
                    } else if (isUserGuess && !isCorrect) {
                      btnStyle = "border-[var(--wsp-red)] bg-[color-mix(in_oklab,var(--wsp-red)_15%,transparent)] text-muted-foreground";
                    } else {
                      btnStyle = "opacity-40 border-border/40";
                    }
                  }

                  return (
                    <button
                      key={key}
                      disabled={revealed}
                      onClick={() => handleGuess(key)}
                      className={`flex items-center justify-between rounded-xl border p-3 font-sans text-xs font-semibold transition-all ${btnStyle}`}
                    >
                      <span>{GAMES[key].name}</span>
                      {revealed && isCorrect && <CheckCircle2 className="size-4 text-[var(--wsp-green)]" />}
                      {revealed && isUserGuess && !isCorrect && <XCircle className="size-4 text-[var(--wsp-red)]" />}
                    </button>
                  );
                })}
              </div>

              {/* Reveal Explanation Card */}
              {revealed && (
                <div className="rounded-xl border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_10%,transparent)] p-3.5 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    {userGuess === mysteryGame ? (
                      <span className="font-mono text-xs font-bold text-[var(--wsp-green)] flex items-center gap-1">
                        <CheckCircle2 className="size-3.5" /> Correct Deduction!
                      </span>
                    ) : (
                      <span className="font-mono text-xs font-bold text-[var(--wsp-amber)] flex items-center gap-1">
                        <Info className="size-3.5" /> Identity Revealed: {GAMES[mysteryGame].name}
                      </span>
                    )}
                  </div>
                  <p className="font-serif text-xs leading-relaxed text-foreground">
                    {GAMES[mysteryGame].fingerprintAnalysis}
                  </p>
                  <p className="font-serif text-[11px] leading-relaxed text-muted-foreground pt-1 border-t border-border/50">
                    <strong>Why it's legible:</strong> {GAMES[mysteryGame].realInsight}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Channel Selector */}
          <div className="space-y-2">
            <span className="block font-mono text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Input Observation Channel
            </span>
            <div className="flex flex-col gap-1.5">
              {CHANNELS.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`flex items-center justify-between rounded-xl px-3 py-2 text-left font-sans text-xs transition-all ${
                    selectedChannel === ch.id
                      ? "bg-accent/80 font-bold text-foreground border border-border/80 shadow-2xs"
                      : "text-muted-foreground hover:bg-accent/30 hover:text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className="size-2 rounded-full"
                      style={{ backgroundColor: ch.color }}
                      aria-hidden="true"
                    />
                    <span>{ch.label}</span>
                  </div>
                  {ch.id === 0 && (
                    <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 rounded bg-[var(--wsp-chrome)]/20 text-[var(--wsp-chrome)] font-semibold">
                      Key Signature
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Mathematical Tensor Derivation & Empirical Mechanics Card */}
          <div className="rounded-2xl border border-border/70 bg-secondary/30 p-4 space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--wsp-chrome)] flex items-center gap-1.5">
                <Layers className="size-3 text-[var(--wsp-chrome)]" />
                Tensor Geometry &amp; L2 Formulation
              </span>
              <span className="text-[10px] text-muted-foreground">W₁ ∈ ℝ³²ˣ⁵⁰⁰</span>
            </div>

            <div className="space-y-1.5 font-sans text-xs text-foreground/85">
              <p className="leading-relaxed">
                The policy network receives an input observation tensor <code className="font-mono text-[11px] px-1 py-0.5 rounded bg-card border border-border/60 text-foreground">X ∈ ℝ¹⁰ˣ¹⁰ˣ⁵</code> (500 features across 5 channels). The sensitivity of spatial coordinate <code className="font-mono text-[11px]">(r, c)</code> is computed via the L2 norm across all 32 first-layer hidden units:
              </p>
              <div className="rounded-xl border border-border/70 bg-card/90 p-2.5 text-center font-mono text-[11px] text-[var(--wsp-chrome)] shadow-2xs">
                ‖W₁[·, r, c, ch]‖₂ = √( Σₖ₌₁³² W₁[k, r, c, ch]² )
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                An LLM inspecting raw weights evaluates these marginal sums symbolically to distinguish vertical boundary constraints (Pong) from horizontal paddle tracking (Breakout) with zero forward execution passes.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): The 10x10 Spatial Grid Heatmap + Marginal Charts */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-2xl border border-border/80 bg-background/50 p-4 sm:p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                10 × 10 Spatial Input Grid: L2 Norm of First-Layer Weights
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                500 Inputs × 32 Hidden Units
              </span>
            </div>

            {/* Grid Container with Top Column Bars & Left Row Bars */}
            <div className="flex items-start gap-3">
              {/* Row Marginals (Vertical Bar Column on Left) */}
              <div className="flex flex-col gap-1.5 pt-7 shrink-0" title="Row Marginal Weight Energy">
                {rowSums.map((val: number, rIdx: number) => {
                  const pct = (val / totalEnergy) * 100;
                  const isTop = rIdx === gameData?.top_row && selectedChannel === 0;
                  return (
                    <div
                      key={rIdx}
                      className="flex items-center gap-1.5 h-7 sm:h-8"
                      title={`Row ${rIdx}: ${pct.toFixed(1)}% of total energy`}
                    >
                      <span className="font-mono text-[9px] text-muted-foreground w-3 text-right">
                        {rIdx}
                      </span>
                      <div className="w-12 sm:w-16 h-3 rounded bg-accent/70 overflow-hidden flex items-center">
                        <div
                          className="h-full transition-all duration-300 rounded"
                          style={{
                            width: `${Math.min(100, pct * 1.8)}%`,
                            backgroundColor: isTop ? "var(--wsp-amber)" : "var(--wsp-chrome)",
                          }}
                        />
                      </div>
                      <span className={`font-mono text-[9px] w-7 text-right tabular-nums ${isTop ? "font-bold text-[var(--wsp-amber)]" : "text-muted-foreground"}`}>
                        {pct.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* 10x10 Heatmap Grid with Column Marginals Above */}
              <div className="flex-1 space-y-2">
                {/* Column Marginals (Horizontal Bars on Top) */}
                <div className="grid grid-cols-10 gap-1.5 pl-0.5" title="Column Marginal Weight Energy">
                  {colSums.map((val: number, cIdx: number) => {
                    const pct = (val / totalEnergy) * 100;
                    const isTop = cIdx === gameData?.top_col && selectedChannel === 0;
                    return (
                      <div
                        key={cIdx}
                        className="flex flex-col items-center gap-1"
                        title={`Column ${cIdx}: ${pct.toFixed(1)}% of total energy`}
                      >
                        <span className={`font-mono text-[9px] tabular-nums ${isTop ? "font-bold text-[var(--wsp-amber)]" : "text-muted-foreground"}`}>
                          {pct.toFixed(0)}%
                        </span>
                        <div className="w-full h-8 rounded bg-accent/70 flex items-end overflow-hidden">
                          <div
                            className="w-full transition-all duration-300 rounded"
                            style={{
                              height: `${Math.min(100, pct * 1.8)}%`,
                              backgroundColor: isTop ? "var(--wsp-amber)" : "var(--wsp-chrome)",
                            }}
                          />
                        </div>
                        <span className="font-mono text-[9px] text-muted-foreground">
                          {cIdx}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 10x10 Grid Cells */}
                <div className="grid grid-cols-10 gap-1.5 rounded-xl border border-border/70 bg-card p-2 sm:p-3 shadow-inner">
                  {matrix10x10.map((row: number[], rIdx: number) =>
                    row.map((val: number, cIdx: number) => {
                      const normRatio = val / maxCellVal;
                      const isHovered = hoveredCell?.r === rIdx && hoveredCell?.c === cIdx;
                      return (
                        <div
                          key={`${rIdx}-${cIdx}`}
                          onMouseEnter={() => setHoveredCell({ r: rIdx, c: cIdx, val })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`relative aspect-square rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center ${
                            isHovered
                              ? "scale-110 z-10 ring-2 ring-foreground shadow-md"
                              : "hover:scale-105"
                          }`}
                          style={{
                            backgroundColor: `color-mix(in oklab, var(--wsp-chrome) ${(normRatio * 90).toFixed(0)}%, var(--card))`,
                            border: `1px solid color-mix(in oklab, var(--wsp-chrome) ${(normRatio * 60).toFixed(0)}%, var(--border))`,
                          }}
                        >
                          {normRatio > 0.45 && (
                            <span className="font-mono text-[8px] font-bold text-foreground opacity-75 select-none pointer-events-none hidden sm:inline">
                              {val.toFixed(1)}
                            </span>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* Hover Telemetry Footer */}
            <div className="flex items-center justify-between border-t border-border/60 pt-3 font-mono text-[11px] text-muted-foreground">
              <div>
                {hoveredCell ? (
                  <span>
                    Coordinate: <strong className="text-foreground">[Row {hoveredCell.r}, Col {hoveredCell.c}]</strong> · L2 Norm: <strong className="text-[var(--wsp-chrome)]">{hoveredCell.val.toFixed(4)}</strong>
                  </span>
                ) : (
                  <span>Hover any grid cell to inspect exact L2 weight norm</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[var(--wsp-chrome)]" />
                  <span>Energy Density</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="size-2 rounded-full bg-[var(--wsp-amber)]" />
                  <span>Marginal Peak</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

