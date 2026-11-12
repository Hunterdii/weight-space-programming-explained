import type { Metadata } from "next";
import M15Quiz from "@/components/modules/M15Quiz";
import { ListChecks, Award, Sparkles, CheckCircle2, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Cognitive Mastery Quiz - 15 Diagnostic Questions",
  description: "Test your comprehension from basic parameter representations to experimental design, control mechanics, and proposing WSP benchmarks.",
};

export default function QuizPage() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-12 sm:px-6 lg:px-10 space-y-12">
      {/* Header & Context */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md">
          <ListChecks className="size-3.5 text-[var(--wsp-chrome)]" />
          <span>MODULE M15 · 15 DIAGNOSTIC QUESTIONS · EMPIRICAL MECHANISM MASTERY</span>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Cognitive Mastery Assessment
        </h1>

        <p className="max-w-[85ch] font-serif text-lg leading-relaxed text-muted-foreground">
          Fifteen diagnostic questions spanning the full scope of Weight-Space Programming. Every single option includes an evidence-badged explanation so every wrong answer clarifies an underlying mechanism.
        </p>

        {/* 3 Tracks Preview Bar */}
        <div className="grid gap-3 sm:grid-cols-3 pt-2">
          <div className="rounded-xl border border-border/70 bg-card/60 p-3.5">
            <span className="font-mono text-xs font-bold text-[var(--wsp-blue)] block">
              Section 1 · Q1–Q5
            </span>
            <span className="font-sans text-xs font-bold text-foreground mt-0.5 block">
              Foundations &amp; Mechanisms
            </span>
            <span className="font-serif text-[11px] text-muted-foreground block mt-1">
              Weight coordinates, attention induction heads, and parameter scales.
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-3.5">
            <span className="font-mono text-xs font-bold text-[var(--wsp-chrome)] block">
              Section 2 · Q6–Q10
            </span>
            <span className="font-sans text-xs font-bold text-foreground mt-0.5 block">
              The 8 Experiments
            </span>
            <span className="font-serif text-[11px] text-muted-foreground block mt-1">
              Ramp car repair, diffusion shape reading, and Go policy synthesis.
            </span>
          </div>

          <div className="rounded-xl border border-border/70 bg-card/60 p-3.5">
            <span className="font-mono text-xs font-bold text-[var(--wsp-green)] block">
              Section 3 · Q11–Q15
            </span>
            <span className="font-sans text-xs font-bold text-foreground mt-0.5 block">
              Judgment &amp; Controls
            </span>
            <span className="font-serif text-[11px] text-muted-foreground block mt-1">
              Negative controls, baseline requirements, and benchmark protocols.
            </span>
          </div>
        </div>
      </div>

      {/* Quiz Module Component */}
      <div className="pt-2">
        <M15Quiz />
      </div>
    </div>
  );
}

