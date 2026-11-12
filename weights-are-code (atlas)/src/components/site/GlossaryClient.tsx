"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, X, BookOpen, Sparkles, Filter, Check, Copy, ArrowUpRight, Hash } from "lucide-react";
import { CHAPTERS } from "@/content/chapters";
import type { Term } from "@/content/glossary";

const CATEGORIES = [
  { id: "all", label: "All Terms", count: 60, icon: Hash },
  {
    id: "geometry",
    label: "Weight Space & Geometry",
    keywords: ["parameter", "weight", "bias", "theta", "p (", "architecture", "space", "mlp", "tanh", "receptive", "forward pass", "delta", "gradient", "learning rate", "loss", "sgd", "residual"],
  },
  {
    id: "circuits",
    label: "Circuits & Mech Interp",
    keywords: ["mechanistic", "transformer", "attention", "causal mask", "induction", "copying", "composition", "lora", "task arithmetic", "model editing", "activation", "tracr"],
  },
  {
    id: "experiments",
    label: "Experiments & Games",
    keywords: ["ddpm", "sycophancy", "kinetix", "minatar", "go (9x9)", "liberty", "ppo", "qwen", "gemma", "breakout", "asterix", "seaquest"],
  },
  {
    id: "verification",
    label: "Audits & Benchmarks",
    keywords: ["truth contract", "wsp-bench", "maier", "speculation", "negative control", "baseline", "paper", "review"],
  },
];

const SUGGESTED_QUERIES = ["rank-1", "0.016%", "induction head", "sycophancy", "Takehi", "Maier", "residual stream", "LoRA"];

