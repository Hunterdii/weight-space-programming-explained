import type { ReactNode } from "react";
import { BadgeChip } from "@/components/content/Badge";
import { badgeTf } from "@/components/content/DataTable";

function Frame({
  badge,
  caption,
  children,
  watermark = false,
}: {
  badge: "paper" | "review" | "schematic" | "speculation";
  caption: string;
  children: ReactNode;
  watermark?: boolean;
}) {
  return (
    <figure className={`my-8 max-w-full ${badgeTf(badge)}`}>
      <div className="mb-2 flex flex-wrap items-center gap-2 font-sans text-xs text-muted-foreground">
        <BadgeChip b={badge} />
        <span className="font-medium text-foreground/80 normal-case tracking-normal">{caption}</span>
      </div>
      <div className={`overflow-x-auto rounded-2xl border border-border/80 bg-card/80 p-4 sm:p-6 shadow-sm backdrop-blur-sm ${watermark ? "watermarked" : ""}`}>
        {children}
      </div>
    </figure>
  );
}

const S = (p: { children: ReactNode; vb: string; label: string }) => (
  <svg viewBox={p.vb} role="img" aria-label={p.label} className="w-full">
    {p.children}
  </svg>
);

/* ---------- Fig 1: a network is a pile of numbers ---------- */
function FigAnatomy() {
  return (
    <Frame badge="schematic" caption="Same wiring, different numbers, different skill. ILLUSTRATIVE, NOT REAL DATA." watermark>
      <S vb="0 0 720 240" label="Two identical network diagrams; different weight values give different skills">
        {[
          ["Behaviour: “catch the ball”", 40, "#4c9dff"],
          ["Behaviour: “run from ghosts”", 400, "#34d399"],
        ].map(([label, x0, col], k) => (
          <g key={k}>
            <text x={x0 as number} y="20" fontSize="13" fill={col as string} className="mono">
              {label as string}
            </text>
            {Array.from({ length: 3 }, (_, r) =>
              Array.from({ length: 4 }, (_, c) => (
                <circle key={`${r}-${c}`} cx={(x0 as number) + 30 + c * 60} cy={60 + r * 55} r="13" fill="none" stroke="var(--border)" strokeWidth="1.5" />
              ))
            )}
            {Array.from({ length: 3 }, (_, l) =>
              Array.from({ length: 2 }, (_, a) =>
                Array.from({ length: 2 }, (_, b) => {
                  const c1 = l + a;
                  const c2 = l + 1 + b;
                  const rngv = ((l * 7 + a * 3 + b * 11 + k * 5) % 10) / 10 - 0.5;
                  return (
                    <line
                      key={`${l}-${a}-${b}`}
                      x1={(x0 as number) + 30 + c1 * 60}
                      y1={60 + a * 55}
                      x2={(x0 as number) + 30 + c2 * 60}
                      y2={60 + (b + (c2 > 0 ? 0 : 0)) * 55 + 55}
                      stroke={col as string}
                      strokeWidth={Math.abs(rngv) * 6 + 0.6}
                      opacity={0.25 + Math.abs(rngv)}
                    />
                  );
                })
              )
            )}
          </g>
        ))}
        <text x="360" y="228" fontSize="12" fill="var(--muted-foreground)" textAnchor="middle" className="mono">
          architecture identical · θ different ⇒ f different
        </text>
      </S>
    </Frame>
  );
}

