"use client";

import { useState } from "react";
import { Copy, Check, Quote, BookOpen } from "lucide-react";
import { toast } from "sonner";

const CITATIONS = {
  atlas: {
    title: "The Weight Atlas: Inside Weight-Space Programming (Monograph Edition)",
    bibtex: `@techreport{patel2026weightspace,
  title={The Weight Atlas: Inside Weight-Space Programming (Atlas Edition)},
  author={Patel, Het},
  year={2026},
  month={November},
  institution={Independent Monograph},
  url={https://weight-space-atlas.vercel.app/},
  note={45 pages, 40 illustrations, in-browser Atari fingerprint lab}
}`,
    apa: `Patel, H. (2026). The Weight Atlas: Inside Weight-Space Programming (Atlas Edition). Independent Monograph. https://weight-space-atlas.vercel.app/`,
  },
  csail: {
    title: "Sparks of Weight-Space Programming (MIT CSAIL Primary Post)",
    bibtex: `@article{takehi2026weightspace,
  title={Sparks of Weight-Space Programming: LLMs can natively read and write neural network weights},
  author={Takehi, Rikiya and Teoh, Jayden and Zhang, Alex and Khattab, Omar},
  journal={MIT CSAIL Blog},
  year={2026},
  month={November},
  url={https://rikiyat.github.io/blog/weight-space-programming/}
}`,
    apa: `Takehi, R., Teoh, J., Zhang, A., & Khattab, O. (2026). Sparks of Weight-Space Programming: LLMs can natively read and write neural network weights. MIT CSAIL. https://rikiyat.github.io/blog/weight-space-programming/`,
  },
};

export default function CiteBox() {
  const [selectedTarget, setSelectedTarget] = useState<"atlas" | "csail">("atlas");
  const [selectedFormat, setSelectedFormat] = useState<"bibtex" | "apa">("bibtex");
  const [copied, setCopied] = useState(false);

  const textToCopy = CITATIONS[selectedTarget][selectedFormat];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      toast.success("Citation copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy citation");
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card p-5 space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/70 pb-3">
        <div className="flex items-center gap-2">
          <Quote className="size-4 text-[var(--wsp-chrome)]" />
          <h3 className="font-sans text-sm font-bold text-foreground">
            Cite This Research &amp; Monograph
          </h3>
        </div>

        {/* Source Switcher */}
        <div className="flex items-center gap-1 rounded-xl border border-border/70 bg-accent/30 p-1">
          <button
            onClick={() => setSelectedTarget("atlas")}
            className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition-all ${
              selectedTarget === "atlas"
                ? "bg-foreground text-background shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            The Weight Atlas (Patel)
          </button>
          <button
            onClick={() => setSelectedTarget("csail")}
            className={`rounded-lg px-2.5 py-1 font-mono text-[11px] font-bold transition-all ${
              selectedTarget === "csail"
                ? "bg-foreground text-background shadow-2xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            MIT CSAIL Post (Takehi et al.)
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="font-serif text-xs text-muted-foreground">
          {CITATIONS[selectedTarget].title}
        </span>

        {/* Format Switcher */}
        <div className="flex items-center gap-1 font-mono text-[10px]">
          <button
            onClick={() => setSelectedFormat("bibtex")}
            className={`px-2 py-0.5 rounded ${
              selectedFormat === "bibtex"
                ? "bg-accent text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            BibTeX
          </button>
          <button
            onClick={() => setSelectedFormat("apa")}
            className={`px-2 py-0.5 rounded ${
              selectedFormat === "apa"
                ? "bg-accent text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            APA
          </button>
        </div>
      </div>

      {/* Code Display Box */}
      <div className="relative rounded-xl border border-border/70 bg-background/80 p-3.5 font-mono text-xs overflow-x-auto text-foreground/90">
        <pre className="whitespace-pre-wrap leading-relaxed">{textToCopy}</pre>
        <button
          onClick={handleCopy}
          className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-card px-2.5 py-1 font-sans text-[11px] font-semibold text-foreground hover:bg-accent transition-all shadow-2xs"
          title="Copy citation to clipboard"
        >
          {copied ? (
            <>
              <Check className="size-3 text-[var(--wsp-green)]" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="size-3 text-muted-foreground" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

