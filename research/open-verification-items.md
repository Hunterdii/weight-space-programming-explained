# Open verification items - the honesty ledger

Fact-check date: **5 Nov 2026**. These are everything this project could not independently
re-open or confirm at build time. Nothing here is hidden elsewhere in the project: wherever
an affected number appears, it carries its badge and, where relevant, an inline `[VERIFY]`
flag. If you can resolve an item, this project takes corrections with sources.

| # | Item | Where it appears | Status |
|---|---|---|---|
| 1 | The primary post URL (rikyat.github.io/blog/weight-space-programming/) and both review URLs | Every 🟦 figure; references | Could not be re-opened at build time. All paper-reported figures are transcriptions from the source fact sheet and the post's released logs. |
| 2 | Hidden size 1024 behind 131,072 = 2 layers × 64 columns × width | Sparsity arithmetic (Ch 5, Lab 03, whitepaper Eq. sparsity) | Inferred by arithmetic from the reported 131,072 and 64 columns; flagged `[VERIFY]` inline. |
| 3 | Weight Space Learning survey - arXiv:2603.10090 | Chapter 3, references | Identifier as given in the source post; not independently openable at build time. |
| 4 | Sean Goedecke essay URL | Chapter 8 / references | Title and thesis as reported in the review; exact post URL not captured. |
| 5 | Simon Willison laptop-replication URL (3 Nov 2026) | Chapter 8 / references | As reported; not independently re-opened at build time. |
| 6 | Gemma 3 / Qwen3 technical-report arXiv IDs | References | Reports exist; exact IDs not independently confirmed at build time. |
| 7 | Kinetix author list & arXiv ID | References | Paper exists (2024); attribution to be pinned. |
| 8 | Muon optimizer citation | Chapter 2 / references | Community optimizer; formal citation to be pinned before citing as final. |
| 9 | Three lineage entries (steering, sparse-pruning, delta-debugging) | References | **Dropped** from the bibliography pending exact citations; restore with pinned citations in v1.1. |
| 10 | All experiment tables (5.2, 5.2a, 5.2b, 5.2c) | Site-wide, whitepaper | 🟦 Single source (the post); the released logs are the cross-check and are cited for that purpose. |
| 11 | MinAtar per-net parameter count 20,486 | Chapter 6 / fact sheet | **Computed** by this project from the stated architecture (600→32→32→6 with biases), not reported by the authors. |
| 12 | Go win-rate ranges (54–55% / 81–84% / 26–43% / 70–79%) | Chapter 6 / whitepaper | 🟩 As reported by the independent review of the released logs; ranges, n=1 per condition. |

## Watch list (update the site's "What changed since launch" box with dated entries)

- The promised benchmark + harness ("currently being built")
- Independent replications on other LLMs
- New critiques or analyses published after 5 Nov 2026
- Resolution of any ledger item above

When an item resolves, update: this file, `fact-sheet.json` (references / open items),
the site's References page (`site/src/content/references.ts`), and the whitepaper's Appendix C.
