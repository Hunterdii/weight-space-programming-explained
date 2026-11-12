#!/usr/bin/env python3
"""
Generates every README visual for Hunterdii/weights-are-code.

    python3 assets/readme/generate_assets.py [out_dir]

Pure standard library. Writes dark + light SVGs (GitHub swaps them with <picture>).
If `rsvg-convert` is on PATH it also writes 2x PNGs (for LinkedIn / social cards).
Edit the numbers in STATS / ROUTES below when the project changes, then re-run.
"""
import hashlib, os, shutil, subprocess, sys

OUT = sys.argv[1] if len(sys.argv) > 1 else os.path.dirname(os.path.abspath(__file__))

SANS = "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
MONO = "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'DejaVu Sans Mono', monospace"

THEMES = {
    "dark": dict(bg="#070b14", panel="#0d1526", panel2="#111b31", line="#1f2d4a", text="#eaf0ff",
                 muted="#8fa0bf", faint="#56668a", cyan="#22d3ee", coral="#fb7185", amber="#fbbf24",
                 violet="#a78bfa", green="#34d399", blue="#60a5fa", slate="#94a3b8", dot="#2a3a5e"),
    "light": dict(bg="#f6f8fd", panel="#ffffff", panel2="#f1f5fb", line="#d3dcee", text="#0b1220",
                  muted="#46556f", faint="#8a98b3", cyan="#0891b2", coral="#e11d48", amber="#c2410c",
                  violet="#7c3aed", green="#059669", blue="#2563eb", slate="#64748b", dot="#c9d4e8"),
}

# ----- project facts shown in the visuals (verified against the repo tree / explainer) -----
STATS = [("26", "static routes", "cyan"), ("13", "chapters", "violet"), ("15", "interactive modules", "amber"),
         ("5", "reading levels", "green"), ("4", "Python labs", "coral"), ("13", "vector figures", "blue"),
         ("0", "backend servers", "cyan")]


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def T(x, y, s, size=18, fill="#fff", fam=SANS, w=400, anchor="start", ls=0, extra=""):
    return (f'<text x="{x}" y="{y}" font-family="{fam}" font-size="{size}" font-weight="{w}" fill="{fill}" '
            f'text-anchor="{anchor}" letter-spacing="{ls}" {extra}>{s}</text>')


def rnd(a, b, salt=""):
    return hashlib.md5(f"{a},{b},{salt}".encode()).digest()[0] / 255.0


def wrap(w, h, body, title, desc):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}" '
            f'role="img" aria-labelledby="t d"><title id="t">{esc(title)}</title><desc id="d">{esc(desc)}</desc>'
            f'{body}</svg>')


def defs_common(c, p):
    return f'''<defs>
<radialGradient id="{p}g1" cx="86%" cy="12%" r="55%"><stop offset="0" stop-color="{c['cyan']}" stop-opacity=".16"/><stop offset="1" stop-color="{c['cyan']}" stop-opacity="0"/></radialGradient>
<radialGradient id="{p}g2" cx="6%" cy="108%" r="55%"><stop offset="0" stop-color="{c['violet']}" stop-opacity=".18"/><stop offset="1" stop-color="{c['violet']}" stop-opacity="0"/></radialGradient>
<pattern id="{p}dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="{c['dot']}"/></pattern>
<linearGradient id="{p}tx" x1="0" x2="1"><stop offset="0" stop-color="{c['cyan']}"/><stop offset="1" stop-color="{c['violet']}"/></linearGradient>
</defs>'''


def backdrop(c, p, W, H):
    return (f'<rect width="{W}" height="{H}" fill="{c["bg"]}"/>'
            f'<rect width="{W}" height="{H}" fill="url(#{p}dots)"/>'
            f'<rect width="{W}" height="{H}" fill="url(#{p}g1)"/><rect width="{W}" height="{H}" fill="url(#{p}g2)"/>')


