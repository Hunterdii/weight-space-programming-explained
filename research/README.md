# The Research Folder - structured data and the honesty ledger

Everything on the site and in the whitepaper binds to these files. If you want to check a
number, or extend the project with new claims, start here.

## Files

| File | What it is |
|---|---|
| `fact-sheet.json` | The single source of truth: source metadata, all 8 experiments, every reported table (MinAtar, Qwen budget, Gemma control, Go logs, sycophancy head 10.2), the 12-formula pack, the 60-term glossary, the 44-entry reference list, and the open verification items. The site's charts bind to this file (it is also served at `/data/fact-sheet.json`). |
| `references.md` | Every source with its verification status: primary (the post + its released artifacts), the two independent reviews, and the research lineage. |
| `open-verification-items.md` | The honesty ledger - everything that could not be independently re-opened at build time (fact-check date: 5 Nov 2026), exactly as it appears in the whitepaper's Appendix C. |
| `wsp-bench-lite.md` | The community benchmark proposal (clearly Het's, not the paper authors'): tracks, rules, scoring template, JSON task schema, and the rationale mapping each rule to a gap named by the independent review. |

## The truth contract (applies to every file here)

- 🟦 **PAPER-REPORTED** - stated in the original post (2 Nov 2026). Transcribed, not re-measured.
- 🟩 **INDEPENDENT REVIEW** - from a third-party analysis (principally the 5 Nov 2026 review).
- 🟨 **TEACHING SCHEMATIC** - invented toy data for explanation. Always marked "illustrative, not real data".
- 🟥 **SPECULATION** - predictions about the future, untested, including the original authors'.

If you extend this project: keep the badges, never present a schematic as data, and add any
new unverifiable claim to the open-verification ledger rather than letting it pass silently.
