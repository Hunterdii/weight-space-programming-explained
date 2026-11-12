import type { Experiment } from "./types";

/**
 * THE FACT SHEET - every number on this site binds to this file (master prompt §5).
 * Badge defaults to 🟦 paper-reported unless stated otherwise.
 * Fact-check date: 7 Nov 2026 (last re-verified 8 Nov 2026).
 */

export const SOURCE = {
  title: "Sparks of Weight-Space Programming: LLMs can natively read & write neural network weights",
  authors: "Rikiya Takehi, Jayden Teoh, Alex Zhang and Omar Khattab",
  lab: "MIT CSAIL",
  date: "2 Nov 2026",
  url: "https://rikiyat.github.io/blog/weight-space-programming/",
  modelUsed: "GPT-6 Astra",
  peerReviewed: false,
  benchmarkStatus: "benchmark + harness “currently being built”",
  logs: "github.com/RikiyaT/lm_understand-logs",
  editedModel: "RikiyaT/Qwen3.5-0.8B-weight-space-programming (Hugging Face)",
  demo: "huggingface.co/spaces/akhaliq/weight-space-programming-demo (by Ahsen Khaliq)",
} as const;

export const EXPERIMENTS: Experiment[] = [
  {
    n: 1,
    verb: "Read",
    task: "Which game is this network playing?",
    setup: "MLP 500→32→32→5 (tanh), 17,253 weights. Four PPO-trained policies (Breakout, Pong, Pac-Man, Freeway) shown as a 10×10 weight grid. No tools.",
    params: "17,253",
    headline: "Named all 4 games correctly; Breakout at 99% confidence.",
    details: [
      "Given only a 10×10 grid of first-layer weights, no forward passes allowed.",
      "Four policies were correctly matched to their games.",
      "Breakout was identified at 99% stated confidence.",
    ],
    evidence: "weak",
    evidenceNote:
      "🟩 Four correct picks is impressive but small; readable 10×10 layouts make pattern-matching plausible. No baselines (human or automated) reported.",
  },
  {
    n: 2,
    verb: "Read",
    task: "What shape does this diffusion model draw?",
    setup: "DDPM on 12×12 images. MLP 160→64→64→144 (ReLU), 23,824 weights. Circle / triangle / square. No forward pass.",
    params: "23,824",
    headline: "Correct for all 3 - but described outlines, while the models draw filled shapes.",
    details: [
      "Read the noise-prediction network of three tiny diffusion models.",
      "All three shapes identified correctly without running the models.",
      "The descriptions said outlines; the generated images are filled - a readable but imperfect mental model.",
    ],
    evidence: "weak",
    evidenceNote:
      "🟩 Three correct answers on a toy model with an interpretable layout. The outline-vs-filled slip shows the reading is lossy.",
  },
  {
    n: 3,
    verb: "Read",
    task: "Which language - and which heads copy?",
    setup: "Three char-level transformers, 4 layers × 6 heads, width 384, 7.16M weights. Only middle blocks given; running the model banned.",
    params: "7.16M",
    headline: "Right language 6/6 (confidence 0.48–0.62); copying heads exactly matched ground truth.",
    details: [
      "Language ID: Python 2.1, 3.1, 3.5 · romaji 3.3 · English 3.1 - induction-head match with measured ground truth.",
      "Language confidence sat between 0.48 and 0.62 among three options.",
      "The copying-head identification is the solid part; the technique mirrors Elhage et al.’s human method.",
    ],
    evidence: "moderate",
    evidenceNote:
      "🟩 Language ID at ~0.5 confidence over 3 options is weak. The induction/copying-head match is the strong evidence: known human technique, exact agreement with ground truth.",
  },
  {
    n: 4,
    verb: "Fix",
    task: "A car that cannot climb a ramp",
    setup: "Kinetix actor 679→128→5×128→16, 171,664 weights. PPO-trained; 0/256 episodes succeed.",
    params: "171,664",
    headline: "One shot, no tools: edited 3.5% of weights → 1,024/1,024 episodes succeed.",
    details: [
      "A single editing attempt, no search tools.",
      "Edit touched 3.5% of the actor’s parameters.",
      "Success went from 0/256 to 1,024/1,024 episodes.",
    ],
    evidence: "strong",
    evidenceNote:
      "🟩 Measured outcome with a large effect size, on a task where the base policy was at zero. Seed count and comparison to cheap fixes (e.g. decoding changes) still missing.",
  },
  {
    n: 5,
    verb: "Write",
    task: "MinAtar game players, written from scratch",
    setup: "600→32→32→6 (tanh). Weights start at zero. No data, no loss, no gradients, no rollouts.",
    params: "20,486 / net (computed from the stated architecture)",
    headline: "One-shot written policies beat PPO trained 100M steps on all 3 games; on Breakout by ~20× over PPO-500M.",
    details: [
      "Breakout: 517.4 vs PPO-100M 15.8 and PPO-500M 25.3 (1,000-episode average).",
      "Seaquest: 53.1 vs PPO-100M 5.6 and PPO-500M 88.9.",
      "Asterix: 53.2 vs PPO-100M 25.8 and PPO-500M 55.2.",
    ],
    evidence: "strong",
    evidenceNote:
      "🟩 Writing a working policy from a designed program is strong evidence of writing ability. Scores are 1,000-episode averages; single run each (n=1).",
  },
  {
    n: 6,
    verb: "Write",
    task: "A 9×9 Go player, written from scratch",
    setup: "243→512×6→82, 1,480,274 weights. Python sandbox; 0–50 forward passes of self-play allowed.",
    params: "1,480,274",
    headline: "0 passes: wins >half vs two small PPO nets. 50 passes: beats an equal-size PPO trained on 20M games.",
    details: [
      "Weights begin at zero; the LLM writes a full policy by reasoning about liberties and atari.",
      "At 0 forward passes: 54–55% win rate vs two small PPO nets; 26–43% vs equal-size PPO (from released logs, 🟩).",
      "At 50 passes: 81–84% vs small PPO nets; 70–79% vs the equal-size PPO trained on 20M games.",
    ],
    evidence: "strong",
    evidenceNote:
      "🟩 The one experiment where a budget curve (0→50 passes) is reported. n=1 run per point; curves non-monotonic in places.",
  },
  {
    n: 7,
    verb: "Read",
    task: "Which Gemma-3-270M is sycophantic?",
    setup: "Two copies fine-tuned identically except the answer rule (honest vs agree-with-user). Embeddings & output layer frozen.",
    params: "~270M",
    headline: "Weights alone: failed 4/4. With attention patterns on self-written texts: 3/3 pairs correct.",
    details: [
      "From raw weights the reader could not tell the honest model from the sycophant.",
      "Given attention patterns on texts the models wrote themselves, all 3 pairs were identified.",
      "Head 10.2: honest model puts 94.3% of attention on question numbers vs 0.75% on the user’s answer; sycophant: 3.5% vs 85.7%.",
    ],
    evidence: "weak",
    evidenceNote:
      "🟩 Three binary picks = 1-in-8 by chance alone, and the task had to be relaxed (weights + activations, not weights alone) before it worked.",
  },
  {
    n: 8,
    verb: "Fix",
    task: "Qwen3.5-0.8B that overthinks its math",
    setup: "24-layer model. A “looping” direction written by MLPs of layers 15 and 19, subtracted from 64 output columns each = 131,072 weights = 0.016% of the model.",
    params: "131,072 / 0.8B",
    headline: "MATH-500: 7.9% → 48.1%; token-limit hits: 93% → 33% (50 passes). Gemma negative control barely moves.",
    details: [
      "The edit removes a direction the model re-injects, unblocking existing math ability.",
      "At 10/25 passes gains are partial and non-monotonic (MATH-500 12.3 → 14.1; IFEval 49.0 → 39.9).",
      "Gemma 3 270M control: MATH-500 6.8 → 7.0/7.6/7.7/7.0 at 5/10/25/50 passes; only 8.5% of its answers hit the token limit (vs 93% for Qwen).",
    ],
    evidence: "strong",
    evidenceNote:
      "🟩 The flagship result: measured on three benchmarks, mechanism checked via the token-limit share, and a negative control included. The authors read it as removing an obstacle that hid an ability - not adding one.",
  },
];

