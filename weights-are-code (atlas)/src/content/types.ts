export type Badge = "paper" | "review" | "schematic" | "speculation";

export const BADGE_META: Record<
  Badge,
  { label: string; icon: string; cls: string; desc: string }
> = {
  paper: {
    label: "Paper-reported",
    icon: "🟦",
    cls: "bf-paper",
    desc: "A number or claim stated in the original post (2 Nov 2026).",
  },
  review: {
    label: "Independent review",
    icon: "🟩",
    cls: "bf-review",
    desc: "From a third-party analysis (e.g. Maier, 5 Nov 2026).",
  },
  schematic: {
    label: "Teaching schematic",
    icon: "🟨",
    cls: "bf-schematic",
    desc: "Made-up toy data created to explain an idea. Illustrative, not real data.",
  },
  speculation: {
    label: "Speculation",
    icon: "🟥",
    cls: "bf-speculation",
    desc: "Predictions about the future - untested, including the authors’ own.",
  },
};

export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "callout"; badge: Badge; title?: string; text: string }
  | { kind: "formula"; id: string }
  | { kind: "table"; id: string }
  | { kind: "figure"; id: string }
  | { kind: "module"; id: string }
  | { kind: "code"; source: string; lang?: string; caption?: string; badge?: Badge }
  | { kind: "quote"; text: string; source: string; badge: Badge };

export interface Chapter {
  slug: string;
  number: number;
  part: 1 | 2 | 3 | 4;
  title: string;
  kicker: string;
  minutes: number;
  /** Shown at every level - a 2–3 sentence orientation. */
  intro: string;
  /** Shown at every level: core figures, tables, modules. */
  shared: Block[];
  levels: { 1: Block[]; 2: Block[]; 3: Block[]; 4: Block[]; 5: Block[] };
}

export interface Experiment {
  n: number;
  verb: "Read" | "Fix" | "Write";
  task: string;
  setup: string;
  params: string;
  headline: string;
  details: string[];
  evidence: "strong" | "moderate" | "weak" | "negative-control";
  evidenceNote: string;
}

export interface Ref {
  id: string;
  authors: string;
  title: string;
  venue: string;
  year: number;
  url?: string;
  arxiv?: string;
  kind: "primary" | "review" | "background" | "coverage";
  note?: string;
  verify?: string;
}
