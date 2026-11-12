import type { Chapter } from "../types";

export const ch12: Chapter = {
  slug: "12-hets-lab",
  number: 12,
  part: 4,
  title: "Het’s Lab - Three Runnables and a Benchmark Proposal",
  kicker: "My own additions, clearly marked: three Python labs and WSP-Bench-Lite.",
  minutes: 9,
  intro:
    "Everything in this chapter is mine (Het’s Lab), not the authors’: three tiny runnable labs that make the paper’s mechanisms tangible, and a community benchmark proposal - WSP-Bench-Lite - designed to close exactly the gaps the independent review found.",
  shared: [
    { kind: "table", id: "wsp-bench" },
    {
      kind: "code",
      lang: "json",
      badge: "speculation",
      caption: "WSP-Bench-Lite - JSON task schema (draft proposal).",
      source: `{
  "task_id": "FIX-kine-ramp-01",
  "track": "FIX",
  "author_team": "alpha",          // NEVER the evaluated team
  "target": {
    "family": "mlp",               // mlp | transformer | ddpm_head
    "shape": [679, 128, 640, 16],
    "init": "ppo_trained",
    "defect": "seeded: ramp_thruster_sign_flip"
  },
  "spec": "The car fails the ramp. Fix it.",
  "budget": { "forward_passes": 10, "reasoning_tokens": null },
  "baselines_required": ["random_direction_ablation",
                          "standard_direction_ablation",
                          "decoding_tweak", "human_interpreter"],
  "metrics": ["success_rate", "edit_sparsity_s", "functional_drift_D",
              "budget_curve_fidelity_n", "cost_usd"],
  "seeds": 5,
  "report": { "pre_registered_prompt": "sha256:...", "public_logs": true }
}`,
    },
  ],
  levels: {
    1: [
      { kind: "p", text: "Reading about machines is fine - *playing* with them is better. I wrote three tiny programs you can run on any computer with Python: one builds a game machine by hand (the paddle idea from Chapter 7); one performs the “remove one bad direction” surgery on a pile of random numbers; and one does the paper’s arithmetic that says the maths-machine was fixed by changing 1 knob in 6,000. Each is under 15 lines. Nothing to install except NumPy." },
      { kind: "p", text: "The fourth thing in this chapter is bigger: a proposal for a **fair contest** - WSP-Bench-Lite. Contests need rules that stop cheating: the tasks must be made by people who aren’t competing; every attempt must be repeated several times; rival methods must be tried too; and everyone must publish their notes. That is exactly what the independent review said was missing from the paper - so I wrote the ruleset down." },
      { kind: "callout", badge: "speculation", title: "Who gets credit for what", text: "The three labs and WSP-Bench-Lite are mine (Het Patel), clearly marked, not the paper’s. They are a proposal (🟥) - no results exist yet, because that is the point of a benchmark: results come from the community running it." },
    ],
    2: [
      { kind: "p", text: "**Lab 01 - compile a rule.** A complete paddle-following network written as numbers, by hand, with the asserts passing: run it and you have a Breakout-ish brain in 17 numbers. It makes the paper’s “reason → program → compile” mechanism concrete - you are the reasoner this time. **Lab 02 - direction surgery.** Ten lines that remove a direction u from a random matrix: the printout shows uᵀW′ ≈ 1e-16 after surgery, and shows the sparsity/energy trade-off when you only edit the top-k columns - the exact operation class of Experiment 8." },
      { kind: "p", text: "**Lab 03 - blast radius.** The paper’s arithmetic: 131,072 edited out of 0.8B = 0.016%. Run it and see where the 131,072 comes from (2 layers × 64 columns × 1024 - hidden size inferred, flagged for verification), and how tiny the fraction really is. **Then WSP-Bench-Lite**: three tracks (Read/Fix/Write), tasks authored by non-competing teams, ≥5 seeds, mandatory baselines (including “the same trick written as ordinary code”), metrics that include edit sparsity and functional drift, pre-registered prompts, public logs." },
      { kind: "p", text: "Why the boring rules matter: every one of them exists because its absence is how the review deflated a claim. Author-blind tasks kill the “author-designed” confound; seeds kill n=1; baselines kill “works” without “works better than a 20-line script”; drift D catches edits that fix the symptom and break the neighbour. The benchmark is the review, turned into a protocol." },
      { kind: "callout", badge: "schematic", title: "Run them yourself", text: "All three labs ship in this site’s download (lab/ folder) and are mirrored on the Lab page with copy buttons. Verified running on Python 3.12 + NumPy 2.x; each finishes in under a second." },
    ],
    3: [
      { kind: "p", text: "**Lab 02’s mathematics, in the open:** the full projection W′ = W − u(uᵀW) zeroes u’s contribution exactly (to float precision - the printed max |uᵀW′| ≈ 1e-16); the sparse variant edits only the k columns with the largest |uᵀW|, leaving the remaining u-energy at ‖uᵀW′‖/‖uᵀW‖ (≈0.74 at k=8, d_ff=64 in the shipped code). That residual-energy curve is the sparsity/efficacy frontier Experiment 8 sat on - the lab lets you draw it yourself by varying k." },
      { kind: "p", text: "**The three metrics that make WSP-Bench-Lite honest:** edit sparsity s = ‖Δ‖₀/P (is the edit surgical?); functional drift D = E_x KL(p_θ ‖ p_θ′) over a held-out probe distribution (is it *contained*?); and fidelity(n) - the budget curve (is it *efficient*?). Success without sparsity is just fine-tuning; success without drift control is a safety problem; success at any cost is not the claim under test." },
      { kind: "p", text: "**Scoring template (one page, in the table):** each track scores {success, s, D, fidelity(n), cost} per task, geometric-meaned within track, then reported per track - never averaged across tracks (a great Fixer is not automatically a great Writer; averaging would launder weakness). Leaderboards show baseline rows pinned at the top: beating a random-direction ablation is the entry bar, not the finish line." },
    ],
    4: [
      { kind: "p", text: "Implementation notes for anyone building the harness: (1) *task isolation* - targets ship as seeded generators (script + seed), not checkpoints, so authors cannot overfit a particular training run; (2) *defect seeding* - FIX tasks inject known defects (sign flips, dead columns, injected loops) so ground truth for “what changed” exists; (3) *drift probes* - D is measured on a frozen, task-unrelated probe set shipped with the task, so participants cannot game it; (4) *log format* - every attempt publishes {prompt, reasoning trace, Δ coordinates, budget curve, seeds} as JSONL; the sha256 of the prompt is pre-registered before the run." },
      { kind: "p", text: "Honest budget for the whole thing: initial rollout with 30 tasks (10 per track) at 270M-and-below model scale is a few GPU-weeks - small-model WRITE/FIX tasks need only CPU-class training for baselines. The expensive part is human: recruiting non-competing task authors and holding the task set private between evaluation windows. Governance idea: rotating stewards, tasks licensed CC BY 4.0 after their retirement from the live set (same model as some capture-the-flag competitions)." },
      { kind: "p", text: "Failure modes of the benchmark itself, so we are not naive: overfitting to the task *distribution* (mitigate: rotating task families); metric gaming on D (mitigate: frozen probe sets + a held-out secret probe set for post-hoc audits); baseline sandbagging (mitigate: community-reviewed baseline implementations, at least two independent ones). A benchmark is a claim about measurement; it must hold itself to its own standard." },
      { kind: "callout", badge: "speculation", title: "The offer", text: "If you want to build or fund this: the schema above is open and I will maintain a public issues list. The whole point of Het’s Lab is that the *next* experiments should not be mine or the authors’ alone - that is what the review actually demanded." },
    ],
    5: [
      { kind: "p", text: "Design rationale, mapped gap-to-rule: review gap “other LLMs” → multiple-participant requirement; “human/automated baselines” → mandatory baseline rows incl. human_interpreter; “repeated runs” → ≥5 seeds with spread reporting; “cheaper alternatives” → decoding_tweak + standard_direction_ablation; “tasks not designed by the authors” → author_team ≠ evaluated_team, enforced by task provenance; “over-trust in explanations” → the reasoning trace is *logged* but *never scored* as evidence - only the measured Δ and its effects count. Rule 6 is the benchmark’s soul: narratives are data for study, not proof of mechanism." },
      { kind: "p", text: "The two results I most want from this proposal, both informative either way: (1) does any participant beat standard_direction_ablation on FIX with statistical separation? (if no - the field’s flagship demo is an interface to known surgery, and *that* finding reframes everything); (2) does WRITE performance survive author-blind, procedurally novel task families? (if no - recall, not reasoning, carried the games; if yes - Chapter 6’s W2 claim graduates to evidence). Both outcomes move science; few benchmarks can promise that symmetry." },
      { kind: "p", text: "Position vs prior art: this is deliberately *Lite* - a 30-task, ≤270M-scale, three-track protocol, in the spirit of small transparent benchmarks over monolith ones. The natural extension path: a WRITE track at 1–10M parameters (paper’s demonstrated frontier), then a FIX track against *organically* broken models (not seeded defects) once the harness is trusted. Keep every stage small enough that a PhD student can replicate the whole leaderboard on a department cluster - the day that stops being true is the day the benchmark stops doing its job." },
    ],
  },
};