/** Highlight query terms inside matching text cleanly */
function Highlighted({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&")})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={i}
            className="rounded-sm bg-[color-mix(in_oklab,var(--wsp-chrome)_25%,transparent)] text-foreground font-semibold px-0.5"
          >
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
}

export default function GlossaryClient({ terms }: { terms: Term[] }) {
  const [q, setQ] = useState("");
  const [selectedCat, setSelectedCat] = useState("all");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [copiedTerm, setCopiedTerm] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Global hotkey: "/" to focus search, "Esc" to clear
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== inputRef.current) {
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "Escape" && document.activeElement === inputRef.current) {
        if (q) setQ("");
        else inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [q]);

  // Available initial letters
  const letters = useMemo(() => {
    const set = new Set<string>();
    terms.forEach((t) => {
      const char = t.t[0].toUpperCase();
      if (/[A-Z]/.test(char)) set.add(char);
    });
    return Array.from(set).sort();
  }, [terms]);

  // Compute category counts
  const categoryWithCounts = useMemo(() => {
    return CATEGORIES.map((cat) => {
      if (cat.id === "all") return { ...cat, count: terms.length };
      const count = terms.filter((t) => {
        const text = (t.t + " " + t.d).toLowerCase();
        return cat.keywords?.some((k) => text.includes(k));
      }).length;
      return { ...cat, count };
    });
  }, [terms]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const cat = CATEGORIES.find((c) => c.id === selectedCat);

    return terms.filter((t) => {
      // Search text match
      const matchesSearch =
        !needle ||
        t.t.toLowerCase().includes(needle) ||
        t.d.toLowerCase().includes(needle);

      // Letter match
      const matchesLetter = !activeLetter || t.t.toUpperCase().startsWith(activeLetter);

      // Category match
      let matchesCat = true;
      if (cat && cat.id !== "all" && cat.keywords) {
        const text = (t.t + " " + t.d).toLowerCase();
        matchesCat = cat.keywords.some((k) => text.includes(k));
      }

      return matchesSearch && matchesLetter && matchesCat;
    });
  }, [q, selectedCat, activeLetter, terms]);

  const copyTerm = (term: Term) => {
    const text = `${term.t}: ${term.d}`;
    navigator.clipboard.writeText(text);
    setCopiedTerm(term.t);
    setTimeout(() => setCopiedTerm(null), 1800);
  };

  return (
    <div className="space-y-10">
      {/* ========================================================
          FORGE UI ANIMATED SEARCH BAR & HUD
          ======================================================== */}
      <div className="space-y-4">
        {/* Animated Gradient Beam Wrapper */}
        <div
          className={`forge-beam-container transition-all duration-300 ${
            isFocused ? "shadow-[0_0_35px_-5px_color-mix(in_oklab,var(--wsp-chrome)_45%,transparent)]" : ""
          }`}
        >
          <div className="forge-beam-inner flex items-center gap-3 px-4 py-2 sm:px-5">
            {/* Search Icon with Radar Ping */}
            <div className="relative flex size-8 shrink-0 items-center justify-center rounded-xl bg-accent/40 text-[var(--wsp-chrome)]">
              <Search className="size-4.5" />
              {isFocused && (
                <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-[var(--wsp-chrome)] animate-ping" />
              )}
            </div>

            {/* Pure clean search input - NO webkit cancel button clash! */}
            <input
              ref={inputRef}
              type="text"
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setActiveLetter(null);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Search 60 terms by name, mathematical formula, or concept (e.g. 'rank-1', '0.016%', 'induction')..."
              aria-label="Filter glossary terms"
              className="clean-focus h-12 w-full bg-transparent font-sans text-sm sm:text-base text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-0 border-none shadow-none"
            />

            {/* Clear Button */}
            {q && (
              <button
                onClick={() => {
                  setQ("");
                  inputRef.current?.focus();
                }}
                className="group flex size-7 shrink-0 items-center justify-center rounded-lg bg-accent/50 text-muted-foreground hover:bg-destructive/20 hover:text-destructive transition-all"
                aria-label="Clear search query"
                title="Clear (Esc)"
              >
                <X className="size-3.5 transition-transform group-hover:rotate-90" />
              </button>
            )}

            {/* Keyboard shortcut pill */}
            <div className="hidden sm:flex items-center gap-1.5 pl-2 border-l border-border/60 shrink-0">
              <kbd className="kbd text-[10px] opacity-75">/</kbd>
              <span className="font-mono text-[10px] text-muted-foreground">focus</span>
            </div>

            {/* Live Count HUD */}
            <div className="flex items-center gap-1.5 pl-3 border-l border-border/60 shrink-0">
              <span className="size-2 rounded-full bg-[var(--wsp-green)] animate-pulse" />
              <span className="font-mono text-xs font-bold text-foreground tabular-nums">
                {filtered.length}
              </span>
              <span className="font-mono text-[11px] text-muted-foreground">/ {terms.length}</span>
            </div>
          </div>
        </div>

        {/* Suggested Quick Queries Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs text-muted-foreground">
          <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground mr-1 flex items-center gap-1">
            <Sparkles className="size-3 text-[var(--wsp-chrome)]" />
            Quick terms:
          </span>
          {SUGGESTED_QUERIES.map((sug) => (
            <button
              key={sug}
              onClick={() => {
                setQ(sug);
                setActiveLetter(null);
                inputRef.current?.focus();
              }}
              className="rounded-full border border-border/70 bg-card/60 px-2.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-all hover:border-[var(--wsp-chrome)]/60 hover:bg-[color-mix(in_oklab,var(--wsp-chrome)_12%,transparent)] hover:text-foreground"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Category Matrix Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2" role="group" aria-label="Filter by domain">
          {categoryWithCounts.map((cat) => {
            const active = selectedCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCat(cat.id);
                  setActiveLetter(null);
                }}
                aria-pressed={active}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 font-sans text-xs font-semibold transition-all duration-200 ${
                  active
                    ? "bg-[var(--wsp-chrome)] text-[#090c12] shadow-md shadow-[var(--wsp-chrome)]/20 scale-[1.02]"
                    : "border border-border/70 bg-card/70 text-muted-foreground hover:bg-accent hover:text-foreground hover:border-border"
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                    active ? "bg-black/20 text-[#090c12]" : "bg-accent text-muted-foreground"
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Alphabet Scrubber Bar */}
        <div className="flex flex-wrap items-center gap-1 border-t border-border/60 pt-4">
          <span className="font-mono text-[10px] uppercase text-muted-foreground mr-2 font-bold flex items-center gap-1">
            <Filter className="size-3 text-muted-foreground" /> Initial:
          </span>
          <button
            onClick={() => setActiveLetter(null)}
            className={`rounded-lg px-2.5 py-1 font-mono text-xs font-semibold transition-all ${
              activeLetter === null
                ? "bg-accent font-bold text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
            }`}
          >
            All
          </button>
          {letters.map((l) => {
            const active = activeLetter === l;
            return (
              <button
                key={l}
                onClick={() => {
                  setActiveLetter(active ? null : l);
                  setQ("");
                }}
                className={`size-7 rounded-lg font-mono text-xs font-bold transition-all ${
                  active
                    ? "bg-[var(--wsp-chrome)] text-[#090c12] shadow-sm scale-105"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/60"
                }`}
              >
                {l}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          TERMS DICTIONARY GRID - EXPANDED FULL-WIDTH 3D CARDS
          ======================================================== */}
      <dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((t) => {
          const ch = t.ch ? CHAPTERS[t.ch - 1] : undefined;
          const isCopied = copiedTerm === t.t;
          return (
            <div
              key={t.t}
              id={t.t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}
              className="card-3d group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-sm transition-all duration-300 hover:border-[var(--wsp-chrome)]/60"
            >
              <div>
                {/* Header row with Term Title & Chapter Tag */}
                <div className="flex items-start justify-between gap-3 border-b border-border/50 pb-3">
                  <dt className="font-sans text-base font-bold text-foreground leading-snug group-hover:text-[var(--wsp-chrome)] transition-colors">
                    <Highlighted text={t.t} query={q} />
                  </dt>
                  {ch && (
                    <Link
                      href={`/read/${ch.slug}`}
                      prefetch={false}
                      className="font-mono text-[10px] font-semibold text-[var(--wsp-chrome)] border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_12%,transparent)] px-2.5 py-1 rounded-full shrink-0 hover:bg-[var(--wsp-chrome)] hover:text-[#090c12] transition-all flex items-center gap-1"
                      title={`Read Chapter ${t.ch}: ${ch.title}`}
                    >
                      <span>Ch {t.ch}</span>
                      <ArrowUpRight className="size-2.5" />
                    </Link>
                  )}
                </div>

                {/* Definition prose with query highlighting */}
                <dd className="mt-3.5 font-serif text-sm leading-relaxed text-foreground/85">
                  <Highlighted text={t.d} query={q} />
                </dd>
              </div>

              {/* Card Footer: Copy button & provenance */}
              <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-mono text-[10px] opacity-60">
                  {t.ch ? `Guide canonical · Ch ${t.ch}` : "Foundational AI parameter"}
                </span>
                <button
                  onClick={() => copyTerm(t)}
                  className="inline-flex items-center gap-1 font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-accent"
                  title="Copy definition"
                >
                  {isCopied ? (
                    <>
                      <Check className="size-3 text-[var(--wsp-green)]" />
                      <span className="text-[var(--wsp-green)]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3 opacity-60" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </dl>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-border/80 p-12 text-center space-y-4 bg-card/40">
          <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-accent/60 text-muted-foreground">
            <Search className="size-6" />
          </div>
          <div className="space-y-1">
            <p className="font-sans text-base font-bold text-foreground">
              No glossary terms match “{q}”
            </p>
            <p className="font-serif text-sm text-muted-foreground max-w-md mx-auto">
              Try exploring concepts like <strong className="text-foreground">rank-1</strong>, <strong className="text-foreground">attention</strong>, <strong className="text-foreground">residual stream</strong>, or reset the filters.
            </p>
          </div>
          <button
            onClick={() => {
              setQ("");
              setSelectedCat("all");
              setActiveLetter(null);
            }}
            className="mt-2 rounded-xl bg-[var(--wsp-chrome)] px-5 py-2.5 font-sans text-xs font-bold text-[#090c12] shadow-sm hover:brightness-110 transition-all"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
