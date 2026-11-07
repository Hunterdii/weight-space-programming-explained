# References - with verification status

Policy: **no invented entries.** Every item is either (a) a verifiable primary source or
standard literature entry, or (b) explicitly flagged as pending verification (also listed in
the open-verification ledger). The machine-readable version, including the 44 BibTeX entries,
ships as `fact-sheet.json` (`references` key) and `../paper/references.bib`.

## Primary sources (🟦)

1. Rikiya Takehi, Jayden Teoh, Alex Zhang, Omar Khattab. *Sparks of Weight-Space Programming: LLMs can natively read & write neural network weights.* Blog post, MIT CSAIL (rikiyat.github.io), 2 Nov 2026. - The primary source for every paper-reported figure in this project. [not independently re-openable at build time - see ledger]
2. lm_understand-logs - released experiment logs. github.com/RikiyaT/lm_understand-logs. [URL as given in the post]
3. RikiyaT/Qwen3.5-0.8B-weight-space-programming - the edited checkpoint. Hugging Face. [as given in the post]
4. Ahsen Khaliq. weight-space-programming-demo - live demo. Hugging Face Spaces. [as given in the post]

## Independent reviews & coverage (🟩)

5. Andreas Maier. *Weight-Space Programming: what is measured and what is anecdote?* Substack, 5 Nov 2026. - The sorted-evidence scoreboard behind every "independent review" badge.
6. Sean Goedecke. *LLMs are not superhuman at reading and writing neural network weights.* seangoedecke.com. - The deflationary case across all eight experiments. [exact post URL to be pinned]
7. Simon Willison. *Qwen can interpret model weights.* simonwillison.net, 3 Nov 2026. - Laptop-class open-model replication of a similar weight-reading example; anecdotal.

## Background lineage (standard, verifiable literature)

8. Vaswani et al. *Attention Is All You Need.* NeurIPS 2017 (arXiv:1706.03762).
9. Schulman et al. *Proximal Policy Optimization Algorithms.* 2017 (arXiv:1707.06347).
10. Ho, Jain, Abbeel. *Denoising Diffusion Probabilistic Models.* NeurIPS 2020 (arXiv:2006.11239).
11. Kingma & Ba. *Adam.* ICLR 2015 (arXiv:1412.6980).
12. Brown et al. *Language Models are Few-Shot Learners.* NeurIPS 2020 (arXiv:2005.14165).
13. Young & Tian. *MinAtar.* 2019 (arXiv:1903.03176).
14. Cobbe et al. *Training Verifiers to Solve Math Word Problems (GSM8K).* 2021 (arXiv:2110.14168).
15. Hendrycks et al. *Measuring Mathematical Problem Solving With the MATH Dataset.* ICLR 2022 (arXiv:2103.03874).
16. Zhou et al. *Instruction-Following Evaluation for Large Language Models (IFEval).* ACL 2024 (arXiv:2311.07911).
17. Elhage et al. *A Mathematical Framework for Transformer Circuits.* Transformer Circuits Thread, 2021.
18. Olsson et al. *In-context Learning and Induction Heads.* Transformer Circuits Thread, 2022.
19. Nanda et al. *Progress measures for grokking via mechanistic interpretability.* ICLR 2023 (arXiv:2301.05217).
20. Lindell et al. *Tracr: Compiled Transformers as a Laboratory for Interpretability.* NeurIPS 2023 (arXiv:2301.05062).
21. Schlag et al. *Linear Transformers Are Secretly Fast Weight Programmers.* ICML 2021 (arXiv:2102.11174).
22. Ha, Dai, Le. *HyperNetworks.* ICLR 2017 (arXiv:1609.09106).
23. Ilharco et al. *Editing Models with Task Arithmetic.* ICLR 2023 (arXiv:2212.04089).
24. Hu et al. *LoRA: Low-Rank Adaptation of Large Language Models.* ICLR 2022 (arXiv:2106.09685).
25. Meng et al. *Locating and Editing Factual Associations in GPT (ROME).* NeurIPS 2022 (arXiv:2202.05262).
26. Yadav et al. *TIES-Merging.* NeurIPS 2023 (arXiv:2306.01708).
27. Ainsworth, Hayase, Srinivasa. *Git Re-Basin.* ICLR 2023 (arXiv:2209.04836).
28. Frankle & Carbin. *The Lottery Ticket Hypothesis.* ICLR 2019 (arXiv:1803.03635).
29. Wang et al. *Neural Network Diffusion.* IEEE TPAMI 2024 (arXiv:2401.04012).
30. Arditi et al. *Refusal in LLMs is mediated by a single direction.* NeurIPS 2024 (arXiv:2406.11717). - The published precedent for single-direction surgery, and for risk #2.
31. Carlini et al. *Extracting Training Data from Large Language Models.* USENIX Security 2021.
32. Burns et al. *Discovering Latent Knowledge in Language Models Without Supervision.* ICLR 2023.
33. Marks & Tegmark. *The Geometry of Truth.* 2023 (arXiv:2310.06824).
34. Dosovitskiy et al. *An Image is Worth 16x16 Words (ViT).* ICLR 2021 (arXiv:2010.11929).
35. Mitchell et al. *Model Cards for Model Reporting.* FAT* 2019.
36. Gemma Team. *Gemma 3 Technical Report.* 2025. [arXiv ID pending confirmation - see ledger]
37. Qwen Team. *Qwen Technical Report.* 2025. [arXiv ID pending confirmation - see ledger]
38. Arnold, Ellis et al. *Kinetix.* 2024. [author list pending confirmation - see ledger]
39. Weight Space Learning survey. arXiv:2603.10090. [as cited in the source post; not independently openable - see ledger]
40. Awesome-Weight-Space-Learning. GitHub (as named in the post).
41. Jordan, Bernstein et al. *Muon optimizer.* 2024. [informal citation to be pinned]
42. SPDX / CycloneDX communities. *SBOM standards.* 2021. (Template for a "weights BOM".)
43. Center for Open Science. *Preregistration standards (OSF).* 2019. (Model for pre-registered prompts.)
44. CTF communities (DEF CON, picoCTF). *Capture-the-flag governance.* 2023. (Stewardship footnote.)

## Citing this project

- Results → cite the **original post** [1].
- Evidence-strength verdicts → cite the **review** [5].
- The deflationary case → cite [6].
- The teaching apparatus, labs, and WSP-Bench-Lite → cite **this project** (Het Patel / Hunterdii).
