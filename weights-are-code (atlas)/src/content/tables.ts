import type { Badge } from "./types";
import { MINATAR, QWEN_BUDGET, GEMMA_CONTROL, GO_LOGS, SYCOPHANCY_HEAD } from "./facts";

export interface TableItem {
  caption: string;
  badge: Badge;
  columns: string[];
  rows: string[][];
  note?: string;
  /** column indexes (0-based) that are numeric and may be right-aligned/labelled */
  numeric?: number[];
  highlight?: { row: number; why: string }[];
}

const T: Record<string, TableItem> = {
  "exp8-budget": { ...QWEN_BUDGET, numeric: [1, 2, 3, 4], highlight: [{ row: 3, why: "50 passes - the reported jump" }] },
  "exp8-gemma": { ...GEMMA_CONTROL, numeric: [1] },
  "exp5-minatar": { ...MINATAR, numeric: [1, 2, 3], highlight: [{ row: 0, why: "Breakout: the headline gap" }] },
  "exp6-go": { ...GO_LOGS },
  "exp7-head102": { ...SYCOPHANCY_HEAD, numeric: [1, 2] },
  "who-writes-weights": {
    caption: "Who writes the weights? - methods compared",
    badge: "schematic",
    columns: ["Method", "Needs data?", "Needs gradients?", "Needs training compute?", "Human-readable diff?", "Writes or reads?"],
    rows: [
      ["Training (SGD/Adam/Muon)", "Yes - lots", "Yes", "Yes - the whole point", "No", "Writes (slowly)"],
      ["Fine-tuning", "Yes - task data", "Yes", "Yes", "No", "Writes"],
      ["LoRA", "Yes - task data", "Yes", "Less", "Somewhat - two thin matrices", "Writes"],
      ["Task arithmetic", "Two checkpoints", "No", "No (post-hoc)", "Yes - one vector", "Writes"],
      ["Model merging", "Several models", "No", "No (post-hoc)", "Roughly - an average", "Writes"],
      ["Model editing (ROME)", "One fact pair", "No - closed form", "Tiny", "Yes - one rank-one update", "Writes"],
      ["Activation steering", "A direction (some data)", "No", "Tiny", "Yes - one vector", "Steers at runtime"],
      ["Mechanistic interpretability", "The model itself", "No", "Human effort", "Yes - circuits", "Reads"],
      ["Tracr compile", "A formal program", "No", "Compile time", "Yes - by construction", "Writes"],
      ["Hypernetworks / fast weights", "Training data for the writer", "Yes", "Yes - train the writer", "No", "Writes (learned writer)"],
      ["Neural network diffusion", "Many trained nets", "Yes", "Heavy", "No", "Writes (generated weights)"],
      ["Weight-space programming", "No - a spec", "No", "One forward pass × n", "Yes - reasoned Δ", "Reads + writes"],
    ],
    note: "A teaching summary, not a taxonomy from the literature. “Needs data?” for WSP means: none required by the method itself.",
  },
  "read-experiments": {
    caption: "The three READ experiments at a glance",
    badge: "paper",
    columns: ["#", "Task", "Weights shown", "Reported result"],
    rows: [
      ["1", "Which game? (Breakout/Pong/Pac-Man/Freeway)", "17,253 (10×10 grid)", "4/4 named; Breakout at 99% confidence"],
      ["2", "What shape does the diffusion model draw?", "23,824", "3/3 correct - but described outlines, not filled shapes"],
      ["3", "Which language + which heads copy?", "7.16M (middle blocks only)", "6/6 language; copying heads exactly match ground truth"],
      ["7", "Which Gemma is sycophantic?", "~270M × 2 (frozen embeddings/output)", "Weights alone: 0/4. With attention patterns: 3/3"],
    ],
  },
  "fix-experiments": {
    caption: "The two FIX experiments (+ control) at a glance",
    badge: "paper",
    columns: ["#", "Task", "Edit size", "Before → after"],
    rows: [
      ["4", "Car can’t climb a ramp (Kinetix)", "3.5% of 171,664", "0/256 → 1,024/1,024 episodes"],
      ["8", "Qwen3.5-0.8B overthinks math", "131,072 = 0.016%", "MATH-500 7.9% → 48.1%; token-limit hits 93% → 33%"],
      ["-", "Gemma 3 270M (negative control)", "same method", "MATH-500 6.8% → 7.0% at 50 passes (no hidden ability to unblock)"],
    ],
  },
  "small-vs-big": {
    caption: "What WSP could genuinely help with, by model size",
    badge: "speculation",
    columns: ["Side", "Use", "Status", "Why"],
    rows: [
      ["Small models", "Write/initialise tiny specialist nets (game players, controllers)", "Demonstrated", "Exp 5–6 wrote working policies from scratch"],
      ["Small models", "Fix broken small policies (robots, edge agents)", "Demonstrated", "Exp 4: one-shot 0/256 → 1024/1024"],
      ["Big models", "Targeted fixes of known bad behaviours", "Demonstrated (one model)", "Exp 8 on Qwen3.5-0.8B; generalisation unproven"],
      ["Big models", "Audit / interpret without running the model", "Suggested", "Exp 3’s copying heads + Exp 7’s partial success hint at it"],
      ["Any model", "Zero-data unlearning, patch ecosystems", "Speculative", "Predictions §5.4 - none tested"],
    ],
    note: "Demonstrated / Suggested / Speculative tags per the independent review’s framing (🟩).",
  },
  "scoreboard": {
    caption: "Evidence vs anecdote - the sorted scoreboard",
    badge: "review",
    columns: ["Evidence strength", "What", "Why"],
    rows: [
      ["Strong", "Exp 8 (Qwen math fix)", "Measured on 3 benchmarks; mechanism checked via token-limit share; negative control included"],
      ["Strong", "Exp 4 (ramp fix)", "Large effect, measured success rate, one-shot"],
      ["Strong (with n=1 caveat)", "Exp 5 & 6 (writing from a designed program)", "Working policies from zero - but single runs"],
      ["Weaker", "Exp 1 & 2 (reads on toy nets)", "4 and 3 correct answers; readable layouts"],
      ["Weaker", "Exp 3 language ID", "~0.5 confidence over 3 options; copying-head match is the solid part"],
      ["Weaker", "Exp 7 sycophancy", "3 binary picks = 1-in-8 by chance; task had to be relaxed"],
      ["Missing everywhere", "Baselines & seeds", "Other LLMs, human/automated baselines, ≥5 seeds, cheaper alternatives, author-blind tasks"],
    ],
  },
  "wsp-bench": {
    caption: "WSP-Bench-Lite - proposed scoring template (one page)",
    badge: "speculation",
    columns: ["Track", "Task type", "Mandatory baselines", "Metrics"],
    rows: [
      ["READ", "Identify behaviour from weights", "Human interpretability researcher; the same heuristic written as ordinary code", "Accuracy, calibration, false-positive rate"],
      ["FIX", "Repair a seeded defect", "Decoding tweaks; standard direction ablation; random-direction edit control", "Success rate, edit sparsity s, functional drift D"],
      ["WRITE", "Produce a working policy from a spec", "Random init + short training; the best published checkpoint", "Score, forward-pass budget curve fidelity(n), cost"],
    ],
    note: "Het’s original proposal (clearly credited to Het Patel, not the authors). Tasks must not be authored by the evaluated team; ≥5 seeds; multiple LLMs; pre-registered prompts; public logs.",
  },
};

export const TABLE_BY_ID: Record<string, TableItem> = T;
