#!/usr/bin/env python3
"""Whitepaper figures - vector PDFs, one per figure, white background, site palette.
Run: python3 paper/scripts/make_figures.py  (from repo root)
Badge discipline: every figure carries its evidence class; schematics are marked in captions."""
import os
import numpy as np
import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle

OUT = os.path.join(os.path.dirname(__file__), "..", "figures")
os.makedirs(OUT, exist_ok=True)

INK = "#1A1D26"
MUTED = "#5D6372"
BORDER = "#DED9CC"
BLUE = "#2F6FD0"
GREEN = "#0E8A5F"
AMBER = "#B57A00"
RED = "#C03A2F"
VIOLET = "#6D55C8"

plt.rcParams.update(
    {
        "figure.facecolor": "white",
        "axes.facecolor": "white",
        "font.family": "DejaVu Sans",
        "font.size": 9.5,
        "axes.edgecolor": BORDER,
        "axes.labelcolor": INK,
        "text.color": INK,
        "xtick.color": MUTED,
        "ytick.color": MUTED,
        "axes.unicode_minus": False,
    }
)

import matplotlib.pyplot as _plt
_orig_subplots = _plt.subplots

def subplots(*args, **kw):
    kw.setdefault("constrained_layout", True)
    return _orig_subplots(*args, **kw)

_plt.subplots = subplots

def save(fig, name):
    fig.savefig(os.path.join(OUT, name), format="pdf")
    plt.close(fig)
    print("ok", name)

# ---------------- fig 01: same wiring, different numbers (schematic) ----------------
def fig_anatomy():
    fig, axes = plt.subplots(1, 2, figsize=(6.6, 2.6))
    titles = ["behaviour: catch the ball", "behaviour: run from ghosts"]
    colors = [BLUE, GREEN]
    rngs = [np.random.default_rng(3), np.random.default_rng(9)]
    for ax, t, c, rng in zip(axes, titles, colors, rngs):
        xs = np.array([[0.1, 0.5, 0.9], [0.3, 0.5, 0.7], [0.2, 0.5, 0.8]])
        ys = np.array([[0.85, 0.85, 0.85], [0.5, 0.5, 0.5], [0.15, 0.15, 0.15]])
        w = rng.uniform(0.1, 1.0, size=(3, 3, 3))
        for li in range(2):
            for a in range(3):
                for b in range(3):
                    ax.plot(
                        [xs[li, a], xs[li + 1, b]],
                        [ys[li, a], ys[li + 1, b]],
                        color=c,
                        lw=0.4 + w[li, a, b] * 2.6,
                        alpha=0.15 + w[li, a, b] * 0.7,
                    )
        for r in range(3):
            ax.scatter(xs[r], ys[r], s=140, facecolor="white", edgecolor=BORDER, zorder=5)
        ax.set_title(t, fontsize=9, color=c)
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.axis("off")
    fig.suptitle("identical architecture, different theta => different behaviour", fontsize=9, color=MUTED)
    save(fig, "fig01_anatomy.pdf")

# ---------------- fig 02: weight-space landscape (schematic) ----------------
def fig_landscape():
    fig, ax = plt.subplots(figsize=(5.4, 3.4))
    gx = np.linspace(-2.6, 2.2, 240)
    gy = np.linspace(-1.9, 1.9, 200)
    X, Y = np.meshgrid(gx, gy)
    Z = 0.55 * ((X - 0.6) ** 2 + 1.6 * Y ** 2) + 0.35 * np.sin(1.7 * X + 0.8 * Y) + 0.2 * np.cos(2.1 * X)
    Z += 0.15 * np.sin(3.2 * X * Y)
    ax.contour(X, Y, Z, levels=14, colors=BORDER, linewidths=0.7)
    walk_x = np.linspace(-2.3, 0.52, 14)
    walk_y = np.linspace(1.45, 0.18, 14)
    ax.plot(walk_x, walk_y, "--o", color=BLUE, lw=1.4, ms=3.5, label="training: ~10$^6$ gradient steps")
    ax.scatter([0.6], [0], s=42, color=GREEN, zorder=6, label="target behaviour")
    ax.annotate("", xy=(0.62, 0.02), xytext=(-1.8, -1.45),
                arrowprops=dict(arrowstyle="-|>", color=AMBER, lw=1.8, linestyle=(0, (4, 3))))
    ax.scatter([-1.8], [-1.45], s=30, color=AMBER, zorder=6)
    ax.text(0.72, 0.2, "WSP: one reasoned edit ($\\theta + \\Delta$)", fontsize=8.5, color=AMBER)
    ax.set_xlabel("$\\theta_1$")
    ax.set_ylabel("$\\theta_2$")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.legend(loc="upper left", frameon=False, fontsize=8)
    save(fig, "fig02_landscape.pdf")

