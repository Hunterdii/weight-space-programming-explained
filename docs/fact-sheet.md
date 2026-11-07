# Weight-Space Programming: Verified Fact Sheet

**Last Verified**: 2026-11-05  
**Audit Source**: `research/fact-sheet.json` & `site/src/content/facts.ts`  
**Epistemic Standard**: Strict Four-Badge Truth Contract (Verified Empirical, Formal Definition, Theoretical Conjecture, Open Question)

---

## 1. Core Discovery
- **Paper**: *Sparks of Weight-Space Programming: LLMs can natively read & write neural network weights*
- **Authors**: Rikiya Takehi, Jayden Teoh, Alex Zhang, and Omar Khattab (MIT CSAIL)
- **Publication Date**: 2 November 2026
- **Central Finding**: Large Language Models can inspect raw floating-point weight matrices, localize computational circuits, excise degenerative attractor subspaces, and directly compile functional logic without gradient descent.

## 2. Experimental Verification Matrix (Exp 1–8)

| Exp # | Target Model / Task | Operation | Key Metric / Result | Evidence Tier |
|:---:|:---|:---|:---|:---:|
| **Exp 1** | Breakout Atari Policy | Read (Identification) | 99% accuracy identifying game from weight tensors | Verified Empirical |
| **Exp 2** | Toy Diffusion Model | Read (Noise Shape) | 3/3 noise trajectories decoded from raw weights | Verified Empirical |
| **Exp 3** | GPT-style Transformer | Read (Circuit Matching) | Copying induction heads localized across layers | Verified Empirical |
| **Exp 4** | Kinetix Robot Car | Fix (Subspace Surgery) | 3.5% parameter edit restored upright navigation | Verified Empirical |
| **Exp 5** | MinAtar Breakout | Fix (Policy Patch) | Reward score 517.4 vs standard PPO baseline 25.3 | Verified Empirical |
| **Exp 6** | Go Player Network | Write (Compilation) | 1.48M parameters compiled with 0 training runs | Verified Empirical |
| **Exp 7** | Sycophancy Benchmark | Fix (Safety Alignment) | De-sycophanted weights without degrading MMLU | Verified Empirical |
| **Exp 8** | Qwen3.5-0.8B Math Model | Fix (Attractor Excision) | MATH-500 score: 7.9% ➔ 48.1% (131,072 params edited) | Verified Empirical |

## 3. Mathematical Foundations
- **Projection Operator**: $W' = (I - uu^T)W$
- **Parameter Edit Budget**: $131,072 / 800,000,000 = 0.01638\%$ ($0.016\%$)
- **Excised Subspace**: 64 column directions in Layer 15 MLP and 64 column directions in Layer 19 MLP
- **Attractor Metric**: Spectral radius collapse from $\lambda_{max} > 1.4$ down to $\lambda_{max} \approx 0.98$

## 4. Benchmark Proposal
- **Benchmark**: WSP-Bench-Lite (`research/wsp-bench-lite.md`)
- **Evaluation Requirements**: Multi-seed testing ($n \ge 5$), drift bound $D < 0.05$, zero-training compilation.
