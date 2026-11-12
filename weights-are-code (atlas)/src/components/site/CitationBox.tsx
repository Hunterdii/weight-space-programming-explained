"use client";

import { useState } from "react";
import { Copy, Check, FileCode2 } from "lucide-react";

const BIBTEX = `@misc{patel2026weightspace,
  title={Weight-Space Programming: An Interactive Field Guide},
  author={Patel, Het},
  year={2026},
  publisher={GitHub},
  howpublished={\\url{https://github.com/Hunterdii/weight-space-programming}},
  note={Based on MIT CSAIL research by Takehi, Teoh, Zhang, and Khattab}
}`;

export default function CitationBox() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(BIBTEX);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      // Fallback if clipboard API is blocked
      setCopied(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-3.5 shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <FileCode2 className="size-4 text-[var(--wsp-blue)]" />
          <h3 className="font-sans text-xs font-bold uppercase tracking-wider text-foreground">
            BibTeX Citation
          </h3>
        </div>
        <button
          onClick={handleCopy}
          aria-label={copied ? "BibTeX copied to clipboard" : "Copy BibTeX citation to clipboard"}
          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 font-mono text-[11px] font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            copied
              ? "border-[var(--wsp-green)] bg-[color-mix(in_oklab,var(--wsp-green)_15%,transparent)] text-[var(--wsp-green)]"
              : "border-border/80 bg-accent/40 text-foreground hover:bg-accent/80 hover:border-foreground/30 active:scale-95"
          }`}
        >
          {copied ? (
            <>
              <Check className="size-3.5" />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy className="size-3.5" />
              <span>Copy BibTeX</span>
            </>
          )}
        </button>
      </div>

      <pre className="overflow-x-auto rounded-xl border border-border/60 bg-muted/40 p-3 font-mono text-[11px] leading-relaxed text-muted-foreground select-all">
        <code>{BIBTEX}</code>
      </pre>

      <p className="font-serif text-[11px] text-muted-foreground leading-relaxed italic">
        When referencing this educational field guide alongside the CSAIL paper, please cite both this repository and Takehi et al. (2026).
      </p>
    </div>
  );
}