# ---------------- fig 03: four ways to write weights (schematic) ----------------
def fig_fourways():
    fig, axes = plt.subplots(1, 4, figsize=(6.9, 1.9))
    data = [
        ("(1) optimization", "SGD / Adam / Muon\nmillions of tiny steps", BLUE),
        ("(2) trained writers", "hypernetworks\nfast weights, diffusion", VIOLET),
        ("(3) compilers", "Tracr:\nprogram to weights", GREEN),
        ("(4) WSP (new)", "a general LLM\nreasons about $\\theta$, writes $\\Delta$", AMBER),
    ]
    for ax, (t, d, c) in zip(axes, data):
        ax.add_patch(Rectangle((0.04, 0.04), 0.92, 0.92, transform=ax.transAxes,
                               fill=False, ec=c, lw=1.4, ls=(0, (5, 3)) if "WSP" in t else "solid"))
        for i, h in enumerate([0.62, 0.42, 0.24]):
            ax.add_patch(Rectangle((0.12, h), (0.76 - i * 0.14), 0.12, transform=ax.transAxes,
                                   fc=c, alpha=0.30 - i * 0.08, ec="none"))
        ax.text(0.12, 0.86, t, transform=ax.transAxes, fontsize=8.0, weight="bold", color=c)
        ax.text(0.5, 0.02, d, transform=ax.transAxes, fontsize=6.6, ha="center", va="bottom", color=MUTED)
        ax.axis("off")
    save(fig, "fig03_fourways.pdf")

# ---------------- fig 04: copying-head grid (paper) ----------------
HEADS = {
    "Python": [(2, 1), (3, 1), (3, 5)],
    "Romaji": [(3, 3)],
    "English": [(3, 1)],
}
def fig_headgrid():
    fig, axes = plt.subplots(1, 3, figsize=(6.9, 2.5))
    for ax, lang in zip(axes, HEADS):
        for li in range(4):
            for hi in range(6):
                is_c = (li + 1, hi + 1) in HEADS[lang]
                ax.add_patch(Rectangle((hi, 3 - li), 0.92, 0.92,
                                       fc=(GREEN if is_c else "#F4F2EA"),
                                       ec=(GREEN if is_c else BORDER),
                                       lw=1.4 if is_c else 0.6))
                ax.text(hi + 0.46, 3 - li + 0.46, f"{li+1}.{hi+1}", ha="center", va="center",
                        fontsize=6.6, color=(INK if is_c else MUTED),
                        weight="bold" if is_c else "normal")
        ax.set_title(lang, fontsize=9, color=INK)
        ax.set_xlim(-0.15, 6)
        ax.set_ylim(-0.2, 4.3)
        ax.axis("off")
        ax.set_aspect("equal")
    fig.suptitle("copying heads identified from weights alone - exact match with measured ground truth",
                 fontsize=8.2, color=MUTED)
    save(fig, "fig04_headgrid.pdf")

# ---------------- fig 05: head 10.2 attention shares (paper) ----------------
def fig_head102():
    fig, ax = plt.subplots(figsize=(5.6, 2.7))
    labels = ["on question numbers", "on the user's answer"]
    honest = [94.3, 0.75]
    syc = [3.5, 85.7]
    x = np.arange(2)
    ax.bar(x - 0.16, honest, 0.3, color=GREEN, label="honest model")
    ax.bar(x + 0.16, syc, 0.3, color=RED, label="sycophantic model")
    for xi, v in zip(x - 0.16, honest):
        ax.text(xi, v + 2.5, f"{v}%", ha="center", fontsize=8, color=GREEN, weight="bold")
    for xi, v in zip(x + 0.16, syc):
        ax.text(xi, v + 2.5, f"{v}%", ha="center", fontsize=8, color=RED, weight="bold")
    ax.set_xticks(x)
    ax.set_xticklabels(labels)
    ax.set_ylabel("attention share of head 10.2 (%)")
    ax.set_ylim(0, 112)
    ax.legend(frameon=False, fontsize=8, loc="upper center")
    ax.spines[["top", "right"]].set_visible(False)
    save(fig, "fig05_head102.pdf")