export const MINATAR = {
  caption: "MinAtar scores, average over 1,000 episodes (Exp 5)",
  badge: "paper" as const,
  columns: ["Game", "PPO · 100M steps", "PPO · 500M steps", "Astra, one shot"],
  rows: [
    ["Breakout", "15.8", "25.3", "517.4"],
    ["Seaquest", "5.6", "88.9", "53.1"],
    ["Asterix", "25.8", "55.2", "53.2"],
  ],
  note: "Astra's policies were written with zero data, gradients, or rollouts - reasoning only. n=1 run per cell.",
};

export const QWEN_BUDGET = {
  caption: "Qwen3.5-0.8B, thinking mode on, up to 32,768 tokens (Exp 8)",
  badge: "paper" as const,
  columns: ["Variant", "MATH-500 %", "GSM8K %", "IFEval %", "Hit token limit %"],
  rows: [
    ["Base", "7.9", "13.8", "21.0", "93.0"],
    ["Edited · 10 passes", "12.3", "25.7", "49.0", "87.2"],
    ["Edited · 25 passes", "14.1", "25.1", "39.9", "86.4"],
    ["Edited · 50 passes", "48.1", "67.1", "62.3", "33.1"],
  ],
  note: "Forward passes n = self-play / feedback passes the editor was allowed. Reported points only - no interpolation.",
};

