# The Lab - three runnable experiments

Three tiny Python files that make the whitepaper's mechanisms tangible. Each is under
fifteen lines, needs only NumPy, and finishes in under a second. All three are verified
running on Python 3.12 / NumPy 2.x.

```bash
python 01_compile_a_rule.py    # -> all asserts passed - your 17-number brain plays paddle
python 02_direction_surgery.py # -> max |u^T W'| ≈ 1e-16 · remaining u-energy 0.74
python 03_blast_radius.py      # -> 0.0164%  ·  131072
```

| Lab | What it is | Evidence badge |
|---|---|---|
| `01_compile_a_rule.py` | Hand-compiled paddle follower: the "reason → program → compile into weights" mechanism in 17 numbers (mirrors the whitepaper §7) | TEACHING SCHEMATIC (invented for teaching - **not** one of the paper's networks) |
| `02_direction_surgery.py` | Rank-1 direction removal `W' = (I − uuᵀ)W` plus the sparse top-k variant - the exact operation class of the paper's Experiment 8 | TEACHING SCHEMATIC (random toy matrix) |
| `03_blast_radius.py` | The paper's sparsity arithmetic: 131,072 / 0.8B = 0.016%, and where 131,072 comes from (with its `[VERIFY]` flag preserved) | PAPER-REPORTED numbers |

The same three files are also embedded in the companion site (`site/public/labs/`, served
at `/labs/…`) and printed in the whitepaper's Appendix D.

## Ideas for extension

- Sweep `k` from 1 to 64 in Lab 02 and plot the residual-energy frontier - an afternoon exercise that reproduces the sparsity/efficacy trade-off the flagship edit sat on.
- Load two small Hugging Face checkpoints and plot per-layer Δ sparsity and the top singular values of ΔW (no GPU needed for small models).
- Write Lab 04: a second rule (e.g. "avoid the left wall") compiled into the same network, then measure how many shared weights change.
