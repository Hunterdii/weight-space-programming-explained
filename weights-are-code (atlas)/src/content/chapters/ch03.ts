import type { Chapter } from "../types";

export const ch03: Chapter = {
  slug: "3-cousins",
  number: 3,
  part: 1,
  title: "Cousins of WSP - Who Else Touches the Weights?",
  kicker: "Fine-tuning, LoRA, merging, editing, steering, interpretability - and where the new method sits.",
  minutes: 9,
  intro:
    "Weight-space programming is not the first method to read or write weights. This chapter maps the whole family, so you can see exactly what is new - and what is borrowed.",
  shared: [
    { kind: "module", id: "m9-who-writes" },
    { kind: "table", id: "who-writes-weights" },
    { kind: "formula", id: "f-lora" },
    { kind: "formula", id: "f-taskarith" },
    { kind: "formula", id: "f-rome" },
  ],
  levels: {
    1: [
      { kind: "p", text: "Think of a family reunion of “things that change a machine”: **the re-trainer** cooks the whole machine from scratch (slow, expensive). **The patcher** sticks a little adapter card on it. **The adder/subtractor** slides whole abilities in or out like Lego bricks. **The fact-fixer** corrects one wrong sentence with a scalpel. **The nudge-r** pushes the machine’s elbow while it works, without touching its parts. **The detective** only *reads* - figuring out how the machine thinks. Weight-space programming is the new cousin who can do the detective’s job *and* then turn knobs directly." },
      { kind: "p", text: "Why bother learning the cousins? Because when a scientist says “we fixed a model by editing weights”, the first honest question is: *couldn’t one of the older cousins have done that?* The experiments in the next chapters make sense only if you know the alternatives." },
      { kind: "list", items: [
        "**Fine-tuning** - re-cook with new examples.",
        "**LoRA** - small trainable patch-card instead of editing everything.",
        "**Task arithmetic / merging** - add and subtract whole skills as vectors.",
        "**Model editing (ROME)** - surgical single-fact correction.",
        "**Activation steering** - push at runtime, weights untouched.",
        "**Mechanistic interpretability** - read-only detective work.",
      ] },
    ],
    2: [
      { kind: "p", text: "**Fine-tuning** trains an existing model a bit more on new data - gradients again, just shorter. **LoRA** (Low-Rank Adaptation) is fine-tuning’s frugal cousin: instead of updating every weight, it learns two small matrices whose product *is* the change - say 0.5% as many numbers - and adds it on top." },
      { kind: "p", text: "**Task arithmetic** (Ilharco et al., 2022) treats whole skills as vectors: fine-tune a model on maths, subtract the base, and the difference τ is the “maths direction” in weight space; add it to another model and maths gets stronger. **Model merging** (TIES and friends) blends several such models into one - no gradients at merge time, but the ingredients were each trained the hard way." },
      { kind: "p", text: "**Model editing** (ROME, Meng et al. 2022) changes one fact by solving a small equation for the one weight-update that flips it. **Activation steering** doesn’t touch weights at all - it nudges the model’s inner state at run time. **Mechanistic interpretability** reads weights and activations to reverse-engineer circuits (like the transformer-circuits work behind the copying-head technique in Exp 3)." },
      { kind: "p", text: "And the umbrella the paper cites for the whole field - **weight-space learning** (survey: arXiv 2603.10090 [VERIFY]) - splits research into understanding weights, representing them, and generating them. WSP lands in the third branch with a twist: its writer was never trained for the job." },
      { kind: "callout", badge: "schematic", title: "One-line summary of each cousin", text: "LoRA: gradients, but small. Task arithmetic: vectors, but pre-trained. ROME: surgery, but one fact. Steering: runtime only. Mech-interp: read-only. WSP: read *and* write, reasoned, general-purpose writer. (A teaching summary, not the survey’s taxonomy.)" },
    ],
    3: [
      { kind: "p", text: "Mechanism level: fine-tuning and LoRA both ride the gradient loop (θ ← θ − η∇L); LoRA constrains Δ to a low-rank cone, Δ = (α/r)·BA with r ≈ 4–64. Task arithmetic moves along the line between checkpoints - valid because fine-tunes stay roughly *linearly connected* to their base (Git Re-Basin explains when). ROME solves the rank-one closed form for (k* → v*) under a key-covariance C." },
      { kind: "p", text: "Activation steering adds α·u to the residual stream at layer ℓ at inference: weights frozen, behaviour bent. The Exp-8 edit is its weight-space mirror image: instead of adding u at runtime, *subtract the u-writing machinery* permanently - W′ = (I − uuᵀ)W on selected columns. Same maths, different target: weights vs activations." },
      { kind: "p", text: "Mechanistic interpretability contributes the *reading* toolkit: attention-head composition scores (Elhage et al.), path patching, logit-lens-style analysis. Exp 3 is literally this toolkit executed by an LLM on raw weights - which is why the review calls the copying-head match the most solid READ evidence." },
      { kind: "callout", badge: "paper", title: "The refusal precedent", text: "Arditi et al. (2024) showed refusal in LLMs is mediated by a single direction - removable by projection, exactly the operation class Exp 8 used. This is why the risk chapter treats “guardrail removal” as a real, pre-existing hazard class rather than speculation about speculation." },
    ],
    4: [
      { kind: "p", text: "Practical distinctions that survive the marketing: (1) *data need* - LoRA needs a dataset; task arithmetic needs two checkpoints; WSP claims spec-only. (2) *locality* - ROME edits one fact with provable-ish locality; WSP edits 131k weights with *measured* (not proven) locality via token-limit share and the Gemma control. (3) *transparency* - LoRA deltas are inspectable but meaningless to humans; a WSP Δ arrives with a reasoning trace that is *supposed* to explain the mechanism (see Ch 7 for how well that holds up)." },
      { kind: "p", text: "The table in this chapter sorts every method on four axes - data, gradients, compute, human-readability. Notice the empty quadrant WSP tries to occupy: no data, no gradients, low compute, readable diff. The reason it was empty until now is that writing weights without any of those crutches requires *understanding the machine* - the very thing the experiments test for." },
      { kind: "p", text: "For production thinking: today, if you have data, LoRA remains the reliable choice; if you have a single known defect, ROME-class editing; if you need to remove a capability, published single-direction work is the state of the art. WSP’s honest current niche is *small-model authoring* (Exps 5–6) and *diagnosed-obstacle removal* (Exp 8) - both demonstrated, neither yet baseline-beaten." },
      { kind: "callout", badge: "review", title: "Cousin-based null models, again", text: "The review notes that for Exp 8, the *standard direction ablation* is the mandatory missing baseline: if removing the same direction by textbook projection (no LLM reasoning at all) reproduces the gains, WSP is a (very good) interface to known techniques." },
    ],
    5: [
      { kind: "p", text: "Taxonomically, WSP is best modelled as *amortised program synthesis over weight space*: the LLM amortises a lifetime of code, math, and systems reading into a direct map from (θ-slice, spec) → Δ. That framing exposes the two things to test: transfer breadth (does it survive architectures it never saw?) and Δ-reachability (which edit classes can reasoning actually hit, vs those only gradients find?)." },
      { kind: "p", text: "Notice what WSP does *not* claim - and hold authors to it: it does not claim better final quality than training (nowhere demonstrated beyond n=1 toys), nor safety (see Ch 11), nor efficiency at scale (context costs grow with P). The strongest version of the claim compatible with the evidence: *for small-to-mid θ and diagnosed mechanisms, reasoned edits reach quality milestones directly without full training runs or gradient descent.*" },
      { kind: "p", text: "The survey (arXiv 2603.10090 [VERIFY]) and the Awesome-Weight-Space-Learning repo are the right entry points for the academic family tree; the paper’s logs repo is the right entry point for WSP’s working artifacts. If you are designing follow-up work, place it relative to both - and pre-register your baselines before the cousins’ community does it for you." },
    ],
  },
};