# =====================================================================================
# 1. BANNER (animated SMIL; `static=True` freezes mid-surgery for PNG / social card)
# =====================================================================================
def banner_inner(t, static=False, p="b"):
    c = THEMES[t]
    W, H = 1600, 600
    COLS, ROWS, CELL, PITCH = 22, 12, 22, 28
    px, py, pw, ph = 880, 44, 640, 520
    lx, ly = px + 15, py + 62
    lw, lh = COLS * PITCH - 6, ROWS * PITCH - 6
    s = [defs_common(c, p)]
    s.append(f'''<defs>
<linearGradient id="{p}beam" x1="0" x2="1"><stop offset="0" stop-color="{c['cyan']}" stop-opacity="0"/><stop offset=".5" stop-color="{c['cyan']}" stop-opacity=".95"/><stop offset="1" stop-color="{c['cyan']}" stop-opacity="0"/></linearGradient>
<filter id="{p}blur" x="-200%" y="-10%" width="500%" height="120%"><feGaussianBlur stdDeviation="7"/></filter>
<filter id="{p}shadow" x="-10%" y="-10%" width="120%" height="125%"><feDropShadow dx="0" dy="14" stdDeviation="22" flood-color="#000" flood-opacity="{.45 if t == 'dark' else .12}"/></filter>
</defs>''')
    s.append(backdrop(c, p, W, H))

    # ---- left column
    s.append(f'<rect x="80" y="72" width="596" height="40" rx="20" fill="{c["panel"]}" stroke="{c["line"]}"/>')
    s.append(f'<circle cx="104" cy="92" r="5" fill="{c["green"]}"/>')
    s.append(T(122, 98, "OPEN SOURCE · THE CODE BEHIND THE ATLAS", 16, c["muted"], MONO, 600, ls=1.6))
    s.append(T(76, 238, "Weights", 128, c["text"], SANS, 800, ls=-4))
    s.append(T(76, 366, "Are Code.", 128, f"url(#{p}tx)", SANS, 800, ls=-4))
    s.append(T(80, 424, "The source of the Weight-Space Atlas: an interactive", 26, c["muted"]))
    s.append(T(80, 458, "field guide to LLMs that read, repair and write weights.", 26, c["muted"]))
    s.append(f'<text x="80" y="516" font-family="{MONO}" font-size="30" font-weight="700" letter-spacing="1">'
             f'<tspan fill="{c["cyan"]}">READ</tspan><tspan fill="{c["faint"]}">&#160;&#160;·&#160;&#160;</tspan>'
             f'<tspan fill="{c["coral"]}">FIX</tspan><tspan fill="{c["faint"]}">&#160;&#160;·&#160;&#160;</tspan>'
             f'<tspan fill="{c["amber"]}">WRITE</tspan></text>')
    s.append(T(80, 558, "Next.js 16 · TypeScript · Tailwind v4 · static export", 17, c["faint"], MONO, 500))

    # ---- right: lattice panel
    s.append(f'<g filter="url(#{p}shadow)"><rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="20" fill="{c["panel"]}"/></g>')
    s.append(f'<rect x="{px}" y="{py}" width="{pw}" height="{ph}" rx="20" fill="none" stroke="{c["line"]}" stroke-width="1.5"/>')
    for i, col in enumerate((c["coral"], c["amber"], c["green"])):
        s.append(f'<circle cx="{px + 28 + i * 22}" cy="{py + 30}" r="6" fill="{col}"/>')
    s.append(T(px + 118, py + 36, "layer_15.mlp.W_gate", 17, c["muted"], MONO, 500))
    s.append(T(px + pw - 24, py + 36, "64 × 64 view", 15, c["faint"], MONO, 500, anchor="end"))
    s.append(f'<line x1="{px}" x2="{px + pw}" y1="{py + 52}" y2="{py + 52}" stroke="{c["line"]}"/>')

    # lattice columns (each column group animates its own fill)
    DUR = 9.0
    k_static = 13
    for col in range(COLS):
        f_c = 0.08 + (col + 0.5) / COLS * 0.54
        if static:
            fill = c["cyan"] if col < k_static else c["coral"]
            op = ' opacity=".62"' if col < k_static else ""
            s.append(f'<g fill="{fill}"{op}>')
        else:
            s.append(f'<g fill="{c["coral"]}"><animate attributeName="fill" dur="{DUR}s" repeatCount="indefinite" '
                     f'values="{c["coral"]};{c["coral"]};{c["cyan"]};{c["cyan"]};{c["coral"]}" '
                     f'keyTimes="0;{f_c:.4f};{f_c + .025:.4f};0.9;1"/>'
                     f'<animate attributeName="opacity" dur="{DUR}s" repeatCount="indefinite" '
                     f'values="1;1;.62;.62;1" keyTimes="0;{f_c:.4f};{f_c + .025:.4f};0.9;1"/>')
        for r in range(ROWS):
            o = 0.12 + 0.88 * (rnd(col, r) ** 2.4)
            s.append(f'<rect x="{lx + col * PITCH}" y="{ly + r * PITCH}" width="{CELL}" height="{CELL}" rx="5" '
                     f'opacity="{o:.2f}"/>')
        s.append("</g>")

    # beam
    bx0, bx1 = lx - 8, lx + lw - 2
    if static:
        bx = lx + k_static * PITCH - 3
        s.append(f'<rect x="{bx - 7}" y="{ly - 16}" width="16" height="{lh + 32}" fill="{c["cyan"]}" opacity=".5" filter="url(#{p}blur)"/>')
        s.append(f'<rect x="{bx}" y="{ly - 16}" width="3" height="{lh + 32}" rx="1.5" fill="{c["cyan"]}"/>')
    else:
        kt = "0;0.08;0.62;0.66;1"
        s.append(f'<g opacity="0"><animate attributeName="opacity" dur="{DUR}s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="{kt}"/>'
                 f'<rect x="-7" y="{ly - 16}" width="16" height="{lh + 32}" fill="{c["cyan"]}" opacity=".5" filter="url(#{p}blur)"/>'
                 f'<rect x="0" y="{ly - 16}" width="3" height="{lh + 32}" rx="1.5" fill="{c["cyan"]}"/>'
                 f'<animateTransform attributeName="transform" type="translate" dur="{DUR}s" repeatCount="indefinite" '
                 f'values="{bx0} 0;{bx0} 0;{bx1} 0;{bx1} 0;{bx1} 0" keyTimes="{kt}"/></g>')

    # formula + caption
    s.append(T(px + 28, py + 462, "W′ = (I − u·uᵀ) W", 32, c["text"], MONO, 700))
    s.append(T(px + pw - 28, py + 462, "rank-1", 18, c["cyan"], MONO, 700, anchor="end", ls=1))
    s.append(T(px + 28, py + 496, "131,072 of 800,000,000 weights edited = 0.016%", 18, c["muted"], MONO, 500))
    return "".join(s), W, H


