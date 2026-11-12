import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy · Weight-Space Programming",
  description:
    "Privacy and data minimization policy for the Weight-Space Programming interactive educational platform.",
};

export default function PrivacyPage() {
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
          <ShieldCheck className="size-3.5 text-[var(--wsp-green)]" />
          <span>DATA INTEGRITY &amp; PRIVACY CONTRACT</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="font-serif text-sm sm:text-base text-muted-foreground leading-relaxed">
          This educational monograph and interactive lab platform is engineered with strict client-side data minimization. We do not track, profile, or monetize your research activity.
        </p>
      </div>

      <div className="space-y-8 font-sans text-xs sm:text-sm text-foreground/90 leading-relaxed">
        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            1. Zero Tracking Cookies &amp; No Telemetry Beacons
          </h2>
          <p className="text-muted-foreground">
            We do not use advertising cookies, marketing trackers, fingerprinting scripts, or third-party behavioral analytics. All static assets, fonts, and interactive visualizers run directly in your browser.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            2. Client-Side Local Storage Usage
          </h2>
          <p className="text-muted-foreground">
            We store only strictly functional user preferences locally on your device via standard browser <code className="font-mono text-xs px-1.5 py-0.5 rounded bg-accent text-foreground">localStorage</code>:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
            <li><strong>Theme Preference:</strong> Remembers your chosen Dark or Light interface appearance.</li>
            <li><strong>Audience Rigor Ladder:</strong> Remembers your chosen depth level (L1 through L5).</li>
            <li><strong>Truth Filter State:</strong> Remembers whether strict empirical-only mode is toggled active.</li>
          </ul>
          <p className="text-muted-foreground">
            This data never leaves your browser and is never transmitted to our servers or third parties.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            3. Interactive Neural Code Execution
          </h2>
          <p className="text-muted-foreground">
            All tensor coordinate visualizers, Atari weight heatmaps, and threat radar simulations execute client-side via JavaScript and Canvas. We do not log inputs, parameter edits, or simulation scenarios.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            4. External Links &amp; Academic Papers
          </h2>
          <p className="text-muted-foreground">
            This site links to external academic repositories (such as arXiv, GitHub, and Hugging Face). Once you navigate to external domains, their respective privacy policies apply.
          </p>
        </section>

        <section className="space-y-2.5">
          <h2 className="font-sans text-base font-bold text-foreground">
            5. Inquiries &amp; Attribution
          </h2>
          <p className="text-muted-foreground">
            For questions regarding this policy or data practices, please open a public discussion on our GitHub repository or contact the author via LinkedIn.
          </p>
        </section>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/40 p-4 font-mono text-xs text-muted-foreground">
        Independent Status: Not affiliated with or endorsed by MIT CSAIL or OpenAI. Modules labelled Het’s Lab are independent pedagogical additions, clearly badged.
      </div>
    </div>
  );
}

