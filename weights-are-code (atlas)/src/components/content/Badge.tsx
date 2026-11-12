import { BADGE_META, type Badge } from "@/content/types";

export function BadgeChip({ b, className = "" }: { b: Badge; className?: string }) {
  const m = BADGE_META[b];
  if (!m) return null;

  return (
    <span className={`badge-frame ${m.cls} ${className}`}>
      {/* Crisp SVG geometric dot indicator ensuring 100% sharp rendering on all OSes */}
      <span
        aria-hidden="true"
        className="inline-block size-2 rounded-[2px] shrink-0"
        style={{
          backgroundColor:
            b === "paper"
              ? "var(--wsp-blue)"
              : b === "review"
              ? "var(--wsp-green)"
              : b === "schematic"
              ? "var(--wsp-amber)"
              : "var(--wsp-red)",
          boxShadow: "0 0 5px currentColor",
        }}
      />
      <span>{m.label}</span>
    </span>
  );
}

export function BadgeLegend() {
  return (
    <ul className="space-y-2.5 text-xs">
      {(Object.keys(BADGE_META) as Badge[]).map((k) => (
        <li
          key={k}
          className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/70 p-2.5 transition-all duration-200 hover:bg-accent/40 hover:border-foreground/20"
        >
          <BadgeChip b={k} className="shrink-0" />
          <span className="text-xs text-muted-foreground leading-relaxed">
            {BADGE_META[k].desc}
          </span>
        </li>
      ))}
    </ul>
  );
}