def banner(t, static=False):
    body, W, H = banner_inner(t, static)
    return wrap(W, H, body, "Weights Are Code",
                "Banner for the weights-are-code repository: a grid of weights where a scanning beam removes one "
                "direction, with the formula W prime equals I minus u u transpose times W.")


# =====================================================================================
# 2. STATS STRIP
# =====================================================================================
def stats(t):
    c = THEMES[t]
    W, H = 1600, 210
    p = "s"
    s = [defs_common(c, p), backdrop(c, p, W, H)]
    n = len(STATS)
    gap, pad = 16, 40
    tw = (W - 2 * pad - gap * (n - 1)) / n
    for i, (num, label, col) in enumerate(STATS):
        x = pad + i * (tw + gap)
        s.append(f'<rect x="{x:.1f}" y="34" width="{tw:.1f}" height="142" rx="16" fill="{c["panel"]}" stroke="{c["line"]}"/>')
        s.append(f'<rect x="{x + 22:.1f}" y="34" width="44" height="4" rx="2" fill="{c[col]}"/>')
        s.append(T(f"{x + 22:.1f}", 112, num, 66, c[col], SANS, 800, ls=-2))
        s.append(T(f"{x + 22:.1f}", 150, label, 19, c["muted"], SANS, 500))
    return wrap(W, H, "".join(s), "Atlas by the numbers",
                "26 static routes, 13 chapters, 15 interactive modules, 5 reading levels, 4 Python labs, "
                "13 vector figures and 0 backend servers.")


