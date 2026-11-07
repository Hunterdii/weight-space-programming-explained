# Security Policy

## Scope & Philosophy

The **Weight-Space Programming Showcase** is a scientific research and educational repository containing:
- Theoretical formulations and mathematical proofs (e.g. rank-1 projection operators).
- Standalone pedagogical Python demonstration scripts (`lab/`).
- Benchmark specifications (`bench/WSP-Bench-Lite.md`).
- A 24-page research whitepaper (`paper/weight-space-programming.pdf`).

**This repository does NOT host full-scale multi-billion parameter model checkpoints, binary weight files for production deployment, or automated tool-use agents with write access to production model weights.**

---

## Weight Modification & AI Safety Risks

Weight-space programming enables direct modification of neural network parameters without gradient descent. In the context of AI safety and security:

1. **Malicious Backdoors & Safety Guardrail Ablation**: Direct rank-1 projection operators could theoretically be repurposed to ablate safety alignment vectors (e.g., representation refusal directions).
2. **Repository Policy**: We strictly prohibit the publication of operational recipes, scripts, or weight-diff vectors specifically designed to disable safety guardrails, introduce covert backdoors, or weaponize frontier models. All discussions of alignment risks in this repository (e.g., Chapter 12 of the curriculum and `paper/figures/fig13_risks.pdf`) remain strictly defensive, conceptual, and focused on verifiable safety governance.

---

## Reporting a Vulnerability

If you discover a security vulnerability, epistemic integrity breach, or sensitive safety flaw relating to this repository:

1. **Do NOT open a public issue.**
2. Send a confidential report to `hunterdii@users.noreply.github.com`.
3. Include:
   - Description of the vulnerability or concern.
   - Specific commit hash and file paths affected.
   - Potential impact and reproduction steps.
4. You will receive an acknowledgment within 48 hours, followed by a remediation timeline.
