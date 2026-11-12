import type { Chapter } from "../types";
import { PREDICTIONS, RISKS } from "../facts";

export const ch10: Chapter = {
  slug: "10-what-comes-next",
  number: 10,
  part: 4,
  title: "What Comes Next - Predictions & the Horizon Map",
  kicker: "Everything in this chapter is 🟥 speculation, including the authors’ own.",
  minutes: 8,
  intro:
    "The authors made five predictions. This chapter presents them, extends them into a horizon map from now to 2035, and - because this entire chapter is speculation - every prediction arrives with what would falsify it.",
  shared: [
    { kind: "module", id: "m13-futures" },
    {
      kind: "list",
      items: PREDICTIONS.map((p) => `**${p.title}** - ${p.text}`),
    },
    { kind: "callout", badge: "speculation", title: "None of the five predictions is tested in the post", text: "Auditing without evaluation, one-shot initialisation, zero-data steering/unlearning, recursive self-improvement, true architectural merging - all 🟥, none demonstrated. The horizon map below is my extension, equally untested." },
  ],
  levels: {
    1: [
      { kind: "p", text: "When inventors finish a great trick, they always sketch the future. The authors sketched five futures: robots-auditors that check machines for hidden traps without running them; super-cheap ways to give machines new skills by writing starting numbers; removing skills (or mistakes) without any practice data; machines improving their own successors; and true Frankenstein-style part-swaps between different kinds of machines. Fun to imagine. None tested yet." },
      { kind: "p", text: "This guide adds a timeline: **soon** (a shared scoring contest for these tricks - the authors promised one; other machines trying the tricks; first tiny “repair patches” shared like trading cards), **later** (a whole library of signed patches; un-learning trials; machine-assistant detectives for researchers; cheap custom machines for gadgets), and **much later** (auditing without running; part-swapping between different machine species; machines that design machines). Each step needs the earlier ones - the timeline slides away if reading stops working on other machines." },
      { kind: "callout", badge: "speculation", title: "The golden rule of this chapter", text: "If a prediction sounds exciting, ask: “what would prove it wrong?” Every honest prediction has an answer. Every dishonest one changes the subject." },
    ],
    2: [
      { kind: "p", text: "**The authors’ five predictions (🟥).** ① Auditing without evaluation - e.g. spotting backdoors from weights alone. ② Dramatically cheaper optimisation - one-shot initialisation. ③ Zero-data capability steering and unlearning. ④ Recursive self-improvement - models editing successors. ⑤ “True architectural merging” - grafting a circuit between different architectures. All untested in the post." },
      { kind: "p", text: "**The near horizon (now–6 months, still 🟥 but checkable):** the promised benchmark + harness (“currently being built”); replications on other LLMs; shrinking context and tooling limits; the first shared weight-diff patches. **The middle horizon (6–24 months):** signed patch ecosystems - “git for weights”; zero-data unlearning trials; LLM-assisted interpretability as a research tool; one-shot initialisation for small specialist nets and edge devices. **The far horizon (2–5 years):** evaluation-free auditing *if* reading generalises; cross-architecture grafting; WSP agents inside training pipelines; models programming successors. **The very far edge (5+ years):** weights treated as reviewable source code - humans reviewing, versioning, formally verifying “compiled” behaviours." },
      { kind: "p", text: "Notice the load-bearing assumption separating near from far: **does reading generalise beyond one frontier model and beyond author-designed tasks?** Every far-future item quietly assumes yes. The futures slider (M13) lets you flip that switch and watch the far side dim." },
      { kind: "callout", badge: "speculation", title: "What would falsify each band", text: "Near: no benchmark by mid-2027, no independent replications. Middle: patch ecosystems stay absent; unlearning trials fail safety review. Far: reading shown brittle across architectures; grafting attempts degrade both models. Watch dates, not vibes." },
    ],
    3: [
      { kind: "p", text: "Structure the predictions by their *prerequisite claims*: ① needs reading to generalise to non-author tasks (currently untested - see Ch 8’s missing-baselines list); ② needs WRITE to scale beyond 1.5M parameters (three demonstrated data points, all below that); ③ needs FIX-style diagnosis without a forward-pass budget (Exp 8 used up to 50); ④ needs everything above plus automated evaluation of self-edits; ⑤ needs cross-architecture representation alignment - arguably the hardest, since it presupposes shared computational bases across different tokenisers, depths, and training distributions." },
      { kind: "p", text: "The horizon map (§7.1) also encodes *who must act*: benchmark (authors/community), patch ecosystems (infrastructure builders - signing, diffing, provenance), unlearning trials (legal and safety communities), edge initialisation (hardware and embedded teams). A prediction without an actor is a wish; the map assigns actors deliberately." },
      { kind: "p", text: "Interpolation discipline: treat the horizon map as ordered speculation, not a forecast with probabilities. Nothing here has even an n=1 test, which is precisely why every entry carries its falsifier - the cheapest one being “the next 12 months of benchmarks and replications”. If the field stalls there, the far bands are fiction; if it moves, revisit the map." },
    ],
    4: [
      { kind: "p", text: "Operationalise the checkable band: benchmark + harness - what would qualify? Minimum viable: ≥3 tracks (Read/Fix/Write), ≥5 seeds, ≥2 baselines, author-blind tasks - i.e. WSP-Bench-Lite (Ch 12) or a superset. If what ships is weaker (single-run, author-tasks), treat the “benchmark exists” box as *unchecked* - a benchmark without baselines is a demo. Track this the way you’d track a pre-registered trial." },
      { kind: "p", text: "For “patch ecosystems”, the real gating tech is not ML - it is *provenance infrastructure*: signed weight-diffs with attestation of origin and licence, plus a diff format compact enough to review by hand (Exp-8-style edits are 131,072 parameters, or ~0.26 MB in bf16 / ~0.52 MB in fp32; a full 0.8B checkpoint is ~1.6 GB - over 3,000× more compact for human inspection). Git-for-weights is mostly a security-engineering problem wearing an ML costume." },
      { kind: "p", text: "For recursive self-improvement specifically, hold the near-term bar at “models proposing edits to a *sibling* model under human sign-off, with immutable audit logs” - that is the defensible, monitorable version. Anything describing closed-loop self-editing at frontier scale is currently fiction with a governance tail (Ch 11 §4). The evidence in the paper does not distinguish “LLM edits weights” from “LLM could bootstrap capability” - the second needs *evaluation* access, not just edit access, to compound." },
      { kind: "callout", badge: "speculation", title: "Base rates to keep you honest", text: "Interpretability tools historically take years from paper to production reliability (adversarial-example detection, anyone?). Weight-diff review tooling is security engineering - historically 2–5 years to maturity. Discount every horizon by those base rates before repeating it in a roadmap." },
    ],
    5: [
      { kind: "p", text: "The research programme hiding inside the horizon map: (1) **identifiability theory** - which behaviours are decidable from θ (Ch 1–4 question, formalised); (2) **edit-reachability** - which Δ are reachable by reasoning vs gradients (distinguishes WSP from optimisation in principle, not just cost); (3) **drift control** - bounding D over a distribution of held-out behaviours after an edit (the safety licence for all of this); (4) **cross-architecture alignment** - the ⑤ prerequisite; today no formal object exists for “the same circuit” across architectures. Each is a paper-sized opening, and the paper’s artifacts (logs, checkpoints, demo) make each concrete to start." },
      { kind: "p", text: "Recent community research and discussions (November 2026) have zeroed in on the reachability boundary: can an LLM reason about weight matrices when representations are non-linear or deeply superpositional? While linear induction heads (Exp 3) and rank-1 attractor subspaces (Exp 8) are algebraically transparent to a frontier reasoning model equipped with a Python interpreter, distributed multi-layer polysemanticity remains an open theoretical bottleneck. The upcoming 2027 benchmark cycle will determine whether WSP scales into a general-purpose compiler for neural circuits or settles as an exquisite forensic scalpel for low-rank pathology removal." },
      { kind: "p", text: "For policy readers: the only near-term governance-relevant items are compute-threshold blindness (0.016%-edits evade compute-keyed rules - Ch 11 §3) and patch provenance. Both need *capability-based* evaluation rules and post-release change tracking - neither needs new science, only will. The far items (RSI, successor-programming) are worth watching but currently govern nothing real; resist regulating the fiction while ignoring the two concrete gaps." },
    ],
  },
};