# =====================================================================================
# 3. TWO WAYS TO CHANGE A BRAIN (for non-technical readers)
# =====================================================================================
def two_ways(t):
    c = THEMES[t]
    W, H = 1600, 600
    p = "w"
    s = [defs_common(c, p), backdrop(c, p, W, H)]
    s.append(f'<defs><marker id="{p}ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">'
             f'<path d="M0 0L10 5L0 10z" fill="{c["faint"]}"/></marker>'
             f'<marker id="{p}arc" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto">'
             f'<path d="M0 0L10 5L0 10z" fill="{c["cyan"]}"/></marker></defs>')

    def lane(x, w, col, tag, title, steps, foot, arrow):
        out = [f'<rect x="{x}" y="40" width="{w}" height="520" rx="22" fill="{c["panel"]}" stroke="{c[col]}" stroke-opacity=".55" stroke-width="1.5"/>']
        out.append(f'<rect x="{x + 32}" y="68" width="{len(tag) * 12 + 28}" height="30" rx="15" fill="{c[col]}" fill-opacity=".14"/>')
        out.append(T(x + 46, 89, tag, 15, c[col], MONO, 700, ls=2))
        out.append(T(x + 32, 144, title, 40, c["text"], SANS, 800, ls=-1))
        y = 186
        for i, (a, b) in enumerate(steps):
            out.append(f'<rect x="{x + 32}" y="{y}" width="{w - 64}" height="62" rx="14" fill="{c["panel2"]}" stroke="{c["line"]}"/>')
            out.append(f'<circle cx="{x + 68}" cy="{y + 31}" r="16" fill="{c[col]}" fill-opacity=".16" stroke="{c[col]}"/>')
            out.append(T(x + 68, y + 37, str(i + 1), 17, c[col], MONO, 700, anchor="middle"))
            out.append(T(x + 100, y + 28, a, 21, c["text"], SANS, 700))
            out.append(T(x + 100, y + 50, b, 15, c["muted"], SANS, 400))
            if i < len(steps) - 1:
                out.append(f'<line x1="{x + 68}" y1="{y + 62}" x2="{x + 68}" y2="{y + 80}" stroke="{c[arrow]}" stroke-width="2" marker-end="url(#{p}{"arc" if arrow == "cyan" else "ar"})"/>')
            y += 80
        out.append(T(x + 32, 548, foot, 16, c[col], MONO, 600))
        return "".join(out)

    s.append(lane(40, 730, "slate", "THE OLD WAY", "Train it",
                  [("Show it data", "millions of examples"),
                   ("Measure the mistakes", "a single score called the loss"),
                   ("Nudge every number a little", "gradient descent adjusts all the weights"),
                   ("Repeat, again and again", "until the score stops improving")],
                  "gradient descent · optimizer · training loop", "slate"))
    s.append(f'<line x1="780" y1="280" x2="820" y2="280" stroke="{c["faint"]}" stroke-width="2" stroke-dasharray="3 6"/>')
    s.append(T(800, 262, "vs", 18, c["faint"], MONO, 700, anchor="middle"))
    s.append(lane(830, 730, "cyan", "THE NEW IDEA", "Program it",
                  [("Hand an LLM the raw numbers", "the weights, pasted in as plain text"),
                   ("It works out what each part does", "READ: names the game, the language, the circuit"),
                   ("It edits only the numbers that matter", "FIX or WRITE: one targeted algebraic cut"),
                   ("Check the result", "Qwen3.5-0.8B: 131,072 of 800M weights (0.016%)")],
                  "no optimizer · no training loop  (paper-reported)", "cyan"))
    return wrap(W, H, "".join(s), "Two ways to change a neural network",
                "Left: the old way, training with gradient descent. Right: the new idea, an LLM reads the raw weights and edits only the numbers that matter.")


