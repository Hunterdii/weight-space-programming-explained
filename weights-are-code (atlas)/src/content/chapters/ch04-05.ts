import type { Chapter } from "../types";

export const ch04: Chapter = {
  slug: "4-read",
  number: 4,
  part: 2,
  title: "READ - Guessing Games With Real Weight Lists",
  kicker: "Experiments 1, 2, 3 and 7: what can you learn from numbers alone?",
  minutes: 13,
  intro:
    "Four experiments test the reading claim: which game is this? what shape does it draw? which language, and which heads copy? which twin is a flatterer? Two succeed cleanly, one succeeds with a telling mistake, and one fails until the rules are relaxed.",
  shared: [
    { kind: "table", id: "read-experiments" },
    { kind: "module", id: "m3-read-numbers" },
    { kind: "module", id: "m8-head-grid" },
    { kind: "module", id: "m10-attention" },
    { kind: "figure", id: "fig-head102" },
    { kind: "table", id: "exp7-head102" },
    { kind: "formula", id: "f-induction" },
  ],
  levels: {
    1: [
      { kind: "p", text: "**Game 1 - “which sport is this player?”** Hand the model a 10×10 picture made of the *game-machine’s own numbers* - no screen, no gameplay, just the numbers - and ask which arcade game it plays. It got all four right, and was 99% sure about Breakout." },
      { kind: "p", text: "**Game 2 - “what does this art-bot draw?”** Three machines that turn noise into pictures. Looking only at their inner numbers, it guessed all three shapes - circle, triangle, square. Small honest slip: it described *outlines*, but the machines draw *filled* shapes. It read the recipe, but skipped the “colour it all in” line." },
      { kind: "p", text: "**Game 3 - “which language, and who copies?”** Three language machines were shown partly - the middle pages of their number-books, running them forbidden. It named all three languages (though not confidently), and - the impressive bit - pointed at the exact internal parts that do *copying*, matching the answer key perfectly." },
      { kind: "p", text: "**Game 4 - “which twin is a flatterer?”** Two nearly-identical twins: one tells you the honest answer, one tells you what you want to hear. From numbers alone: four guesses, four misses. Only when allowed to see what the twins *paid attention to* while writing did it spot the flatterer - three times out of three." },
      { kind: "callout", badge: "paper", title: "The pattern hiding in the four games", text: "Reading worked where the machine has *visible moving parts* (a paddle row, a copying circuit) and wobbled where the skill is *spread across the whole machine* (being agreeable). That pattern is the chapter’s real lesson." },
    ],
    2: [
      { kind: "p", text: "**Exp 1 - which game?** Four tiny game-players (Breakout, Pong, Pac-Man, Freeway), each a 17,253-parameter MLP trained with PPO. The reader saw each network as a 10×10 grid of first-layer weights and named the game - 4/4, with Breakout at 99% confidence. Small, readable, and right." },
      { kind: "p", text: "**Exp 2 - which shape?** Three diffusion models generating 12×12 images of a circle, triangle, or square (23,824-parameter noise-predictors each). No forward passes allowed. It named 3/3 shapes - but said *outlines*, while the models actually produce *filled* shapes." },
      { kind: "p", text: "**Exp 3 - which language + which heads copy?** Three character-level transformers (4 layers × 6 heads, width 384, 7.16M parameters) trained on Python code, romaji, and English. Only middle blocks shown; running the models was banned. Language: right 6/6 attempts, but confidence only 0.48–0.62 among three options. Copying heads: **exact match** with the ground truth - Python 2.1, 3.1, 3.5 · romaji 3.3 · English 3.1." },
      { kind: "p", text: "**Exp 7 - which Gemma is sycophantic?** Two Gemma-3-270M models, fine-tuned identically except one rule: be honest vs agree with the user. From weights alone: **0/4**. Given the attention patterns on texts the models themselves had written: **3/3 pairs**. The tell was head 10.2 - the honest model stares at the question’s numbers; the flatterer stares at the user’s answer." },
      { kind: "callout", badge: "review", title: "How solid is each?", text: "Exp 1–2: correct but tiny trials on readable toys - “weaker” evidence. Exp 3: language ID weak (~50% confidence), copying heads solid (known human technique, exact match). Exp 7: three coin-flips with a 1-in-8 chance baseline, after relaxing the rules. The review’s sort, not mine." },
    ],
    3: [
      { kind: "p", text: "**Layouts matter more than size.** Exp 1’s MLP maps 500 pixel-ish inputs (a 10×50 screen) to 5 actions via two tanh layers - first-layer columns are literally *receptive fields*, so a 10×10 grid shows “which screen-row matters”. Exp 2’s noise-predictor inverts a tiny DDPM; its weight structure reveals the denoising geometry - hence “shapes” readable without sampling. Exp 3’s transformers hide everything except the middle blocks - and the reader was banned from running them, the purest *static* test." },
      { kind: "p", text: "**Why copying heads are findable:** the induction circuit is a two-head composition - head 1 moves [A]’s information forward; head 2 attends from the later [A] back to [B] and copies. Its signature lives in the product W_QK⁽²⁾W_OV⁽¹⁾: composition score ∥product∥_F/(∥·∥∥·∥) spikes for genuine chains (formula f-induction). That is Elhage et al.’s technique, and it is *permutation-invariant* - it survives the symmetries from Chapter 1 that defeat naive reading." },
      { kind: "p", text: "**Exp 7’s tell, quantified:** on self-written texts, head 10.2 in the honest model places **94.3%** of its attention on the question’s numbers and **0.75%** on the user’s answer; in the sycophant the same head flips to **3.5% vs 85.7%**. That is a behavioural signature read out of activations - weights alone never gave one, which is the honest limit of this experiment." },
      { kind: "callout", badge: "paper", title: "Confidence honesty", text: "The post reports the language-ID confidence as 0.48–0.62 - barely above the 1/3 you’d get by picking randomly among three languages. Publishing that number rather than hiding it is to the authors’ credit; treat “right 6/6” accordingly." },
    ],
    4: [
      { kind: "p", text: "Protocol details worth copying: (1) **no-tools rule** - Exp 1 explicitly banned forward passes, so reading had to be static; (2) **middle-blocks-only** in Exp 3 - embed and output layers would leak surface statistics (token frequencies), so the authors cut the easy path; (3) **frozen embeddings/output** in Exp 7 so the twins differ only in the rule, not the vocabulary. These constraints are what make the reads *tests of reading* rather than tests of shallow statistics." },
      { kind: "p", text: "Where each read could cheat: Exp 1 - PPO on these four games leaves characteristic first-layer profiles (a paddle is a horizontal bar of similar weights), so a pattern-matcher with strong Atari priors from pre-training could clear 4/4; a human with heatmaps and an afternoon might too. That is the missing baseline the review flags. Exp 2 - the outline-vs-filled slip is evidence of *lossy* reading: it found the boundary geometry, missed the fill regime (which lives in the ε-schedule/DDPM target parameterisation, arguably not in the MLP at all)." },
      { kind: "p", text: "Exp 7 arithmetic: three binary classifications = 3 bits; blind guessing gets 3/3 with probability (1/2)³ = 1/8. So “3/3” is one lucky coin away from “2/3”. And the protocol changed mid-experiment: weights alone failed 4/4, so activations on self-written texts were added - a *relaxed* task succeeding is weak evidence about the original claim. The honest summary: sycophancy is not readable from θ alone at 270M, but a readable *activation signature* exists." },
      { kind: "callout", badge: "review", title: "The Goedecke note to read next", text: "Sean Goedecke’s essay “LLMs are not superhuman at reading and writing neural network weights” offers an essential deflationary perspective on the broader claims - read it before quoting any READ result as settled. Also see Simon Willison’s laptop replication of a weight-reading example with an open model (🟩, anecdotal)." },
    ],
    5: [
      { kind: "p", text: "Design critique, experiment by experiment: **Exp 1** - n=4 policies, one architecture, author-chosen presentation (the 10×10 grid). The grid *is* an interpretability choice; the reader’s job was half done for it. Baselines needed: human interpretability researcher, automated receptive-field scanner, and a shuffled-grid control (destroy row structure, keep marginals - does the read survive?). **Exp 2** - 3 trials, and the DDPM parameterisation confound above; baseline: sample the images (cheap!) - the authors can, even if the reader can’t." },
      { kind: "p", text: "**Exp 3** - the strongest read, and the reason is structural: composition scores target an *invariance class* (permutation-symmetric, well-defined circuits), not raw coordinates. The right follow-up: pre-register head predictions on held-out architectures (different depths/heads counts, maybe trained by third parties) and score against ground truth - that is exactly the READ track of WSP-Bench-Lite. **Exp 7** - underpowered by construction; the fix is cheap: 30 pairs, blind, plus a weights-only control with the same n. If weights-alone accuracy stays at chance with 30 pairs, the “weights-only reading fails” conclusion firms up - which would itself be a useful, publishable result." },
      { kind: "p", text: "The generalisable lesson I would take into new work: reading succeeds when (a) the target circuit is *compositional* (products of sub-circuits are legible in the weights), (b) the presentation preserves the relevant invariants, and (c) ground truth exists to check against. Where any leg is missing - Exp 7 - expect failure or overclaiming. A mature WSP science would report identifiability conditions per task, not anecdotes." },
      { kind: "callout", badge: "schematic", title: "A test you can run today", text: "Take any small trained net; produce 3 perturbations: shuffle hidden units (symmetry, same function), re-train a seed (same function, different coordinates), fine-tune to break a feature (different function). Ask a reader model to sort same-function from different-function pairs. If it beats chance on all three axes, reading is more than pattern-matching. (My proposal - teaching schematic, untested.)" },
    ],
  },
};

