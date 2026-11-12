"use client";

import { useEffect, useRef, useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { clamp, useReducedMotion } from "./utils";

/** Loss hill: f(θ) = 0.5·(θ − θ*)² mapped to the drawing. */
const THETA_STAR = 0.62;
const THETA0 = -0.85;
const f = (t: number) => 0.5 * (t - THETA_STAR) ** 2;
const W = 480;
const H = 260;
const toX = (t: number) => 40 + ((t + 1) / 2) * (W - 80);
const toY = (v: number) => H - 34 - v * (H - 60) * 2.4;

export default function M2TwoWaysToMove() {
  const [theta, setTheta] = useState(THETA0);
  const [steps, setSteps] = useState(0);
  const [eta, setEta] = useState(0.35);
  const [playing, setPlaying] = useState(false);
  const [jumped, setJumped] = useState(false);
  const reduced = useReducedMotion();
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stepOnce = () => {
    setTheta((t) => clamp(t - eta * (t - THETA_STAR), -1.05, 1.05));
    setSteps((s) => s + 1);
  };

  const togglePlay = () => {
    if (reduced) {
      // reduced motion: play becomes step-through
      stepOnce();
      return;
    }
    setPlaying((p) => !p);
  };

  const reset = () => {
    setPlaying(false);
    setTheta(THETA0);
    setSteps(0);
    setJumped(false);
  };

  useEffect(() => {
    if (!playing || reduced) return;
    timer.current = setInterval(() => {
      setTheta((t) => {
        const nt = clamp(t - eta * (t - THETA_STAR), -1.05, 1.05);
        if (Math.abs(nt - THETA_STAR) < 0.004) {
          setPlaying(false);
          return THETA_STAR;
        }
        return nt;
      });
      setSteps((s) => s + 1);
    }, 260);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, eta, reduced]);

  const curve: string = Array.from({ length: 60 }, (_, i) => {
    const t = -1 + (i / 59) * 2;
    return `${i === 0 ? "M" : "L"}${toX(t)},${toY(f(t))}`;
  }).join(" ");

  return (
    <ModuleChrome
      id="m2-two-ways"
      badge="schematic"
      title="M2 · Two Ways to Move"
      blurb="gradient descent crawls; a reasoned edit jumps"
      transport
      playing={playing && !reduced}
      progress={clamp(Math.abs(theta - THETA0) / Math.abs(THETA_STAR - THETA0), 0, 1)}
      onPlayPause={togglePlay}
      onStep={(d) => {
        if (d > 0) stepOnce();
        else setTheta((t) => clamp(THETA_STAR === t ? t : t + (t - THETA_STAR) * eta * 0.5, -1.05, 1.05));
      }}
      onReset={reset}
      caption={`Left: ${steps} tiny gradient steps so far (learning rate η = ${eta.toFixed(2)}). Right: one reasoned jump, 0 forward passes before the edit.`}
      levelCaptions={{
        1: "One ball takes the stairs down step by step, counting every hop. The other sees where the bottom is and teleports.",
        2: "Today’s training nudges weights millions of times. A weight-space edit picks the destination in one go - the cost is thinking, not stepping.",
        3: "Left: θ ← θ − η∇L(θ), converging geometrically for η<1. Right: θ′ = θ + Δ with Δ produced by reasoning (see the formula pack).",
        4: "Push η above 1.0 (slider caps below) to feel the stability edge - gradient steps can overshoot; a reasoned Δ can be wrong in a completely different way: no theorem protects it.",
        5: "Cost accounting matters only if both reach comparable minima. In Exp 5–6 the written policies beat PPO’s 100M–500M steps on some games - that is the anomaly worth interrogating.",
      }}
      note="TEACHING SCHEMATIC - the “hill” is invented. The step/jump contrast mirrors the paper’s method comparison, but no real loss curve looks this tidy."
      extra={
        <label className="flex items-center gap-3 font-sans text-sm">
          η (learning rate)
          <input
            type="range"
            min={0.05}
            max={0.95}
            step={0.05}
            value={eta}
            onChange={(e) => setEta(parseFloat(e.target.value))}
            className="wsp-slider w-36"
            aria-label="Learning rate"
          />
          <span className="mono w-10 text-sm">{eta.toFixed(2)}</span>
        </label>
      }
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-card p-2">
          <p className="px-2 pt-1 font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
            ① Optimization - many small steps
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Gradient descent ball rolling down a loss hill">
            <path d={curve} fill="none" stroke="var(--wsp-blue)" strokeWidth="3" />
            <line x1={toX(THETA_STAR)} y1={toY(f(THETA_STAR)) - 4} x2={toX(THETA_STAR)} y2={H - 30} stroke="var(--border)" strokeDasharray="4 4" />
            <circle cx={toX(theta)} cy={toY(f(theta))} r="9" fill="var(--wsp-blue)" />
            <text x={toX(THETA_STAR) - 24} y={H - 12} fontSize="11" className="mono" fill="var(--muted-foreground)">
              θ*
            </text>
          </svg>
          <p className="px-2 pb-1 font-mono text-xs text-muted-foreground">steps so far: {steps}</p>
        </div>
        <div className="rounded-xl border bg-card p-2">
          <p className="px-2 pt-1 font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">
            ④ Weight-space programming - one reasoned jump
          </p>
          <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="One jump from start to optimum">
            <path d={curve} fill="none" stroke="var(--wsp-blue)" strokeWidth="3" opacity="0.3" />
            <circle cx={toX(THETA0)} cy={toY(f(THETA0))} r="9" fill="none" stroke="var(--wsp-green)" strokeWidth="2.5" />
            <circle cx={toX(THETA_STAR)} cy={toY(f(THETA_STAR))} r="9" fill="var(--wsp-green)" />
            <path
              d={`M${toX(THETA0)},${toY(f(THETA0))} Q${toX((THETA0 + THETA_STAR) / 2)},${toY(f((THETA0 + THETA_STAR) / 2)) - 70} ${toX(THETA_STAR)},${toY(f(THETA_STAR))}`}
              fill="none"
              stroke="var(--wsp-green)"
              strokeWidth="2.5"
              strokeDasharray={jumped ? "0" : "6 6"}
              markerEnd="url(#arrowm2)"
            />
            <defs>
              <marker id="arrowm2" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6 Z" fill="var(--wsp-green)" />
              </marker>
            </defs>
            <text x={toX(THETA0) - 8} y={toY(f(THETA0)) + 26} fontSize="12" className="mono" fill="var(--wsp-green)">
              θ
            </text>
            <text x={toX(THETA_STAR) - 10} y={toY(f(THETA_STAR)) - 18} fontSize="12" className="mono" fill="var(--wsp-green)">
              θ + Δ
            </text>
          </svg>
          <p className="px-2 pb-1 font-mono text-xs text-muted-foreground">
            forward passes before the edit: 0 · Δ decided by: reasoning
          </p>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <button onClick={() => setJumped((j) => !j)} className="h-11 rounded-lg border bg-card px-4 font-sans text-sm hover:bg-accent">
          {jumped ? "Replay the jump" : "Make the jump"}
        </button>
        <p className="self-center font-sans text-xs text-muted-foreground">
          Count the cost difference - that’s the whole pitch, and the whole open question.
        </p>
      </div>
    </ModuleChrome>
  );
}