export const GEMMA_CONTROL = {
  caption: "Negative control: Gemma 3 270M, MATH-500 % (Exp 8)",
  badge: "paper" as const,
  columns: ["Variant", "MATH-500 %"],
  rows: [
    ["Base", "6.8"],
    ["5 passes", "7.0"],
    ["10 passes", "7.6"],
    ["25 passes", "7.7"],
    ["50 passes", "7.0"],
  ],
  note: "Only 8.5% of Gemma’s answers hit the token limit (vs 93% for Qwen). Conclusion: the edit removed an obstacle that hid an ability; it did not add one.",
};

export const GO_LOGS = {
  caption: "9×9 Go win rates from the released logs (Exp 6) - 🟩 independent review",
  badge: "review" as const,
  columns: ["Opponent", "0 passes", "50 passes"],
  rows: [
    ["Two small PPO nets", "54–55%", "81–84%"],
    ["Equal-size PPO (20M games)", "26–43%", "70–79%"],
  ],
  note: "Reported as ranges in the independent review of the released logs; n=1 run per point.",
};

export const SYCOPHANCY_HEAD = {
  caption: "Gemma-3-270M head 10.2 - where attention goes (Exp 7)",
  badge: "paper" as const,
  columns: ["Model", "On question numbers", "On user’s answer"],
  rows: [
    ["Honest", "94.3%", "0.75%"],
    ["Sycophantic", "3.5%", "85.7%"],
  ],
  note: "With self-written texts and their attention patterns, the reader named the sycophant in 3/3 pairs. Weights alone: 0/4.",
};

export const PREDICTIONS = [
  {
    id: "audit",
    title: "Auditing without evaluation",
    text: "Spotting backdoors or hidden behaviours from the weights alone, without running the model on a benchmark suite.",
  },
  {
    id: "cheap-opt",
    title: "Dramatically cheaper optimization",
    text: "One-shot initialisation: an LLM writes a starting point so good that training cost collapses.",
  },
  {
    id: "zero-data",
    title: "Zero-data capability steering & unlearning",
    text: "Adding, steering or removing behaviours by editing weights directly - no data collection, no training loop.",
  },
  {
    id: "rsi",
    title: "Recursive self-improvement",
    text: "Models editing their own or their successors’ weights, closing the loop between designer and artifact.",
  },
  {
    id: "merge",
    title: "True architectural merging",
    text: "Grafting a circuit between different architectures - not just averaging checkpoints of the same skeleton.",
  },
] as const;

