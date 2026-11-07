# Contributing to Weight-Space Programming (WSP)

Thank you for your interest in contributing to the **Weight-Space Programming (WSP) Research Showcase & Field Guide**!

This project is an open, community-driven effort to advance the understanding and rigorous empirical verification of weight-space programming discoveries. We welcome contributions ranging from factual corrections and code enhancements to benchmark evaluations and new pedagogical modules.

---

## 🛡️ Epistemic Truth Contract & Badge Discipline

To protect against hype, misattribution, and unverified claims, this repository adheres to a strict four-tier Truth Contract. **Every contribution that introduces or modifies claims, numbers, or diagrams MUST declare its epistemic badge:**

| Badge | Classification | Standard of Evidence |
|:---:|:---|:---|
| 🟦 | **PAPER-REPORTED** | Directly stated and documented in the primary announcement (*Takehi et al., MIT CSAIL, 2 Nov 2026*). Requires exact citation and paper coordinates. |
| 🟩 | **INDEPENDENT REVIEW** | Verified or critiqued by external peer review (e.g. *Prof. Andreas Maier audit, 5 Nov 2026*). Requires independent reproduction or mathematical derivation. |
| 🟨 | **TEACHING SCHEMATIC** | Simplified toy model, hand-crafted weights, or illustrative numerical example designed for educational clarity. Must be explicitly flagged as non-production. |
| 🟥 | **SPECULATION** | Theoretical hypothesis, roadmap prediction, or research conjecture. Must never be presented as established empirical fact. |

### Contribution Integrity Rules
1. **Source Links Required**: Any factual correction or quantitative metric submitted must link to a primary paper, preprint, commit, or publicly accessible log.
2. **Never Add Unverified Numbers**: If a number is an estimate or unconfirmed, tag it explicitly with `[VERIFY]` and open an issue in `research/open-verification-items.md`.
3. **No Hallucinated Benchmarks**: All reported benchmark results must follow the WSP-Bench-Lite protocol with $n \ge 5$ seeds and reported drift $D < 0.05$.
4. **Zero Proprietary Site Code**: The public repository is reserved for research text, data, LaTeX, and runnable Python labs. Do not submit front-end website code (`.tsx`, `.jsx`, `.css`, or Webpack/Next.js configurations) here.

---

## 🛠️ Development & Submission Workflow

### 1. Factual Corrections
If you find a typo, outdated metric, or inaccurate attribution:
1. Check `docs/fact-sheet.md` and `docs/what-changed-since-launch.md` to see if it is already tracked.
2. Open a **Correction Issue** using the `.github/ISSUE_TEMPLATE/correction.yml` template, citing the primary source URL.
3. Submit a Pull Request updating the relevant markdown file with a link to your issue.

### 2. Python Labs (`lab/`)
All lab scripts must adhere to our zero-dependency design principle:
- Rely only on standard Python 3.8+ and `numpy`.
- Execute in under 2 seconds on consumer hardware.
- Include clear docstrings, variable definitions, and printable telemetry.

### 3. Pull Request Checklist
Before opening a PR, ensure:
- [ ] Epistemic badge (🟦, 🟩, 🟨, or 🟥) is assigned to new claims.
- [ ] Any changed numbers are backed by citations in `docs/fact-sheet.md`.
- [ ] Python scripts in `lab/` run cleanly without warnings.
- [ ] No website source code files (`.tsx`, `.jsx`, `.css`) are added.
- [ ] PR template is completely filled out.

---

## 📜 Code of Conduct
Please note that all contributors must follow our [Code of Conduct](CODE_OF_CONDUCT.md). Be respectful, collaborative, and scientifically honest.