/* ---------- Fig 2: the four ways to write weights ---------- */
function FigFourWays() {
  const cols = [
    { t: "① Optimization", d: "SGD · Adam · Muon - millions of tiny symbolic steps", c: "#4c9dff" },
    { t: "② Trained writers", d: "hypernetworks · fast weights · weight diffusion", c: "#0284c7" },
    { t: "③ Compilers", d: "Tracr - formal program → weights", c: "#34d399" },
    { t: "④ WSP", d: "a general LLM reasons about θ and writes Δ directly", c: "#ffc857" },
  ];
  return (
    <Frame badge="schematic" caption="Four paradigms for writing weights - ①②③ existed before; ④ is the new claim. ILLUSTRATIVE.">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {cols.map((c, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl p-4 relative overflow-hidden"
            style={{
              border: `1.5px ${i === 3 ? "dashed" : "solid"} ${c.c}`,
              background: `color-mix(in oklab, ${c.c} 7%, transparent)`,
            }}
          >
            <span className="font-mono text-sm font-bold leading-tight" style={{ color: c.c }}>
              {c.t}
            </span>
            {/* Placeholder bars */}
            <div className="flex flex-col gap-1.5">
              {[100, 70, 48].map((w, j) => (
                <div
                  key={j}
                  className="rounded-sm h-2.5"
                  style={{
                    width: `${w}%`,
                    background: c.c,
                    opacity: 0.28 - j * 0.07,
                  }}
                />
              ))}
            </div>
            <p className="mt-auto font-mono text-[10px] leading-snug text-muted-foreground">
              {c.d}
            </p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

/* ---------- Fig 3: weight-space landscape ---------- */
function FigLandscape() {
  const ring = (r: number) => `M ${360 + r * 0.9} 140 A ${r} ${r * 0.55} 0 1 0 ${360 - r * 0.9} 140 A ${r} ${r * 0.55} 0 1 0 ${360 + r * 0.9} 140`;
  return (
    <Frame badge="schematic" caption="Weight space as a landscape: training walks, WSP teleports. ILLUSTRATIVE, NOT REAL DATA." watermark>
      <S vb="0 0 720 280" label="Contour rings of a loss landscape with a slow walking path and a single jump">
        {[42, 78, 114, 150, 186].map((r, i) => (
          <path key={r} d={ring(r)} fill="none" stroke="var(--border)" strokeWidth="1.4" strokeDasharray={i % 2 ? "4 4" : "0"} />
        ))}
        <circle cx="360" cy="140" r="6" fill="var(--wsp-green)" />
        <text x="372" y="136" fontSize="12" className="mono" fill="var(--wsp-green)">
          θ* behaviour
        </text>
        <path d="M 160 208 C 200 190, 240 196, 300 178 S 350 150, 356 144" fill="none" stroke="var(--wsp-blue)" strokeWidth="2.6" strokeDasharray="2 6" />
        <circle cx="160" cy="208" r="5.5" fill="var(--wsp-blue)" />
        <text x="120" y="232" fontSize="12" className="mono" fill="var(--wsp-blue)">
          θ₀
        </text>
        <path d="M 520 220 Q 420 40, 368 146" fill="none" stroke="var(--wsp-amber)" strokeWidth="2.6" markerEnd="url(#fa)" />
        <defs>
          <marker id="fa" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--wsp-amber)" />
          </marker>
        </defs>
        <circle cx="520" cy="220" r="5.5" fill="var(--wsp-amber)" />
        <text x="500" y="244" fontSize="12" className="mono" fill="var(--wsp-amber)">
          θ + Δ
        </text>
        <text x="196" y="184" fontSize="11" className="mono" fill="var(--wsp-blue)">
          training: ~10⁶ steps
        </text>
        <text x="446" y="60" fontSize="11" className="mono" fill="var(--wsp-amber)">
          WSP: 1 reasoned edit
        </text>
      </S>
    </Frame>
  );
}

/* ---------- Fig 4: the two mechanisms ---------- */
function FigMechanism() {
  return (
    <Frame badge="schematic" caption="The two reported mechanisms: compile-a-program vs subtract-a-direction. ILLUSTRATIVE.">
      <div className="grid gap-4 md:grid-cols-2">
        <S vb="0 0 360 190" label="Reason, program, compile into weights: paddle predictor and Go liberties">
          <rect x="8" y="10" width="344" height="172" rx="10" fill="none" stroke="var(--wsp-green)" strokeWidth="1.4" />
          <text x="22" y="34" fontSize="13" className="mono" fill="var(--wsp-green)" fontWeight="700">
            reason → program → compile into weights
          </text>
          {[
            ["reason about the game", 58],
            ["write pseudo-rules (liberties, atari)", 90],
            ["compile rules into W₁, W₂, …", 122],
            ["test 0–50 passes", 154],
          ].map(([t, y], i) => (
            <g key={i}>
              <rect x="22" y={(y as number) - 16} width="316" height="22" rx="6" fill="var(--wsp-green)" opacity="0.14" />
              <text x="32" y={y as number} fontSize="11.5" className="mono" fill="var(--muted-foreground)">
                {t as string}
              </text>
            </g>
          ))}
        </S>
        <S vb="0 0 360 190" label="Reason, find a direction, subtract it: the looping direction removed from output columns">
          <rect x="8" y="10" width="344" height="172" rx="10" fill="none" stroke="var(--wsp-blue)" strokeWidth="1.4" />
          <text x="22" y="34" fontSize="13" className="mono" fill="var(--wsp-blue)" fontWeight="700">
            reason → find a direction → subtract it
          </text>
          {[
            ["read MLPs of layers 15 & 19", 58],
            ["identify the re-injected “loop” u", 90],
            ["subtract u from 64 columns × 2", 122],
            ["verify: token-limit share falls", 154],
          ].map(([t, y], i) => (
            <g key={i}>
              <rect x="22" y={(y as number) - 16} width="316" height="22" rx="6" fill="var(--wsp-blue)" opacity="0.12" />
              <text x="32" y={y as number} fontSize="11.5" className="mono" fill="var(--muted-foreground)">
                {t as string}
              </text>
            </g>
          ))}
        </S>
      </div>
    </Frame>
  );
}

/* ---------- Fig 5: head 10.2 honesty pattern (paper data) ---------- */
function FigHead102() {
  return (
    <Frame badge="paper" caption="Exp 7, head 10.2: where attention goes on self-written texts (values from the post).">
      <S vb="0 0 720 230" label="Bar chart: honest model attends to question numbers; sycophant attends to the user's answer">
        <text x="40" y="30" fontSize="13" className="mono" fill="var(--muted-foreground)">
          attention share on question numbers vs user’s answer
        </text>
        {[
          ["honest", 0.943, 0.0075, "var(--wsp-green)"],
          ["sycophant", 0.035, 0.857, "var(--wsp-red)"],
        ].map(([label, v1, v2, col], i) => {
          const y0 = 70 + i * 74;
          return (
            <g key={i}>
              <text x="40" y={y0 - 8} fontSize="12.5" className="mono" fill={col as string}>
                {label as string}
              </text>
              <text x="40" y={y0 + 22} fontSize="10.5" className="mono" fill="var(--muted-foreground)">
                on numbers
              </text>
              <rect x="130" y={y0} width={(v1 as number) * 480} height="26" rx="5" fill={col as string} opacity="0.85" />
              <text x={134 + (v1 as number) * 480} y={y0 + 18} fontSize="11" className="mono" fill={col as string}>
                {((v1 as number) * 100).toFixed(1)}%
              </text>
              <text x="40" y={y0 + 52} fontSize="10.5" className="mono" fill="var(--muted-foreground)">
                on answer
              </text>
              <rect x="130" y={y0 + 30} width={(v2 as number) * 480} height="26" rx="5" fill={col as string} opacity="0.4" />
              <text x={134 + (v2 as number) * 480} y={y0 + 48} fontSize="11" className="mono" fill={col as string}>
                {((v2 as number) * 100).toFixed(1)}%
              </text>
            </g>
          );
        })}
      </S>
    </Frame>
  );
}

/* ---------- Fig 6: Go budget curve (review data) ---------- */
function FigGoCurve() {
  const pts = [
    { x: 60, v: 54.5 },
    { x: 300, v: 82.5 },
  ];
  return (
    <Frame badge="review" caption="Exp 6 Go win rates from the released logs (ranges mid-plotted): reported points only, never interpolated.">
      <S vb="0 0 720 240" label="Bar chart of Go win rate against small PPO and equal-size PPO at zero and fifty passes">
        <text x="40" y="26" fontSize="13" className="mono" fill="var(--muted-foreground)">
          win rate vs two small PPO nets · vs equal-size PPO (20M games)
        </text>
        {[
          ["vs small PPO", 0.545, 0.825, "var(--wsp-green)"],
          ["vs equal-size PPO", 0.345, 0.745, "var(--wsp-blue)"],
        ].map(([label, a, b, col], i) => {
          const y0 = 60 + i * 84;
          return (
            <g key={i}>
              <text x="40" y={y0 - 6} fontSize="12" className="mono" fill={col as string}>
                {label as string}
              </text>
              <rect x="60" y={y0} width={((a as number) * 6) * 8} height="30" rx="5" fill={col as string} opacity="0.35" />
              <rect x="300" y={y0} width={(b as number) * 8 * 6 * 1.16} height="30" rx="5" fill={col as string} opacity="0.85" />
              <text x="66" y={y0 + 20} fontSize="11" className="mono" fill="var(--muted-foreground)">
                0 passes: 54–55%
              </text>
              <text x="306" y={y0 + 20} fontSize="11" className="mono" fill="var(--foreground)">
                50 passes: 81–84%
              </text>
            </g>
          );
        })}
        <text x="40" y="212" fontSize="10.5" className="mono" fill="var(--wsp-amber)">
          n = 1 run per point · ranges as reported by the review (🟩)
        </text>
      </S>
    </Frame>
  );
}

/* ---------- Fig 7: edit anatomy of Exp 8 ---------- */
function FigEditAnatomy() {
  const layerX = (i: number) => 32 + i * 29;
  return (
    <Frame badge="paper" caption="Anatomy of the Exp-8 edit: two MLP blocks, 64 output columns each - 131,072 weights in total (as reported).">
      <S vb="0 0 760 320" label="A 24-layer transformer strip with layers 15 and 19 marked as edited, and detailed callouts for both MLP blocks">
        {/* Title / Description */}
        <text x="32" y="32" fontSize="12" className="mono" fill="var(--muted-foreground)">
          24 layers of Qwen3.5-0.8B · MLP output projections of layers 15 &amp; 19 edited (amber)
        </text>

        {/* 24 Layer Strip */}
        {Array.from({ length: 24 }, (_, i) => {
          const edited = i === 15 || i === 19;
          const x = layerX(i);
          return (
            <g key={i}>
              <rect
                x={x}
                y={46}
                width={22}
                height={60}
                rx={4}
                fill={edited ? "var(--wsp-amber)" : "var(--muted)"}
                opacity={edited ? 0.95 : 0.3}
                stroke={edited ? "var(--wsp-amber)" : "var(--border)"}
                strokeWidth={edited ? 1.6 : 1}
              />
              {(i === 0 || i === 5 || i === 10 || i === 15 || i === 19 || i === 23) && (
                <text
                  x={x + 11}
                  y={118}
                  textAnchor="middle"
                  fontSize="10"
                  className="mono"
                  fill={edited ? "var(--wsp-amber)" : "var(--muted-foreground)"}
                  fontWeight={edited ? "600" : "normal"}
                >
                  {edited ? `L${i}*` : `L${i}`}
                </text>
              )}
            </g>
          );
        })}

        {/* Dashed Highlight Box around Layer 15 */}
        <rect
          x={layerX(15) - 3}
          y={42}
          width={28}
          height={68}
          rx={6}
          fill="none"
          stroke="var(--wsp-amber)"
          strokeWidth="1.6"
          strokeDasharray="4 3"
        />

        {/* Dashed Highlight Box around Layer 19 */}
        <rect
          x={layerX(19) - 3}
          y={42}
          width={28}
          height={68}
          rx={6}
          fill="none"
          stroke="var(--wsp-amber)"
          strokeWidth="1.6"
          strokeDasharray="4 3"
        />

        {/* Connector projection lines: Layer 15 to Block 1, Layer 19 to Block 2 */}
        <line
          x1={layerX(15) + 11}
          y1={110}
          x2={205}
          y2={154}
          stroke="var(--wsp-amber)"
          strokeWidth="1.4"
          strokeDasharray="4 3"
          opacity="0.8"
        />
        <line
          x1={layerX(19) + 11}
          y1={110}
          x2={545}
          y2={154}
          stroke="var(--wsp-amber)"
          strokeWidth="1.4"
          strokeDasharray="4 3"
          opacity="0.8"
        />

        {/* Outer dashed container for both edited MLP blocks */}
        <rect
          x={32}
          y={144}
          width={696}
          height={136}
          rx={10}
          fill="var(--card)"
          fillOpacity="0.4"
          stroke="var(--border)"
          strokeDasharray="5 5"
          strokeWidth="1.2"
        />

        {/* Container Header */}
        <text x={48} y={165} fontSize="11" fontWeight="600" className="mono" fill="var(--wsp-amber)">
          Anatomy of Edited Output Projections (W&apos; = (I − uuᵀ)W on 64 columns each)
        </text>

        {/* Block 1: Layer 15 MLP */}
        <g transform="translate(48, 176)">
          <rect
            x={0}
            y={0}
            width={316}
            height={92}
            rx={8}
            fill="var(--background)"
            stroke="var(--wsp-amber)"
            strokeWidth="1.2"
          />
          <text x={14} y={20} fontSize="11" fontWeight="600" className="mono" fill="var(--foreground)">
            Layer 15 MLP Output Projection
          </text>
          {Array.from({ length: 11 }, (_, k) => (
            <rect
              key={k}
              x={14 + k * 16}
              y={28}
              width={10}
              height={38}
              rx={2}
              fill="var(--wsp-amber)"
              opacity={0.9 - k * 0.05}
            />
          ))}
          <text x={198} y={52} fontSize="12" className="mono" fill="var(--muted-foreground)">…</text>
          <rect x={216} y={28} width={10} height={38} rx={2} fill="var(--wsp-amber)" opacity="0.35" />
          <text x={14} y={80} fontSize="10" className="mono" fill="var(--muted-foreground)">
            64 output columns × 1,024 width = 65,536 weights
          </text>
        </g>

        {/* Block 2: Layer 19 MLP */}
        <g transform="translate(388, 176)">
          <rect
            x={0}
            y={0}
            width={316}
            height={92}
            rx={8}
            fill="var(--background)"
            stroke="var(--wsp-amber)"
            strokeWidth="1.2"
          />
          <text x={14} y={20} fontSize="11" fontWeight="600" className="mono" fill="var(--foreground)">
            Layer 19 MLP Output Projection
          </text>
          {Array.from({ length: 11 }, (_, k) => (
            <rect
              key={k}
              x={14 + k * 16}
              y={28}
              width={10}
              height={38}
              rx={2}
              fill="var(--wsp-amber)"
              opacity={0.9 - k * 0.05}
            />
          ))}
          <text x={198} y={52} fontSize="12" className="mono" fill="var(--muted-foreground)">…</text>
          <rect x={216} y={28} width={10} height={38} rx={2} fill="var(--wsp-amber)" opacity="0.35" />
          <text x={14} y={80} fontSize="10" className="mono" fill="var(--muted-foreground)">
            64 output columns × 1,024 width = 65,536 weights
          </text>
        </g>

        {/* Bottom Summary */}
        <text x={32} y={302} fontSize="11.5" className="mono" fill="var(--muted-foreground)">
          2 layers × 64 output columns × 1,024 width = 131,072 weights (0.016% of Qwen3.5-0.8B)
        </text>
      </S>
    </Frame>
  );
}

export const FIGURES: Record<string, ReactNode> = {
  "fig-anatomy": <FigAnatomy />,
  "fig-four-ways": <FigFourWays />,
  "fig-landscape": <FigLandscape />,
  "fig-mechanism": <FigMechanism />,
  "fig-head102": <FigHead102 />,
  "fig-go-curve": <FigGoCurve />,
  "fig-edit-anatomy": <FigEditAnatomy />,
};
