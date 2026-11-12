"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  RotateCcw,
  ArrowLeft,
  Copy,
  Check,
  Terminal,
  ShieldAlert,
  Layers,
  BookOpen,
  Cpu,
} from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [isCopied, setIsCopied] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    // Log unexpected errors for local inspection
    console.error("Runtime exception caught by Weight-Space error boundary:", error);
  }, [error]);

  const handleReset = useCallback(() => {
    setIsResetting(true);
    setTimeout(() => {
      reset();
      setIsResetting(false);
    }, 400);
  }, [reset]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "h" || e.key === "H" || e.key === "Escape") {
        router.push("/");
      } else if (e.key === "r" || e.key === "R") {
        handleReset();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router, handleReset]);

  const diagnosticText = `[CRITICAL_500_WEIGHT_SPACE_COLLAPSE]
Timestamp: ${new Date().toISOString()}
Error Message: ${error?.message || "Unknown numerical condition collapse in tensor stream"}
Digest: ${error?.digest || "ERR_SINGULAR_VALUE_NAN_0x500"}
Stack Trace: ${error?.stack?.slice(0, 500) || "No client stack available"}
Simulated Layer: TransformerBlock[14].mlp.down_proj
Frobenius Delta: ||ΔW||_F = NaN
Status: RESIDUAL_STREAM_OVERFLOW`;

  const copyDiagnostic = () => {
    navigator.clipboard.writeText(diagnosticText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8 bg-[#06080c] text-foreground">
      {/* Background Animated Gradient Mesh & Hazard Grids */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(255,82,82,0.18),transparent)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px] opacity-40"
      />

      {/* Main Container */}
      <div className="relative z-10 mx-auto max-w-3xl w-full text-center space-y-8">
        
        {/* Monospace Alert Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--wsp-red)]/50 bg-[color-mix(in_oklab,var(--wsp-red)_12%,var(--card))] px-4 py-1.5 font-mono text-[11px] text-[var(--wsp-red)] shadow-lg backdrop-blur-md">
          <ShieldAlert className="size-3.5 animate-pulse" />
          <span className="font-bold">CRITICAL EXCEPTION · ERROR 500</span>
          <span className="text-border">|</span>
          <span className="tracking-wide">RESIDUAL_STREAM_COLLAPSE</span>
        </div>

        {/* Dramatic Kinetic 500 Display */}
        <div className="relative select-none my-2">
          {/* Glitch Shadow */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center font-mono text-8xl sm:text-[11rem] font-black tracking-tighter text-[var(--wsp-red)]/15 blur-2xl scale-105"
          >
            500
          </div>
          {/* Main 500 Graphic */}
          <h1 className="relative font-mono text-8xl sm:text-[11.5rem] font-black tracking-tighter leading-none bg-gradient-to-b from-white via-neutral-200 to-[var(--wsp-red)]/80 bg-clip-text text-transparent drop-shadow-[0_20px_50px_rgba(255,82,82,0.3)]">
            500
          </h1>
          {/* Scanning Hazard Laser Line */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center"
          >
            <div className="w-full max-w-sm h-px bg-gradient-to-r from-transparent via-[var(--wsp-red)]/60 to-transparent" />
          </div>
        </div>

        {/* Narrative & Explanation */}
        <div className="space-y-3 max-w-xl mx-auto -mt-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Loss Gradient Explosion Detected
          </h2>
          <p className="font-serif text-sm sm:text-base text-muted-foreground leading-relaxed">
            The neural computation runtime encountered an unhandled numerical divergence ($NaN / \infty$) during tensor projection or client-side rendering.
            The current parameter checkpoint has destabilized.
          </p>
        </div>

        {/* Interactive Tactical Diagnostic Terminal */}
        <div className="mx-auto max-w-xl rounded-2xl border border-[var(--wsp-red)]/40 bg-[#090d14]/95 p-4 shadow-2xl backdrop-blur-md text-left font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border/50 pb-2.5 mb-3">
            <div className="flex items-center gap-2 text-[var(--wsp-red)]">
              <Terminal className="size-4" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Parameter State Crash Log · Core Dump
              </span>
            </div>
            <button
              type="button"
              onClick={copyDiagnostic}
              className="inline-flex items-center gap-1.5 text-[10px] text-muted-foreground hover:text-foreground font-semibold px-2 py-0.5 rounded border border-border/60 hover:bg-card transition-colors cursor-pointer"
            >
              {isCopied ? (
                <>
                  <Check className="size-3 text-[var(--wsp-green)]" />
                  <span>Dump Copied</span>
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  <span>Copy Stack Trace</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal Console Output */}
          <div className="space-y-1.5 text-[11px] leading-relaxed overflow-x-auto text-muted-foreground font-mono bg-black/40 rounded-lg p-3 border border-border/30">
            <div>
              <span className="text-[var(--wsp-red)] font-bold">[PANIC 0x500] </span>
              <span className="text-foreground">{error?.message || "Singular value spectrum collapsed to NaN"}</span>
            </div>
            <div>
              <span className="text-muted-foreground/60">[TRACE] </span>
              <span className="text-muted-foreground">ResidualStream::forward() → AttentionHead[14]::proj()</span>
            </div>
            {error?.digest && (
              <div>
                <span className="text-muted-foreground/60">[DIGEST] </span>
                <span className="text-[var(--wsp-amber)]">{error.digest}</span>
              </div>
            )}
            <div className="flex gap-4 pt-1 text-[10px] text-muted-foreground/80 border-t border-border/20 mt-1">
              <span>Norm Delta: <strong className="text-[var(--wsp-red)]">+∞%</strong></span>
              <span>Eigenvalue Spectrum: <strong className="text-[var(--wsp-amber)]">Diverged</strong></span>
              <span>Blast Radius: <strong className="text-foreground">Contained</strong></span>
            </div>
          </div>
        </div>

        {/* Action Button Deck */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            disabled={isResetting}
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--wsp-red)] text-white px-6 py-3 font-sans text-xs font-bold transition-all hover:brightness-110 hover:scale-105 shadow-md active:scale-95 cursor-pointer disabled:opacity-50"
          >
            <RotateCcw className={`size-4 ${isResetting ? "animate-spin" : ""}`} />
            <span>{isResetting ? "Clamping & Rolling Back..." : "Clamp Parameters & Rollback"}</span>
            <kbd className="hidden sm:inline-block rounded bg-black/20 px-1.5 py-0.5 text-[9px] font-mono font-semibold">
              R
            </kbd>
          </button>

          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3 font-sans text-xs font-bold text-foreground transition-all hover:bg-accent hover:scale-105 shadow-md active:scale-95"
          >
            <ArrowLeft className="size-4" />
            <span>Return to Grounded Checkpoint</span>
            <kbd className="hidden sm:inline-block rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
              H
            </kbd>
          </Link>

          <Link
            href="/read"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3 font-sans text-xs font-bold text-foreground transition-all hover:bg-accent hover:scale-105 shadow-md active:scale-95"
          >
            <BookOpen className="size-4 text-[var(--wsp-chrome)]" />
            <span>Browse 13 Chapters</span>
          </Link>
        </div>

        {/* Diagnostic Quick Links */}
        <div className="pt-4 text-left">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold block mb-3 text-center sm:text-left">
            Diagnostic & Recovery Portals:
          </span>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link
              href="/experiments"
              className="group rounded-xl border border-border/60 bg-card/70 p-3.5 hover:border-[var(--wsp-blue)]/60 hover:bg-card transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 font-sans text-xs font-bold text-foreground mb-1 group-hover:text-[var(--wsp-blue)] transition-colors">
                <Layers className="size-3.5 text-[var(--wsp-blue)]" />
                <span>Verify Experiments</span>
              </div>
              <p className="font-serif text-[11px] text-muted-foreground leading-snug">
                Review canonical benchmark passes and empirical validation.
              </p>
            </Link>

            <Link
              href="/lab"
              className="group rounded-xl border border-border/60 bg-card/70 p-3.5 hover:border-[var(--wsp-amber)]/60 hover:bg-card transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 font-sans text-xs font-bold text-foreground mb-1 group-hover:text-[var(--wsp-amber)] transition-colors">
                <Cpu className="size-3.5 text-[var(--wsp-amber)]" />
                <span>Local Surgery Labs</span>
              </div>
              <p className="font-serif text-[11px] text-muted-foreground leading-snug">
                Run zero-dependency Python scripts to isolate divergence.
              </p>
            </Link>

            <Link
              href="/"
              className="group rounded-xl border border-border/60 bg-card/70 p-3.5 hover:border-foreground/40 hover:bg-card transition-all shadow-sm"
            >
              <div className="flex items-center gap-2 font-sans text-xs font-bold text-foreground mb-1 group-hover:text-foreground transition-colors">
                <AlertTriangle className="size-3.5 text-[var(--wsp-red)]" />
                <span>Primary Field Guide</span>
              </div>
              <p className="font-serif text-[11px] text-muted-foreground leading-snug">
                Return to the home atlas and interactive visualizers.
              </p>
            </Link>
          </div>
        </div>

        {/* Ambient Footer Micro-Note */}
        <div className="pt-2 text-center text-[11px] font-mono text-muted-foreground/60">
          Press <kbd className="font-bold text-muted-foreground">R</kbd> to retry · Press <kbd className="font-bold text-muted-foreground">H</kbd> to return home
        </div>
      </div>
    </div>
  );
}
