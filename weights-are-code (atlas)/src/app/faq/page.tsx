"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { SEO_FAQS, FaqItem } from "@/content/seoFaq";
import {
  HelpCircle,
  Search,
  ChevronDown,
  Layers,
  ArrowRight,
  Sparkles,
  BookOpen,
  FlaskConical,
  X,
  CheckCircle2,
} from "lucide-react";

export default function FaqPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [openItems, setOpenItems] = useState<Record<number, boolean>>({ 0: true, 1: true });

  const categories = useMemo(() => {
    return ["All", "Fundamentals", "Techniques", "Tools & Implementation", "Compliance"];
  }, []);

  const filteredFaqs = useMemo(() => {
    return SEO_FAQS.map((faq, originalIndex) => ({ ...faq, originalIndex })).filter((faq) => {
      const matchesCategory =
        selectedCategory === "All" || faq.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === "" ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answerPlain.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const toggleItem = (idx: number) => {
    setOpenItems((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const expandAll = () => {
    const allOpen: Record<number, boolean> = {};
    filteredFaqs.forEach((f) => {
      allOpen[f.originalIndex] = true;
    });
    setOpenItems(allOpen);
  };

  const collapseAll = () => {
    setOpenItems({});
  };

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-10 sm:px-6 lg:px-10 space-y-12">
      {/* Top Breadcrumb & Hero */}
      <div className="space-y-4 max-w-4xl">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md">
          <HelpCircle className="size-3.5 text-[var(--wsp-chrome)]" />
          <span>KNOWLEDGE BASE · TECHNICAL &amp; OPERATIONAL FAQS</span>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.08]">
          Frequently Asked Questions
        </h1>

        <p className="font-serif text-lg sm:text-xl leading-relaxed text-muted-foreground">
          Empirical, architectural, and operational answers to core questions about Weight-Space Programming (WSP), rank-1 parameter surgery, mechanistic interpretability, and replication hardware requirements.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Link
            href="/read"
            className="inline-flex h-9 items-center gap-2 rounded-xl bg-foreground text-background px-4 font-sans text-xs font-bold transition-all hover:opacity-90 shadow-2xs"
          >
            <BookOpen className="size-3.5" />
            <span>Read 13-Chapter Guide</span>
            <ArrowRight className="size-3.5" />
          </Link>
          <Link
            href="/prologue"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-card px-4 font-sans text-xs font-semibold text-foreground transition-all hover:bg-accent"
          >
            <Sparkles className="size-3.5 text-[var(--wsp-chrome)]" />
            <span>Prologue &amp; Foundations</span>
          </Link>
          <Link
            href="/experiments"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-border/80 bg-card px-4 font-sans text-xs font-semibold text-muted-foreground transition-all hover:text-foreground hover:bg-accent"
          >
            <Layers className="size-3.5 text-[var(--wsp-blue)]" />
            <span>The 8 Experiments</span>
          </Link>
        </div>
      </div>

      {/* Interactive Controls Bar: Search & Category Chips */}
      <div className="rounded-2xl border border-border/80 bg-card/60 p-4 sm:p-6 backdrop-blur-md space-y-4 shadow-xs">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-xl">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search parameter surgery, hardware, Qwen, LoRA, directions..."
              aria-label="Search frequently asked questions"
              className="w-full h-10 rounded-xl border border-border/90 bg-background/90 pl-10 pr-9 font-sans text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[var(--wsp-chrome)]/40 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5"
                aria-label="Clear search query"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Quick Expand / Collapse Actions */}
          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground shrink-0">
            <button
              type="button"
              onClick={expandAll}
              className="rounded-lg border border-border/70 px-2.5 py-1.5 hover:bg-accent hover:text-foreground transition-colors"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={collapseAll}
              className="rounded-lg border border-border/70 px-2.5 py-1.5 hover:bg-accent hover:text-foreground transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/60">
          <span className="font-mono text-[11px] text-muted-foreground uppercase tracking-wider mr-1">
            Category:
          </span>
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            const count =
              cat === "All"
                ? SEO_FAQS.length
                : SEO_FAQS.filter((f) => f.category === cat).length;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-lg px-3 py-1 font-mono text-xs font-medium transition-all ${
                  isActive
                    ? "bg-foreground text-background shadow-2xs font-semibold"
                    : "border border-border/70 bg-card/60 text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {cat} <span className="opacity-70 text-[10px]">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Accordion FAQ List */}
      <div className="space-y-3">
        {filteredFaqs.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-3">
            <HelpCircle className="size-8 text-muted-foreground mx-auto opacity-50" />
            <h3 className="font-sans text-base font-semibold text-foreground">
              No matching questions found
            </h3>
            <p className="font-serif text-xs text-muted-foreground max-w-md mx-auto">
              We couldn&apos;t find any questions matching &ldquo;{searchQuery}&rdquo;. Try clearing your search query or selecting a different category.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border/80 bg-card px-3 font-sans text-xs font-semibold hover:bg-accent"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.originalIndex];
            return (
              <div
                key={faq.question}
                className="group rounded-2xl border border-border/80 bg-card/60 backdrop-blur-md transition-all duration-200 hover:border-border hover:shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.originalIndex)}
                  className="w-full flex items-start justify-between gap-4 p-5 text-left transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1.5 flex-1 pr-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--wsp-chrome)] bg-[color-mix(in_oklab,var(--wsp-chrome)_10%,transparent)] px-2 py-0.5 rounded-md">
                        {faq.category}
                      </span>
                    </div>
                    <h2 className="font-sans text-sm sm:text-base font-bold text-foreground group-hover:text-[var(--wsp-chrome)] transition-colors leading-snug">
                      {faq.question}
                    </h2>
                  </div>
                  <div
                    className={`size-7 rounded-lg border border-border/80 flex items-center justify-center shrink-0 transition-transform duration-200 mt-0.5 ${
                      isOpen
                        ? "rotate-180 bg-accent text-foreground"
                        : "bg-background text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    <ChevronDown className="size-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-1 border-t border-border/40 animate-in fade-in-50 duration-150">
                    <div
                      className="font-serif text-xs sm:text-sm text-muted-foreground leading-relaxed space-y-2 [&_strong]:text-foreground [&_strong]:font-semibold [&_code]:font-mono [&_code]:text-xs [&_code]:bg-accent [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-foreground"
                      dangerouslySetInnerHTML={{ __html: faq.answerHtml }}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Next Step Exploration Banner */}
      <div className="rounded-2xl border border-border/80 bg-card/40 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <span className="font-mono text-[11px] font-bold text-[var(--wsp-green)] uppercase tracking-wider">
            Hands-on Verification
          </span>
          <h3 className="font-sans text-lg sm:text-xl font-bold text-foreground">
            Explore the Zero-Gradient Atari Weight Reader Live
          </h3>
          <p className="font-serif text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Witness how 17,253 unlabeled weight floats reveal Breakout and Pong policies purely through first-layer spatial L2 geometry without executing a forward pass.
          </p>
        </div>
        <Link
          href="/#fingerprints"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-foreground text-background px-5 font-sans text-xs font-bold transition-all hover:opacity-90 shadow-2xs shrink-0"
        >
          <Sparkles className="size-3.5" />
          <span>Open Fingerprint Lab</span>
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

