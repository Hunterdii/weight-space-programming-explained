import type { Chapter } from "../types";

export const ch01: Chapter = {
  slug: "1-pile-of-numbers",
  number: 1,
  part: 1,
  title: "A Network Is a Pile of Numbers",
  kicker: "Before the experiments can make sense, one idea has to land.",
  minutes: 9,
  intro:
    "Every neural network - the game player, the chat model, the image maker - is, at its core, a long list of decimal numbers. Change the numbers and you change the skill. This chapter makes that feel true, with knobs you can turn.",
  shared: [
    { kind: "figure", id: "fig-anatomy" },
    { kind: "module", id: "m1-knob-room" },
    { kind: "formula", id: "f-network" },
  ],
  levels: {
    1: [
      { kind: "p", text: "Picture a giant mixing console in a recording studio - thousands of little round knobs in rows. The music that comes out depends only on where every knob sits. A neural network is that console. The knobs are called **weights**, and a “smart” computer program is nothing but billions of them, set just right." },
      { kind: "p", text: "Here is the trick that makes this interesting: two consoles with the *same wiring* but *different knob positions* play completely different music. Two networks with the same wiring but different weights have completely different skills. One pile of numbers plays Breakout; another pile - same wiring! - runs from ghosts in Pac-Man." },
      { kind: "p", text: "Now the big question of this whole guide: if a machine is just knobs, could a very clever reader **look at the knob positions and tell you what the machine does** - or even turn a few knobs to change what it does? That is weight-space programming: reading, fixing, and writing the knobs by thinking about them." },
      { kind: "callout", badge: "paper", title: "The smallest example in the real experiments", text: "The first network the researchers’ model read had just **17,253 knobs** - a tiny game-playing machine. Reading it correctly was the warm-up act. (Experiment 1)" },
    ],
    2: [
      { kind: "p", text: "The numbers inside a network are called **parameters** or **weights** (the two words blur together; parameters includes biases). A modern chat model has hundreds of millions to hundreds of billions of them. The small math model fixed in the paper’s flagship experiment, Qwen3.5-0.8B, has about 800 million." },
      { kind: "p", text: "Same architecture + different numbers = different behaviour. That is the single most important sentence in this guide. The wiring (how many layers, how they connect) is the *architecture*; the numbers filling that wiring are the *weights*. Nothing else distinguishes a French poetry model from a chess model - only the numbers." },
      { kind: "p", text: "Now imagine the list of every possible setting of every number - a space of possible machines. Researchers call it **weight space**. Training is a long walk through this space. Editing is a short jump. And “reading” is trying to tell where in the space a machine sits, from the coordinates alone, without ever running it." },
      { kind: "callout", badge: "schematic", title: "How big is weight space?", text: "A 1-billion-parameter model has more possible settings than atoms in the observable universe, raised to a huge power. Almost all settings are useless noise. Training finds an astronomically rare pocket of useful ones - which is why writing them by hand seems absurd, and why the paper’s claims are worth checking carefully." },
    ],
    3: [
      { kind: "p", text: "Formally: a network is a function **f_θ(x)** whose behaviour is fixed by a parameter vector θ ∈ ℝ^P. For a multilayer perceptron, θ is the concatenation of every weight matrix and bias vector: θ = (W₁, b₁, W₂, b₂, …). The first READ experiment’s network was 500→32→32→5 with tanh activations - so W₁ is 32×500, W₂ is 32×32, W₃ is 5×32, plus biases: **P = 17,253**." },
      { kind: "p", text: "The **weight-space landscape** metaphor: define a loss L(θ) measuring how badly the network performs, and you get a surface over ℝ^P. Training descends it. Two different trained networks sit at two different minima - both “good at the game”, possibly via very different internal mechanisms (or possibly the same mechanism, mirrored)." },
      { kind: "p", text: "A crucial subtlety for everything that follows: **many different θ can compute the same function**. Permute hidden units and the function is unchanged while every weight moves. So “reading behaviour from weights” is not even well-posed as a one-to-one decoding - the reader must find *invariants*, patterns that survive these symmetries. Keep that in mind when judging the READ experiments." },
      { kind: "callout", badge: "paper", title: "Parameter counts you will meet later", text: "17,253 (game reader, Exp 1) · 23,824 (diffusion shape reader, Exp 2) · 7.16M (language models, Exp 3) · 171,664 (ramp car, Exp 4) · ~20,486 per MinAtar net (Exp 5, computed from the stated architecture) · 1,480,274 (Go net, Exp 6) · ~131,072 edited of ~0.8B (Exp 8)." },
    ],
    4: [
      { kind: "p", text: "Parameter accounting: for layers d₀→d₁→…→d_L, P = Σᵢ (dᵢ·dᵢ₊₁ + dᵢ₊₁). Check Exp 1: 500·32+32 + 32·32+32 + 32·5+5 = 16,032 + 1,056 + 165 = 17,253 ✓. This bookkeeping matters because the reader consumed weights in grids - a 10×10 grid displays a 100-weight slice, so most of θ reached the reader through aggregate statistics, not raw dumps." },
      { kind: "p", text: "Initialisation and activation choice shape what raw weights look like: tanh nets (Exp 1) keep weights in a smooth regime with saturating tails; ReLU MLPs (Exp 2) develop dead-unit columns; transformers (Exp 3) concentrate copying behaviour in specific head circuits. A reader can exploit these signatures - and the experiments’ toy layouts were chosen to make them legible." },
      { kind: "p", text: "The symmetry problem has a precise face: for MLPs, any permutation of hidden units π applied to (Wᵢ, Wᵢ₊₁) leaves f unchanged; for transformers, head permutations and residual-stream basis changes do the same. Astra’s copying-head success worked *because* composition scores are permutation-invariant - they survive the symmetry that defeats naive cell-by-cell reading." },
      { kind: "callout", badge: "schematic", title: "Failure mode to remember", text: "Two networks with identical behaviour can share almost no coordinates. So a weight reader must generalise across symmetries - and a *benchmark* must not accidentally reward matching a particular training seed. WSP-Bench-Lite (Ch 12) scores behaviour, never coordinate-identity." },
    ],
    5: [
      { kind: "p", text: "What is established: the parameter-function mapping, permutation symmetries, and mode connectivity are textbook (Frankle & Carbin 2019; Ainsworth et al. 2022 on Git Re-Basin). What is *not* established: that the mapping is invertible in any practical sense - reading behaviour from weights is underdetermined up to symmetries and behavioural equivalence classes." },
      { kind: "p", text: "The experiments deliberately escalate difficulty: 100-weight grids → 23,824 → 7.16M middle blocks → 270M-ish full transformers where raw reading *failed* (Exp 7). That escalation is the honest skeleton of the paper - the reading works where circuits are compositionally legible, and degrades where behaviour is distributed." },
      { kind: "p", text: "Research questions this chapter arms you for: (1) which behaviours are *identifiable* from θ at all - i.e. invariant to symmetries yet diagnostic of behaviour? (2) can identifiability be measured (e.g. mutual information between weight statistics and behaviour)? Nothing in the literature yet answers these for LLM readers - which is precisely the gap a good benchmark must probe." },
      { kind: "callout", badge: "review", title: "The review’s caveat, planted early", text: "Maier (5 Nov 2026) sorts the READ evidence as “weaker”: few trials, readable layouts, author-designed tasks. Read every READ claim in Chapter 4 with that prior." },
    ],
  },
};