# =====================================================================================
# 4. ARCHITECTURE BLUEPRINT
# =====================================================================================
def chip(c, x, y, label, sub=None, col="cyan", w=None, h=None):
    cw = 10.4
    w = w or max(len(label) * cw, len(sub or "") * 7.7 if sub else 0) + 30
    h = h or (60 if sub else 38)
    out = [f'<rect x="{x:.1f}" y="{y}" width="{w:.1f}" height="{h}" rx="10" fill="{c["panel2"]}" stroke="{c[col]}" stroke-opacity=".6"/>']
    if sub:
        out.append(T(f"{x + 15:.1f}", y + 25, label, 17, c["text"], MONO, 700))
        out.append(T(f"{x + 15:.1f}", y + 46, sub, 13, c["muted"], SANS, 400))
    else:
        out.append(T(f"{x + 15:.1f}", y + 24, label, 17, c["text"], MONO, 600))
    return "".join(out), w


def row_of_chips(c, x, y, items, col, gap=12, maxw=1086):
    out = []
    cx, cy = x, y
    rowh = 0
    for it in items:
        label, sub = (it if isinstance(it, tuple) else (it, None))
        svg, w = chip(c, cx, cy, label, sub, col)
        if cx + w > x + maxw:  # wrap
            cx, cy = x, cy + (60 if sub else 38) + 12
            svg, w = chip(c, cx, cy, label, sub, col)
        out.append(svg)
        cx += w + gap
    return "".join(out)


