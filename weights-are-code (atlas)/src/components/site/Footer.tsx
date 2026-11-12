import Link from "next/link";
import {
  FileDown,
  Github,
  Linkedin,
  ExternalLink,
  BookOpen,
  Layers,
  FlaskConical,
  ListChecks,
  Bookmark,
  FileText,
  Info,
  Sparkles,
  Command,
  Activity,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";

/**
 * Enhanced Weight-Space Programming Footer
 * - Strict 3-Equal-Column Grid with balanced rhythm and zero right-side dead space.
 * - Column 1: Identity, Attribution, MIT CSAIL research credit, independent explainer status, GitHub & MIT Paper links.
 * - Column 2: Curriculum & Chapter Exploration (13 Chapters, 4 Parts, Fingerprint Lab, Python Labs, Quiz, Glossary).
 * - Column 3: Research Whitepaper Download Card, 8 Experiments Evidence Room, 44 References, What Changed Feed.
 * - Bottom Bar: Copyright notice, legal policies, WCAG 2.2 AA compliance note, and sitemap.
 */
export default function Footer() {
  return (
    <footer className="site-footer mt-0 border-t border-border/80 bg-card/40">
      <div className="mx-auto max-w-[1680px] px-4 py-12 sm:px-6 lg:px-10">
        <div className="grid gap-8 sm:gap-10 md:grid-cols-3 items-start">
          {/* ========================================================
              COLUMN 1: IDENTITY, ATTRIBUTION & RESEARCH FOUNDATIONS
              ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_12%,transparent)] shadow-2xs">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" className="text-[var(--wsp-chrome)]" opacity="0.85" />
                  <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" className="text-[var(--wsp-blue)]" opacity="0.65" />
                  <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-[var(--wsp-chrome)]" />
                  <circle cx="12" cy="12" r="2.2" fill="currentColor" className="text-[var(--wsp-amber)]" />
                </svg>
              </div>
              <div>
                <h3 className="font-sans text-sm font-bold tracking-tight text-foreground">
                  The Weight Atlas
                </h3>
                <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  Inside Weight-Space Programming
                </p>
              </div>
            </div>

            <p className="font-serif text-sm leading-relaxed text-foreground">
              Designed, written and built by{" "}
              <a
                href="https://github.com/Hunterdii"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold underline decoration-border/80 underline-offset-4 hover:decoration-foreground hover:text-[var(--wsp-chrome)] transition-colors"
                title="Het Patel GitHub Profile (opens in new tab)"
              >
                Het Patel (Hunterdii)
                <span className="sr-only"> (opens in new tab)</span>
              </a>
              .
            </p>

            <p className="font-serif text-xs leading-relaxed text-muted-foreground">
              Based on the MIT CSAIL research report{" "}
              <a
                href="https://rikiyat.github.io/blog/weight-space-programming/"
                target="_blank"
                rel="noopener noreferrer"
                className="italic hover:text-foreground underline decoration-border/60 underline-offset-2 transition-colors"
                title="MIT CSAIL Sparks Post (opens in new tab)"
              >
                “Sparks of Weight-Space Programming: LLMs can natively read &amp; write neural network weights”
                <span className="sr-only"> (opens in new tab)</span>
              </a>{" "}
              by Rikiya Takehi, Jayden Teoh, Alex Zhang, and Omar Khattab (2 Nov 2026). All original empirical discovery belongs to the CSAIL team.
            </p>

            {/* Open Access & Licence Card */}
            <div className="rounded-xl border border-border/70 bg-background/50 p-3 text-xs text-muted-foreground">
              <p className="font-mono text-[11px]">
                Open Science Monograph · Code MIT · Prose &amp; Schematics CC BY 4.0.
              </p>
            </div>

            {/* Social & Research Pills (GitHub, LinkedIn, MIT Paper) */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <a
                href="https://github.com/Hunterdii/weight-space-programming-explained"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1.5 font-mono text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-2xs"
                title="GitHub Repository"
                aria-label="GitHub Repository (opens in new tab)"
              >
                <Github className="size-3.5 text-foreground" />
                <span>GitHub Repo</span>
              </a>
              <a
                href="https://github.com/Hunterdii"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1.5 font-mono text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-2xs"
                title="Het Patel GitHub Profile"
                aria-label="Het Patel GitHub Profile (opens in new tab)"
              >
                <Github className="size-3.5 text-foreground" />
                <span>@Hunterdii</span>
              </a>
              <a
                href="https://www.linkedin.com/in/patel-hetkumar-sandipbhai-8b110525a/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1.5 font-mono text-[11px] font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-all shadow-2xs"
                title="Het Patel LinkedIn Profile"
                aria-label="Het Patel LinkedIn Profile (opens in new tab)"
              >
                <Linkedin className="size-3.5 text-foreground" />
                <span>LinkedIn</span>
              </a>
              <a
                href="https://rikiyat.github.io/blog/weight-space-programming/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--wsp-chrome)]/60 bg-[color-mix(in_oklab,var(--wsp-chrome)_10%,transparent)] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-foreground hover:bg-[color-mix(in_oklab,var(--wsp-chrome)_20%,transparent)] transition-all shadow-2xs"
                title="MIT CSAIL Primary Research Post"
                aria-label="MIT CSAIL Research Report (opens in new tab)"
              >
                <ExternalLink className="size-3.5 text-[var(--wsp-chrome)]" />
                <span>MIT Paper</span>
              </a>
            </div>
          </div>

          {/* ========================================================
              COLUMN 2: CURRICULUM & EXPLORATION PATHWAYS
              ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="size-4 text-[var(--wsp-chrome)]" />
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-foreground">
                Curriculum &amp; Chapters
              </h3>
            </div>

            <Link
              href="/read"
              prefetch={false}
              className="group flex items-center justify-between rounded-xl border border-border/80 bg-card/60 px-3.5 py-2 font-sans text-xs font-semibold text-foreground transition-all hover:bg-accent hover:border-foreground/40 shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <BookOpen className="size-3.5 text-[var(--wsp-chrome)]" />
                <span>All 13 Chapters Curriculum</span>
              </div>
              <span className="font-mono text-[10px] text-muted-foreground">Index →</span>
            </Link>

            <div className="space-y-1">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-1">
                The Four Curriculum Parts
              </p>
              <nav aria-label="Curriculum Parts Navigation" className="flex flex-col gap-1 font-sans text-xs">
                {[
                  { href: "/read/1-pile-of-numbers", part: "Part I", title: "Foundations", chapters: "Ch 1–3" },
                  { href: "/read/4-read", part: "Part II", title: "The Experiments", chapters: "Ch 4–7" },
                  { href: "/read/8-measured-vs-anecdote", part: "Part III", title: "Judgement", chapters: "Ch 8–9" },
                  { href: "/read/10-what-comes-next", part: "Part IV", title: "Futures & Risks", chapters: "Ch 10–13" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className="group flex items-center justify-between rounded-lg px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
                  >
                    <span className="font-medium">
                      <span className="text-foreground">{item.part}</span> · {item.title}
                    </span>
                    <span className="font-mono text-[10px] text-muted-foreground group-hover:text-foreground">
                      {item.chapters}
                    </span>
                  </Link>
                ))}
              </nav>
            </div>

            <div className="space-y-1 pt-1">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground px-1">
                Key Interactive Modules
              </p>
              <div className="flex flex-col gap-1 font-sans text-xs">
                <Link
                  href="/read/1-pile-of-numbers"
                  prefetch={false}
                  className="group flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Sparkles className="size-3 text-[var(--wsp-chrome)] shrink-0" />
                  <span>Ch 1 · Foundations &amp; Weight Tensors</span>
                </Link>
                <Link
                  href="/read/5-fix"
                  prefetch={false}
                  className="group flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Sparkles className="size-3 text-[var(--wsp-amber)] shrink-0" />
                  <span>Ch 5 · The 0.016% Surgery on Qwen</span>
                </Link>
                <Link
                  href="/read/11-the-severe-stuff"
                  prefetch={false}
                  className="group flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Sparkles className="size-3 text-[var(--wsp-red)] shrink-0" />
                  <span>Ch 11 · M12 Tactical Risk Radar</span>
                </Link>
                <Link
                  href="/read/12-hets-lab"
                  prefetch={false}
                  className="group flex items-center gap-2 rounded-md px-2 py-1 text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Sparkles className="size-3 text-[var(--wsp-blue)] shrink-0" />
                  <span>Ch 12 · Het’s Lab &amp; WSP-Bench</span>
                </Link>
              </div>
            </div>
          </div>

          {/* ========================================================
              COLUMN 3: RESEARCH WHITEPAPER & INSTRUMENTS
              ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layers className="size-4 text-[var(--wsp-blue)]" />
              <h3 className="font-sans text-xs font-bold uppercase tracking-widest text-foreground">
                Whitepaper &amp; Instruments
              </h3>
            </div>

            {/* Research Whitepaper Download Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-sans text-xs font-bold text-foreground">
                  <FileText className="size-4 text-[var(--wsp-chrome)] shrink-0" />
                  <span>Research Whitepaper</span>
                </div>
                <span className="font-mono text-[9px] font-bold px-2 py-0.5 rounded-full border border-border/80 bg-accent/50 text-foreground">
                  Technical Paper · PDF
                </span>
              </div>
              <p className="font-serif text-xs leading-relaxed text-muted-foreground">
                The complete independent technical paper covering the eight canonical experiments, zero-gradient directional edits, and verification protocols.
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground border-t border-border/50 pt-2">
                <span>Standalone Document</span>
                <span className="text-[var(--wsp-chrome)] font-semibold">16.9 MB</span>
              </div>
              <a
                href="/whitepaper.pdf"
                download="weight-space-programming-whitepaper.pdf"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-foreground text-background px-3 py-2.5 font-sans text-xs font-bold transition-all hover:opacity-90 shadow-2xs group"
              >
                <FileDown className="size-3.5 transition-transform group-hover:-translate-y-0.5" />
                <span>Download Whitepaper (PDF)</span>
              </a>
            </div>

            {/* Research Instruments Links */}
            <nav aria-label="Research Instruments Navigation" className="flex flex-col gap-1 font-sans text-xs">
              {[
                { href: "/experiments", label: "The 8 Experiments Evidence Room", icon: Layers },
                { href: "/lab", label: "Runnable Python Labs (3 Scripts)", icon: FlaskConical },
                { href: "/quiz", label: "Cognitive Mastery Quiz (15 Qs)", icon: ListChecks },
                { href: "/glossary", label: "Domain Glossary (60+ Terms)", icon: Bookmark },
                { href: "/references", label: "44 Verified References & Citations", icon: FileText },
                { href: "/faq", label: "Frequently Asked Questions (FAQ)", icon: HelpCircle },
                { href: "/about", label: "Scoreboard & Audit Protocol", icon: Info },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    prefetch={false}
                    className="group flex items-center gap-2 rounded-md px-2.5 py-1.5 text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground"
                  >
                    <Icon className="size-3.5 text-muted-foreground transition-colors group-hover:text-foreground" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* ========================================================
            BOTTOM BAR: APPLE-STYLE LEGAL & PROVENANCE FOOTNOTE
            ======================================================== */}
        <div className="mt-10 border-t border-border/60 pt-6 space-y-3 text-xs text-muted-foreground">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 font-sans text-xs">
              <span className="font-medium text-foreground">© 2026 Het Patel (Hunterdii)</span>
              <span className="text-border hidden sm:inline" aria-hidden="true">|</span>
              <Link href="/about" prefetch={false} className="hover:text-foreground transition-colors">
                About
              </Link>
              <span className="text-border hidden sm:inline" aria-hidden="true">|</span>
              <Link href="/faq" prefetch={false} className="hover:text-foreground transition-colors">
                FAQs
              </Link>
              <span className="text-border hidden sm:inline" aria-hidden="true">|</span>
              <Link href="/privacy" prefetch={false} className="hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <span className="text-border hidden sm:inline" aria-hidden="true">|</span>
              <Link href="/terms" prefetch={false} className="hover:text-foreground transition-colors">
                Terms of Use
              </Link>
              <span className="text-border hidden sm:inline" aria-hidden="true">|</span>
              <Link href="/contact" prefetch={false} className="hover:text-foreground transition-colors">
                Contact &amp; Verification
              </Link>
              <span className="text-border hidden sm:inline" aria-hidden="true">|</span>
              <a href="/sitemap.xml" className="hover:text-foreground transition-colors">
                Site Map
              </a>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground shrink-0">
              <span className="size-1.5 rounded-full bg-[var(--wsp-green)]" />
              <span>WCAG 2.2 AA · Open Educational Monograph</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
