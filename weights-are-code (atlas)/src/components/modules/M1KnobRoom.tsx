"use client";

import { useMemo, useRef, useState } from "react";
import ModuleChrome from "./ModuleChrome";
import { clamp, mulberry32 } from "./utils";

interface Pt {
  x: number;
  y: number;
  cls: 0 | 1;
}

const W = 560;
const H = 340;
const PAD = 38;

function makePoints(): Pt[] {
  const rng = mulberry32(7);
  const pts: Pt[] = [];
  for (let i = 0; i < 9; i++)
    pts.push({ x: 0.12 + rng() * 0.3, y: 0.1 + rng() * 0.32, cls: 0 });
  for (let i = 0; i < 9; i++)
    pts.push({ x: 0.55 + rng() * 0.32, y: 0.5 + rng() * 0.38, cls: 1 });
  return pts;
}
const POINTS = makePoints();

function Knob({
  val,
  onChange,
  label,
  color,
}: {
  val: number;
  onChange: (v: number) => void;
  label: string;
  color: string;
}) {
  const dragging = useRef(false);
  const lastY = useRef(0);
  const angle = clamp(val, -2.5, 2.5) * 30;
  return (
    <div className="flex flex-col items-center gap-1.5 select-none">
      <svg
        width="68"
        height="68"
        viewBox="0 0 72 72"
        role="slider"
        aria-label={`${label} = ${val.toFixed(2)}`}
        aria-valuenow={val}
        aria-valuemin={-2.5}
        aria-valuemax={2.5}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowUp" || e.key === "ArrowRight") onChange(clamp(val + 0.1, -2.5, 2.5));
          if (e.key === "ArrowDown" || e.key === "ArrowLeft") onChange(clamp(val - 0.1, -2.5, 2.5));
        }}
        onPointerDown={(e) => {
          dragging.current = true;
          lastY.current = e.clientY;
          (e.target as Element).setPointerCapture?.(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (!dragging.current) return;
          const dy = lastY.current - e.clientY;
          lastY.current = e.clientY;
          onChange(clamp(val + dy * 0.012, -2.5, 2.5));
        }}
        onPointerUp={() => (dragging.current = false)}
        className="cursor-ns-resize touch-none"
      >
        <circle cx="36" cy="36" r="30" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
        <circle cx="36" cy="36" r="24" fill="none" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
        <line
          x1="36"
          y1="36"
          x2="36"
          y2="12"
          stroke={color}
          strokeWidth="3.5"
          strokeLinecap="round"
          transform={`rotate(${angle} 36 36)`}
        />
        <circle cx="36" cy="36" r="4.5" fill={color} />
      </svg>
      <span className="font-mono text-xs font-semibold" style={{ color }}>
        {label} = {val >= 0 ? `+${val.toFixed(2)}` : val.toFixed(2)}
      </span>
    </div>
  );
}