def architecture(t):
    c = THEMES[t]
    W, H = 1600, 960
    p = "a"
    s = [defs_common(c, p), backdrop(c, p, W, H)]
    s.append(f'<defs><marker id="{p}ah" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="9" markerHeight="9" orient="auto"><path d="M0 0L10 5L0 10z" fill="{c["cyan"]}"/></marker></defs>')
    s.append(T(48, 64, "HOW THE ATLAS IS BUILT", 16, c["cyan"], MONO, 700, ls=3))
    s.append(T(48, 104, "Content is data. Components render it. Next.js exports it as static HTML.", 30, c["text"], SANS, 800, ls=-.5))

    X, MW = 48, 1130

    def band(y, h, n, title, path, col):
        o = [f'<rect x="{X}" y="{y}" width="{MW}" height="{h}" rx="18" fill="{c["panel"]}" stroke="{c["line"]}"/>']
        o.append(f'<rect x="{X}" y="{y}" width="6" height="{h}" rx="3" fill="{c[col]}"/>')
        o.append(f'<circle cx="{X + 38}" cy="{y + 32}" r="14" fill="{c[col]}" fill-opacity=".16" stroke="{c[col]}"/>')
        o.append(T(X + 38, y + 38, str(n), 15, c[col], MONO, 700, anchor="middle"))
        o.append(T(X + 62, y + 38, title, 20, c["text"], SANS, 800))
        o.append(T(X + MW - 22, y + 37, path, 15, c["muted"], MONO, 500, anchor="end"))
        return "".join(o)

    def down(y, label):
        cx = X + MW / 2
        return (f'<line x1="{cx}" y1="{y}" x2="{cx}" y2="{y + 26}" stroke="{c["cyan"]}" stroke-width="2" marker-end="url(#{p}ah)"/>'
                + T(cx + 14, y + 18, label, 14, c["muted"], MONO, 500))

    # 1 content
    y1 = 132
    s.append(band(y1, 160, 1, "Content as data", "src/content/", "violet"))
    s.append(row_of_chips(c, X + 24, y1 + 54, ["chapters/ ×13", "facts.ts", "formulas.ts", "glossary.ts", "references.ts",
                                              "levels.ts", "tables.ts", "seoFaq.ts", "labs.ts", "types.ts", "fingerprints_data.json"], "violet"))
    s.append(down(y1 + 160 + 4, "pre-generate"))
    # 2 scripts
    y2 = y1 + 160 + 34
    s.append(band(y2, 108, 2, "Build-time scripts", "scripts/", "amber"))
    s.append(row_of_chips(c, X + 24, y2 + 48, [("gen-factsheet.ts", "→ public/data/fact-sheet.json"), ("gen-formula-html.ts", "→ src/content/formulaHtml.ts"),
                                              ("gen-seo-assets.js", "→ SEO + LLM-readable files"), ("serve.js", "→ npm start (static server)")], "amber"))
    s.append(down(y2 + 108 + 4, "feeds"))
    # 3 renderers
    y3 = y2 + 108 + 34
    s.append(band(y3, 128, 3, "Renderers", "src/components/", "cyan"))
    chips = [("content/", "8 block renderers"), ("chapters/", "body · TOC · level rails"), ("modules/", "M1–M15 + FingerprintLab"),
             ("figures/", "figure registry"), ("site/", "12 shell components"), ("ui/", "48 shadcn primitives")]
    cx = X + 24
    for lab, sub in chips:
        svg, w = chip(c, cx, y3 + 50, lab, sub, "cyan", w=172, h=60)
        s.append(svg)
        cx += 184
    s.append(down(y3 + 128 + 4, "compose"))
    # 4 routes
    y4 = y3 + 128 + 34
    s.append(band(y4, 158, 4, "Routes", "src/app/ · 26 static pages", "coral"))
    routes = ["/", "/prologue", "/read ×13", "/experiments", "/lab", "/quiz", "/glossary", "/references", "/faq", "/about", "/contact", "/privacy", "/terms"]
    s.append(row_of_chips(c, X + 24, y4 + 54, routes, "coral", gap=10))
    s.append(down(y4 + 158 + 4, "output: “export”"))
    # 5 ship
    y5 = y4 + 158 + 34
    s.append(band(y5, 104, 5, "Ship", "next build → out/", "green"))
    cx = X + 24
    for lab in ("Vercel", "Netlify", "GitHub Pages", "any static host"):
        svg, w = chip(c, cx, y5 + 50, lab, None, "green", h=38)
        s.append(svg)
        cx += w + 12

    # right rail
    RX, RW = 1214, 338

    def card(y, h, col, title, lines):
        o = [f'<rect x="{RX}" y="{y}" width="{RW}" height="{h}" rx="18" fill="{c["panel"]}" stroke="{c[col]}" stroke-opacity=".6" stroke-dasharray="6 6"/>']
        o.append(T(RX + 22, y + 40, title, 18, c[col], MONO, 700))
        for i, ln in enumerate(lines):
            o.append(T(RX + 22, y + 72 + i * 25, ln, 16, c["muted"], SANS, 400))
        return "".join(o)

    s.append(card(y3 - 6, 140, "cyan", "src/state/store.ts", ["Zustand store with localStorage:", "UI preferences such as the", "Truth Filter survive a reload."]))
    s.append(f'<line x1="{X + MW}" y1="{y3 + 64}" x2="{RX}" y2="{y3 + 64}" stroke="{c["cyan"]}" stroke-dasharray="3 6"/>')
    s.append(card(y1 + 0, 160, "violet", "Single source of truth", ["Numbers, formulas, glossary and", "references are typed data, not", "prose pasted into JSX."]))
    s.append(card(y5 - 36, 140, "green", "public/", ["Served as-is: labs/ · data/ ·", "whitepaper.pdf · llms.txt · ai.txt ·", "og-image.png · robots.txt"]))
    s.append(f'<line x1="{X + MW}" y1="{y5 + 40}" x2="{RX}" y2="{y5 + 40}" stroke="{c["green"]}" stroke-dasharray="3 6"/>')
    return wrap(W, H, "".join(s), "Architecture of the Weight-Space Atlas",
                "Five layers: typed content in src/content, build-time scripts, React renderers, 26 static routes in the Next.js App Router, and a static export deployed to Vercel, Netlify or GitHub Pages.")


# =====================================================================================
# 5. REPO MAP (squarified treemap of real file counts)
# =====================================================================================
def squarify(items, x, y, w, h):
    total = sum(v for v, _ in items)
    areas = [(v * w * h / total, pl) for v, pl in items]
    rects = []

    def worst(row, side):
        s_ = sum(a for a, _ in row)
        return max(max(side * side * a / (s_ * s_), (s_ * s_) / (side * side * a)) for a, _ in row)

    def lay(row, x, y, w, h):
        s_ = sum(a for a, _ in row)
        if w >= h:
            cw = s_ / h
            cy = y
            for a, pl in row:
                ch = a / cw
                rects.append((x, cy, cw, ch, pl))
                cy += ch
            return x + cw, y, w - cw, h
        rh = s_ / w
        cx = x
        for a, pl in row:
            cwid = a / rh
            rects.append((cx, y, cwid, rh, pl))
            cx += cwid
        return x, y + rh, w, h - rh

    row, rest = [], list(areas)
    while rest:
        side = min(w, h)
        nxt = rest[0]
        if not row or worst(row + [nxt], side) <= worst(row, side):
            row.append(nxt)
            rest.pop(0)
        else:
            x, y, w, h = lay(row, x, y, w, h)
            row = []
    if row:
        lay(row, x, y, w, h)
    return rects


