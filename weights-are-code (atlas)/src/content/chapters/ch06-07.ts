import type { Chapter } from "../types";

export const ch06: Chapter = {
  slug: "6-write",
  number: 6,
  part: 2,
  title: "WRITE - Policies Born From Pure Thought",
  kicker: "Experiments 5 and 6: game players written with zero data, zero gradients.",
  minutes: 11,
  intro:
    "The boldest claim in the paper: an LLM can write a working network from scratch - no data, no loss, no gradients - by reasoning about the task. On three MinAtar games it beat policies trained for 100M steps; on 9×9 Go it beat an equal-size PPO trained on 20M games.",
  shared: [
    { kind: "table", id: "exp5-minatar" },
    { kind: "formula", id: "f-compile" },
    { kind: "table", id: "exp6-go" },
    { kind: "figure", id: "fig-go-curve" },
  ],
  levels: {
    1: [
      { kind: "p", text: "**Writing a game player without ever playing.** Could you write down the exact numbers for a machine that plays Breakout - without letting the machine try even one round? That is what the LLM did. It thought about the game: ball left of paddle → move left. Ball right → move right. Then it *wrote those ideas as numbers* - 20,486 of them - into an empty machine. First try, no practice games: the machine scores 517 points. Machines that practised 100 million rounds score 15." },
      { kind: "p", text: "**Writing a Go player.** Go is harder - you must count liberties, spot atari, see the board. The LLM reasoned about the rules, wrote every number of a 1.5-million-knob machine from zero, and then let it play a few practice games (up to 50) to polish itself. Result: it beats machines that studied *20 million* real games." },
      { kind: "callout", badge: "paper", title: "Read that again, with the right amount of awe and doubt", text: "Both results are single runs, measured honestly, with strong trained baselines. The awe is justified; the doubt (single runs, author-designed tasks) is what Chapter 8 is for." },
    ],
    2: [
      { kind: "p", text: "**Exp 5 - MinAtar.** Three tiny games (Breakout, Seaquest, Asterix). For each, the LLM wrote a 600→32→32→6 tanh network starting from **all-zero weights** - no data, no loss function, no gradients, no rollouts. Scores (1,000-episode averages) against PPO baselines: Breakout **517.4** vs 15.8 (100M steps) and 25.3 (500M); Seaquest **53.1** vs 5.6 / 88.9; Asterix **53.2** vs 25.8 / 55.2." },
      { kind: "p", text: "So: it *crushed* Breakout, beat the 100M-step baseline on all three games, and roughly matched the 500M-step PPO on Asterix while losing to it on Seaquest (53.1 vs 88.9). Reading the table honestly is part of the fun - the win is real but uneven, not a uniform stomp." },
      { kind: "p", text: "**Exp 6 - 9×9 Go.** A 243→512×6→82 network (1,480,274 weights) written from zero in a Python sandbox, then allowed **0–50 forward passes** of self-play to refine. At 0 passes it already won the majority of games against two small PPO nets (54–55%); after 50 passes it beat even an **equal-size PPO trained on 20M games** (70–79%)." },
      { kind: "callout", badge: "review", title: "The Go numbers, from the released logs", text: "Vs the two small PPO nets: 54–55% at 0 passes → 81–84% at 50. Vs the equal-size PPO: 26–43% at 0 passes → 70–79% at 50. The honest headline: *with zero experience it loses to the big baseline; with 50 games of experience it beats it.* (🟩)" },
    ],
    3: [
      { kind: "p", text: "**Why zero-init matters.** Writing from θ = 0 means there is *no prior behaviour to preserve* - the purest form of the claim (nothing is being repaired or borrowed; every skill in the final network was placed by reasoning). It also makes the task easier to verify: the function is exactly what the written weights compute, no legacy circuits in the way." },
      { kind: "p", text: "**What “compile” means here.** The reasoning path (Ch 7) goes: understand the game → write pseudo-rules (“if the ball’s column < paddle’s column, push left”) → translate each rule into matrix rows with the right signs and thresholds → assemble W₁, b₁, W₂, b₂. The lab file 01_compile_a_rule.py is a human-written miniature of exactly this pipeline for a paddle-follower - 17 numbers that play passable Breakout." },
      { kind: "p", text: "**The budget, formalised (f-budget).** fidelity(n): quality vs allowed forward passes n ∈ {0, 10, 25, 50} in the Go sandbox. The paper reports the two endpoints plus the middle for Exp 8-style curves; for MinAtar the write was one-shot (n=0). Compare the baselines’ budgets: PPO consumed 100M–500M *environment steps* and 20M *games* respectively - the units differ, which is why the core distinction is *zero training run versus millions of gradient rollout steps*, not a simple compute ratio." },
      { kind: "callout", badge: "paper", title: "Shapes to keep in your head", text: "MinAtar net: 600 inputs (10×10×6 observation channels) → 32 → 32 → 6 actions ≈ 20,486 parameters (computed). Go net: 243 board inputs → six 512-wide layers → 82 move logits = 1,480,274 parameters (reported)." },
    ],
    4: [
      { kind: "p", text: "Confound worth taking seriously: MinAtar and Go are *public, well-documented* games, and the LLM has read thousands of pages about both - including published policies, reward tables, and hand-crafted heuristics. So “writing from scratch” may partly be *recalling and transpiling known recipes*. The experiment does not isolate that; a benchmark with *novel* game rules (procedurally generated, unpublished) would. Put that in the WRITE track of WSP-Bench-Lite: author-blind task families." },
      { kind: "p", text: "Score-shape honesty: Breakout 517.4 vs 25.3 is a 20× gap - but MinAtar Breakout scores are known to be heavy-tailed (a policy that never drops the ball snowballs). Seaquest tells the sobering story: the written policy (53.1) is *below* PPO-500M (88.9), and Asterix is a near-tie (53.2 vs 55.2). The correct claim is “a zero-shot written policy is competitive with heavily trained ones on some games”, not “beats RL”." },
      { kind: "p", text: "Go specifics: the equal-size PPO was trained on 20M self-play games - a genuinely strong baseline for 9×9 at this scale, which is why beating it at 50 passes (70–79%) is the paper’s most striking WRITE number. But n=1 and the range 70–79% comes from the review’s reading of the released logs, not the post’s headline table. Reproducing the Go evaluation is the single most valuable community task right now." },
      { kind: "callout", badge: "review", title: "What the review says about WRITE", text: "“Writing from a designed program” is listed as *strong* evidence - because the artifact exists and beats real baselines - while carrying the standing caveats: single runs, no seeds, and the recall-vs-reason confound above. Also unaddressed: does the written policy *generalise* off-distribution the way trained ones (sometimes) do?" },
    ],
    5: [
      { kind: "p", text: "Treat WRITE as two separable claims: (W1) *feasibility* - an LLM can produce working weights for structured, well-specified games. Evidence: strong (three games + Go, all beating at least the 100M-step baseline). (W2) *generality* - this extends to tasks without public strategy literature. Evidence: none yet. Almost all public enthusiasm conflates the two; a good reviewer never will." },
      { kind: "p", text: "The most informative next experiment I can think of (🟨 proposal): procedurally generate 50 novel gridworlds with random-but-learnable rule twists (unpublished, held out by a third party). Give each WSP system the rules sheet only. Compare against PPO 10M steps, a random policy, and a *human-written heuristic* baseline. Success on novel rules moves the claim from W1 to W2; failure localises it honestly. This is the WRITE track of WSP-Bench-Lite, exactly." },
      { kind: "p", text: "Mechanism note for follow-ups: the post describes the Go policy’s internals as liberty-counting and atari-detecting layers (see Ch 7) - i.e. the LLM *compiled a program it could state*. That makes WRITE the cleanest window into what LLM reasoning contributes: the reasoning trace is the spec. Publishing the full trace (the logs repo reportedly does) would let others test whether the trace *matches the weights’ actual behaviour* - a verifiable claim about faithfulness of self-explanation, which is rare and precious in interpretability." },
    ],
  },
};