# ---------------- fig 06: edit anatomy (schematic, values paper) ----------------
def fig_edit_anatomy():
    fig, ax = plt.subplots(figsize=(6.9, 2.3))
    for i in range(24):
        c = AMBER if i in (14, 18) else "#F4F2EA"
        ax.add_patch(Rectangle((i * 1.0, 1.1), 0.86, 1.8, fc=c, ec=BORDER, lw=0.6))
    ax.plot([14.43, 8.2], [1.1, 0.35], color=AMBER, lw=0.9, ls=":")
    ax.plot([18.43, 8.2], [1.1, 0.35], color=AMBER, lw=0.9, ls=":")
    ax.add_patch(Rectangle((1.2, -1.15), 7.0, 0.85, fc="white", ec=AMBER, lw=1.2))
    ax.add_patch(Rectangle((1.5, -0.95), 6.4, 0.45, fc="#F4F2EA", ec="none"))
    ax.text(1.5, -0.32, "zoom: the 64 output columns of the MLPs of layers 15 & 19", fontsize=6.6, color=MUTED)
    ax.text(0.0, 3.15, "24 layers of Qwen3.5-0.8B - edited blocks in amber", fontsize=8.5, color=INK, weight="bold")
    ax.text(0.0, -1.6, "2 layers x 64 columns x width => 131,072 weights = 0.016% of the model", fontsize=8, color=MUTED)
    ax.set_xlim(-0.4, 24.2)
    ax.set_ylim(-1.8, 3.5)
    ax.axis("off")
    save(fig, "fig06_edit_anatomy.pdf")

# ---------------- fig 07: budget curves, reported points only (paper) ----------------
def fig_budget():
    fig, axes = plt.subplots(1, 2, figsize=(6.9, 2.9))
    passes = [0, 10, 25, 50]
    metrics = {
        "MATH-500": ([7.9, 12.3, 14.1, 48.1], BLUE),
        "GSM8K": ([13.8, 25.7, 25.1, 67.1], VIOLET),
        "IFEval": ([21.0, 49.0, 39.9, 62.3], GREEN),
        "hit token limit": ([93.0, 87.2, 86.4, 33.1], RED),
    }
    ax = axes[0]
    for name, (vals, c) in metrics.items():
        ax.plot(passes, vals, "o", color=c, ms=5, label=name)
        for p, v in zip(passes, vals):
            ax.annotate(f"{v:.1f}", (p, v), textcoords="offset points", xytext=(0, 6),
                        ha="center", fontsize=6.2, color=c)
    ax.annotate("dip at 25:\n49.0 to 39.9", xy=(25, 39.9), xytext=(31, 24), fontsize=7, color=GREEN,
                arrowprops=dict(arrowstyle="->", color=GREEN, lw=0.9))
    ax.set_xlabel("forward passes n allowed")
    ax.set_ylabel("score (%)")
    ax.set_title("Qwen3.5-0.8B, edited (Exp 8)", fontsize=8.5)
    ax.set_ylim(0, 108)
    ax.legend(frameon=False, fontsize=6.4, loc="center right", bbox_to_anchor=(1.03, 0.35))
    ax.spines[["top", "right"]].set_visible(False)

    ax = axes[1]
    gp = [0, 5, 10, 25, 50]
    gv = [6.8, 7.0, 7.6, 7.7, 7.0]
    ax.plot(gp, gv, "o", color=AMBER, ms=5)
    for p, v in zip(gp, gv):
        ax.annotate(f"{v}", (p, v), textcoords="offset points", xytext=(0, 6), ha="center", fontsize=6.4, color=AMBER)
    ax.axhline(6.8, color=BORDER, lw=0.8, ls=":")
    ax.set_xlabel("forward passes n")
    ax.set_ylabel("MATH-500 (%)")
    ax.set_title("Gemma 3 270M negative control", fontsize=8.5)
    ax.set_ylim(0, 13)
    ax.text(25, 10.8, "removed an obstacle; added no ability", fontsize=7, color=MUTED, ha="center")
    ax.spines[["top", "right"]].set_visible(False)
    fig.suptitle("reported points only - single run per point (n = 1)", fontsize=8, color=MUTED)
    save(fig, "fig07_budget.pdf")