def repo_map(t, zones):
    c = THEMES[t]
    W, H = 1600, 900
    p = "m"
    s = [defs_common(c, p), backdrop(c, p, W, H)]
    total = sum(z["n"] for z in zones)
    s.append(T(48, 64, "REPO MAP", 16, c["cyan"], MONO, 700, ls=3))
    s.append(T(48, 104, f"{total} files, one picture. Every tile is a folder you can open.", 30, c["text"], SANS, 800, ls=-.5))
    items = sorted(((z["n"] + 9, z) for z in zones), key=lambda a: -a[0])
    for x, y, w, h, z in squarify(items, 48, 132, 1504, 696):
        col = c[z["col"]]
        gx, gy, gw, gh = x + 4, y + 4, w - 8, h - 8
        s.append(f'<rect x="{gx:.1f}" y="{gy:.1f}" width="{gw:.1f}" height="{gh:.1f}" rx="14" fill="{col}" fill-opacity=".11" stroke="{col}" stroke-opacity=".7" stroke-width="1.5"/>')
        big = gw > 300 and gh > 150
        mid = gw > 180 and gh > 100
        fs0 = 22 if big else (18 if mid else 15)
        avail = gw - 36
        fs = max(11, min(fs0, avail / (len(z["path"]) * 0.62)))
        cs = 38 if big else (28 if mid else 22)
        s.append(T(f"{gx + 18:.1f}", f"{gy + 16 + fs:.1f}", esc(z["path"]), f"{fs:.1f}", c["text"], MONO, 700))
        s.append(T(f"{gx + 18:.1f}", f"{gy + 16 + fs + 12 + cs * .8:.1f}", f'{z["n"]} files', cs, col, SANS, 800, ls=-1))
        if big or mid:
            lines = z["role"].split("|")[: 3 if big else 2]
            rs = 16 if big else 14
            fit = []
            for ln in lines:
                size = min(rs, avail / (len(ln) * 0.5))
                if size >= 11.5:
                    fit.append((ln, size))
            for i, (ln, size) in enumerate(fit):
                s.append(T(f"{gx + 18:.1f}", f"{gy + gh - 18 - (len(fit) - 1 - i) * 22:.1f}", esc(ln), f"{size:.1f}", c["muted"], SANS, 400))
    s.append(T(48, 868, "Tile area is softened (files + 9) so small folders stay readable. Counts are exact. Hidden folders such as .github are not included.", 15, c["faint"], MONO, 500))
    return wrap(W, H, "".join(s), "Repository map", f"Treemap of {total} files grouped by folder: UI primitives, modules, site shell, content data, app routes, paper, public assets and scripts.")


# =====================================================================================
# 6. DIVIDER + SOCIAL CARD
# =====================================================================================
def divider():
    W, H = 1600, 26
    body = (f'<defs><linearGradient id="dv" x1="0" x2="1"><stop offset="0" stop-color="#22d3ee" stop-opacity="0"/>'
            f'<stop offset=".22" stop-color="#22d3ee"/><stop offset=".5" stop-color="#8b5cf6"/><stop offset=".78" stop-color="#fb7185"/>'
            f'<stop offset="1" stop-color="#fb7185" stop-opacity="0"/></linearGradient></defs>'
            f'<rect x="40" y="12" width="1520" height="2.5" rx="1.25" fill="url(#dv)" opacity=".85"/>'
            f'<circle cy="13.25" r="5" fill="#22d3ee"><animate attributeName="cx" dur="6s" repeatCount="indefinite" values="120;1480;120" keyTimes="0;.5;1" calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1"/>'
            f'<animate attributeName="fill" dur="6s" repeatCount="indefinite" values="#22d3ee;#fb7185;#22d3ee"/></circle>')
    return wrap(W, H, body, "Section divider", "A thin gradient rule with a moving dot.")