export default function M1KnobRoom() {
  const [w1, setW1] = useState(1.0);
  const [w2, setW2] = useState(-0.6);
  const [b, setB] = useState(0.0);

  const { linePts, acc, correctCount, predOf } = useMemo(() => {
    // decision boundary: w1*x + w2*y + b = 0 in unit coords
    const predOf = (x: number, y: number) => w1 * x + w2 * y + b > 0;
    let correct = 0;
    for (const p of POINTS) if (predOf(p.x, p.y) === (p.cls === 1)) correct++;
    const acc = correct / POINTS.length;

    // Robust 4-edge parametric clipping against [-0.05, 1.05]^2
    const minC = -0.05;
    const maxC = 1.05;
    const rawPts: { x: number; y: number }[] = [];

    const addIfValid = (x: number, y: number) => {
      if (x >= minC - 1e-4 && x <= maxC + 1e-4 && y >= minC - 1e-4 && y <= maxC + 1e-4) {
        const cx = clamp(x, minC, maxC);
        const cy = clamp(y, minC, maxC);
        if (!rawPts.some((p) => Math.hypot(p.x - cx, p.y - cy) < 1e-3)) {
          rawPts.push({ x: cx, y: cy });
        }
      }
    };

    if (Math.abs(w2) > 1e-6) {
      addIfValid(minC, (-b - w1 * minC) / w2);
      addIfValid(maxC, (-b - w1 * maxC) / w2);
    }
    if (Math.abs(w1) > 1e-6) {
      addIfValid((-b - w2 * minC) / w1, minC);
      addIfValid((-b - w2 * maxC) / w1, maxC);
    }

    let linePts: { x: number; y: number }[] = [];
    if (rawPts.length >= 2) {
      if (rawPts.length === 2) {
        linePts = rawPts;
      } else {
        // Pick the two points with maximal separation
        let maxDist = -1;
        let pA = rawPts[0];
        let pB = rawPts[1];
        for (let i = 0; i < rawPts.length; i++) {
          for (let j = i + 1; j < rawPts.length; j++) {
            const d = Math.hypot(rawPts[i].x - rawPts[j].x, rawPts[i].y - rawPts[j].y);
            if (d > maxDist) {
              maxDist = d;
              pA = rawPts[i];
              pB = rawPts[j];
            }
          }
        }
        linePts = [pA, pB];
      }
    }

    return { linePts, acc, correctCount: correct, predOf };
  }, [w1, w2, b]);

  const toPx = (x: number, y: number) => ({
    px: PAD + x * (W - 2 * PAD),
    py: H - PAD - y * (H - 2 * PAD),
  });

  return (
    <ModuleChrome
      id="m1-knob-room"
      badge="schematic"
      title="M1 · The Knob Room"
      blurb="drag the knobs - the decision line follows your fingers"
      note="TEACHING SCHEMATIC - invented toy data, ILLUSTRATIVE ONLY. The aha: weights ARE behaviour."
      caption={`${acc === 1 ? "Perfect - every point on the right side of the line" : `Accuracy ${(acc * 100).toFixed(0)}% - move the knobs (or drag up/down on them) until the line splits ○ from ◆`}`}
      levelCaptions={{
        1: "Each knob is one number inside a machine. Turn them and the machine changes its mind.",
        2: "A tiny “neuron” multiplies two inputs by two knobs (weights), adds a bias, and picks a side. Same knobs = same behaviour.",
        3: "y = w₁x₁ + w₂x₂ + b. The knobs set the hyperplane normal (w₁, w₂); the bias shifts the intercept. Points classify by sign(wᵀx + b).",
        4: "Try w₁=2.5, w₂=0.3 to see the line pivot on a near-zero weight - in high P this is exactly the “one dead input” failure mode.",
        5: "Invert the exercise: given only the 17,253 numbers (Exp 1), the reader had to guess what behaviour they encode - you just felt why that is hard.",
      }}
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_320px] items-start w-full">
        {/* Canvas & Legend */}
        <div className="w-full">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="w-full rounded-2xl border bg-card/60 shadow-sm"
            role="img"
            aria-label="Decision line separating two classes of points, controlled by weight knobs"
          >
            {/* Top Legend Bar */}
            <rect x="0" y="0" width={W} height="36" fill="var(--background)" fillOpacity="0.75" />
            <line x1="0" y1="36" x2={W} y2="36" stroke="var(--border)" strokeWidth="1" />

            {/* Legend items */}
            <circle cx="24" cy="18" r="6" fill="none" stroke="var(--wsp-blue)" strokeWidth="2" />
            <text x="36" y="22" fontSize="11" className="mono" fill="var(--muted-foreground)">
              ○ Class 0
            </text>

            <rect x="108" y="12" width="10" height="10" transform="rotate(45 113 17)" fill="var(--wsp-green)" fillOpacity="0.3" stroke="var(--wsp-green)" strokeWidth="2" />
            <text x="128" y="22" fontSize="11" className="mono" fill="var(--muted-foreground)">
              ◆ Class 1
            </text>

            <line x1="196" y1="18" x2="216" y2="18" stroke="var(--wsp-chrome)" strokeWidth="2.5" />
            <text x="224" y="22" fontSize="11" className="mono" fill="var(--muted-foreground)">
              - Decision Boundary
            </text>

            {/* In-Canvas Accuracy Badge */}
            <g transform={`translate(${W - 128}, 8)`}>
              <rect
                x="0"
                y="0"
                width="116"
                height="20"
                rx="5"
                fill={acc === 1 ? "var(--wsp-green)" : "var(--card)"}
                fillOpacity={acc === 1 ? "0.2" : "0.9"}
                stroke={acc === 1 ? "var(--wsp-green)" : "var(--border)"}
                strokeWidth="1"
              />
              <text
                x="58"
                y="14"
                textAnchor="middle"
                fontSize="11"
                fontWeight="600"
                className="mono"
                fill={acc === 1 ? "var(--wsp-green)" : "var(--foreground)"}
              >
                Accuracy: {(acc * 100).toFixed(0)}%
              </text>
            </g>

            {/* Decision Line */}
            {linePts.length === 2 && (
              <line
                x1={toPx(linePts[0].x, linePts[0].y).px}
                y1={toPx(linePts[0].x, linePts[0].y).py}
                x2={toPx(linePts[1].x, linePts[1].y).px}
                y2={toPx(linePts[1].x, linePts[1].y).py}
                stroke="var(--wsp-chrome)"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
            )}

            {/* Data Points */}
            {POINTS.map((p, i) => {
              const { px, py } = toPx(p.x, p.y);
              const right = predOf(p.x, p.y);
              const correct = right === (p.cls === 1);
              return p.cls === 0 ? (
                <circle
                  key={i}
                  cx={px}
                  cy={py}
                  r="7.5"
                  fill="none"
                  stroke={correct ? "var(--wsp-green)" : "var(--wsp-red)"}
                  strokeWidth="2.5"
                />
              ) : (
                <rect
                  key={i}
                  x={px - 6}
                  y={py - 6}
                  width="12"
                  height="12"
                  transform={`rotate(45 ${px} ${py})`}
                  fill={correct ? "var(--wsp-green)" : "var(--wsp-red)"}
                  fillOpacity="0.25"
                  stroke={correct ? "var(--wsp-green)" : "var(--wsp-red)"}
                  strokeWidth="2.5"
                />
              );
            })}

            {/* Coordinate Axis Labels */}
            <text x={PAD} y={H - 10} className="mono" fontSize="11" fill="var(--muted-foreground)">
              x₁ →
            </text>
            <text x={12} y={PAD + 12} className="mono" fontSize="11" fill="var(--muted-foreground)">
              x₂ ↑
            </text>
          </svg>
        </div>

        {/* Unified Parameter Control Panel */}
        <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-5">
          <div className="flex items-center justify-between border-b border-border/60 pb-3">
            <div>
              <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">
                Neuron Hyperplane
              </h3>
              <p className="font-mono text-[11px] text-muted-foreground mt-0.5">
                w₁x₁ + w₂x₂ + b = 0
              </p>
            </div>
            <span
              className="rounded-full px-2.5 py-0.5 font-mono text-xs font-semibold border"
              style={{
                borderColor: acc === 1 ? "var(--wsp-green)" : "var(--border)",
                backgroundColor: acc === 1 ? "color-mix(in oklab, var(--wsp-green) 15%, transparent)" : "var(--muted)",
                color: acc === 1 ? "var(--wsp-green)" : "var(--muted-foreground)",
              }}
            >
              {correctCount} / {POINTS.length} pts
            </span>
          </div>

          {/* Rotary Knobs for w1 and w2 */}
          <div className="flex items-center justify-around py-1">
            <Knob val={w1} onChange={setW1} label="w₁ (weight 1)" color="var(--wsp-blue)" />
            <Knob val={w2} onChange={setW2} label="w₂ (weight 2)" color="var(--wsp-green)" />
          </div>

          {/* Slider for w1 */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-[var(--wsp-blue)]">w₁ Slider</span>
              <span>{w1 >= 0 ? `+${w1.toFixed(2)}` : w1.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={-2.5}
              max={2.5}
              step={0.05}
              value={w1}
              onChange={(e) => setW1(parseFloat(e.target.value))}
              className="wsp-slider w-full"
              aria-label="Weight 1 slider"
            />
          </div>

          {/* Slider for w2 */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-[var(--wsp-green)]">w₂ Slider</span>
              <span>{w2 >= 0 ? `+${w2.toFixed(2)}` : w2.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={-2.5}
              max={2.5}
              step={0.05}
              value={w2}
              onChange={(e) => setW2(parseFloat(e.target.value))}
              className="wsp-slider w-full"
              aria-label="Weight 2 slider"
            />
          </div>

          {/* Bias Slider */}
          <div className="space-y-1.5">
            <div className="flex justify-between font-mono text-xs">
              <span className="text-foreground">Bias b</span>
              <span>{b >= 0 ? `+${b.toFixed(2)}` : b.toFixed(2)}</span>
            </div>
            <input
              type="range"
              min={-1}
              max={1}
              step={0.02}
              value={b}
              onChange={(e) => setB(parseFloat(e.target.value))}
              className="wsp-slider w-full"
              aria-label="Bias value slider"
            />
          </div>

          {/* Presets / Action Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/60">
            <button
              onClick={() => {
                setW1(1.0);
                setW2(1.0);
                setB(-0.9);
              }}
              className="h-10 rounded-xl border border-[var(--wsp-chrome)]/60 bg-[color-mix(in_oklab,var(--wsp-chrome)_12%,transparent)] font-sans text-xs font-semibold text-foreground hover:bg-[color-mix(in_oklab,var(--wsp-chrome)_20%,transparent)] transition-colors"
            >
              Solve it for me
            </button>
            <button
              onClick={() => {
                setW1(-0.4);
                setW2(0.5);
                setB(0.3);
              }}
              className="h-10 rounded-xl border bg-card/80 font-sans text-xs text-muted-foreground hover:text-foreground hover:bg-card transition-colors"
            >
              Scramble
            </button>
          </div>
        </div>
      </div>
    </ModuleChrome>
  );
}