export const ch13: Chapter = {
  slug: "13-glossary-quiz-refs",
  number: 13,
  part: 4,
  title: "The Library - Glossary, Quiz, References, Open Items",
  kicker: "Everything you need to go from reader to critic.",
  minutes: 6,
  intro:
    "The reference desk of the guide: sixty glossary terms, a fifteen-question quiz, every source with its verification status, and the honest list of things this guide could not verify.",
  shared: [
    { kind: "callout", badge: "paper", title: "The primary sources, once more", text: "The original post (2 Nov 2026), the released logs, the edited model on Hugging Face, and the live demo - all linked from the References page with verification status." },
    { kind: "callout", badge: "review", title: "The two reads that will make you a critic", text: "Andreas Maier’s measured-vs-anecdote review (5 Nov 2026) and Sean Goedecke’s deflationary essay. Read them back-to-back with the paper and you will never read a weights-can-be-written headline the same way again." },
    { kind: "callout", badge: "schematic", title: "How to use the library", text: "Quiz first if you like learning by being wrong; glossary when a term slips; references when you cite (always cite the original post for results - and badge what you cite, like this guide does)." },
  ],
  levels: {
    1: [
      { kind: "p", text: "Every big guide needs its library shelf: a **picture-dictionary** of the sixty words used across these chapters (each explained in one friendly line - find it under Glossary); a **quiz** of fifteen questions that starts gentle (“what’s a weight?”) and ends hard (“design the next experiment”) - wrong answers explain themselves; and a **sources shelf** listing every book, paper, and blog this guide used, each stamped with how much it should be trusted. There is even a short honest page listing the things *I* could not double-check myself." },
      { kind: "p", text: "That last page matters most: a guide that admits what it couldn’t verify is a guide you can trust on everything else. Check it whenever a number here surprises you - the surprise is usually one click away." },
    ],
    2: [
      { kind: "p", text: "The **Glossary** (60 terms) covers the arc from *parameter* to *WSP-Bench-Lite*, each in one or two plain sentences. The **Quiz** (15 questions) is calibrated to the guide: five on foundations, five on experiments, five on judgement and design - the last five are the ones that turn readers into reviewers. The **References** page lists ~45 sources: the primary post and its artifacts, the two independent reviews, and the research lineage (Elhage, ROME, LoRA, task arithmetic, Tracr, fast weights, refusal directions, the weight-space learning survey…), each with kind and verification status." },
      { kind: "p", text: "The **Open verification items** page is this guide’s honesty ledger: everything marked [VERIFY] anywhere in these chapters is listed there with what exactly is unconfirmed - for example, the arXiv ID of the weight-space learning survey and the hidden-size arithmetic behind 131,072. If you can resolve an item, the guide takes pull requests of the politest kind: a diff and a source." },
    ],
    3: [
      { kind: "p", text: "Using the library to study: the glossary is ordered by chapter-arc, so reading it start-to-finish is a one-page revision of the whole guide. The quiz’s answer explanations each cite the badge of the fact they test (🟦 for paper facts, 🟩 for review verdicts), which quietly trains the habit this guide most wants to install: *checking the provenance of every claim that persuades you*." },
      { kind: "p", text: "For citations in your own writing: results → cite the original post; verdicts about evidence strength → cite Maier’s review; the deflationary case → Goedecke; technique lineage → the primary papers (Elhage for induction heads, Arditi for direction removal, Meng for ROME, Ilharco for task vectors, Hu for LoRA). Cite this guide only for the teaching apparatus, the labs, and WSP-Bench-Lite - and say which." },
    ],
    4: [
      { kind: "p", text: "Reference hygiene notes for practitioners: the site embeds every source as structured data (the References page and the downloadable fact-sheet JSON), so downstream tools can diff claims against sources mechanically. The JSON-LD in each page marks the guide as a derivative scholarly work with its licence (CC BY 4.0 text, MIT code) - machine-readable honesty, not just badges." },
      { kind: "p", text: "If you extend the guide: keep the truth contract (four badges, colour + text + border, never colour alone), keep the ladder (five rungs per chapter), and keep the verification ledger - those three mechanisms are the guide’s actual contribution beyond the paper it explains. Break one and you have a blog post; keep them and you have an instrument." },
    ],
    5: [
      { kind: "p", text: "The research-student’s path out of this guide: (1) re-run lab 02 with k swept 1→64 and plot the residual-energy frontier - an afternoon; (2) pull the paper’s logs and extract the attempt-level record: how many directions were tried before layers 15/19? - the field’s first search-efficiency datapoint, sitting un-mined; (3) build one WSP-Bench-Lite READ task from a net you train yourself, and offer it to the pool. Each is a real contribution, sized for a week." },
      { kind: "p", text: "And the critic’s farewell: this guide exists because the paper did something rare - released its logs and chose the modest word “sparks”. Hold every future weights-can-be-written claim to that standard: artifacts public, mechanisms measured, controls negative, baselines run, seeds repeated. The paper mostly clears the bar it set itself. The bar is the part worth keeping." },
    ],
  },
};