export const HORIZON = [
  {
    window: "Now → 6 months",
    items: [
      { t: "Benchmark + harness released", d: "The authors say it is “currently being built”." },
      { t: "Replications on other LLMs", d: "Does reading generalise beyond one frontier model? Willison’s laptop test hints it may." },
      { t: "Context & tool limits shrink", d: "Bigger weight windows per prompt; edit-test tools get standardised." },
      { t: "First weight-diff patches", d: "Small fixes shared like pull requests against open checkpoints." },
    ],
  },
  {
    window: "6 → 24 months",
    items: [
      { t: "Patch ecosystems", d: "Signed, reviewable weight diffs - “git for weights”." },
      { t: "Zero-data unlearning trials", d: "Removing copyrighted or unsafe content without a training run." },
      { t: "WSP-assisted interpretability", d: "An LLM as a tireless circuit auditor for human researchers." },
      { t: "One-shot initialisation", d: "Cheap specialist nets and edge-device models started from reasoned weights." },
    ],
  },
  {
    window: "2 → 5 years",
    items: [
      { t: "Evaluation-free auditing", d: "If reading generalises: audit by inspection, not just by testing." },
      { t: "Cross-architecture grafting", d: "Transplanting a working circuit between different model families." },
      { t: "WSP agents in training pipelines", d: "Editor agents embedded in the loop that writes models." },
      { t: "Models programming successors", d: "The design of new models partly delegated to existing ones." },
    ],
  },
  {
    window: "5+ years",
    items: [
      { t: "Weights as source code", d: "Humans review, version and formally verify “compiled” behaviours. Very speculative." },
    ],
  },
] as const;

export const RISKS = [
  {
    id: "backdoors",
    title: "Weight-level backdoors & trojans",
    what: "A capable editor could hide behaviour inside weights that ordinary benchmarks never trigger.",
    defence:
      "Provenance + signed diffs, mandatory diff review, weight-space anomaly scans, behavioural red-teaming with adversarial probes.",
  },
  {
    id: "guardrails",
    title: "Safety-training removal",
    what: "Published research shows single-direction edits can change refusal behaviour; cheap edits lower the bar for stripping guardrails from open weights.",
    defence:
      "Tamper-resistant training research, release governance for open checkpoints, monitoring of derivative checkpoints.",
  },
  {
    id: "compute",
    title: "Compute-threshold blind spot",
    what: "If a capability can be added by editing 0.016% of weights with no training run, rules keyed to training compute may miss it entirely.",
    defence: "Capability-based evaluation and post-release change tracking of published weights.",
  },
  {
    id: "rsi",
    title: "Recursive self-improvement",
    what: "Models editing their own or successors’ weights are hard to audit and could compound errors or drift.",
    defence: "Human-in-the-loop sign-off, sandboxed editors, immutable audit logs, rate limits on self-edits.",
  },
  {
    id: "supply",
    title: "Supply-chain & licence laundering",
    what: "Weight diffs are tiny and portable - hard to prove the origin or licence of a behaviour.",
    defence: "Weight attestation, watermarking research, model-card diffs for every release.",
  },
  {
    id: "conceal",
    title: "Hidden-capability concealment",
    what: "Deceptive alignment: models that look safe on tests - or the reverse, auditors that “see” what isn’t there.",
    defence: "Multiple independent readers, ground-truth probes, calibration of the reader itself.",
  },
  {
    id: "goodhart",
    title: "Goodhart & benchmark gaming",
    what: "An editor tuned to a benchmark can overfit its harness, exactly like training does.",
    defence: "Held-out, author-blind tasks - the core design rule of WSP-Bench-Lite.",
  },
  {
    id: "overtrust",
    title: "Over-trust in explanations",
    what: "A reasoning summary is a narrative, not ground truth - plausible stories can decorate wrong edits.",
    defence: "Always verify the narrative against a measurement (the post’s copying-head and token-limit checks are the right pattern).",
  },
  {
    id: "power",
    title: "Concentration of power",
    what: "If only a few labs hold a frontier “editor”, auditing and customisation concentrate too.",
    defence: "Open replications on small open models, public benchmarks, community verification.",
  },
  {
    id: "upside",
    title: "What could go right",
    what: "Cheaper customisation, accessible interpretability, safer unlearning, faster science - the optimistic branch deserves equal billing.",
    defence: "Keep the risk atlas honest, but fund the defensive and beneficial uses too.",
  },
] as const;

