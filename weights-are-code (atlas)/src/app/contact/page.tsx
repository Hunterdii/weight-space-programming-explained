import type { Metadata } from "next";
import Link from "next/link";
import { Mail, Github, Linkedin, ArrowLeft, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact & Empirical Verification · Weight-Space Programming",
  description:
    "Contact information, replication submissions, and peer auditing channels for Weight-Space Programming.",
};

export default function ContactPage() {
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
          <Mail className="size-3.5 text-[var(--wsp-blue)]" />
          <span>PEER AUDITING &amp; REPLICATION CHANNELS</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Contact &amp; Independent Verification
        </h1>
        <p className="font-serif text-sm sm:text-base text-muted-foreground leading-relaxed">
          Have an independent replication result, empirical correction, or inquiry regarding the interactive labs? We operate an open verification ledger.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-sans text-base font-bold">
              <Github className="size-5 text-[var(--wsp-chrome)]" />
              <span>GitHub Discussions &amp; Issues</span>
            </div>
            <p className="font-serif text-xs text-muted-foreground leading-relaxed">
              Submit empirical replication logs, report factual errata, or contribute new interactive modules directly to the open-source repository.
            </p>
          </div>
          <a
            href="https://github.com/Hunterdii/weight-space-programming-explained"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-foreground text-background px-4 py-2.5 font-sans text-xs font-bold transition-all hover:opacity-90 shadow-2xs"
          >
            <span>Open Issue on GitHub</span>
          </a>
        </div>

        <div className="rounded-2xl border border-border/80 bg-card p-6 space-y-4 shadow-sm flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground font-sans text-base font-bold">
              <Linkedin className="size-5 text-[#0a66c2]" />
              <span>Connect on LinkedIn</span>
            </div>
            <p className="font-serif text-xs text-muted-foreground leading-relaxed">
              Connect directly with author Het Patel for academic collaborations, conference inquiries, or technical discussion.
            </p>
          </div>
          <a
            href="https://www.linkedin.com/in/patel-hetkumar-sandipbhai-8b110525a/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border/80 bg-card px-4 py-2.5 font-sans text-xs font-bold text-foreground transition-all hover:bg-accent shadow-2xs"
          >
            <span>View LinkedIn Profile</span>
          </a>
        </div>
      </div>

      <div className="rounded-2xl border border-border/70 bg-card/40 p-5 space-y-3 font-mono text-xs">
        <div className="flex items-center gap-2 text-foreground font-bold">
          <ShieldCheck className="size-4 text-[var(--wsp-green)]" />
          <span>Independent Pedagogical Mandate</span>
        </div>
        <p className="font-serif text-xs text-muted-foreground leading-relaxed">
          Independent Status: Not affiliated with or endorsed by MIT CSAIL or OpenAI. Modules labelled <strong>Het’s Lab</strong> are independent pedagogical additions, clearly badged.
        </p>
      </div>
    </div>
  );
}

