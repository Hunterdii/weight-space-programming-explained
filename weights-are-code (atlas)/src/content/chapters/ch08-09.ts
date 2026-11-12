import type { Chapter } from "../types";

export const ch08: Chapter = {
  slug: "8-measured-vs-anecdote",
  number: 8,
  part: 3,
  title: "Measured vs Anecdote - Sorting the Evidence",
  kicker: "A scoreboard, a review, and the difference between sparks and fireworks.",
  minutes: 9,
  intro:
    "A third-party review (Andreas Maier, 5 Nov 2026) sorted every claim in the paper by evidence strength. This chapter walks that scoreboard, names the missing baselines, and explains why “sparks” is exactly the right word.",
  shared: [
    { kind: "table", id: "scoreboard" },
    { kind: "module", id: "m14-scoreboard" },
    { kind: "module", id: "m6-budget-dial" },
    { kind: "quote", text: "the strongest evidence is the Qwen math edit - measured, mechanism-checked, controlled", source: "Andreas Maier, “What is measured and what is anecdote?”, 5 Nov 2026 (🟩, paraphrased summary)", badge: "review" },
  ],
  levels: {
    1: [
      { kind: "p", text: "When someone tells you “a machine did something amazing!”, the kind question to ask is: **which kind of amazing?** There is “amazing and *measured* carefully” (someone timed it, counted it, checked it twice, tried it on a machine where it shouldn’t work). And there is “amazing, *trust me*” (it worked once, in front of the person who built it)." },
      { kind: "p", text: "The maths fix is the first kind: measured on three big tests, double-checked with a clever trick (counting how often the model ran out of time), and tried on a machine where it rightly did *nothing*. The game-guessing experiments are closer to the second kind: wonderful, but only a few tries, on machines built to be easy to read." },
      { kind: "callout", badge: "review", title: "The scoreboard in one breath", text: "Strong: the math fix, the ramp fix, writing working game players. Weaker: the small reading games, the language guesses, the flattery-detection. Missing everywhere: repeats, rival methods, and tasks the authors didn’t pick themselves." },
    ],
    2: [
      { kind: "p", text: "**The sorting, from the review (🟩).** Strongest first: Exp 8 (the Qwen math fix - measured on MATH-500/GSM8K/IFEval, mechanism checked via the token-limit share, with the Gemma negative control). Then Exp 4 (the ramp fix: 0/256 → 1,024/1,024, one shot). Then Exps 5–6 (writing working policies from designed programs - real artifacts beating real baselines, but each a single run)." },
      { kind: "p", text: "**Weaker, per the same review:** Exps 1–2 (four and three correct answers on tiny, readable toys), Exp 3’s language ID (confidence 0.48–0.62 among three options - barely better than a die with three sides; the copying-head match is the solid part), and Exp 7 (three binary picks, a 1-in-8 chance of pure luck, and the task had to be relaxed before it worked)." },
      { kind: "p", text: "**Missing everywhere:** other LLMs (does this work beyond one frontier model?), human or automated baselines, repeated runs with different seeds, cheap alternatives (decoding tweaks, standard direction ablation, the same heuristic as ordinary code), and - most structurally important - tasks *not designed by the authors*." },
      { kind: "callout", badge: "paper", title: "Why “sparks” is honest", text: "The original post title says “sparks” - deliberately modest. Sparks are real (you can see them), small (you can’t run a factory on them yet), and the beginning of something *if* tended. The evidence matches the word; the word should survive every retelling." },
    ],
    3: [
      { kind: "p", text: "**The n=1 problem.** Every headline number in the paper - 517.4 on Breakout, 48.1% on MATH-500, 1,024/1,024 on the ramp - is a *single run*. RL scores on these games swing by seed; benchmark percentages swing by decoding parameters; the honest remedy is ≥5 seeds with reported spread. Until then the right mental picture is dots, not curves." },
      { kind: "p", text: "**Chance arithmetic for the small reads.** Exp 7: three binary pairs, blind-guess success 2⁻³ = 12.5%. Exp 3 language ID: three options, 33% for blind guessing vs the reported 48–62% confidence - a signal, but a thin one. Exp 1: four games, 25% blind vs 4/4 observed - impressive but four trials. None of this is damning; all of it demands the same phrase: *promising, not established*." },
      { kind: "p", text: "**The Go figures, restored to context (🟩 from the logs):** vs two small PPO nets 54–55% at 0 passes and 81–84% at 50; vs the equal-size PPO (20M games) 26–43% at 0 and 70–79% at 50. So the zero-experience policy *loses* to the strong baseline and the 50-pass policy beats it - the paper reports this honestly, and it is the single best budget-curve data point in the post." },
      { kind: "p", text: "**Independent replication signals (🟩, anecdotal):** Simon Willison reported (3 Nov 2026) that a Qwen 2.5 7B running on a laptop reproduced a similar weight-reading example - suggesting the skill is not exclusive to one frontier model. And Sean Goedecke’s essay presents a deflationary analysis questioning whether general weight comprehension extends beyond specific heuristics. Both are worth reading *before* quoting any result here as settled." },
    ],
    4: [
      { kind: "p", text: "Baseline gaps, precisely: (1) **decoding control** - would a shorter thinking budget or a stop-token nudge fix Exp 8’s overthinking without any weight edit? (2) **standard direction ablation** - the same u-subtraction with no LLM reasoning; (3) **heuristic-code baseline** - the same policy written as ordinary Python (for WRITE tasks, the honest rival is a human with NumPy); (4) **human-interpreter baseline** - given the same 10×10 grids, does an interpretability researcher beat the model at Exp 1? Every one of these is a few GPU-hours or a few hours of grad-student time. Their absence is the field’s to-do list." },
      { kind: "p", text: "Non-monotonic budgets as variance evidence: MATH-500 12.3 → 14.1 → 48.1 at 10/25/50 passes and the IFEval dip 49.0 → 39.9 at 25 passes. If run-to-run variance can flip a 9-point metric swing at n=1, then *any single point* in the paper carries a hidden error bar of at least that size. The budget dial (M6) exists to make that visceral." },
      { kind: "p", text: "Also under-scrutinised: presentation choices. The 10×10 grid of Exp 1 is itself an interpretability transform chosen by the authors; middle-blocks-only in Exp 3 cuts some shortcuts but leaves others (layer-index conventions, head-order). A benchmark needs *fixed, published* presentation protocols so readers can’t be handed a pre-chewed task - pre-registration of the weight-reading format is as important as pre-registering the prompt." },
      { kind: "callout", badge: "review", title: "The review’s one-line standard, generalised", text: "For each claim ask: measured, or anecdote? If measured - mechanism checked? If checked - baseline tried? If tried - seeds repeated? Four yeses make “established”. The paper’s best results reach three." },
    ],
    5: [
      { kind: "p", text: "The evidence tiers, as I would grade them for a review committee: **Tier A (compelling)**: Exp 8 - but only after the direction-ablation baseline lands, at which point it becomes the field’s reference result either way (if the baseline matches, WSP is a brilliant diagnostic interface; if not, WSP adds value beyond textbook surgery - both are publishable, important outcomes)." },
      { kind: "p", text: "**Tier B (real but unproven)**: Exps 4, 5, 6 - measured, large effects, n=1, with the recall-vs-reason confound unresolved for the games. **Tier C (suggestive)**: Exps 1, 2, 3-language, 7 - correct small-n reads with known confounds. **Tier D (anecdote)**: the laptop replication - encouraging, weightless alone. This grading differs slightly from the review’s only in that I’d hold Exp 8 inside Tier A pending its baseline rather than in it already." },
      { kind: "p", text: "What I would tell a journalist: the story is real, the superlatives aren’t. “An LLM edited 0.016% of a model’s weights and tripled its maths score, with a control that showed it wasn’t magic” is extraordinary enough - no “AI learns to reprogram brains” needed. And the deeper story - *weight-space reasoning as a new interface for understanding* - is the one that survives even if every n=1 number shifts." },
      { kind: "callout", badge: "speculation", title: "My prediction, on record", text: "Within 6 months, someone runs the standard direction-ablation baseline on Exp 8. Two things can happen, and both make the paper *more* important - which is the mark of work worth taking seriously. (🟥 untested, deliberately falsifiable.)" },
    ],
  },
};

