import type { Metadata } from "next";
import { REFERENCES, OPEN_ITEMS } from "@/content/references";
import { BadgeChip } from "@/components/content/Badge";
import { ExternalLink, FileText, CheckCircle2, ShieldCheck, AlertCircle } from "lucide-react";
import CiteBox from "@/components/content/CiteBox";

export const metadata: Metadata = {
  title: "References & Verification Ledger - 44 Literature Sources",
  description: "Complete bibliography of 44 verified sources with DOI/arXiv links, plus the standing honesty ledger of open unconfirmed items.",
};

const KIND_LABEL: Record<string, string> = {
  primary: "Primary Research Source",
  review: "Independent Third-Party Review",
  coverage: "Notable Research Coverage",
  background: "Foundational Literature & Lineage",
};

const KIND_COLOR: Record<string, string> = {
  primary: "var(--wsp-blue)",
  review: "var(--wsp-green)",
  coverage: "var(--wsp-amber)",
  background: "var(--muted-foreground)",
};

export default function ReferencesPage() {
  const kinds: (keyof typeof KIND_LABEL)[] = ["primary", "review", "coverage", "background"];

  return (
    <div className="mx-auto max-w-[1680px] px-4 py-12 sm:px-6 lg:px-10 space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-4 py-1.5 font-mono text-xs text-muted-foreground backdrop-blur-md">
          <FileText className="size-3.5 text-[var(--wsp-blue)]" />
          <span>LITERATURE LEDGER · 44 VERIFIED CITATIONS · ZERO FABRICATIONS</span>
        </div>

        <h1 className="font-serif text-3xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
          References &amp; The Honesty Ledger
        </h1>

        <p className="max-w-[85ch] font-serif text-lg leading-relaxed text-muted-foreground">
          Every citation below represents a verifiable primary paper, benchmark standard, or historical lineage document. Any claim or metric that could not be independently reproduced at build time is explicitly recorded in the standing Open Verification Ledger below.
        </p>

        {/* Quick BibTeX & APA Citation Box */}
        <CiteBox />
      </div>

      {/* Bibliography by Kind */}
      <div className="space-y-16">
        {kinds.map((k) => {
          const items = REFERENCES.filter((r) => r.kind === k);
          return (
            <section key={k} aria-labelledby={`kind-${k}`} className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/80 pb-3">
                <div className="flex items-center gap-2.5">
                  <span
                    className="size-3 rounded-full"
                    style={{ background: KIND_COLOR[k] }}
                    aria-hidden
                  />
                  <h2
                    id={`kind-${k}`}
                    className="font-sans text-sm font-bold uppercase tracking-wider text-foreground"
                  >
                    {KIND_LABEL[k]} ({items.length})
                  </h2>
                </div>
                <span className="font-mono text-xs text-muted-foreground">
                  {items.length} citations
                </span>
              </div>

              <div className="grid gap-3.5">
                {items.map((r) => (
                  <article
                    key={r.id}
                    className="card-hover rounded-2xl border border-border/80 bg-card p-5 space-y-2.5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <p className="font-serif text-sm leading-relaxed text-foreground/95">
                        <span className="font-bold text-foreground">{r.authors}</span> ({r.year}).{" "}
                        <span className="font-semibold">{r.title}</span>.{" "}
                        <em className="text-muted-foreground">{r.venue}</em>.
                      </p>

                      {r.url && (
                        <a
                          href={r.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-background/80 px-2.5 py-1 font-mono text-[11px] font-semibold text-[var(--wsp-chrome)] shrink-0 hover:bg-accent transition-colors"
                        >
                          Source <ExternalLink className="size-3" />
                        </a>
                      )}
                    </div>

                    {(r.note || r.verify) && (
                      <div className="border-t border-border/60 pt-2 space-y-1 text-xs">
                        {r.note && (
                          <p className="font-serif text-muted-foreground leading-relaxed">
                            <span className="font-sans font-bold text-foreground/80">Context:</span> {r.note}
                          </p>
                        )}
                        {r.verify && (
                          <div className="flex items-start gap-2 text-[var(--wsp-amber)] font-mono text-[11px]">
                            <span className="rounded border border-dashed border-[var(--wsp-amber)] px-1.5 py-0.2 bg-[color-mix(in_oklab,var(--wsp-amber)_10%,transparent)] font-bold">
                              [VERIFY]
                            </span>
                            <span>{r.verify}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* The Open Verification Items Table */}
      <section aria-labelledby="open-items" className="space-y-6 border-t border-border/80 pt-16">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BadgeChip b="schematic" />
            <span className="font-mono text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              Transparency Ledger
            </span>
          </div>

          <h2 id="open-items" className="font-sans text-2xl font-black tracking-tight text-foreground sm:text-3xl">
            Open Verification Items
          </h2>

          <p className="font-serif text-base leading-relaxed text-muted-foreground max-w-[72ch]">
            Items that could not be independently re-opened at initial build time (fact-check date: 7 Nov 2026; re-verified 8 Nov 2026). As replications and open-source harnesses land, items are updated here.
          </p>
        </div>

        <div className="table-scroll">
          <table className="wsp">
            <caption>Standing Ledger - {OPEN_ITEMS.length} tracked items</caption>
            <thead>
              <tr>
                <th scope="col" className="w-1/3">Target Item / Claim</th>
                <th scope="col" className="w-1/4">Location in Guide</th>
                <th scope="col">Verification Status</th>
              </tr>
            </thead>
            <tbody>
              {OPEN_ITEMS.map((o, idx) => (
                <tr key={idx}>
                  <td className="txt font-semibold text-foreground">{o.item}</td>
                  <td className="txt text-[var(--wsp-chrome)]">{o.where}</td>
                  <td className="txt text-muted-foreground leading-relaxed">{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

