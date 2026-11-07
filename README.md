<div align="center">

# 🧠 Weight-Space Programming (WSP)
### An Independent Research Showcase & Technical Field Guide
**Reading, Repairing, and Writing Neural Network Weights via Symbolic LLM Reasoning**

[![Live Interactive Guide](https://img.shields.io/badge/Live%20Explainer-hunterdii.github.io-success?style=for-the-badge&logo=github)](https://hunterdii.github.io/weight-space-programming-explained/)
[![Whitepaper PDF](https://img.shields.io/badge/Whitepaper-24--Page%20PDF-red?style=for-the-badge&logo=adobe-acrobat-reader)](paper/weight-space-programming.pdf)
[![Code License: MIT](https://img.shields.io/badge/code-MIT-blue.svg?style=for-the-badge)](LICENSE)
[![Content License: CC BY 4.0](https://img.shields.io/badge/content-CC%20BY%204.0-green.svg?style=for-the-badge)](LICENSE-CONTENT.md)
[![Status: v0.1 living document](https://img.shields.io/badge/status-v0.1%20living%20document-orange.svg?style=for-the-badge)](research/open-verification-items.md)
[![Facts Checked: 2026-11-05](https://img.shields.io/badge/facts%20checked-2026--11--05-purple.svg?style=for-the-badge)](docs/fact-sheet.md)

</div>

---

> **Independent Research & Educational Showcase**  
> Curated and authored by **Het Patel ([@Hunterdii](https://github.com/Hunterdii))**, MSc Data Science student.  
> Based on the seminal research discovery *"Sparks of Weight-Space Programming: LLMs can natively read & write neural network weights"* by **Rikiya Takehi, Jayden Teoh, Alex Zhang, and Omar Khattab (MIT CSAIL)**, announced on **2 Nov 2026**.  
> **All primary research discovery credit belongs to the MIT CSAIL authors.** This repository is an independent technical showcase and is not affiliated with, endorsed by, or sponsored by MIT CSAIL, OpenAI, or the original authors.  
> 🌐 **Live Interactive Website**: [https://hunterdii.github.io/weight-space-programming-explained/](https://hunterdii.github.io/weight-space-programming-explained/)

---

## 🌟 Executive Summary: The Weight-Space Paradigm Shift

For forty years (1986–2026), artificial neural networks were optimized exclusively in **function space**:
$$\min_{\theta} \mathcal{L}(\mathcal{D}; \theta) = \mathbb{E}_{(x, y) \sim \mathcal{D}} \left[ \ell(f_\theta(x), y) \right]$$
Parameters were treated as opaque floating-point numbers adjusted blindly via backpropagation across millions of iterative gradient steps.

On **2 November 2026**, MIT CSAIL demonstrated that frontier reasoning models (such as GPT-6 Astra and quantized Qwen models) possess the emergent capacity to treat raw neural network parameters as **symbolic source code**:
- **READ**: Accurately inferring policies, internal representations, and circuit topology directly from raw floating-point weight matrices without forward-pass execution.
- **FIX**: Diagnosing failure modes and excising runaway attractors via closed-form surgical operators—such as repairing Qwen3.5-0.8B on MATH-500 from **7.9% to 48.1%** by modifying only **0.016%** of its parameters with zero gradient steps.
- **WRITE**: Hand-compiling functional neural policies directly into parameter matrices from blank slates, beating reinforcement learning agents trained over tens of millions of frames.

This repository provides the open research artifacts, mathematical formulations, empirical scoreboards, academic critiques, and runnable Python experiments for Weight-Space Programming.

---

## 🧭 Repository Contents

| Section | Destination | Key Artifacts |
|---|---|---|
| **Live Explainer** | [Live Site](https://hunterdii.github.io/weight-space-programming-explained/) | 26 static routes, interactive knobs, Truth Filter, audience levels L1–L5 |
| **Whitepaper PDF** | `paper/weight-space-programming.pdf` | 24-page IEEE-typeset research monograph (671,051 bytes, SHA256: `D47BA732...`) |
| **LaTeX Sources** | `paper/` | `main.tex`, `references.bib`, 13 vector figures (`fig01` to `fig13`), figure scripts |
| **Runnable Labs** | `lab/` | Zero-dependency Python scripts: Lab 1 (Compile), Lab 2 (Surgery), Lab 3 (Blast Radius) |
| **Benchmark Schema** | `bench/WSP-Bench-Lite.md` | Standardized 3-track community benchmark protocol ($n \ge 5$ seeds, drift bounds) |
| **Quantitative Facts** | `docs/fact-sheet.md` | Granular metrics, parameters, and paper-reported numbers |
| **Honesty Ledger** | `research/open-verification-items.md` | Public tracking of unconfirmed claims, assumptions, and audit flags |
| **Community Health** | `CONTRIBUTING.md`, `CITATION.cff` | Truth Contract contribution guidelines, CC BY 4.0 license, BibTeX citation |

---

## 🛡️ The Epistemic Truth Contract

Every metric, diagram, and assertion in this project adheres to a strict four-badge epistemic classification:

| Badge | Classification | Description & Evidentiary Standard |
|:---:|:---|:---|
| 🟦 | **PAPER-REPORTED** | Directly stated in Takehi et al. (MIT CSAIL, 2 Nov 2026). Verified against primary text. |
| 🟩 | **INDEPENDENT REVIEW** | Verified or critiqued by external academic audit (e.g. Prof. Andreas Maier, 5 Nov 2026). |
| 🟨 | **TEACHING SCHEMATIC** | Simplified toy model, hand-crafted weights, or illustrative numerical example for learning. |
| 🟥 | **SPECULATION** | Theoretical hypothesis, roadmap prediction, or unverified extrapolation. |

---

## 📅 The 4-Era Evolution of Model Programming

```
ERA 1: 1986–2020 · Weights as Opaque Continuous Variables
   Loss L(θ) ──► Backprop ∇_θ L ──► SGD/Adam Optimizer ──► Iterative θ_{t+1}
   • Characteristics: Gradient descent in function space, opaque tensors, high compute.

ERA 2: 2021–2023 · Subspace Geometry & Linear Task Arithmetic
   Base W_0 ──► Low-Rank Adaptation (LoRA: ΔW = B·A) ──► Task Vectors (W_A - W_B)
   • Characteristics: Trajectories live in low intrinsic dimensions; linear composition.

ERA 3: 2022–2024 · Mechanistic Interpretability & Associative Editing
   Factual Triplet (s, r, o) ──► Activation Tracing ──► ROME / MEMIT: W' = W + Λ C⁻¹
   • Characteristics: Covariance-inverted associative rank-1 key-value updates.

ERA 4: 2026+ · Native Weight-Space Programming (WSP)
   Raw Weights W ──► LLM Symbolic Inspection ──► Surgical Operator W' = (I - uuᵀ)W
   • Characteristics: ZERO gradients, ZERO forward passes, direct symbolic reading & writing.
```

---

## 📐 Visual Architectural Schematics

### Schematics 1: The Three-Verb Operational Pipeline (Read · Fix · Write)

```
                                  ┌──────────────────────────────────────────────┐
                                  │       Frontier Reasoning Engine (LLM)        │
                                  │  (e.g., GPT-6 Astra / Qwen 27B / Claude)     │
                                  └──────┬───────────────────┬───────────────────┘
                                         │                   │
                      ┌──────────────────┴────────┐          │
                      │                           │          │
                      ▼                           ▼          ▼
            [ 1. READ PIPELINE ]        [ 2. FIX PIPELINE ]  [ 3. WRITE PIPELINE ]
            
        ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
Input:  │ Raw Parameter Tensors  │  │ Broken Policy / Model  │  │ Blank Weight Canvas    │
        │(Middle MLP/Attn Blocks)│  │ (e.g., Qwen 0.8B loops)│  │ (Weights initialized 0)│
        └───────────┬────────────┘  └───────────┬────────────┘  └───────────┬────────────┘
                    │                           │                           │
Operation:  │ Symbol Table Parsing      │ Attractor Subspace ID      │ Hand-Compiling Logic   │
            │ QK/OV Frobenius Norm      │ Rank-1 Projection Operator │ Coordinate Alignment   │
            │ Circuit Matching          │ W' = (I - uuᵀ)W            │ Symbolic Circuit Synth │
                    │                           │                           │
Output:     ▼                           ▼                           ▼
        • Game ID (Breakout 99%)    • 131,072 params edited     • 17-param Paddle Policy
        • Copying Heads Located     • MATH-500: 7.9% ➔ 48.1%    • 1.48M-param Go Player
        • Noise Shapes Decoded      • Timeouts: 93% ➔ 33.1%     • Zero Training Runs
```

### Schematics 2: Flagship Exp-8 0.016% Surgical Attractor Excision

```
Qwen3.5-0.8B (800,000,000 Parameters Total)
══════════════════════════════════════════════════════════════════════════════
Layer 01 ────────────────────────────────────────────────────────────────────┐
  ...                                                                        │
Layer 14 ────────────────────────────────────────────────────────────────────┤
Layer 15 [MLP Block] ──► 64 Columns Edited (65,536 Parameters)               │
Layer 16 ────────────────────────────────────────────────────────────────────┤ ──► Residual Stream
Layer 17 ────────────────────────────────────────────────────────────────────┤
Layer 18 ────────────────────────────────────────────────────────────────────┤
Layer 19 [MLP Block] ──► 64 Columns Edited (65,536 Parameters)               │
Layer 20 ────────────────────────────────────────────────────────────────────┤
  ...                                                                        │
Layer 24 ────────────────────────────────────────────────────────────────────┘
══════════════════════════════════════════════════════════════════════════════
Total Parameters Modified: 131,072 / 800,000,000 = 0.01638% ≈ 0.016%
Operation: W'_col = W_col - u(uᵀ W_col)  (Excises runaway 1D thinking attractor)
Result: MATH-500 lifts 7.9% ➔ 48.1% · Token limit timeouts collapse 93% ➔ 33%
```

---

## 🧮 Mathematical Formulations

### 1. Rank-1 Direction Projection Surgery (Exp 4 & Exp 8)
Given a weight matrix $W \in \mathbb{R}^{d_{in} \times d_{out}}$ and a identified 1D destructive attractor unit vector $u \in \mathbb{R}^{d_{in}}$ ($\|u\|_2 = 1$):
$$W' = (I - u u^T) W \quad \text{on column subset } S \subseteq \{1, \dots, d_{out}\}$$
$$\Delta W = -u (u^T W)|_S$$
The modified weights satisfy $u^T W' \approx 0$, projecting out activations along direction $u$ while preserving all orthogonal semantic subspaces.

### 2. Edit Sparsity & Parameter Blast Radius
The blast radius sparsity budget $s$ measures the fraction of model weights touched during surgery:
$$s = \frac{\|\Delta W\|_0}{P} = \frac{131{,}072}{800{,}000{,}000} \approx 0.01638\% \approx 0.016\%$$
- **Layer 15 MLP**: 64 columns $\times 1,024$ hidden dimension $= 65,536$ parameters.
- **Layer 19 MLP**: 64 columns $\times 1,024$ hidden dimension $= 65,536$ parameters.
- **Total Edit**: $2 \times 65,536 = 131,072$ parameters.

### 3. Induction Circuit Composition Score (Exp 3)
Following the Transformer Circuits framework (Elhage et al.), the copying capability of attention heads is quantified from static weights alone using the Frobenius norm ratio of the composite QK and OV matrices:
$$\mathrm{score}_{\mathrm{induction}} = \frac{\|W^{(2)}_{QK} W^{(1)}_{OV}\|_F}{\|W^{(2)}_{QK}\|_F \, \|W^{(1)}_{OV}\|_F}$$
Because this Frobenius metric is invariant to orthogonal coordinate rotations, the LLM identifies copying circuits directly from static floating-point tensors without execution traces.

### 4. Functional Drift Bound (Safety Contract)
To guarantee that surgical intervention does not cause catastrophic forgetting, functional drift $D$ across held-out evaluation tasks $\mathcal{P}_{eval}$ is bounded by KL divergence:
$$D = \mathbb{E}_{x \sim \mathcal{P}_{eval}} \left[ \mathrm{KL}(p_\theta(\cdot \mid x) \,\|\, p_{\theta'}(\cdot \mid x)) \right] < 0.05$$

### 5. Hand-Compiled Symbolic Policy (Lab 1)
Direct compilation of deterministic rules into a 2-layer ReLU feedforward network:
$$h = \mathrm{ReLU}(W_1 [b, p]^T + b_1), \qquad z = W_2 h + b_2$$
Where $b$ is ball position, $p$ is paddle position, and weights are synthesized directly from logic gates:
$$W_1 = \begin{bmatrix} 1 & -1 \\ -1 & 1 \end{bmatrix}, \quad b_1 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}, \quad W_2 = \begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}, \quad b_2 = \begin{bmatrix} 0 \\ 0 \end{bmatrix}$$

---

## 📊 The 8 Breakthrough Experiments Scoreboard

| # | Domain & Task | Target Architecture & Parameters | Intervention / Operation | Baseline Metric | Post-Intervention Result | Evidentiary Badge |
|---|---|---|---|---|---|:---:|
| **Exp 1** | **Read: Game Policy ID** | 4 PPO MLP policies ($17,253$ params each: Breakout, Pong, Pac-Man, Freeway) | $10 \times 10$ first-layer weight grid; no forward passes | Random guess ($25\%$) | **4/4 identified** (Breakout at $99\%$ confidence) | 🟦 PAPER-REPORTED |
| **Exp 2** | **Read: Diffusion Shapes** | 3 DDPM noise predictors ($23,824$ params each) | $12 \times 12$ center receptive field matrix inspection | Random guess ($33.3\%$) | **3/3 shapes identified** (correct boundary geometry) | 🟦 PAPER-REPORTED |
| **Exp 3** | **Read: Transformer Circuits** | 3 char-transformers ($7.16\text{M}$ params, 4 layers $\times$ 6 heads) | Middle block weight matrices; Frobenius composition score | Random head selection ($16.7\%$) | **6/6 languages identified**; copying heads match activation ground truth | 🟦 PAPER-REPORTED |
| **Exp 4** | **Fix: Robot Car Locomotion** | Kinetix actor MLP ($171,664$ params, $679 \to 128 \to 16$) | Single surgical edit touching $3.5\%$ of weights | $0 / 256$ climbs ($0\%$) | **$1,024 / 1,024$ climbs ($100\%$)** | 🟦 PAPER-REPORTED |
| **Exp 5** | **Write: MinAtar Policies** | $600 \to 32 \to 32 \to 6$ tanh network ($20,486$ params) | Weights synthesized from zero with zero training data | Breakout: $15.8$ (PPO 100M), $25.3$ (PPO 500M) | **Breakout: 517.4** ($>20\times$ lift over PPO 500M) | 🟦 PAPER-REPORTED |
| **Exp 6** | **Write: 9×9 Go Player** | $243 \to 512 \times 6 \to 82$ CNN/MLP ($1,480,274$ params) | Direct weight synthesis in Python execution sandbox | $0\%$ win rate vs trained PPO | **$70\% - 79\%$ win rate** vs PPO trained on 20M games | 🟦 PAPER-REPORTED |
| **Exp 7** | **Read: Sycophancy Twins** | 2 fine-tuned Gemma-3-270M models | Raw weights alone failed ($0/4$); succeeded with attention matrices | $50\%$ random guess | **$3/3$ honest vs sycophant separated** (Head 10.2: $94.3\%$ vs $0.75\%$) | 🟦 PAPER-REPORTED |
| **Exp 8** | **Fix: Qwen3.5-0.8B Overthinking** | Qwen3.5-0.8B ($800\text{M}$ params), thinking mode | Rank-1 surgery: $131,072$ params ($0.016\%$) across Layers 15 & 19 | MATH-500: $7.9\%$<br>GSM8K: $13.8\%$<br>Timeouts: $93.0\%$ | **MATH-500: 48.1%**<br>**GSM8K: 67.1%**<br>**Timeouts: 33.1%** | 🟦 PAPER-REPORTED |

---

## 🔍 Independent Academic Audit & Critical Review

While the results of Takehi et al. are revolutionary, independent peer audits have identified important empirical caveats:

### 1. Prof. Andreas Maier (FAU Erlangen-Nürnberg) Audit
- **Single-Seed Evaluation ($n=1$)**: All eight headline experiments were evaluated on a single random seed. Multi-seed runs across $\ge 5$ seeds are required to separate genuine weight programming from lucky initialization alignment.
- **Non-Monotonicity in IFEval**: In Exp 8, while MATH-500 showed monotonic gains across surgical refinement passes, instruction-following (IFEval) exhibited a sharp dip at 25 passes before recovering at 50 passes, suggesting unmonitored parameter interference.
- **Missing Baselines**: Exp 8 lacked comparison against simple decoding truncation (e.g. setting `max_tokens = 4096`) or standard PCA direction ablation without an LLM in the loop.

### 2. Deflationary Analysis (Goedecke / Independent Interpretability Community)
- **High-Dimension Bias**: Reading policies from first-layer weight grids is equivalent to finding the linear separator in input space, a task easily solved by inspecting sign patterns.
- **Clearing Chokes vs. Imparting Knowledge**: Negative control on Gemma-3-270M ($6.8\% \to 7.0\%$) proves that Exp 8 did not "teach math" to Qwen; it excised an artificial runaway attractor that was exhausting the token generation budget.

---

## 🧪 Runnable Zero-Dependency Python Labs

Located in the `lab/` directory, these pedagogical labs run on any machine with standard Python 3.8+ and NumPy in less than 2 seconds:

```bash
# Lab 1: Hand-compile a 17-parameter paddle player from pure symbolic logic
python lab/01_compile_a_rule.py

# Lab 2: Perform rank-1 direction surgery on an MLP weight matrix
python lab/02_direction_surgery.py

# Lab 3: Calculate the parameter blast radius and verify 0.016% sparsity
python lab/03_blast_radius.py
```

### Lab Summaries:
- **`01_compile_a_rule.py`**: Compiles an exact Pong paddle tracking policy into a $2 \times 2 \times 2$ neural network ($17$ parameters) with zero training data. Demonstrates the **WRITE** verb.
- **`02_direction_surgery.py`**: Implements the projection operator $W' = (I - uu^T)W$ on selected columns and validates that the attractor energy is reduced to $\approx 0$. Demonstrates the **FIX** verb.
- **`03_blast_radius.py`**: Computes the exact parameter budget across Qwen3.5-0.8B layers 15 and 19 ($131,072 / 800,000,000 = 0.01638\%$).

---

## 🔬 Community Benchmark: WSP-Bench-Lite

To address the single-seed limitations identified by Prof. Andreas Maier, we propose **WSP-Bench-Lite** (`bench/WSP-Bench-Lite.md`):

1. **Three Standardized Tracks**:
   - `READ`: Semantic identification of frozen networks (games, circuits, noise patterns).
   - `FIX`: Repairing deterministic failure modes with strict parameter budgets ($s < 1.0\%$).
   - `WRITE`: Zero-gradient policy synthesis evaluated over $>1,000$ test episodes.
2. **Mandatory Multi-Seed Protocol**: All benchmark submissions must report mean and standard deviation over $n \ge 5$ random seeds.
3. **Strict Functional Drift Bounds**: Surgical modifications must preserve non-target capabilities with drift $D < 0.05$.
4. **Verifiable Weight Diffs**: Submissions are evaluated via reproducible sparse coordinate arrays (`COO` format).

---

## 📖 Citation & References

If you reference this showcase, the field guide, or the WSP-Bench-Lite benchmark in your research, please cite both the original MIT CSAIL discovery and this showcase:

```bibtex
@article{takehi2026weightspace,
  title   = {Sparks of Weight-Space Programming: {LLMs} can natively read \& write neural network weights},
  author  = {Takehi, Rikiya and Teoh, Jayden and Zhang, Alex and Khattab, Omar},
  journal = {MIT CSAIL Research Notes},
  year    = {2026},
  month   = {nov},
  url     = {https://csail.mit.edu/research/sparks-weight-space-programming}
}

@software{patel2026wspatlas,
  title   = {Weight-Space Programming: Research & Technical Showcase},
  author  = {Patel, Het},
  year    = {2026},
  month   = {nov},
  url     = {https://github.com/Hunterdii/weight-space-programming-explained},
  note    = {Independent research monograph, 24-page whitepaper, and field guide}
}
```

A machine-readable `CITATION.cff` is co-located in the repository root.

---

## 📄 License

- **Code & Python Labs**: Released under the **[MIT License](LICENSE)**.
- **Text, Curricula, Whitepaper & Figures**: Licensed under **[Creative Commons Attribution 4.0 International (CC BY 4.0)](LICENSE-CONTENT.md)**.

---

<div align="center">
  <sub>Weight-Space Programming Showcase • Curated by Het Patel (@Hunterdii) • Built with Epistemic Integrity</sub>
</div>
