import type { Badge } from "./types";

export interface FormulaItem {
  id: string;
  name: string;
  latex: string;
  plain: string;
  legend: string[];
  example: string;
  badge: Badge;
}

/** Master prompt §8 - the formula pack. Each has a plain-English sentence, legend, and numeric example. */
export const FORMULAS: FormulaItem[] = [
  {
    id: "f-network",
    name: "A network and its weight space",
    latex: "f_\\theta(x),\\quad \\theta\\in\\mathbb{R}^{P}",
    plain: "A neural network is a function f whose behaviour is fully described by P numbers θ - its weights.",
    legend: ["f_θ - the network as a function", "θ (theta) - the P-dimensional vector of all weights and biases", "x - one input"],
    example: "GPT-scale models: P is billions. Exp 1’s game-reader: P = 17,253.",
    badge: "schematic",
  },
  {
    id: "f-sgd",
    name: "Training - how weights get written today",
    latex: "\\theta_{t+1}=\\theta_t-\\eta\\,\\nabla_\\theta\\mathcal{L}(\\theta_t)",
    plain: "Gradient descent nudges every weight a tiny step downhill on the loss, repeated millions of times.",
    legend: ["η (eta) - learning rate, the step size", "∇L - the gradient: which direction reduces the loss", "t - training step number"],
    example: "PPO needed 100M–500M steps to reach 15.8–25.3 on MinAtar Breakout.",
    badge: "paper",
  },
  {
    id: "f-wsp",
    name: "Weight-space programming",
    latex: "\\theta'=\\theta+\\Delta,\\quad \\Delta=\\mathrm{LLM}\\!\\left(\\theta,\\ \\text{spec},\\ \\text{optional feedback}\\right)",
    plain: "An LLM reads the weights, decides a full edit Δ in one reasoned shot, and writes θ′ - no gradient descent.",
    legend: ["θ′ - the edited weights", "Δ (delta) - the edit, produced by reasoning", "spec - the task description", "feedback - optional forward passes the editor may run"],
    example: "Exp 4: one Δ took a broken ramp-climber from 0/256 to 1,024/1,024 successes.",
    badge: "paper",
  },
  {
    id: "f-sparsity",
    name: "Edit sparsity - the “blast radius”",
    latex: "s=\\frac{\\lVert\\Delta\\rVert_0}{P}",
    plain: "What fraction of all weights did the edit touch? Smaller is surgical.",
    legend: ["∥Δ∥₀ - count of non-zero edited weights", "P - total parameters", "s - sparsity as a fraction"],
    example: "Exp 8: 131,072 / (0.8×10⁹) ≈ 1.6×10⁻⁴ = 0.016% of Qwen3.5-0.8B.",
    badge: "paper",
  },
  {
    id: "f-direction",
    name: "Direction removal (rank-1 projection)",
    latex: "W'=(I-uu^{\\top})W,\\qquad \\Delta=-u\\,(u^{\\top}W),\\qquad u^{\\top}W'=0",
    plain: "To kill a direction u, project every row of W so nothing along u survives - here shown as the teaching approximation; the post’s exact update lives in its released logs.",
    legend: ["u - the unit direction to remove", "I - uuᵀ - the projection that erases u", "W, W′ - a weight matrix before and after"],
    example: "lab/02_direction_surgery.py: after the full projection, max |uᵀW′| ≈ 1e-16.",
    badge: "schematic",
  },
  {
    id: "f-drift",
    name: "Functional drift of an edit",
    latex: "D=\\mathbb{E}_{x\\sim\\mathcal{P}}\\,\\mathrm{KL}\\!\\left(p_\\theta(\\cdot\\mid x)\\,\\lVert\\,p_{\\theta'}(\\cdot\\mid x)\\right)",
    plain: "How much did the model’s output distribution actually change on typical inputs? A small number says the edit was contained.",
    legend: ["D - average KL divergence", "p_θ, p_θ′ - output probabilities before/after", "𝒫 - the input distribution you care about"],
    example: "The post does not report D; WSP-Bench-Lite proposes it as a mandatory metric.",
    badge: "schematic",
  },
  {
    id: "f-lora",
    name: "LoRA - the familiar low-rank cousin",
    latex: "W'=W+\\tfrac{\\alpha}{r}BA,\\quad B\\in\\mathbb{R}^{d\\times r},\\ A\\in\\mathbb{R}^{r\\times k}",
    plain: "Instead of editing W directly, learn two thin matrices whose product is the edit - trained with gradients.",
    legend: ["r - rank, e.g. 8 or 16", "A, B - the learned factors", "α - scaling"],
    example: "A rank-8 LoRA on a 1024×1024 matrix trains ~16k numbers instead of ~1M.",
    badge: "paper",
  },
  {
    id: "f-taskarith",
    name: "Task arithmetic",
    latex: "\\theta_{\\text{new}}=\\theta_{\\text{base}}+\\lambda\\tau,\\qquad \\tau=\\theta_{\\text{ft}}-\\theta_{\\text{base}}",
    plain: "Add or subtract whole fine-tuning “task vectors” to steer a model - vector arithmetic on checkpoints.",
    legend: ["τ - the task vector (fine-tuned minus base)", "λ - how strongly to apply it"],
    example: "λ = −1 “forgets” a fine-tune; λ = +1 re-applies it (Ilharco et al., 2022).",
    badge: "paper",
  },
  {
    id: "f-rome",
    name: "ROME-style rank-one edit",
    latex: "\\Delta W=\\frac{(v^{*}-Wk^{*})(C^{-1}k^{*})^{\\top}}{(C^{-1}k^{*})^{\\top}k^{*}}",
    plain: "Model editing solves for the smallest weight change that makes key k* map to value v* - a closed-form nudge.",
    legend: ["k*, v* - the key and desired value", "C - the covariance of keys", "ΔW - a rank-one update"],
    example: "ROME edits single facts like “The Eiffel Tower is in Paris” without retraining (Meng et al., 2022).",
    badge: "paper",
  },
  {
    id: "f-induction",
    name: "Induction-head composition",
    latex: "\\mathrm{score}=\\frac{\\lVert W_{QK}^{(2)}W_{OV}^{(1)}\\rVert_F}{\\lVert W_{QK}^{(2)}\\rVert_F\\,\\lVert W_{OV}^{(1)}\\rVert_F}",
    plain: "Two heads in series can copy: head 1 moves [A][B] → [B], head 2 uses B to find the next B. This score finds such pairs from weights alone.",
    legend: ["W_QK - the query-key circuit of a head", "W_OV - the output-value circuit", "∥·∥_F - Frobenius norm"],
    example: "This is the human technique (Elhage et al. 2021) that Exp 3’s copying-head match echoes - and that Astra rediscovered from the weights.",
    badge: "paper",
  },
  {
    id: "f-compile",
    name: "A hand-compiled rule",
    latex: "h=\\mathrm{ReLU}(W_1[b,p]^{\\top}+b_1),\\quad z=W_2h+b_2",
    plain: "The paddle rule as an actual network: two hidden units (ball left / ball right of paddle) feeding three logits (left / stay / right).",
    legend: ["b, p - ball and paddle positions", "h - hidden activations", "z - action logits"],
    example: "See lab/01_compile_a_rule.py - 17 numbers that play a passable Breakout.",
    badge: "schematic",
  },
  {
    id: "f-budget",
    name: "The budget curve",
    latex: "\\mathrm{fidelity}(n)\\ \\text{vs.}\\ n\\ \\text{forward passes}",
    plain: "How good is the edit as the editor is allowed more forward passes? Only the reported points may be drawn - never a smooth interpolation.",
    legend: ["n - number of feedback passes allowed", "fidelity(n) - measured quality at that budget"],
    example: "Exp 8, n = 0/10/25/50: MATH-500 7.9 → 12.3 → 14.1 → 48.1. The dip at n=25 (IFEval 49.0 → 39.9) is why n=1 runs per point is a real caveat.",
    badge: "paper",
  },
];

export const FORMULA_BY_ID: Record<string, FormulaItem> = Object.fromEntries(FORMULAS.map((f) => [f.id, f]));