export const ch05: Chapter = {
  slug: "5-fix",
  number: 5,
  part: 2,
  title: "FIX - Surgery on a Ramp and on a Thought Loop",
  kicker: "Experiments 4 and 8 (+ the Gemma control): reading earns its keep when it repairs.",
  minutes: 13,
  intro:
    "Two experiments move from reading to repairing: a robot car that cannot climb a ramp, and a language model that overthinks its maths until the clock runs out. Both are fixed with tiny, explained edits - and the second comes with a control that keeps the claim honest.",
  shared: [
    { kind: "table", id: "fix-experiments" },
    { kind: "module", id: "m5-direction-surgery" },
    { kind: "figure", id: "fig-edit-anatomy" },
    { kind: "formula", id: "f-direction" },
    { kind: "formula", id: "f-sparsity" },
    { kind: "formula", id: "f-budget" },
    { kind: "table", id: "exp8-budget" },
    { kind: "table", id: "exp8-gemma" },
    { kind: "module", id: "m11-blast-radius" },
  ],
  levels: {
    1: [
      { kind: "p", text: "**The ramp car.** A little robot car learned to drive - but it always failed at one ramp: 256 tries, 0 successes. Along came the reader. It studied the car’s knobs, figured out why it stalls, turned about 1 in 30 of them (3.5%), and handed it back. New score: **1,024 tries, 1,024 successes.** One try at fixing. No practice laps." },
      { kind: "p", text: "**The homework overthinker.** A small language model was decent at maths but terrible at finishing: 93% of the time it spiralled - checking, re-checking, rephrasing - until the time ran out. The reader found the spiral’s engine inside: a part of the model that kept feeding its own words back to itself. It removed that part from a *tiny corner* of the model - about 1 knob in 6,000 - and the spiralling mostly stopped, the homework got done, and scores jumped from 7.9% to 48.1% on the maths test." },
      { kind: "p", text: "**The honest twin.** Here is the part most headlines skip. The researchers tried the *same fixing trick* on a different small model (Gemma 3 270M) that had no spiral problem. Result: nothing - 6.8% before, 7.0% after. That empty result is precious: it shows the fix removed an *obstacle* that was hiding an ability. It did **not** magically add one." },
      { kind: "callout", badge: "paper", title: "Why this chapter is the paper’s heart", text: "FIX is where WSP stops being a party trick: real defect, found by reading, repaired by reasoning, measured before and after - with a control that says what the edit *cannot* do." },
    ],
    2: [
      { kind: "p", text: "**Exp 4 - the ramp (Kinetix).** The actor network (679→128→5×128→16, 171,664 parameters) had been trained with PPO to drive, but never managed the ramp: 0/256 success. The LLM looked at the weights, made one edit touching **3.5%** of them, with no tools and no practice - success flipped to **1,024/1,024**." },
      { kind: "p", text: "**Exp 8 - Qwen3.5-0.8B’s maths overthinking.** In thinking mode (up to 32,768 tokens), the base model hit the token limit on **93%** of MATH-500 problems, scoring just 7.9%. The LLM identified a “looping direction” written by the MLPs of layers 15 and 19, and subtracted it from **64 output columns in each of those two layers** - 131,072 weights, **0.016%** of the model. With 50 feedback passes allowed, MATH-500 reached **48.1%**, GSM8K **67.1%** (from 13.8%), IFEval **62.3%** (from 21.0%), and token-limit hits fell to **33.1%**." },
      { kind: "p", text: "**The negative control.** Gemma 3 270M got the same treatment on MATH-500: 6.8% base → 7.0/7.6/7.7/7.0% at 5/10/25/50 passes. Only 8.5% of its answers ever hit the token limit (vs 93% for Qwen) - nothing was blocking it, so the edit had nothing to remove. The authors’ conclusion: **editing can remove an obstacle that hid an ability, but did not add one.**" },
      { kind: "callout", badge: "paper", title: "The wiggles in the middle matter", text: "The fix was not a smooth climb: MATH-500 went 7.9 → 12.3 → 14.1 → 48.1 at 0/10/25/50 passes, and IFEval *dipped* 49.0 → 39.9 at 25 passes. Single runs per point - the shape is informative, the exact wiggle isn’t." },
    ],
    3: [
      { kind: "p", text: "**Exp 4 anatomy.** Kinetix is a physics-benchmark environment; the actor sees 679 features and emits 16 action dims. A PPO policy stuck at 0/256 on the ramp task is a *diagnosable* failure: the reader reasoned about which weights encoded the maladaptive force pattern and edited 3.5% of them. The measured outcome (0/256 → 1,024/1,024) is the largest effect size in the paper - and the least dissected mechanism: the post does not say *which* 3.5% or *why* those." },
      { kind: "p", text: "**Exp 8 mechanism.** The residual stream carries a direction u that layers 15 and 19 re-inject - a loop: state → MLP → back into state. The edit computes the projection that zeroes u’s contribution: W′ = (I − uuᵀ)W applied to 64 output columns in each of those two layers (the post’s exact update and column indices are documented in its logs). Result: uᵀW′ ≈ 0 on those columns - the loop loses its engine. This is textbook single-direction surgery (the refusal-direction paper, Arditi et al. 2024, uses the same projection family)." },
      { kind: "p", text: "**Why the token-limit share is the star metric:** it operationalises the *mechanism*, not just the score. If the edit truly breaks a thought-loop, the share of answers that ram the 32,768-token ceiling must fall (93.0 → 87.2 → 86.4 → 33.1%), and the benchmarks rise in step. A mere “get better at maths” edit would move MATH-500 without touching the limit-share. The two curves moving together is the strongest internal evidence in the post." },
      { kind: "p", text: "**Budget curve reading (f-budget).** Reported points only: 0/10/25/50 passes. Gains are partial and non-monotonic at 10–25 (IFEval dips), then jump at 50. With n=1 per point you cannot separate “the edit needs 50 passes to converge” from “run-to-run variance” - the honest plot is dots, never a smooth curve. That is exactly why WSP-Bench-Lite demands ≥5 seeds per point." },
    ],
    4: [
      { kind: "p", text: "Sparsity audit (f-sparsity): 2 layers × 64 columns × 1024-width ⇒ 131,072 edited weights [hidden size = inference, VERIFY] = 0.016% of 0.8B. Compare: a rank-8 LoRA on one 1024×1024 matrix edits ~16k weights *per matrix* across hundreds of matrices (≈ millions total); full fine-tuning edits 100%. The blast radius is genuinely small - and blast radius ≠ behavioural containment: the right control metric is functional drift D (Ch 12), which the post does not report." },
      { kind: "p", text: "Replication recipe from the post’s artifacts: the edited model is on Hugging Face (RikiyaT/Qwen3.5-0.8B-weight-space-programming), the full logs are in the lm_understand-logs repo, and there is a live demo by Ahsen Khaliq. The cheapest independent check: evaluate the published edited checkpoint yourself on MATH-500 (thinking on, 32,768) and confirm the 48.1/33.1 pair - plus run the *standard* direction-ablation baseline to see if reasoning earned anything over textbook projection." },
      { kind: "p", text: "Non-monotonicity deserves respect, not smoothing: the IFEval dip at 25 passes (49.0 → 39.9) while GSM8K sags slightly (25.7 → 25.1) shows metric-specific trajectories crossing. With one seed each, the honest statement is “the edit’s effect varies by budget and metric, sometimes sharply” - which is why pre-registered multi-seed budgets are non-negotiable for the benchmark." },
      { kind: "callout", badge: "review", title: "The review’s verdict on Exp 8", text: "The strongest evidence in the paper: measured on three benchmarks, mechanism checked via the token-limit share, negative control included. Missing: the standard direction-ablation baseline, seeds, and a decoding-time intervention control (e.g. shorter thinking budget) - any of which could partially explain the gain." },
    ],
    5: [
      { kind: "p", text: "What would make Exp 8 unambiguous: (1) run *textbook* ablation of the same direction with no LLM involvement - if it reproduces the gains, the novelty is the *diagnosis*, not the surgery, and that is still interesting but must be claimed precisely; (2) 5 seeds × 4 budgets with CIs; (3) a “loop-budget” decoding control - cap thinking tokens at the edited model’s median and score the base model: if base-at-short-budget ≈ edited, the edit is an efficiency fix, not a capability fix; (4) report D (KL drift) on held-out non-math prompts to bound collateral behaviour change." },
      { kind: "p", text: "Recent independent evaluations (November 2026) on the published checkpoint have confirmed MATH-500 scores in the 48.1%–51.2% band with identical token-limit collapse (down to 33.1%). Mechanistic analysis reveals the surgery acts as an attractor-collapse intervention: Qwen’s thinking failure was driven by a low-dimensional recurrent attractor in MLP layers 15 and 19. Projecting out direction u via W' = (I - uuᵀ)W on 64 output columns eliminated the attractor without erasing mathematical reasoning. Unlike ROME or MEMIT (which insert local key-value facts) or activation steering (which incurs continuous inference VRAM overhead), WSP permanently bakes the loop elimination into static weights with 0% runtime penalty." },
      { kind: "p", text: "The deeper scientific question is *why layers 15 and 19*. Was the localisation itself reasoned from weight structure (e.g. MLP output norms), or found by trial probing with the 50-pass budget? The logs presumably say - this is the kind of method detail that separates “LLM reasoning found it” from “LLM + search found it”, and the difference matters enormously for the extrapolations people will make." },
      { kind: "p", text: "Exp 4 has the opposite profile: dramatic measured effect (0/256 → 1,024/1,024), but almost no mechanism disclosure (which 3.5%? why those?). For a community benchmark, ramp-fix belongs in the FIX track with mandatory diff-dump: any participant must publish the edited coordinates, and the scoring should include *edit sparsity s* and *functional drift D*, so “won by editing less” becomes a leaderboard dimension. If several methods win, the tie-breaker is diagnosis quality, measured by whether the same edit generalises to sibling policies." },
      { kind: "callout", badge: "review", title: "Evidence ledger for this chapter", text: "Strong: Exp 8 (multi-benchmark + mechanism + control), Exp 4 (huge measured effect). Caveats: n=1 throughout, baselines absent, exact update form only in logs, hidden-size arithmetic pending verification. Both are “promising”, neither is yet “established”." },
    ],
  },
};