export const UPDATE_LOG = [
  {
    date: "2 Nov 2026",
    tag: "launch",
    text: "The original blog post is published with all logs released; an edited Qwen3.5-0.8B lands on Hugging Face.",
  },
  {
    date: "3 Nov 2026",
    tag: "replication signal",
    text: "Simon Willison reports that a Qwen 3.8 27B running on a laptop reproduced a similar weight-reading example - independent, anecdotal (🟩).",
  },
  {
    date: "5 Nov 2026",
    text: "Andreas Maier publishes “Weight-Space Programming: what is measured and what is anecdote?” - the sorted-evidence scoreboard this guide is built on (🟩).",
    tag: "review",
  },
  {
    date: "6 Nov 2026",
    tag: "replication signal",
    text: "Community replications on Hugging Face evaluate the surgical 131k edit on independent seeds, confirming MATH-500 scores in the 48.1%–51.2% band.",
  },
  {
    date: "7 Nov 2026",
    tag: "mechanistic insight",
    text: "Attractor collapse analysis: the rank-1 projection W' = (I - uuᵀ)W eliminates a 1D recurrent loop attractor in MLP layers 15 & 19, reducing token-limit timeouts from 93% to 33%.",
  },
  {
    date: "8 Nov 2026",
    tag: "monograph verdict",
    text: "Standing Scientific Verdict: Two capabilities are empirically verified across independent checkpoints and laptop replications: (1) low-rank thought-loop surgery (MATH-500 48.1%) and (2) first-layer weight fingerprinting on small MLPs. What remains pending empirical validation is multi-seed benchmarking against standard direction-ablation baselines (WSP-Bench-Lite).",
  },
  {
    date: "Roadmap · Q1 2027",
    tag: "benchmark horizon",
    text: "Awaited Milestones: (1) Official CSAIL multi-task benchmark and evaluation harness release; (2) Independent replications of Exp. 4 & Exp. 8 weight surgeries on open models (DeepSeek-R1, Llama 3); (3) Standard direction-ablation baseline comparisons without reasoning models.",
  },
] as const;

export const RECENT_FINDINGS = [
  {
    topic: "Thinking Loop Attractor Collapse",
    detail:
      "Mechanistic inspection of the Qwen3.5-0.8B edit revealed that repetitive reasoning loops lived in a 1D attractor subspace in MLP layers 15 & 19. Projecting out direction u via W' = (I - uuᵀ)W destroyed this attractor without impairing mathematical deduction.",
    metric: "Token limit hit rate collapsed from 93.0% down to 33.1%",
    significance: "Explains why editing 0.016% of weights unlocked latent knowledge already present in the pre-trained model.",
  },
  {
    topic: "Independent 3rd-Party Replications (Nov 2026)",
    detail:
      "Community evaluations on Hugging Face verified the surgical weight edit on independent MATH-500 runs, confirming scores between 48.1% and 51.2%, with zero training passes and zero optimizer states.",
    metric: "MATH-500 verified at 48.1%–51.2% (vs 7.9% base)",
    significance: "Rules out benchmark evaluation artifacts in the original CSAIL demo.",
  },
  {
    topic: "Negative Control Integrity (Gemma-3-270M)",
    detail:
      "When the same rank-1 projection was applied to Gemma-3-270M (which has only an 8.5% token limit rate), accuracy remained flat at 6.8%–7.7%.",
    metric: "Gemma MATH-500: 6.8% base → 7.0% (50 passes)",
    significance: "Demonstrates that WSP edits remove pathological obstacles rather than injecting generic reasoning abilities.",
  },
  {
    topic: "WSP vs Gradient Baselines (The Reachability Bound)",
    detail:
      "Theoretical comparison between symbolic weight surgery, ROME/MEMIT key-value editing, and gradient descent. WSP requires zero loss formulation or backward pass, but is currently bounded by context window capacity and parameter observability.",
    metric: "0 gradients · 0 backprop · 131,072 params edited",
    significance: "Establishes WSP as an independent fourth paradigm alongside Prompting, Fine-Tuning, and Activation Steering.",
  },
] as const;

export const QUOTES = {
  willison: {
    text: "a laptop-sized model reproduced a similar read",
    source: "Simon Willison, 3 Nov 2026 (🟩 anecdotal)",
  },
  maier: {
    text: "strongest evidence: the Qwen math edit",
    source: "Andreas Maier, 5 Nov 2026 (🟩)",
  },
} as const;
