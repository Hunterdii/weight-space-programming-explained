"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  FlaskConical,
  Layers,
  ListChecks,
  Compass,
  RotateCcw,
  Terminal,
  Search,
  Radar,
  Sparkles,
} from "lucide-react";

export default function NotFound() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [isCopied, setIsCopied] = useState(false);

  // Keyboard shortcut listener for power users (Awwwards delight)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === "h" || e.key === "H" || e.key === "Escape") {
        router.push("/");
      } else if (e.key === "r" || e.key === "R") {
        router.push("/read");
      } else if (e.key === "l" || e.key === "L") {
        router.push("/lab");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [router]);

  // Interactive Weight Space Particle Manifold Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener("resize", handleResize);

    // Particle nodes in parameter space
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      label?: string;
    }

    const COLORS = [
      "rgba(41, 121, 255, ", // Chrome Blue
      "rgba(0, 230, 118, ",  // Green
      "rgba(255, 179, 0, ",  // Amber
      "rgba(255, 82, 82, ",  // Red
    ];

    const particles: Particle[] = Array.from({ length: 42 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1.5,
      color: COLORS[i % COLORS.length],
      alpha: Math.random() * 0.5 + 0.3,
      label: i % 7 === 0 ? `w[${i * 128}]` : undefined,
    }));

    let mouseX = width / 2;
    let mouseY = height / 2;
    let isHovering = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovering = true;
      setCoords({
        x: Number((mouseX / width).toFixed(3)),
        y: Number((mouseY / height).toFixed(3)),
      });
    };

    const handleMouseLeave = () => {
      isHovering = false;
    };

    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw faint coordinate grid lines
      ctx.strokeStyle = "rgba(255, 255, 255, 0.02)";
      ctx.lineWidth = 1;
      const gridSize = 48;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update & draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Bounce on boundary
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        // Mouse gravitational attraction/repulsion
        if (isHovering) {
          const dx = mouseX - p.x;
          const dy = mouseY - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140 && dist > 1) {
            p.vx += (dx / dist) * 0.02;
            p.vy += (dy / dist) * 0.02;
          }
        }

        // Draw connections (Low-rank subspace projections)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 110) {
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.08 * (1 - dist / 110)})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw particle node
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Optional tiny coordinate tag
        if (p.label) {
          ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
          ctx.font = "9px monospace";
          ctx.fillText(p.label, p.x + 6, p.y + 3);
        }
      }

      // Radar cursor locator
      if (isHovering) {
        ctx.strokeStyle = "rgba(41, 121, 255, 0.25)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 32, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const copyDiagnostic = () => {
    navigator.clipboard.writeText(
      `[WSP_STATUS_404]\nCoordinate: [NaN, NaN, 404.0]\nManifold: Out-of-Distribution Nullspace\nRank: 0 / 4096\nFrobenius: ||W|| = Inf\nURL: ${typeof window !== "undefined" ? window.location.href : "unknown"}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8 bg-[#06080c] text-foreground">
      {/* Dynamic 60fps Interactive Parameter Space Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-auto absolute inset-0 size-full opacity-60 transition-opacity duration-700"
      />

      {/* Subtle Radial Ambient Glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 size-[650px] rounded-full opacity-20 blur-[130px] bg-[radial-gradient(circle,var(--wsp-blue)_0%,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 right-1/4 size-[500px] rounded-full opacity-15 blur-[120px] bg-[radial-gradient(circle,var(--wsp-red)_0%,transparent_70%)]"
      />

      {/* Main Content Card Container */}
      <div className="relative z-10 mx-auto max-w-3xl w-full text-center space-y-8">
        
        {/* Monospace Tactical Telemetry Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-[#090d14]/85 px-4 py-1.5 font-mono text-[11px] text-muted-foreground shadow-lg backdrop-blur-md">
          <span className="size-2 rounded-full bg-[var(--wsp-red)] animate-ping" />
          <span className="font-bold text-[var(--wsp-red)]">ERROR 404</span>
          <span className="text-border">|</span>
          <span className="tracking-wide">COORDINATE_NOT_FOUND_IN_WEIGHT_SPACE</span>
        </div>

        {/* Dramatic Kinetic 404 Display */}
        <div className="relative select-none my-2">
          {/* Chromatic Glow Shadow Behind */}
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center justify-center font-mono text-8xl sm:text-[11rem] font-black tracking-tighter text-[var(--wsp-chrome)]/10 blur-xl scale-105"
          >
            404
          </div>
          {/* Forefront Number with Linear Gradient & Border Cut */}
          <h1 className="relative font-mono text-8xl sm:text-[11.5rem] font-black tracking-tighter leading-none bg-gradient-to-b from-white via-neutral-200 to-neutral-500 bg-clip-text text-transparent drop-shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
            404
          </h1>
          {/* Crosshair Wireframe Overlay */}
          <div className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="w-full max-w-sm border-t border-dashed border-border/30" />
          </div>
        </div>

        {/* Narrative & Explanation */}
        <div className="space-y-3 max-w-xl mx-auto -mt-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Subspace Manifold Divergence
          </h2>
          <p className="font-serif text-sm sm:text-base text-muted-foreground leading-relaxed">
            The neural circuit or coordinate you requested does not exist in this parameter checkpoint.
            It may have been pruned, ablated via orthogonal projection, or never compiled into this transformer layer.
          </p>
        </div>

        {/* Live Vector Telemetry Terminal HUD */}
        <div className="mx-auto max-w-lg rounded-2xl border border-border/70 bg-[#090d14]/90 p-4 shadow-2xl backdrop-blur-md text-left font-mono text-xs">
          <div className="flex items-center justify-between border-b border-border/50 pb-2 mb-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Terminal className="size-3.5 text-[var(--wsp-chrome)]" />
              <span className="text-[10px] uppercase font-bold tracking-wider">
                Telemetry Readout · Projection Vector
              </span>
            </div>
            <button
              type="button"
              onClick={copyDiagnostic}
              className="text-[10px] text-muted-foreground hover:text-foreground font-semibold px-2 py-0.5 rounded border border-border/60 hover:bg-card transition-colors cursor-pointer"
            >
              {isCopied ? "✓ Diagnostic Copied" : "Copy Diagnostic"}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-y-1.5 gap-x-4 text-[11px]">
            <div>
              <span className="text-muted-foreground">Target Coordinate: </span>
              <span className="text-[var(--wsp-red)] font-bold">[NaN, NaN, 404.0]</span>
            </div>
            <div>
              <span className="text-muted-foreground">Cursor UV: </span>
              <span className="text-[var(--wsp-chrome)] font-semibold">
                ({coords.x}, {coords.y})
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Subspace Angle: </span>
              <span className="text-foreground">θ = 90.00° (Orthogonal)</span>
            </div>
            <div>
              <span className="text-muted-foreground">Condition Number: </span>
              <span className="text-[var(--wsp-amber)] font-bold">κ = ∞ (Diverged)</span>
            </div>
          </div>
        </div>

        {/* Primary Action Button Deck */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-foreground text-background px-6 py-3 font-sans text-xs font-bold transition-all hover:opacity-90 hover:scale-105 shadow-md active:scale-95"
          >
            <ArrowLeft className="size-4" />
            <span>Re-center to Origin Manifold</span>
            <kbd className="hidden sm:inline-block rounded bg-background/20 px-1.5 py-0.5 text-[9px] font-mono font-semibold">
              H
            </kbd>
          </Link>

          <Link
            href="/read"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3 font-sans text-xs font-bold text-foreground transition-all hover:bg-accent hover:scale-105 shadow-md active:scale-95"
          >
            <BookOpen className="size-4 text-[var(--wsp-chrome)]" />
            <span>Browse 13 Chapters</span>
            <kbd className="hidden sm:inline-block rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
              R
            </kbd>
          </Link>

          <Link
            href="/lab"
            className="inline-flex items-center gap-2 rounded-xl border border-border/80 bg-card px-5 py-3 font-sans text-xs font-bold text-foreground transition-all hover:bg-accent hover:scale-105 shadow-md active:scale-95"
          >
            <FlaskConical className="size-4 text-[var(--wsp-amber)]" />
            <span>Open Python Labs</span>
            <kbd className="hidden sm:inline-block rounded bg-muted px-1.5 py-0.5 text-[9px] font-mono text-muted-foreground">
              L
            </kbd>
          </Link>
        </div>

        {/* Suggested Research Chambers (High-Craft Navigation Hub) */}
        <div className="pt-4 text-left">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground font-bold block mb-3 text-center sm:text-left">
            Valid Manifold Chambers:
          </span>
          <div className="grid gap-3 sm:grid-cols-4">
            <Link
              href="/experiments"
              className="group rounded-xl border border-border/60 bg-card/70 p-3.5 hover:border-[var(--wsp-blue)]/60 hover:bg-card transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-center gap-2 font-sans text-xs font-bold text-foreground mb-1 group-hover:text-[var(--wsp-blue)] transition-colors">
                <Layers className="size-3.5 text-[var(--wsp-blue)]" />
                <span>The 8 Experiments</span>
              </div>
              <p className="font-serif text-[11px] text-muted-foreground leading-snug">
                Canonical proof matrix with four-tier evidence filter.
              </p>
            </Link>

            <Link
              href="/lab"
              className="group rounded-xl border border-border/60 bg-card/70 p-3.5 hover:border-[var(--wsp-amber)]/60 hover:bg-card transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-center gap-2 font-sans text-xs font-bold text-foreground mb-1 group-hover:text-[var(--wsp-amber)] transition-colors">
                <FlaskConical className="size-3.5 text-[var(--wsp-amber)]" />
                <span>Runnable Surgery</span>
              </div>
              <p className="font-serif text-[11px] text-muted-foreground leading-snug">
                Zero-dependency NumPy scripts for local model surgery.
              </p>
            </Link>

            <Link
              href="/quiz"
              className="group rounded-xl border border-border/60 bg-card/70 p-3.5 hover:border-[var(--wsp-green)]/60 hover:bg-card transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-center gap-2 font-sans text-xs font-bold text-foreground mb-1 group-hover:text-[var(--wsp-green)] transition-colors">
                <ListChecks className="size-3.5 text-[var(--wsp-green)]" />
                <span>Mastery Quiz</span>
              </div>
              <p className="font-serif text-[11px] text-muted-foreground leading-snug">
                15 rigorous diagnostic questions testing your weight mastery.
              </p>
            </Link>

            <Link
              href="/glossary"
              className="group rounded-xl border border-border/60 bg-card/70 p-3.5 hover:border-foreground/40 hover:bg-card transition-all hover:-translate-y-0.5 shadow-sm"
            >
              <div className="flex items-center gap-2 font-sans text-xs font-bold text-foreground mb-1 group-hover:text-foreground transition-colors">
                <Compass className="size-3.5 text-[var(--wsp-chrome)]" />
                <span>Tensor Lexicon</span>
              </div>
              <p className="font-serif text-[11px] text-muted-foreground leading-snug">
                30+ mathematical definitions from singular vectors to SVD.
              </p>
            </Link>
          </div>
        </div>

        {/* Ambient Footer Micro-Note */}
        <div className="pt-2 text-center text-[11px] font-mono text-muted-foreground/60">
          Tip: Move cursor across the canvas to disturb parameter projections · Press <kbd className="font-bold text-muted-foreground">H</kbd> to return home
        </div>
      </div>
    </div>
  );
}
