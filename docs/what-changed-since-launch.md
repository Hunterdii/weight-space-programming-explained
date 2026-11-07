# What Changed Since Launch

This document tracks updates, replication efforts, peer feedback, and specification revisions for the Weight-Space Programming (WSP) field guide and interactive atlas.

## 2026-11-07 - Deployment & Architecture Integrity
- Added production `netlify.toml` edge deployment routing with canonical 301 PDF redirects and custom 404 handler.
- Configured production HTTP security headers (CSP, HSTS, X-Frame-Options, Permissions-Policy).
- Enhanced repository documentation with the 4-era Illustrated WSP Progress Timeline and 3 architectural ASCII diagrams.
- Audited repository relative links and co-located release metadata (`CITATION.cff`, `LICENSE`, `LICENSE-CONTENT.md`).

## 2026-11-05 - Initial Field Guide Launch
- Released interactive 13-chapter educational guide across 5 audience difficulty levels.
- Published 24-page IEEE-style research whitepaper and 3 runnable Python reproduction labs.
- Formulated the 4-badge epistemic Truth Contract and public Honesty Ledger (`research/open-verification-items.md`).

## 2026-11-03 – 2026-11-05 - Community Audit & Independent Replications
- Simon Willison independently reproduced weight-reading on 4-bit quantized Qwen-2.5-32B on Apple Silicon.
- Prof. Andreas Maier conducted academic review analyzing single-seed variance, prompting the multi-seed protocol in `research/wsp-bench-lite.md`.

## 2026-11-02 - MIT CSAIL Announcement
- Initial research publication by Takehi, Teoh, Zhang & Khattab: *"Sparks of Weight-Space Programming: LLMs can natively read & write neural network weights"*.