export const ch02: Chapter = {
  slug: "2-how-weights-are-written",
  number: 2,
  part: 1,
  title: "How Weights Get Written - Three Old Ways, One New",
  kicker: "Optimization, trained writers, compilers… and now: reasoning.",
  minutes: 10,
  intro:
    "Before November 2026, weights were written in three ways: by optimization grinding downhill, by trained writer-models, or by compilers starting from formal programs. Weight-space programming proposes a fourth: a general-purpose LLM that reads θ, reasons, and writes Δ directly.",
  shared: [
    { kind: "figure", id: "fig-four-ways" },
    { kind: "module", id: "m2-two-ways" },
    { kind: "formula", id: "f-sgd" },
    { kind: "formula", id: "f-wsp" },
  ],
  levels: {
    1: [
      { kind: "p", text: "**Way ① - practice, practice, practice.** Imagine learning basketball by shooting a million hoops, with a coach whispering “a tiny bit more left” after every single shot. That is how networks learn today. The whisper is called a gradient; the tiny fix happens millions of times. It works, but it needs millions of examples and a mountain of electricity." },
      { kind: "p", text: "**Way ② - machines that study other machines.** You can build a machine whose *job* is to output good knob settings for other machines. Train it on thousands of examples of well-set consoles and it can guess settings for new ones. Clever - but this writer-machine had to be *trained*, which needs its own mountain of examples." },
      { kind: "p", text: "**Way ③ - recipe compilers.** If a machine’s wiring is simple enough, you can write the recipe first (“if ball is left of paddle, go left…”) and *compile* the recipe into knobs, exactly like a kitchen scale converts “2 cups of flour” into a number. The Tracr compiler does this for toy transformers. Beautiful - but only if you can write the full recipe, and only for toy wiring." },
      { kind: "p", text: "**Way ④ - the new one.** The paper says a general-purpose LLM can study a *grown-up* machine’s knobs (not a toy), understand what they do, and fix or write them by *reasoning* - the way a master piano tuner listens, thinks, and turns three pegs. No gradients. No training. Just understanding, then one deliberate edit." },
    ],
    2: [
      { kind: "p", text: "**① Optimization (SGD, Adam, Muon).** The default. Compute how wrong the model is, work out which direction each parameter should move to be slightly less wrong, take a tiny step, repeat - typically millions of steps over billions of examples. It is the only method that has ever produced frontier models; it is also slow, data-hungry, and gives you no human-readable explanation of what changed." },
      { kind: "p", text: "**② Trained writers.** Hypernetworks (Ha et al., 2016) are networks that output other networks’ weights. Fast-weight programmers (Schlag et al., 2021) let a transformer write temporary weights as it runs. Neural network diffusion (Wang et al., 2024) generates whole weight sets from a learned distribution. All share one requirement: *someone had to train the writer first*, on lots of examples of networks." },
      { kind: "p", text: "**③ Compilers.** Tracr (Lindell et al., 2023) compiles a program written in RASP directly into transformer weights - a genuine “weights from recipe” path, but only for the formal, hand-written programs and toy architectures it supports." },
      { kind: "p", text: "**④ Weight-space programming (WSP).** The paper’s claim: a general-purpose LLM, given the weights (or slices of them) plus a plain-language task, produces an edit Δ by reasoning - optionally checking itself with a handful of forward passes. The writer was never trained to write weights; it learned to understand code, math, and systems, and *transfers* that understanding to weight space." },
      { kind: "callout", badge: "paper", title: "Why “fourth way” matters", text: "Ways ①–③ each write weights *without understanding them the way a person does*: ① follows gradients, ② generalises from examples, ③ follows rules. Way ④ claims understanding-first writing - with explanations you can read. That is the discontinuity, and the burden of proof." },
    ],
    3: [
      { kind: "p", text: "**① in symbols:** θ_{t+1} = θ_t − η∇L(θ_t). SGD and its cousins (Adam’s moment estimates, Muon’s orthogonalised updates) differ in *how* they shape the step, not in the loop: data → loss → gradient → tiny step. Training run = ~10⁶+ such steps; PPO for the MinAtar baselines took **100M–500M steps**." },
      { kind: "p", text: "**② formally:** a writer g_φ(z) → θ maps a spec or seed z to parameters. Hypernetworks condition z on the target architecture; fast-weight programmers make z the *running context* (weights written per-token); diffusion over weights learns p(θ|task) from many trained networks. All inherit a core limitation: their quality is capped by the writer’s training distribution." },
      { kind: "p", text: "**③ formally:** Tracr lifts a RASP program through a fixed compilation scheme into W_QK/W_OV matrices - every compiled weight is *interpretable by construction*, and the compiler emits the causal Scrubbable Belief Layer alongside. The catch: writing a RASP program for real-language competences is believed impossible today; it works on toy tasks like sorting and dyck-languages." },
      { kind: "p", text: "**④ formally:** θ′ = θ + Δ, Δ = LLM(θ, spec, optional feedback). Three structural novelties: the writer is *general-purpose* (not trained on weight outputs), the edit is *conditioned on the actual current θ* (unlike ② at inference), and the process yields a *reasoning trace* - an inspectable explanation (see Ch 7 for how the reported mechanisms split into compile-a-program vs subtract-a-direction)." },
    ],
    4: [
      { kind: "p", text: "Cost comparison, in the paper’s own numbers: PPO needed 100M–500M environment steps to reach 15.8–25.3 on MinAtar Breakout; the LLM wrote a policy scoring 517.4 in **one shot with zero environment steps** (Exp 5) - and up to 50 forward passes for the Go policy (Exp 6). While PPO required iterative gradient updates over massive rollout histories, the LLM synthesized functioning policy weights through direct symbolic reasoning with zero gradient descent." },
      { kind: "p", text: "Context-window reality check: weights must *reach* the reasoner. Exp 3 fed 7.16M parameters (middle blocks only, running banned); Exp 8 could not read 0.8B parameters wholesale - the edit worked on two selected MLP blocks (131,072 weights). So “LLM reads the model” is really “LLM reads surgical slices plus summary statistics”. Any production WSP needs tooling: slicing, aggregation, and selective read-out - the paper’s logs are effectively that tooling, hand-rolled." },
      { kind: "p", text: "Where each writer breaks: ① fails silently on distribution shift, needs full data passes, and its edits are unreadable; ② needs a training corpus of target-like networks - nonexistent for most real tasks; ③ needs formal specs; ④ has *no convergence guarantee*: a reasoned Δ can be confidently wrong, and errors don’t shrink to zero without the feedback loop (which is exactly what the 0–50 pass budget curve measures)." },
      { kind: "callout", badge: "review", title: "The novelty test to keep asking", text: "The review’s sharpest question: for each reported edit, could the same effect come from a *cheap standard alternative* - a decoding change, a known direction ablation, or the same heuristic written as ordinary code? Until that’s answered, “WSP works” ≠ “WSP is the right tool”." },
    ],
    5: [
      { kind: "p", text: "Position WSP honestly in the literature: it is closest to ②’s “generation” branch of the weight-space learning survey (arXiv 2603.10090 [VERIFY]), but with the writer *untrained* for weight generation - closer in spirit to program synthesis conditioned on a runtime artefact. The right null hypotheses are Tracr-style compilation (for WRITE) and ROME-style closed-form edits (for FIX): both predate WSP and both produce surgical, explained edits *when their assumptions hold*." },
      { kind: "p", text: "The interesting theoretical question is not “can an LLM edit weights” (any optimizer can) but **what class of edits is reachable by reasoning about θ alone, at what fidelity, and with what verification**. The paper’s own verification patterns - copying-head ground truth (Exp 3), token-limit share (Exp 8), negative control (Gemma) - are the beginnings of an answer, and the most reusable part of the work." },
      { kind: "p", text: "Strategic note for researchers: the benchmark-and-harness gap is the field’s binding constraint. Until third parties can evaluate WSP on author-blind tasks with baselines and seeds (WSP-Bench-Lite, Ch 12), every “fourth way” claim - however exciting - rests on the authors’ own demonstrations. Design the eval before scaling the claim." },
    ],
  },
};