export const ch11: Chapter = {
  slug: "11-the-severe-stuff",
  number: 11,
  part: 4,
  title: "The Severe Stuff - a Risk Atlas, Told Responsibly",
  kicker: "Ten risks, ten defender’s toolboxes, zero operational recipes.",
  minutes: 10,
  intro:
    "A technique that edits neural networks by reasoning carries real risks. This chapter maps them at a conceptual level only - no step-by-step harmful instructions anywhere - and pairs every single risk with a defender’s toolbox. It ends with the optimistic branch, because doom-only is its own kind of dishonest.",
  shared: [
    { kind: "module", id: "m12-risk-radar" },
    {
      kind: "list",
      items: RISKS.map((r) => `**${r.title}** - ${r.what} *Defence:* ${r.defence}`),
    },
    { kind: "callout", badge: "paper", title: "The precedent that makes risk #2 real, not hypothetical", text: "Published research (Arditi et al., 2024) already shows single-direction edits can change refusal behaviour in open models - and the Exp-8 edit is the same mathematical operation class. Cheap weight surgery for guardrail-stripping is a pre-existing hazard class; WSP would only lower the barrier." },
  ],
  levels: {
    1: [
      { kind: "p", text: "Some readers will feel a chill: “if a machine can *fix* other machines, can it also *break* them on purpose - and hide it?” Yes, that is exactly the right worry, and it is why this chapter exists. Here is the deal this guide makes with you: we will name every scary possibility plainly - but we will *never* teach how to do the scary thing, and we will always show the shield that goes with each sword." },
      { kind: "p", text: "The shields are real: tamper-proof seals for machine-parts (signed patches); X-ray machines that spot sneaky edits (anomaly scans); “show your work” rules for anyone who changes a public machine (diff review); and - the simplest one - *never trust a story over a measurement*. Every risk in the list has shields like these. Defenders have work to do, but the work is doable." },
      { kind: "p", text: "And one more thing, because fear sells and balance doesn’t: the same trick could make custom machines *cheap* for small businesses, make safety-removal (un-learning) *possible* without retraining, and let researchers finally see inside the machines. What could go right deserves its own seat at the table - it gets one, below." },
    ],
    2: [
      { kind: "p", text: "**The ten risks, one line each.** ① Hidden backdoors - edits that smuggle in behaviour benchmarks never trigger. ② Guardrail-stripping - cheap removal of safety training from open models. ③ Compute-rule blindness - capability added by a 0.016% edit, invisible to compute-threshold rules. ④ Recursive self-improvement - models editing models, hard to audit. ⑤ Licence laundering - tiny weight-diffs hiding the origin of stolen behaviour. ⑥ Concealment - models that look safe, or auditors that imagine dangers. ⑦ Benchmark gaming - editors tuned to the test instead of the task. ⑧ Over-trust - believing a model’s explanation of its own edit. ⑨ Power concentration - only a few labs holding a frontier editor. ⑩ …and the counter-weight: what could go *right*." },
      { kind: "p", text: "**The standing rule of this chapter:** every risk above has a defence listed in the atlas - provenance and signed diffs, tamper-resistant training, capability-based (not compute-based) evaluation, human sign-off on edits, weight attestation, author-blind benchmarks, and the verify-narratives-against-measurements habit. None is hypothetical; all are buildable today." },
      { kind: "p", text: "One honest calibration: the *paper itself* demonstrated none of the harmful uses - no backdoor was built, no guardrail stripped. The risks here are about what the *technique class* makes cheaper, given published precedent (risk ② rests on published refusal-direction work, not on the post). Speculation, but disciplined speculation - 🟥 throughout." },
      { kind: "callout", badge: "speculation", title: "What could go right (risk #10)", text: "Cheaper customisation for people without data budgets; interpretability that reads like a mechanic’s report; unlearning that actually removes content rather than papering over it; a public patch commons for small models. Every one of these is as plausible as its scary twin - and more likely to arrive first." },
    ],
    3: [
      { kind: "p", text: "Mechanism-level notes on the four most consequential risks. **Backdoors (①):** a triggered behaviour needs a trigger detector circuit - small, localised, and *readable* in principle, which is exactly why weight-space anomaly scanning is the matching defence; the arms race is detector-size vs scan-resolution. **Guardrail-stripping (②):** refusal is single-direction-mediated (Arditi et al.), so the attack is a known closed-form operation; the defences are tamper-resistant training (making refusal robust to projection) and derivative-checkpoint monitoring." },
      { kind: "p", text: "**Compute blindness (③):** rules keyed to training FLOPs assume capability scales with compute spent *creating* it; a 0.016% edit decouples the two. The fix is capability-based evaluation plus tracking *post-release changes* to published weights (a weight diff is a fingerprint; watching for them is cheap). **Concealment (⑥):** the double-edged sword - the same reading skill that finds real hidden behaviour can also hallucinate it; multiple independent readers plus ground-truth probe sets are the calibration defence." },
      { kind: "p", text: "**Goodhart (⑦)** deserves its mechanism spelled out: an editor optimised against a benchmark overfits its harness exactly the way RL overfits reward models; the defence is the benchmark-design rule from Ch 12 - author-blind, held-out tasks, with the *task authors forbidden from competing*. **Over-trust (⑧)** is the epistemic risk under all the others: the paper’s own verification patterns (ground-truth copying heads, token-limit shares, negative controls) are the habit that keeps narratives honest." },
    ],
    4: [
      { kind: "p", text: "Deployment-grade defence stack, layer by layer: (1) *provenance* - every public checkpoint carries a signed manifest; every derivative carries a signed diff against its parent (Exp-8-scale diffs are ~MBs; reviewable). (2) *screening* - weight-space anomaly scans + behavioural red-team suites as CI for models, like package scanners for dependencies. (3) *governance* - capability-keyed (not compute-keyed) evaluation rules; mandatory model-card diffs on release. (4) *epistemics* - no narrative accepted without its measurement; audit logs immutable and public." },
      { kind: "p", text: "The detection research gaps (the constructive to-do list): (a) can 131k-weight edits be *detected* statistically in a 0.8B model without knowing the direction? - nobody has published the power analysis; (b) tamper-resistant training - published work exists for refusal, generalising it is open; (c) attestation formats - the “SBOM for weights” does not exist yet; (d) evaluation protocols that notice *capability added without a training run* - the exact blind spot of current reporting norms. Each is a fundable, publishable project today." },
      { kind: "p", text: "On recursive self-improvement (④), the sober version: compounding requires *reliable evaluation* of one’s own edits, and the paper’s evidence is that even *one* edit’s effects are non-monotonic in feedback budget (the 25-pass dip). Self-editing without trusted external evaluation is more likely to compound error than capability. The danger scenario needs a *trusted automated evaluator* first - which is a monitoring problem, and monitorable. Human sign-off and rate-limited self-edits remain cheap, effective controls while the science catches up." },
      { kind: "callout", badge: "speculation", title: "The asymmetry worth remembering", text: "Offence in WSP-land is *surgical and quiet*; defence is *infrastructural and loud* (signing, scanning, publishing). History says infrastructural defence lags by years. That lag - not any single attack - is the real risk. Start the infrastructure now, before it is needed." },
    ],
    5: [
      { kind: "p", text: "Research agenda I would fund from this atlas, ordered by risk-reduction per dollar: (1) *edit detection theory* - the statistical detectability of rank-k sparse edits under unknown directions (a clean maths problem with immediate policy value); (2) *capability-based evaluation standards* - replacing compute-keyed thresholds with behaviour-keyed ones; (3) *attestation and diff-signing standards for open weights*; (4) *reader calibration* - measuring false-positive rates of weight-reading auditors against ground-truth-hidden-behaviour testbeds (buildable from WSP-Bench-Lite’s READ track). All four are defences first and science second - the best kind." },
      { kind: "p", text: "Meta-point for the field: this paper did the right thing twice over - released logs and edited checkpoints *and* framed claims modestly (“sparks”). The correct community response is to hold that standard: refuse to amplify unverified claims, demand the verification patterns (ground truth, mechanism checks, negative controls) as the citation price of coverage. Risk #8 (over-trust) is defeated or caught in exactly one place: the editorial layer. This guide’s truth-contract machinery (badges, filter, verification list) is a small working example of that layer." },
    ],
  },
};
