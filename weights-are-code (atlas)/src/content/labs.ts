export interface LabItem {
  id: string;
  file: string;
  title: string;
  blurb: string;
  badge: "schematic" | "paper";
  runs: string;
  code: string;
}

export const LABS: LabItem[] = [
  {
    id: "lab-01",
    file: "01_compile_a_rule.py",
    title: "Lab 01 · Compile a rule into weights",
    blurb:
      "A complete paddle-following network written by hand as 17 numbers - the miniature of the paper’s “reason → program → compile” mechanism. You are the reasoner this time.",
    badge: "schematic",
    runs: "Python 3.8+ · NumPy only · < 1 second",
    code: `# lab/01_compile_a_rule.py : hand-compile a paddle-follower into weights (TEACHING SCHEMATIC)
import numpy as np
relu = lambda z: np.maximum(z, 0.0)
W1 = np.array([[-1., 1.], [1., -1.]]); b1 = np.array([-0.05, -0.05])   # h0: ball left of paddle, h1: ball right
W2 = np.array([[1., 0.], [0., 0.], [0., 1.]]); b2 = np.array([0., 0.05, 0.])
ACTIONS = ["left", "stay", "right"]
def act(ball, paddle):
    h = relu(W1 @ np.array([ball, paddle]) + b1)
    return ACTIONS[int(np.argmax(W2 @ h + b2))]
assert act(0.2, 0.7) == "left" and act(0.8, 0.3) == "right" and act(0.5, 0.52) == "stay"
print("all asserts passed - your 17-number brain plays paddle")
`,
  },
  {
    id: "lab-02",
    file: "02_direction_surgery.py",
    title: "Lab 02 · Direction surgery",
    blurb:
      "Remove one direction u from a random MLP output matrix - the exact operation class of Experiment 8 - and watch the sparsity/energy trade-off when you only edit the top-k columns.",
    badge: "schematic",
    runs: "Python 3.8+ · NumPy only · < 1 second",
    code: `# lab/02_direction_surgery.py : remove one direction from an MLP output matrix
import numpy as np
rng = np.random.default_rng(0)
d_model, d_ff = 16, 64
W = rng.normal(size=(d_model, d_ff))
u = rng.normal(size=d_model); u /= np.linalg.norm(u)
W_full = W - np.outer(u, u @ W)                       # (I - u u^T) W
print("max |u^T W'| =", np.abs(u @ W_full).max())      # ~ 1e-16
k = 8; cols = np.argsort(-np.abs(u @ W))[:k]            # sparse variant: edit only k columns
W_sp = W.copy(); W_sp[:, cols] -= np.outer(u, u @ W[:, cols])
print(f"edited {k}/{d_ff} columns; remaining u-energy {np.linalg.norm(u @ W_sp) / np.linalg.norm(u @ W):.2f}")  # ~0.74
`,
  },
  {
    id: "lab-03",
    file: "03_blast_radius.py",
    title: "Lab 03 · Blast-radius arithmetic",
    blurb:
      "The paper’s headline fraction, computed: 131,072 edited weights out of ~0.8B - and where 131,072 comes from. One [VERIFY] flag included, on purpose.",
    badge: "paper",
    runs: "Python 3.8+ · no dependencies · instant",
    code: `# lab/03_blast_radius.py : sparsity arithmetic (paper-reported numbers)
edited, total = 131_072, 0.8e9
print(f"{edited/total:.4%}")                           # 0.0164%  (paper rounds to 0.016%)
print(2*64*1024)                                       # 131072 = 2 layers x 64 columns x 1024 (hidden size = inference, VERIFY)
`,
  },
  {
    id: "lab-04",
    file: "04_fingerprint_games.py",
    title: "Lab 04 · Fingerprint the four Atari games",
    blurb:
      "Recompute the Exp. 1 weight fingerprints directly from the authors' released prompt files on GitHub. Taking the L2 norm of the first-layer weights across 32 hidden units reveals the spatial signature of each game's paddle or agent.",
    badge: "paper",
    runs: "Python 3.8+ · NumPy & urllib · ~2 seconds",
    code: `# lab/04_fingerprint_games.py - recompute Exp. 1 weight fingerprints from released CSAIL logs
import numpy as np, urllib.request

BASE = "https://raw.githubusercontent.com/RikiyaT/lm_understand-logs/refs/heads/main/exp1_which_game/runs/{}/prompt.txt"
games = ["breakout", "pong", "pacman", "freeway"]

for game in games:
    lines = urllib.request.urlopen(BASE.format(game)).read().decode().split("\\n")
    i = next(k for k, l in enumerate(lines) if l.startswith("W1 (layer 1 weights)"))
    W1 = np.array([[float(x) for x in lines[i + 1 + r].split()] for r in range(500)])   # 500 inputs x 32 units
    agent = np.linalg.norm(W1, axis=1).reshape(10, 10, 5)[:, :, 0]                      # channel 0 = the agent
    rows, cols = agent.sum(1), agent.sum(0)
    print(f"{game:9s} strongest row {rows.argmax()} ({rows.max()/rows.sum():.0%})   strongest col {cols.argmax()} ({cols.max()/cols.sum():.0%})")
`,
  },
];

export const BENCH_SPEC = {
  intro:
    "A community benchmark proposal (clearly Het’s, not the authors’): three tracks, author-blind tasks, ≥5 seeds, mandatory baselines, public logs - every rule answers a gap the independent review named.",
  rules: [
    "Three tracks: READ (identify behaviour from weights), FIX (repair a seeded defect), WRITE (produce a working policy from a spec).",
    "Tasks are authored by non-competing teams; task sets rotate and are held private between evaluation windows.",
    "≥5 seeds per condition; report means and spread - never single runs.",
    "Multiple LLM participants; at least two independent baseline implementations.",
    "Mandatory baselines: decoding tweaks, standard direction ablation, human interpreter, the same heuristic as ordinary code.",
    "Metrics: success rate, edit sparsity s = ‖Δ‖₀/P, functional drift D, budget-curve fidelity(n), cost.",
    "Pre-registered prompts (sha256 before runs); public JSONL logs: prompt, trace, Δ coordinates, budget curves, seeds.",
    "Reasoning traces are logged for study but never counted as evidence - only measured Δ and its effects score.",
  ],
};
