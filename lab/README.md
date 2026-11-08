# 🧪 The Lab: Reproducible Weight-Space Experiments

Four tiny, self-contained Python experiments that make the paper's core mechanisms tangible on any machine. Each script is under 20 lines, requires only **NumPy**, and executes in under a second.

All scripts are verified across **Python 3.8 – 3.12** and **NumPy 1.x / 2.x**.

---

## ⚡ Quick Execution

```bash
# Lab 1: Hand-compile a 17-parameter neural policy directly from logic
python 01_compile_a_rule.py
# -> all asserts passed - your 17-number brain plays paddle

# Lab 2: Perform rank-1 direction surgery on a weight matrix
python 02_direction_surgery.py
# -> max |u^T W'| ≈ 1e-16 · edited 8/64 columns; remaining u-energy 0.74

# Lab 3: Calculate the parameter blast radius & verify the 0.016% arithmetic
python 03_blast_radius.py
# -> 0.0164%  ·  131072

# Lab 4: Recompute Exp 1 Atari weight fingerprints from released MIT CSAIL logs
python 04_fingerprint_games.py
# -> Recomputing Exp 1 Atari weight fingerprints from released CSAIL logs...
```

---

## 🔬 Lab Registry & Evidentiary Standard

| Script | Mechanism Demonstrated | Evidence Badge | Description |
|---|---|:---:|---|
| [`01_compile_a_rule.py`](01_compile_a_rule.py) | **WRITE Verb**: Symbolic Compilation | 🟨 TEACHING SCHEMATIC | Hand-compiles a Pong paddle tracking policy into a $2 \times 2 \times 2$ neural network ($17$ numbers) with zero training data. Mirrors Whitepaper §7. |
| [`02_direction_surgery.py`](02_direction_surgery.py) | **FIX Verb**: Rank-1 Projection | 🟨 TEACHING SCHEMATIC | Implements the closed-form projection operator $W' = (I - uu^T)W$ plus sparse top-$k$ column selection. Mirrors Experiment 8's operator class. |
| [`03_blast_radius.py`](03_blast_radius.py) | **MEASURE**: Sparsity Arithmetic | 🟦 PAPER-REPORTED | Verifies the $131,072 / 800,000,000 = 0.01638\%$ parameter edit budget across Layers 15 & 19 of Qwen3.5-0.8B. |
| [`04_fingerprint_games.py`](04_fingerprint_games.py) | **READ Verb**: Weight Fingerprinting | 🟦 PAPER-REPORTED | Fetches raw $W_1$ weight matrices from the authors' released logs and decodes the agent spatial receptive fields for Breakout, Pong, Pac-Man, and Freeway. |

---

## 💡 Recommended Extensions for Research & Classrooms

1. **Energy-Sparsity Frontier**: Sweep $k$ from 1 to 64 in `02_direction_surgery.py` and plot the residual attractor energy vs. parameter sparsity frontier.
2. **Hugging Face Model Surgery**: Load a small open checkpoint (e.g. `Qwen/Qwen2.5-0.5B`) and project out the top singular direction of a target MLP block.
3. **Multi-Rule Neural Synthesis**: Hand-compile a composite rule (e.g., "track paddle AND avoid left wall hazard") into a 3-layer MLP and measure weight interference.