# ---------------- fig 08: MinAtar grouped bars (paper) ----------------
def fig_minatar():
    fig, ax = plt.subplots(figsize=(5.9, 3.0))
    games = ["Breakout", "Seaquest", "Asterix"]
    ppo100 = [15.8, 5.6, 25.8]
    ppo500 = [25.3, 88.9, 55.2]
    astra = [517.4, 53.1, 53.2]
    x = np.arange(3)
    ax.bar(x - 0.26, ppo100, 0.25, color="#9AA3B2", label="PPO / 100M steps")
    ax.bar(x, ppo500, 0.25, color=BLUE, label="PPO / 500M steps")
    ax.bar(x + 0.26, astra, 0.25, color=GREEN, label="written, one shot")
    for xi, v in zip(x + 0.26, astra):
        ax.text(xi, v * 1.12, f"{v}", ha="center", fontsize=7.5, color=GREEN, weight="bold")
    for xi, v in zip(x, ppo500):
        ax.text(xi, v * 1.12, f"{v}", ha="center", fontsize=7, color=BLUE)
    ax.set_xticks(x)
    ax.set_xticklabels(games)
    ax.set_ylabel("score (1,000-episode average)")
    ax.set_yscale("log")
    ax.set_ylim(1, 1600)
    ax.legend(frameon=False, fontsize=7.6, loc="upper right")
    ax.spines[["top", "right"]].set_visible(False)
    save(fig, "fig08_minatar.pdf")

# ---------------- fig 09: Go win rates (review) ----------------
def fig_go():
    fig, ax = plt.subplots(figsize=(5.9, 2.9))
    conds = ["vs two small\nPPO nets", "vs equal-size PPO\n(20M games)"]
    x = np.arange(2)
    ax.bar(x - 0.17, [54.5, 34.5], 0.3, yerr=[0.5, 8.5], capsize=3, color="#9AA3B2", label="0 passes")
    ax.bar(x + 0.17, [82.5, 74.5], 0.3, yerr=[1.5, 4.5], capsize=3, color=GREEN, label="50 passes")
    ax.text(0 - 0.17, 57.5, "54-55%", ha="center", fontsize=7.5, color=MUTED)
    ax.text(0 + 0.17, 86, "81-84%", ha="center", fontsize=7.5, color=GREEN, weight="bold")
    ax.text(1 - 0.17, 45.5, "26-43%", ha="center", fontsize=7.5, color=MUTED)
    ax.text(1 + 0.17, 80.5, "70-79%", ha="center", fontsize=7.5, color=GREEN, weight="bold")
    ax.axhline(50, color=BORDER, lw=0.9, ls=":")
    ax.text(1.44, 51, "50% (even)", fontsize=6.8, color=MUTED)
    ax.set_xticks(x)
    ax.set_xticklabels(conds)
    ax.set_ylabel("win rate of the written policy (%)")
    ax.set_ylim(0, 100)
    ax.legend(frameon=False, fontsize=7.6, loc="upper left")
    ax.spines[["top", "right"]].set_visible(False)
    save(fig, "fig09_go.pdf")

# ---------------- fig 10: evidence scoreboard (review) ----------------
def fig_scoreboard():
    claims = [
        ("reading generalises to all models", 20),
        ("weight-level auditing is near", 15),
        ("WSP beats cheap baselines", 30),
        ("LLMs can read small networks", 55),
        ("one-shot repair of broken policies", 72),
        ("writing working policies from scratch", 75),
        ("copying heads found from weights", 80),
        ("0.016% edit fixes overthinking", 88),
    ]
    fig, ax = plt.subplots(figsize=(6.5, 3.1))
    ys = np.arange(len(claims))
    cols = [RED if v < 25 else AMBER if v < 45 else BLUE if v < 70 else GREEN for _, v in claims]
    ax.barh(ys, [v for _, v in claims], color=cols, height=0.62)
    for y, (c, v) in enumerate(claims):
        ax.text(v + 1.5, y, f"{v}", va="center", fontsize=7.5, color=cols[y])
    ax.set_yticks(ys)
    ax.set_yticklabels([c for c, _ in claims], fontsize=7.6)
    ax.set_xlabel("visual encoding of the review's qualitative verdicts (0-100; an editorial device, not a meta-analysis)")
    ax.set_xlim(0, 100)
    ax.spines[["top", "right"]].set_visible(False)
    save(fig, "fig10_scoreboard.pdf")

# ---------------- fig 11: blast radius (paper + schematic refs) ----------------
def fig_blast():
    fig, ax = plt.subplots(figsize=(6.3, 2.7))
    items = [
        ("Exp 8 / Qwen3.5-0.8B edit", 131072 / 0.8e9, BLUE, "0.016%"),
        ("Exp 4 / Kinetix actor edit", 0.035, BLUE, "3.5%"),
        ("LoRA r=8 on one 1024x1024 matrix", 16400 / 1048576, VIOLET, "1.56%"),
        ("full fine-tuning", 1.0, MUTED, "100%"),
    ]
    ys = np.arange(len(items))[::-1]
    for y, (label, v, c, txt) in zip(ys, items):
        ax.hlines(y, 1e-8, max(v, 2e-8), color=BORDER, lw=0.8, zorder=1)
        ax.plot([v], [y], "o", ms=8, color=c, zorder=3)
        ax.text(min(v * 1.4, 1.05), y, txt, va="center", fontsize=7.8, color=c, weight="bold")
    ax.set_xscale("log")
    ax.set_xlim(1e-8, 1)
    ax.set_yticks(ys)
    ax.set_yticklabels([i[0] for i in items], fontsize=7.8)
    ax.set_xlabel("edit sparsity s = |delta|_0 / P   (log scale)")
    ax.axvline(1.6e-4, color=AMBER, lw=0.9, ls=":")
    ax.text(1.35e-4, 3.42, "flagship", fontsize=6.8, color=AMBER, ha="right")
    ax.spines[["top", "right"]].set_visible(False)
    save(fig, "fig11_blast.pdf")