export const ch09: Chapter = {
  slug: "9-small-vs-big",
  number: 9,
  part: 3,
  title: "Small Models, Big Models - Who Benefits?",
  kicker: "Demonstrated, suggested, speculative - by model size.",
  minutes: 8,
  intro:
    "Where could weight-space programming genuinely help? The honest split is by scale: small networks are writable (demonstrated), big models are so far only editable at diagnosed spots (demonstrated once), and everything beyond that is suggestion.",
  shared: [
    { kind: "table", id: "small-vs-big" },
  ],
  levels: {
    1: [
      { kind: "p", text: "Think of two machines: a **toy robot** with a few thousand knobs, and a **city-sized machine** with billions. A brilliant mechanic with a good eye can build the toy from scratch and fix it when it jams - the whole machine fits in one head. The city-machine is different: nobody can hold it all in mind. But a good mechanic can still fix *one known broken pipe* if the blueprints show where it is." },
      { kind: "p", text: "That is exactly what the experiments showed: whole machines written for small games; one targeted pipe-repair in the giant maths machine; and the honest discovery that some faults in the giant (like the flattery problem) are spread too thin to see from the blueprints alone." },
      { kind: "callout", badge: "paper", title: "The size ladder of the experiments", text: "17k → 23k → 7M → 171k → 1.48M written → 0.8B edited at one spot. The bigger the machine, the more surgical and diagnosis-dependent the intervention gets." },
    ],
    2: [
      { kind: "p", text: "**Small models (thousands to a few million weights):** the paper *demonstrated* writing them from scratch (MinAtar, Go) and fixing a broken small policy (the ramp car). These are cases where the whole network fits in the reasoner’s attention window and the task rules are stateable. Practical cousins: simple game bots, home robots’ controllers, signal filters." },
      { kind: "p", text: "**Big models (hundreds of millions to billions):** demonstrated once - the Qwen math fix, which was less “reading the model” and more “a diagnosed surgery on two MLP blocks”, guided by reasoning plus feedback passes. Everything grander (auditing, unlearning, capability steering at scale) is currently *suggested*, not shown." },
      { kind: "p", text: "**The asymmetry that matters:** to *write* a big model you’d have to hold billions of numbers in working context - nobody claims that yet. To *edit* one, you only need to find the small part where a problem lives - the demonstrated pattern. Expect “WSP for small nets” products long before “WSP for foundation models”, whatever the headlines imply." },
      { kind: "callout", badge: "review", title: "Tags from the review, kept honest", text: "Demonstrated: small-net writing/fixing; targeted big-model fix (one model). Suggested: auditing from weights (Exp 3’s heads hint at it). Speculative: zero-data unlearning, one-shot initialisation at scale - see Chapter 10." },
    ],
    3: [
      { kind: "p", text: "**Why small is writable.** A 600→32→32→6 policy is 20,486 numbers: every “concept” the policy needs (paddle row, ball column, dead-zone) is a handful of weights, and the rules composing them fit in a page of pseudo-code. Writing θ from the spec is then a bounded transcription task - hard for humans at 20k numbers, tractable for a system fluent in matrix bookkeeping. The Go net at 1.48M pushes against this limit and still worked (with 50 passes of polish) - the current frontier of *whole-machine writing*." },
      { kind: "p", text: "**Why big is only editable.** At 0.8B parameters, the reasoner consumed slices: aggregate statistics, selected MLP blocks, per-column projections. The successful pattern is diagnosis-then-surgery: use evaluation traces (Exp 8 used its own feedback passes) to localise a misbehaviour, then apply a closed-form intervention within that locale. Note this makes the *editing* almost classical (direction ablation) - the novel part is the diagnosis pipeline that found layers 15 and 19 without activation dumps from the live model." },
      { kind: "p", text: "**The blind spot the experiments exposed:** Exp 7 - *sycophancy, weights alone, 270M-class* - failed. Distributed, whole-model behaviours don’t leave a readable footprint in a few blocks. So the frontier for big-model reading is exactly the class of behaviours that are *localised* (loops, single-direction refusal circuits, format fixations), and that boundary is itself a finding worth keeping." },
      { kind: "callout", badge: "schematic", title: "A useful rule of thumb", text: "Writability ∝ 1/parameter count; editability ∝ 1/behavioural distributedness. Small + localised = easy; big + localised = demonstrated; small + distributed = untested; big + distributed = failed so far. (Teaching heuristic, not a law.)" },
    ],
    4: [
      { kind: "p", text: "Context-window maths, because marketing will wave it away: at ~0.5 tokens per float (say 2–3 chars per number in a serialised grid), 1.48M Go parameters ≈ 4–5M tokens even before overhead - far beyond any context window. So even the Go write could not have been a raw dump; it was structured (per-layer reasoning, staged writes, sandbox verification). The logs repo shows the actual format; anyone building WSP tooling should study it as the first *weight-interchange protocol* de facto standard." },
      { kind: "p", text: "Cost model sketch for real deployments: small-net writes cost ~reasoning tokens (hours of API time for 1.5M parameters, per the Go experiment’s reported effort) vs PPO’s 20M self-play games. Big-model edits cost diagnosis passes + one closed-form edit + evaluation - cheap *if* the diagnosis protocol exists, which is the actual moat. A productised “weight clinic” is: telemetry → hypothesis → targeted read → intervention → evaluation, with D (drift) monitoring throughout. None of this exists off-the-shelf yet; all of it is buildable from the paper’s artifacts." },
      { kind: "p", text: "Failure modes at each scale: small writes can be subtly wrong off-distribution (a compiled Breakout policy that never saw sticky-actions); big edits can fix the symptom and break a neighbour (IFEval dipped at 25 passes); mid-size writes are the untested valley (1M–100M parameters - too big to hold, too small to have tooling). If you are choosing a research lane, the valley is both neglected and the natural next step after the paper." },
      { kind: "callout", badge: "review", title: "The Willison angle on accessibility", text: "A laptop-class open model reproducing a weight-reading example (🟩 anecdotal) hints the *small-model* applications may democratise fastest - reading and writing 20k-weight controllers is plausibly within reach of open weights soon, long before frontier-scale auditing is." },
    ],
    5: [
      { kind: "p", text: "The genuinely novel scientific claim this chapter isolates: **the reasoner is the scalable interface**. Tooling (slicing, statistics, closed-form ops) is classical; what is new is a system that can *decide* which slice matters and *interpret* it. That reframes WSP not as a training method or an editing method, but as a *diagnosis discipline* - and diagnoses are exactly what interpretability has lacked at production pace." },
      { kind: "p", text: "Open questions to hand a grad student: (1) define *writability* formally - the smallest description length of θ sufficient for a reasoner to reproduce f within ε; measure it across the paper’s five written nets. (2) Test the heuristic that behaviour-locality (measurable by ablation sensitivity) predicts edit success at scale, using Exp 7 (distributed → failed) vs Exp 8 (local → fixed) as the two ends. (3) Map the parameter-count frontier: at what P does one-shot writing fall below the trained baseline? The paper gives three points on that curve - the community needs the rest." },
      { kind: "p", text: "Where I would place commercial bets, cautiously (🟥): small-model authoring for edge/robotics niches where data collection is the bottleneck; diagnosis-assisted editing as an internal tool for model teams; and benchmark tooling itself - the picks-and-shovels of whatever this field becomes. The *last* thing to bet on is overnight foundation-model surgery." },
    ],
  },
};