def social():
    body, W, H = banner_inner("dark", static=True, p="sp")
    c = THEMES["dark"]
    inner = (f'<rect width="1280" height="640" fill="{c["bg"]}"/>'
             f'<g transform="translate(0 52) scale(.8)">{body}</g>'
             + T(64, 38, "github.com/Hunterdii/weights-are-code", 20, c["muted"], MONO, 500)
             + T(1216, 38, "MIT · CC BY 4.0", 18, c["faint"], MONO, 500, anchor="end")
             + f'<rect x="0" y="560" width="1280" height="80" fill="{c["panel"]}"/><line x1="0" x2="1280" y1="560" y2="560" stroke="{c["line"]}"/>'
             + T(64, 611, "weight-space-atlas.vercel.app", 28, c["cyan"], SANS, 800)
             + T(1216, 611, "Explore the live atlas →", 22, c["muted"], SANS, 600, anchor="end"))
    return wrap(1280, 640, inner, "Weights Are Code social card", "Social preview card for the weights-are-code repository.")


# =====================================================================================
def write(name, svg):
    path = os.path.join(OUT, name)
    with open(path, "w", encoding="utf-8") as f:
        f.write(svg)
    return path


def png(svg_path, width):
    exe = shutil.which("rsvg-convert")
    if exe:
        subprocess.run([exe, "-w", str(width), "-o", svg_path[:-4] + ".png", svg_path], check=True)


def main(zones):
    os.makedirs(OUT, exist_ok=True)
    for t in ("dark", "light"):
        write(f"banner-{t}.svg", banner(t))
        # static twin only for PNG rendering
        tmp = write(f"_static-banner-{t}.svg", banner(t, static=True))
        png(tmp, 3200)
        os.replace(tmp[:-4] + ".png", os.path.join(OUT, f"banner-{t}.png"))
        os.remove(tmp)
        for name, fn, wpx in (("stats", stats, 3200), ("two-ways", two_ways, 3200), ("architecture", architecture, 3200)):
            png(write(f"{name}-{t}.svg", fn(t)), wpx)
        png(write(f"repo-map-{t}.svg", repo_map(t, zones)), 3200)
    write("divider.svg", divider())
    png(write("social-preview.svg", social()), 2560)


if __name__ == "__main__":
    ZONES = [
        dict(path="src/components/ui", n=49, col="slate", role="48 shadcn/ui primitives|+ one custom Link"),
        dict(path="src/components/modules", n=20, col="cyan", role="M1–M15 interactive modules|FingerprintLab · SurgeryPreview|ModuleChrome · registry"),
        dict(path="src/components/site", n=12, col="violet", role="Header · Footer · WeightHero|CommandMenu · TruthSync|PersonaNavigator …"),
        dict(path="src/components/content", n=8, col="green", role="Badge · CiteBox · Formula|DataTable · CodeBlock …"),
        dict(path="chapters · figures", n=5, col="blue", role="src/components/ · body, TOC, rails|figure registry"),
        dict(path="src/content", n=19, col="amber", role="13 chapters · facts · formulas|glossary · references · levels"),
        dict(path="src/app", n=22, col="coral", role="26 static routes (App Router)|layout · error · sitemap · manifest"),
        dict(path="src/{hooks,lib,state}", n=4, col="blue", role="Zustand store · helpers"),
        dict(path="paper", n=23, col="violet", role="LaTeX source · 13 vector figures|print + cover HTML · BUILD.md"),
        dict(path="public", n=20, col="green", role="4 labs · fact-sheet.json · llms.txt|whitepaper.pdf · icons · OG image"),
        dict(path="scripts", n=5, col="amber", role="fact sheet · KaTeX|SEO · static server"),
        dict(path="repo root", n=13, col="slate", role="package.json · next.config|tailwind · eslint · deploy"),
    ]
    main(ZONES)
    print("done ->", OUT)