# ---------------- fig 12: horizon map (speculation) ----------------
def fig_horizon():
    fig, ax = plt.subplots(figsize=(6.9, 2.9))
    bands = [(2026.0, 2026.5), (2026.5, 2028.0), (2028.0, 2031.0), (2031.0, 2035.5)]
    labels = ["now-6m", "6-24m", "2-5y", "5y+"]
    for i, (a, b) in enumerate(bands):
        ax.axvspan(a, b, color=BORDER, alpha=0.32 if i % 2 else 0.16, lw=0)
        ax.text((a + b) / 2, 5.32, labels[i], ha="center", fontsize=7.4, color=MUTED)
    futures = [
        ("benchmark + harness", 2026.4, False),
        ("replications on other LLMs", 2026.8, False),
        ("weight-diff patches as PRs", 2027.3, False),
        ("zero-data unlearning trials", 2027.8, False),
        ("LLM as circuit auditor", 2028.6, False),
        ("one-shot initialisation", 2029.3, True),
        ("evaluation-free auditing", 2030.0, True),
        ("cross-architecture grafting", 2031.0, True),
        ("WSP agents in pipelines", 2032.2, True),
        ("models program successors", 2033.3, True),
        ("weights as reviewable source", 2035.0, True),
    ]
    for i, (name, yr, needs_gen) in enumerate(futures):
        y = 4.6 - (i % 5) * 0.95
        c = RED if needs_gen else AMBER
        ax.plot([yr], [y], "o", ms=5, color=c)
        ax.text(yr + 0.07, y, name, fontsize=6.9, va="center", color=c if needs_gen else INK)
    ax.set_xlim(2026, 2035.6)
    ax.set_ylim(0, 5.7)
    ax.set_yticks([])
    ax.set_xticks(range(2026, 2036, 2))
    ax.text(2026.05, 0.18, "red items additionally need 'reading generalises' to hold - all items are speculation (untested)",
            fontsize=6.8, color=MUTED)
    ax.spines[["left", "top", "right"]].set_visible(False)
    save(fig, "fig12_horizon.pdf")

# ---------------- fig 13: risk radar quadrant (speculation) ----------------
def fig_risks():
    fig, ax = plt.subplots(figsize=(5.6, 4.2))
    risks = [
        ("backdoors", 0.30, 0.82), ("guardrail removal", 0.60, 0.86),
        ("compute-rule blindness", 0.55, 0.60), ("recursive self-improvement", 0.25, 0.95),
        ("licence laundering", 0.70, 0.50), ("concealment", 0.35, 0.74),
        ("benchmark gaming", 0.75, 0.42), ("over-trust in stories", 0.80, 0.55),
        ("power concentration", 0.45, 0.68), ("what could go right", 0.72, 0.30),
    ]
    for name, x, y in risks:
        c = GREEN if "right" in name else RED
        ax.scatter([x], [y], s=200, color="white", edgecolor=c, lw=1.8, zorder=3)
        ax.text(x, y - 0.045, name, ha="center", fontsize=7.0, color=c)
    ax.set_xlim(0, 1)
    ax.set_ylim(0, 1.05)
    ax.set_xlabel("likelihood (my qualitative guess - draggable in the site version)")
    ax.set_ylabel("impact")
    ax.set_xticks([])
    ax.set_yticks([])
    ax.text(0.51, 1.0, "watch this quadrant", fontsize=7.5, color=RED, alpha=0.8)
    ax.spines[["top", "right"]].set_visible(False)
    save(fig, "fig13_risks.pdf")

if __name__ == "__main__":
    fig_anatomy(); fig_landscape(); fig_fourways(); fig_headgrid(); fig_head102()
    fig_edit_anatomy(); fig_budget(); fig_minatar(); fig_go(); fig_scoreboard()
    fig_blast(); fig_horizon(); fig_risks()
    print("all figures done ->", os.path.abspath(OUT))
