import type { Metadata } from "next";
import Link from "next/link";
import { Scale, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Use & License · Weight-Space Programming",
  description:
    "Open educational license, intellectual property terms, and scientific disclaimer for Weight-Space Programming.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-14 sm:px-6 lg:px-8 space-y-10">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-3.5" />
        <span>Return to Field Guide</span>
      </Link>

      <div className="space-y-3 border-b border-border/70 pb-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-card/60 px-3.5 py-1 font-mono text-xs text-muted-foreground">
          <Scale className="size-3.5 text-[var(--wsp-chrome)]" />
          <span>OPEN EDUCATIONAL LICENSE &amp; SCIENTIFIC TERMS</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Terms of Use &amp; License
        </h1>
        <p className="font-serif text-sm sm:text-base text-muted-foreground leading-relaxed">
          Weight-Space Programming is an independent educational monograph and interactive laboratory designed for academic researchers, machine learning engineers, and computer science students.
        </p>
      </div>

      <div className="space-y-8 font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed">
        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            1. Open Source Licensing
          </h2>
          <div className="space-y-2 text-muted-foreground">
            <p>
              <strong>Code:</strong> The codebase, including interactive simulation widgets, tensor renderers, and runnable Python labs, is licensed under the <strong>MIT License</strong>. You are free to inspect, fork, and adapt the code with attribution.
            </p>
            <p>
              <strong>Prose &amp; Schematics:</strong> All explanatory text, pedagogical schematics, and interactive figures are licensed under <strong>Creative Commons Attribution 4.0 International (CC BY 4.0)</strong>.
            </p>
          </div>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            2. Academic Attribution &amp; Primary Research Rights
          </h2>
          <p className="text-muted-foreground">
            All original empirical discoveries regarding Weight-Space Programming belong to Rikiya Takehi, Jayden Teoh, Alex Zhang, and Omar Khattab (MIT CSAIL, November 2026). When citing empirical findings, please reference the primary CSAIL publication.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            3. Independent Status Notice
          </h2>
          <div className="rounded-2xl border border-border/70 bg-card/60 p-4 font-serif text-xs leading-relaxed text-foreground/90 space-y-1">
            <p className="font-bold text-foreground">Mandatory Compliance Notice:</p>
            <p className="text-muted-foreground">
              Independent Status: Not affiliated with or endorsed by MIT CSAIL or OpenAI. Modules labelled <strong>Het’s Lab</strong> are independent pedagogical additions, clearly badged.
            </p>
          </div>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            4. Scientific Integrity &amp; Falsification Policy
          </h2>
          <p className="text-muted-foreground">
            This platform adheres strictly to empirical truth contracts. We explicitly flag which findings are paper-measured versus anecdotal single-run demonstrations. If you discover a replicability variance or factual error, we welcome public correction pull requests on GitHub.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            5. Disclaimer of Warranties
          </h2>
          <p className="text-muted-foreground">
            The software, interactive models, and pedagogical explanations are provided "as is", without warranty of any kind. In no event shall the authors or contributors be liable for any claim or damages resulting from the use of the materials.
          </p>
        </section>
      </div>
    </div>
  );
}

