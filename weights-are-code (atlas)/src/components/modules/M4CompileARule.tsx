"use client";

import { useEffect, useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { useReducedMotion } from "./utils";

const relu = (z: number) => Math.max(0, z);

function Bar({ v, max, color, label }: { v: number; max: number; color: string; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <span className="mono w-16 shrink-0 text-right text-xs">{label}</span>
      <div className="h-6 flex-1 overflow-hidden rounded-md border bg-accent">
        <div
          className="h-full rounded-[5px] transition-all duration-200"
          style={{ width: `${Math.max(0, Math.min(1, v / max)) * 100}%`, background: color }}
        />
      </div>
      <span className="mono w-12 text-xs text-muted-foreground">{v.toFixed(2)}</span>
    </div>
  );
}

export default function M4CompileARule() {
  const [ball, setBall] = useState(0.3);
  const [paddle, setPaddle] = useState(0.7);
  const [deadzone, setDeadzone] = useState(0.05);
  const [playing, setPlaying] = useState(false);
  const [phase, setPhase] = useState(0);
  const reduced = useReducedMotion();

  // lab/01_compile_a_rule.py, with the bias knob exposed as "dead-zone"
  const b1 = [-deadzone, -deadzone];
  const h = [relu(-ball + paddle + b1[0]), relu(ball - paddle + b1[1])];
  const z = [h[0], 0.05, h[1]];
  const action = z.indexOf(Math.max(...z));
  const ACTIONS = ["left", "stay", "right"];

  useEffect(() => {
    if (!playing || reduced) return;
    const id = setInterval(() => {
      setPhase((p) => {
        const np = (p + 1) % 100;
        setBall(0.5 + 0.45 * Math.sin(np * 0.22));
        return np;
      });
    }, 90);
    return () => clearInterval(id);
  }, [playing, reduced]);

  const togglePlay = () => {
    if (reduced) {
      // reduced motion: play becomes step-through
      setPhase((p) => {
        const np = (p + 6) % 100;
        setBall(0.5 + 0.45 * Math.sin(np * 0.22));
        return np;
      });
      return;
    }
    setPlaying((p) => !p);
  };

  return (
    <ModuleChrome
      id="m4-compile-rule"
      badge="schematic"
      title="M4 · Compile a Rule into Weights"
      blurb="the 17-number paddle follower, live"
      transport
      playing={playing && !reduced}
      progress={phase / 99}
      onPlayPause={togglePlay}
      onStep={(d) => {
        setPlaying(false);
        setBall((b) => Math.max(0, Math.min(1, b + d * 0.08)));
      }}
      onReset={() => {
        setPlaying(false);
        setBall(0.3);
        setPaddle(0.7);
        setDeadzone(0.05);
      }}
      caption={`With ball at ${ball.toFixed(2)} and paddle at ${paddle.toFixed(2)}: h₀ (ball left) = ${h[0].toFixed(2)}, h₁ (ball right) = ${h[1].toFixed(2)} → logits ${z.map((x) => x.toFixed(2)).join(" / ")} → action: ${ACTIONS[action].toUpperCase()}`}
      levelCaptions={{
        1: "Two little meters inside the machine - “ball is left” and “ball is right” - and a tiny table that says which way to move. That table IS the weights.",
        2: "Reasoning about the game produced a rule; the rule became 17 numbers; the numbers ARE a neural network. No training happened.",
        3: "h = ReLU(W₁[b,p]ᵀ + b₁), z = W₂h + b₂. W₁ encodes comparisons, ReLU makes them one-sided detectors, W₂ votes for an action.",
        4: "This is the “reason → program → compile into weights” path the authors report for their paddle-landing predictor. The full runnable file is lab/01_compile_a_rule.py.",
        5: "Ask: would this compile-and-pray scale beyond rules you can hold in your head? The Go result (Exp 6) says “further than you’d guess” - and its n=1 runs say “not yet evidence”.",
      }}
      note="TEACHING SCHEMATIC - the paddle net is invented for teaching (it is lab/01). It is NOT one of the paper’s networks."
    >
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-1 flex items-center gap-3 font-sans text-sm">
            ball x
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={ball}
              onChange={(e) => {
                setPlaying(false);
                setBall(parseFloat(e.target.value));
              }}
              className="wsp-slider flex-1"
              aria-label="Ball position"
            />
          </label>
          <label className="mb-4 flex items-center gap-3 font-sans text-sm">
            paddle x
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={paddle}
              onChange={(e) => setPaddle(parseFloat(e.target.value))}
              className="wsp-slider flex-1"
              aria-label="Paddle position"
            />
          </label>
          <label className="flex items-center gap-3 font-sans text-sm">
            dead-zone
            <input
              type="range"
              min={0.01}
              max={0.4}
              step={0.01}
              value={deadzone}
              onChange={(e) => setDeadzone(parseFloat(e.target.value))}
              className="wsp-slider flex-1"
              aria-label="Dead zone margin"
            />
            <span className="mono w-12 text-xs">{deadzone.toFixed(2)}</span>
          </label>
          <svg viewBox="0 0 320 120" className="mt-4 w-full" role="img" aria-label="Track showing ball and paddle positions">
            <rect x="8" y="52" width="304" height="8" rx="4" fill="var(--border)" />
            <circle cx={8 + ball * 304} cy="56" r="7" fill="var(--wsp-blue)" />
            <rect x={8 + paddle * 304 - 18} y="34" width="36" height="44" rx="6" fill="none" stroke="var(--wsp-green)" strokeWidth="3" />
            <text x="8" y="18" fontSize="10" className="mono" fill="var(--wsp-blue)">ball</text>
            <text x="284" y="18" fontSize="10" className="mono" fill="var(--wsp-green)">paddle</text>
          </svg>
          <div className="mt-3 rounded-lg border bg-accent px-3 py-2 font-mono text-sm">
            action = argmax z ={" "}
            <span style={{ color: action === 0 ? "var(--wsp-blue)" : action === 2 ? "var(--wsp-green)" : "var(--muted-foreground)", fontWeight: 700 }}>
              {ACTIONS[action]}
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <p className="font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Inside the network</p>
          <Bar v={h[0]} max={1} color="var(--wsp-blue)" label="h₀ ←" />
          <Bar v={h[1]} max={1} color="var(--wsp-blue)" label="h₁ →" />
          <p className="pt-2 font-sans text-xs font-bold uppercase tracking-wider text-muted-foreground">Logits</p>
          <Bar v={z[0]} max={1} color={action === 0 ? "var(--wsp-blue)" : "var(--border)"} label="z₀ ←" />
          <Bar v={z[1]} max={1} color={action === 1 ? "var(--wsp-chrome)" : "var(--border)"} label="z₁ ●" />
          <Bar v={z[2]} max={1} color={action === 2 ? "var(--wsp-green)" : "var(--border)"} label="z₂ →" />
          <p className="pt-2 font-mono text-xs text-muted-foreground">
            W₁ = [[-1, 1], [1, -1]] · b₁ = [-{deadzone.toFixed(2)}, -{deadzone.toFixed(2)}] · W₂ = [[1,0],[0,0],[0,1]] · b₂ = [0, .05, 0]
          </p>
        </div>
      </div>
    </ModuleChrome>
  );
}
