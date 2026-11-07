# WSP-Bench-Lite - a community benchmark proposal

**Status: 🟥 SPECULATION - a proposal (v0.1).** WSP-Bench-Lite is an original contribution of
this project (**Het Patel / Hunterdii**), clearly *not* the paper authors'. No results exist
yet - producing them is the community's job. The full rationale lives in the whitepaper §12
and the site's Chapter 12.

## Why: each rule answers a gap named by the independent review (🟩)

| Gap in the evidence | Rule in WSP-Bench-Lite |
|---|---|
| "Other LLMs" | Multiple participants required per evaluation window |
| "Human / automated baselines" | Mandatory baseline rows: decoding tweak, standard direction ablation, random-direction control, human interpreter, same-heuristic-as-code |
| "Repeated runs" | ≥5 seeds per condition; report means **and** spread |
| "Cheaper alternatives" | The baseline rows double as the cheap-alternatives test |
| "Tasks designed by the authors" | Tasks authored by non-competing teams, held private between windows, rotating stewardship |
| "Over-trust in explanations" | Reasoning traces are logged for study but **never counted as evidence** - only the measured Δ and its effects score |
| "Blast radius unmeasured" | Metrics include edit sparsity `s = ‖Δ‖₀/P` |
| "Collateral damage unmeasured" | Metrics include functional drift `D = E_x KL(p_θ ‖ p_θ')` on frozen, task-unrelated probe sets |
| "Budget games" | Budget-curve fidelity `fidelity(n)` at pre-registered n ∈ {0, 10, 25, 50}; plot points, never interpolate |
| "Pre-registration" | Prompt sha256 registered before any run; public JSONL logs |

## The three tracks

| Track | Task type | Example | Mandatory baselines | Metrics |
|---|---|---|---|---|
| **READ** | Identify behaviour from weights alone | Which of 5 procedurally-generated games does this net play? | Human interpreter; automated receptive-field scanner; same heuristic as code | Accuracy, calibration, false-positive rate |
| **FIX** | Repair a seeded defect (known ground truth) | Injected sign-flip / dead-column / loop in an MLP policy | Decoding tweak; standard direction ablation; random-direction control | Success rate, sparsity `s`, drift `D`, cost |
| **WRITE** | Produce a working policy from a spec | A novel gridworld, rules held out by a third party | Random init + short training; best published checkpoint | Score, `fidelity(n)`, cost |

## Scoring template (one page)

Per task, per participant: `{success, s, D, fidelity(n), cost}` over ≥5 seeds.
Geometric-mean within track; **never averaged across tracks** (a great Fixer is not
automatically a great Writer). Leaderboards pin the baseline rows at the top: beating the
random-direction ablation is the entry bar, not the finish line.

## JSON task schema (v0.1)

```json
{
  "task_id": "FIX-kine-ramp-01",
  "track": "FIX",
  "author_team": "alpha",
  "target": {
    "family": "mlp",
    "shape": [679, 128, 640, 16],
    "init": "ppo_trained",
    "defect": "seeded: ramp_thruster_sign_flip"
  },
  "spec": "The car fails the ramp. Fix it.",
  "budget": { "forward_passes": 10, "reasoning_tokens": null },
  "baselines_required": [
    "random_dir_ablation", "standard_dir_ablation",
    "decoding_tweak", "human_interpreter"
  ],
  "metrics": [
    "success_rate", "edit_sparsity_s", "functional_drift_D",
    "budget_curve_fidelity_n", "cost_usd"
  ],
  "seeds": 5,
  "report": { "pre_registered_prompt": "sha256:...", "public_logs": true }
}
```

## Harness notes

- Targets ship as **seeded generators** (script + seed), never frozen checkpoints - no participant can overfit one training run.
- Drift probes are **frozen, task-unrelated sets** shipped with the task, so `D` cannot be gamed.
- Every attempt publishes `{prompt, trace, Δ coordinates, budget curve, seeds}` as JSONL.
- v0.1 scope: 30 tasks (10 per track) at ≤270M-parameter scale - a few GPU-weeks, CPU-class baselines.
- Governance: rotating stewards; tasks relicensed CC BY 4.0 after retirement from the live set.

## The two results to chase first (both informative either way)

1. Does any participant beat **standard direction ablation** on FIX with statistical separation?
   If not, the field's flagship demo is an interface to known surgery - a reframing worth having.
2. Does WRITE performance survive **author-blind, procedurally novel** task families?
   If not, recall carried the games; if yes, the generality claim graduates to evidence.