export const ch07: Chapter = {
  slug: "7-how-did-it-do-it",
  number: 7,
  part: 2,
  title: "How Did It Do It? - Two Mechanisms",
  kicker: "reason → program → compile, versus reason → find a direction → subtract it.",
  minutes: 9,
  intro:
    "When the edits worked, how did the reasoning actually produce numbers? The paper reports two distinct mechanisms: compiling an understood program into weights (paddle predictor, Go liberties/atari), and locating a harmful direction to subtract (the math-loop fix). This chapter walks both, and flags how much is story versus measurement.",
  shared: [
    { kind: "figure", id: "fig-mechanism" },
    { kind: "module", id: "m4-compile-rule" },
    { kind: "code", lang: "python", badge: "schematic", caption: "lab/01_compile_a_rule.py - the hand-written miniature of the compile path (also in /lab).", source: `import numpy as np
relu = lambda z: np.maximum(z, 0.0)
W1 = np.array([[-1., 1.], [1., -1.]]); b1 = np.array([-0.05, -0.05])   # h0: ball left of paddle, h1: ball right
W2 = np.array([[1., 0.], [0., 0.], [0., 1.]]); b2 = np.array([0., 0.05, 0.])
ACTIONS = ["left", "stay", "right"]
def act(ball, paddle):
    h = relu(W1 @ np.array([ball, paddle]) + b1)
    return ACTIONS[int(np.argmax(W2 @ h + b2))]
assert act(0.2, 0.7) == "left" and act(0.8, 0.3) == "right" and act(0.5, 0.52) == "stay"` },
    { kind: "code", lang: "python", badge: "schematic", caption: "lab/02_direction_surgery.py - the subtract-a-direction path in 10 lines (also in /lab).", source: `import numpy as np
rng = np.random.default_rng(0)
d_model, d_ff = 16, 64
W = rng.normal(size=(d_model, d_ff))
u = rng.normal(size=d_model); u /= np.linalg.norm(u)
W_full = W - np.outer(u, u @ W)                       # (I - u u^T) W
print("max |u^T W'| =", np.abs(u @ W_full).max())      # ~ 1e-16
k = 8; cols = np.argsort(-np.abs(u @ W))[:k]            # sparse variant: edit only k columns
W_sp = W.copy(); W_sp[:, cols] -= np.outer(u, u @ W[:, cols])
print(f"edited {k}/{d_ff} columns; remaining u-energy {np.linalg.norm(u @ W_sp) / np.linalg.norm(u @ W):.2f}")` },
  ],
  levels: {
    1: [
      { kind: "p", text: "**Mechanism 1 - build a recipe, then turn it into numbers.** When the model had to *create* a machine, it first wrote itself a recipe in plain language: “if the ball is left of the paddle, go left; if it’s on you, stay.” Then it carefully translated each line of the recipe into actual knobs - a bit like turning “2 cups of flour” into exact numbers on a scale. For Go the recipes were harder: “count this stone’s breathings-spots; if a group has only one left, it’s in danger.” Then numbers." },
      { kind: "p", text: "**Mechanism 2 - find the troublemaker, remove it.** When the machine *already existed* but misbehaved, the model played detective: it looked for the part that kept whispering “go in circles” to the maths model, and it *unscrewed* that part from a handful of places. Not the whole machine - just the bit that fed the circle." },
      { kind: "p", text: "Notice: these are two very different superpowers. One writes whole machines from ideas. The other does keyhole surgery on machines that exist. Both were reported with their reasoning written out - which is unusual, and lets you check the story against the numbers." },
    ],
    2: [
      { kind: "p", text: "**The compile path (WRITE experiments).** For the paddle predictor and the Go policy, the reported reasoning runs: understand the game → state the rules you’d follow → compile those rules into weights. In Go the paper says the resulting layers carry *liberties* and *atari* concepts - i.e. the LLM’s stated strategy is visible in the weights’ structure. The miniature in this chapter (the paddle net above) is a human’s version of the same manoeuvre, so you can run and inspect it in seconds." },
      { kind: "p", text: "**The direction path (the math fix).** The reasoning located a direction u that layers 15 and 19 kept re-injecting - a thought loop - then subtracted u from the 64 most loop-carrying output columns in each of those layers. After the subtraction, uᵀW′ ≈ 0 on those columns: the loop’s fuel line is cut. That is exactly the single-direction technique from published refusal-removal work (Arditi et al. 2024) - aimed at a new target." },
      { kind: "callout", badge: "paper", title: "The two traces, in one line each", text: "Compile: “I’ll write a policy that tracks the ball and intercepts the landing point / counts liberties and treats atari as urgent.” Subtract: “I’ll find the direction whose re-injection causes the token loop and project it out of a few columns.” - paraphrased from the post’s descriptions; the logs carry the full versions." },
    ],
    3: [
      { kind: "p", text: "**Compile, mechanically.** A rule like “ball left of paddle → left” is a linear inequality: (paddle − ball) > margin ⇒ prefer action LEFT. Encoding: a hidden unit h₀ = ReLU((−1)·ball + 1·paddle − margin) fires exactly when ball < paddle − margin; the output row for LEFT reads h₀. Stack such detectors and you get a deep-ish net whose *weights are a literal transcription of pseudo-code* (formula f-compile). The interesting scientific object: the LLM performed this transcription across six 512-wide layers and 1.48M parameters without a compiler - the “compiler” is the reasoning process itself." },
      { kind: "p", text: "**Subtract, mechanically.** For a rank-1 projection the update is closed-form: W′ = (I − uuᵀ)W, Δ = −u(uᵀW), sparsity s = ‖Δ‖₀/P. The post reports the *aggregate* (131,072 weights, 0.016%) and the mechanism check (token-limit share), and the review notes the *exact per-column update* lives in the released logs. The lab file above reproduces the full projection and its sparse variant - 10 lines of NumPy, no LLM required, which is the point of the missing baseline." },
      { kind: "p", text: "**What separates a story from a mechanism:** the compile path is supported by the *artefact* (the written weights and their measured behaviour - the Go policy really plays Go); the subtract path is supported by a *mechanism check* (the token-limit share tracking the gains). In both cases the reasoning trace is *consistent* with the result - consistency being the weak form of verification; intervention being the strong form (they intervened, and the outcome moved as the trace predicted)." },
    ],
    4: [
      { kind: "p", text: "Faithfulness question you should not skip: a reasoning trace is a *narrative the model produced*, not a read-out of its computation (the model has no introspective access to its own forward pass). The paper’s traces could be right about the *artefact* (what the final weights do) while being generated by processes that never “represent” the rule - humans can write correct compiler output from fluent description without running the machine in their head. For WSP that is fine! The claim is about the artifact, not about phenomenology. But beware anyone who markets the trace as “the model understanding weights” - it is the *product* that matters, and the product is checkable." },
      { kind: "p", text: "Where the compile path could silently cheat: public strategies. If the effective Go policy mirrors known heuristics (liberties/atari weights from human Go literature), the LLM may be doing high-quality *retrieval + transpilation*, not novel synthesis. Cheap test: probe the policy on adversarial tsumego positions where textbook liberties-heuristics famously fail; a transpiled textbook will fail identically, a genuinely reasoned policy may diverge. Nobody has run this yet (🟨 proposal)." },
      { kind: "p", text: "Where the subtract path could silently cheat: the 50 feedback passes. Between passes, what got updated - the direction, the columns, both, or a hand-tuned coefficient? If the passes performed a *search* over candidate directions, the mechanism is closer to “LLM-guided random search” than “reasoning found it”, and the correct baseline is the same search with a random initialiser. The logs are the ground truth for this; reviewers should read them before citing the mechanism as established (the review made exactly this point)." },
      { kind: "callout", badge: "review", title: "The trustworthy pattern to copy", text: "The post’s own verification habits - copying-head ground truth in Exp 3, token-limit share in Exp 8, the Gemma control - are the reusable gold. Whenever you see a WSP claim anywhere, ask for the analogous measurement. If it’s missing, downgrade the claim one level of confidence. Every time." },
    ],
    5: [
      { kind: "p", text: "Research framing: the compile path is *program synthesis with weight-level denotation semantics*; the subtract path is *causal localisation + closed-form intervention*. Both have formal analogues (Tracr for the former; ROME/refusal-direction work for the latter). The paper’s genuine contribution is showing a general-purpose reasoner can execute both *without the formal machinery being supplied* - which suggests the missing science is a theory of *when reasoning substitutes for machinery*. Candidate answer: when the target circuit class is small, compositional, and has public priors." },
      { kind: "p", text: "The strongest critique I can construct of the mechanism narratives (steel-manning the skeptics): every reported trace is a *plausible generator story* selected post hoc from a model that also produces wrong traces constantly. Without a registry of *failed* attempts (tried direction u₁: no effect; u₂: no effect; u₃: effect), we cannot compute the reader’s search efficiency or its false-positive rate on intervention. The logs repo appears to contain attempt-level records - extracting that distribution is the single most valuable meta-analysis someone could run this month." },
      { kind: "p", text: "And the strongest defence (steel-manning the authors): the intervention outcomes are independently measured and repeatable from public artifacts (edited checkpoints on HF, logs on GitHub). Whatever the generative process, the *artefacts and their measured effects* are the claim - and those already justify “sparks”. That word keeps earning its place." },
    ],
  },
};
