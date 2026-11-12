import type { Metadata } from "next";
import Link from "next/link";
import { GLOSSARY } from "@/content/glossary";
import GlossaryClient from "@/components/site/GlossaryClient";
import { Bookmark, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Glossary - 60 Mechanistic & Weight-Space Terms",
  description: "Sixty definitions spanning neural network weights, rank-1 surgery, attention induction circuits, and benchmark protocols.",
};

export default function GlossaryPage() {
  return (
    <div className="mx-auto max-w-[1680px] px-4 py-12 sm:px-6 lg:px-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md">
          <Bookmark className="size-3.5 text-[var(--wsp-chrome)]" />
          <span>TECHNICAL DICTIONARY · 60 CANONICAL TERMS · FULL DOMAIN INDEX</span>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          Field Guide Glossary
        </h1>

        <p className="max-w-[85ch] font-serif text-lg leading-relaxed text-muted-foreground">
          Curated in pedagogical sequence: from fundamental parameter geometry to transformer circuit mechanics, empirical verification criteria, and benchmark protocols. Every entry directly anchors to its corresponding guide chapter.
        </p>
      </div>

      {/* Interactive Dictionary Component */}
      <GlossaryClient terms={GLOSSARY} />

      {/* Footer Navigation */}
      <div className="border-t border-border/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted-foreground">
        <span>Need full formal literature citations?</span>
        <div className="flex items-center gap-4">
          <Link href="/references" prefetch={false} className="text-[var(--wsp-chrome)] hover:underline flex items-center gap-1">
            <FileText className="size-3.5" /> 44 Verified Literature References <ArrowRight className="size-3" />
          </Link>
          <Link href="/quiz" prefetch={false} className="hover:text-foreground underline">
            Test on Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

