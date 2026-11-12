import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CHAPTERS, PARTS, chapterBySlug } from "@/content/chapters";
import ChapterBody from "@/components/chapters/ChapterBody";
import ChapterCurriculumRail from "@/components/chapters/ChapterCurriculumRail";
import ChapterTocRail from "@/components/chapters/ChapterTocRail";
import { ArrowLeft, ArrowRight, BookOpen, Clock, ChevronRight } from "lucide-react";

export function generateStaticParams() {
  return CHAPTERS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const ch = chapterBySlug(slug);
  if (!ch) return {};
  return {
    title: `Ch ${ch.number}: ${ch.title}`,
    description: `${ch.kicker} - ${ch.intro.slice(0, 140)}...`,
  };
}

const PART_COLORS: Record<number, string> = {
  1: "var(--wsp-chrome)",
  2: "var(--wsp-blue)",
  3: "var(--wsp-green)",
  4: "var(--wsp-red)",
};

export default async function ChapterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ch = chapterBySlug(slug);
  if (!ch) notFound();
  const part = PARTS.find((p) => p.n === ch.part)!;
  const prev = CHAPTERS[ch.number - 2];
  const next = CHAPTERS[ch.number];

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-8 sm:px-6 lg:px-10 w-full">
      {/* 3-Column Architecture: Left Curriculum Rail + Center Stage + Right TOC/Telemetry Rail */}
      <div className="flex flex-col xl:flex-row gap-8 xl:gap-12 items-start justify-center w-full">
        {/* Left Rail: Curriculum outline */}
        <ChapterCurriculumRail
          currentSlug={ch.slug}
          currentPart={ch.part}
          currentChapterNumber={ch.number}
        />

        {/* Center Stage: Reading & Simulation Flow */}
        <article className="flex-1 min-w-0 max-w-full w-full order-2 xl:order-none">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="w-full mb-8 flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <Link href="/read" prefetch={false} className="hover:text-foreground transition-colors flex items-center gap-1">
              <BookOpen className="size-3" /> Guide
            </Link>
            <ChevronRight className="size-3 opacity-50" />
            <span style={{ color: PART_COLORS[ch.part] }}>Part {part.n}: {part.title}</span>
            <ChevronRight className="size-3 opacity-50" />
            <span className="text-foreground font-semibold">Chapter {ch.number}</span>
          </nav>

          {/* Chapter Editorial Header */}
          <header id="overview" className="w-full mb-12 border-b border-border/70 pb-8">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest" style={{ color: PART_COLORS[ch.part] }}>
              <span>Part {part.n}</span>
              <span>·</span>
              <span>Chapter {ch.number} of 13</span>
              <span>·</span>
              <span className="flex items-center gap-1 text-muted-foreground lowercase">
                <Clock className="size-3" /> {ch.minutes} min read
              </span>
            </div>

            <h1 className="mt-4 font-serif text-3xl font-black leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {ch.title}
            </h1>

            <p className="mt-4 font-serif text-lg sm:text-xl italic text-muted-foreground leading-relaxed max-w-5xl">
              {ch.kicker}
            </p>
          </header>

          {/* Chapter Body & Level Switcher */}
          <div className="w-full">
            <ChapterBody chapter={ch} />
          </div>

          {/* Next / Previous Chapter Navigation */}
          <nav id="chapter-navigation" aria-label="Chapter navigation" className="mt-16 w-full grid gap-4 sm:grid-cols-2 border-t border-border/80 pt-10">
            {prev ? (
              <Link
                href={`/read/${prev.slug}`}
                prefetch={false}
                className="card-hover group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5"
              >
                <span className="flex items-center gap-1.5 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  <ArrowLeft className="size-3.5" /> Previous: Chapter {prev.number}
                </span>
                <span className="mt-2 block font-serif text-base font-bold text-foreground group-hover:text-[var(--wsp-chrome)] transition-colors">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/40 p-5 flex items-center justify-center text-xs font-mono text-muted-foreground">
                Beginning of Guide (Chapter 1)
              </div>
            )}

            {next ? (
              <Link
                href={`/read/${next.slug}`}
                prefetch={false}
                className="card-hover group flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-5 text-right"
              >
                <span className="flex items-center justify-end gap-1.5 font-mono text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                  Next: Chapter {next.number} <ArrowRight className="size-3.5" />
                </span>
                <span className="mt-2 block font-serif text-base font-bold text-foreground group-hover:text-[var(--wsp-chrome)] transition-colors">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div className="rounded-2xl border border-dashed border-border/40 p-5 flex items-center justify-center text-xs font-mono text-muted-foreground">
                End of Guide (Chapter 13)
              </div>
            )}
          </nav>
        </article>

        {/* Right Rail: Table of Contents & Chapter Telemetry */}
        <ChapterTocRail chapter={ch} />
      </div>
    </div>
  );
}
