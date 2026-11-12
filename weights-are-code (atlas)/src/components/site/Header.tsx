"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import {
  Menu,
  Moon,
  Sun,
  Keyboard,
  ShieldCheck,
  BookOpen,
  FlaskConical,
  ListChecks,
  Bookmark,
  FileText,
  Info,
  Layers,
  Sparkles,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { LEVELS, useReading, useUi } from "@/state/store";

const NAV = [
  { href: "/read", label: "Guide", icon: BookOpen },
  { href: "/prologue", label: "Prologue", icon: Sparkles },
  { href: "/experiments", label: "Experiments", icon: Layers },
  { href: "/lab", label: "Lab", icon: FlaskConical },
  { href: "/quiz", label: "Quiz", icon: ListChecks },
  { href: "/glossary", label: "Glossary", icon: Bookmark },
  { href: "/references", label: "References", icon: FileText },
  { href: "/about", label: "About", icon: Info },
];

const SECONDARY_HREFS = new Set(["/quiz", "/glossary", "/references", "/about"]);

const LEVEL_COLORS = [
  "#10b981", // L1 - Emerald
  "#3b82f6", // L2 - Cobalt
  "#0ea5e9", // L3 - Cerulean Cyan
  "#f59e0b", // L4 - Amber
  "#ef4444", // L5 - Crimson
];

/** Bespoke Neural Tensor Vector Icon - Eliminates broken font glyphs / [ ] tofu boxes */
function TensorLogoIcon() {
  return (
    <div className="relative flex size-9 shrink-0 items-center justify-center rounded-xl border border-[var(--wsp-chrome)]/40 bg-[color-mix(in_oklab,var(--wsp-chrome)_14%,transparent)] shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:border-[var(--wsp-chrome)] group-hover:shadow-[0_0_20px_color-mix(in_oklab,var(--wsp-chrome)_35%,transparent)]">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-500 group-hover:rotate-12"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" className="text-[var(--wsp-chrome)]" opacity="0.85" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" className="text-[var(--wsp-blue)]" opacity="0.65" />
        <line x1="4.5" y1="12" x2="19.5" y2="12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="text-[var(--wsp-chrome)]" />
        <circle cx="12" cy="12" r="2.2" fill="currentColor" className="text-[var(--wsp-amber)] animate-pulse" />
      </svg>
    </div>
  );
}

/** Mobile Drawer Audience Rigor Ladder HUD */
function DrawerLevelControl() {
  const level = useReading((s) => s.level);
  const setLevel = useReading((s) => s.setLevel);
  const cur = LEVELS[level - 1];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Audience Rigor Ladder
        </span>
        <span
          className="font-mono text-xs font-bold px-2 py-0.5 rounded-full border"
          style={{
            color: LEVEL_COLORS[level - 1],
            borderColor: LEVEL_COLORS[level - 1],
            backgroundColor: `color-mix(in oklab, ${LEVEL_COLORS[level - 1]} 12%, transparent)`,
          }}
        >
          Rung {level} of 5
        </span>
      </div>
      <div className="grid grid-cols-5 gap-1.5" role="group" aria-label="Audience ladder level">
        {LEVELS.map((l, i) => {
          const roleLabels = ["Intro", "General", "Student", "Applied", "Research"];
          return (
            <button
              key={l.n}
              onClick={() => setLevel(l.n)}
              aria-pressed={level === l.n}
              title={`Level ${l.n} · ${l.name} - ${l.blurb}`}
              className="flex h-11 flex-col items-center justify-center rounded-xl border font-mono text-xs font-bold transition-all"
              style={
                level === l.n
                  ? {
                    borderColor: LEVEL_COLORS[i],
                    background: `color-mix(in oklab, ${LEVEL_COLORS[i]} 18%, transparent)`,
                    color: LEVEL_COLORS[i],
                    boxShadow: `0 0 12px color-mix(in oklab, ${LEVEL_COLORS[i]} 25%, transparent)`,
                  }
                  : {
                    borderColor: "var(--border)",
                    color: "var(--muted-foreground)",
                  }
              }
            >
              <span>L{l.n}</span>
              <span className="text-[9px] font-sans font-normal opacity-75">{roleLabels[i]}</span>
            </button>
          );
        })}
      </div>
      <p className="font-serif text-xs text-muted-foreground italic bg-card/60 p-2.5 rounded-xl border border-border/50">
        <strong className="text-foreground not-italic">{cur.name}:</strong> {cur.blurb}
      </p>
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const truthFilter = useReading((s) => s.truthFilter);
  const setTruthFilter = useReading((s) => s.setTruthFilter);
  const setShortcutsOpen = useUi((s) => s.setShortcutsOpen);
  const setCommandOpen = useUi((s) => s.setCommandOpen);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full overflow-x-clip transition-all duration-300 ${scrolled
          ? "border-b border-border/70 bg-[color-mix(in_oklab,var(--background)_88%,transparent)] backdrop-blur-2xl shadow-lg shadow-black/20"
          : "border-b border-border/40 bg-[color-mix(in_oklab,var(--background)_60%,transparent)] backdrop-blur-md"
        }`}
    >
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      <div className="mx-auto flex h-16 max-w-[1680px] items-center gap-3 px-4 sm:px-6 lg:px-10">
        {/* Brand / Logo */}
        <Link
          href="/"
          prefetch={false}
          className="group flex items-center gap-3 shrink-0"
          aria-label="Weight-Space Programming - homepage"
        >
          <TensorLogoIcon />
          <div className="hidden sm:block leading-tight">
            <span className="block font-sans text-sm font-bold tracking-tight text-foreground transition-colors group-hover:text-[var(--wsp-chrome)]">
              Weight-Space Programming
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-wider text-muted-foreground/75">
              MIT CSAIL Field Guide · 2026
            </span>
          </div>
        </Link>

        {/* Desktop Primary Nav */}
        <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((n) => {
            const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
            const isSecondary = SECONDARY_HREFS.has(n.href);
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                prefetch={false}
                className={`relative ${isSecondary ? "hidden xl:flex" : "flex"} items-center gap-1.5 rounded-xl px-3 py-1.5 font-sans text-[13px] font-medium transition-all duration-150 ${active
                    ? "bg-accent/80 text-foreground font-semibold shadow-xs"
                    : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                  }`}
              >
                <Icon className={`size-3.5 ${active ? "text-[var(--wsp-chrome)]" : "opacity-60"}`} />
                <span>{n.label}</span>
                {active && (
                  <span
                    aria-hidden
                    className="absolute -bottom-[15px] left-3 right-3 h-[2px] rounded-full bg-[var(--wsp-chrome)] shadow-[0_0_8px_var(--wsp-chrome)]"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Tools & Controls */}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2.5">
          {/* Expanded Command & Search Palette Trigger (⌘K) */}
          <button
            type="button"
            onClick={() => setCommandOpen(true)}
            className="flex size-9 sm:size-auto sm:h-9 sm:w-52 md:w-60 items-center justify-center sm:justify-between rounded-xl border border-border/80 bg-card/70 p-0 sm:px-3 font-sans text-xs text-muted-foreground hover:border-foreground/30 hover:text-foreground transition-all shadow-xs group shrink-0"
            title="Search field guide chapters, experiments, risks, and tools (⌘K)"
            aria-label="Search field guide"
          >
            <div className="flex items-center gap-2 truncate">
              <Search className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
              <span className="hidden sm:inline truncate font-medium">Search field guide...</span>
            </div>
            <kbd className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-accent/70 border border-border/60 text-muted-foreground shrink-0">
              ⌘K
            </kbd>
          </button>

          {/* Theme Switcher (Always visible, before Truth) */}
          <Button
            variant="ghost"
            size="icon"
            className="size-9 rounded-xl border border-border/70 bg-card/60 text-muted-foreground hover:text-foreground hover:bg-accent/60 transition-all shadow-2xs shrink-0"
            aria-label={mounted && theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title={mounted && theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {mounted && theme === "dark" ? (
              <Sun className="size-4 text-[var(--wsp-amber)] transition-transform hover:rotate-45" />
            ) : (
              <Moon className="size-4 text-[var(--wsp-blue)] transition-transform hover:-rotate-12" />
            )}
          </Button>

          {/* Truth Filter Switch */}
          <button
            onClick={() => setTruthFilter(!truthFilter)}
            className={`flex h-9 items-center gap-1.5 rounded-xl border px-2.5 sm:px-3 font-sans text-xs font-semibold transition-all duration-200 shadow-2xs shrink-0 ${truthFilter
                ? "border-[var(--wsp-green)]/70 bg-[color-mix(in_oklab,var(--wsp-green)_18%,transparent)] text-foreground shadow-sm shadow-[var(--wsp-green)]/20"
                : "border-border/70 bg-card/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
              }`}
            title="Truth Filter (press T): display only verified paper & review empirical facts"
            aria-pressed={truthFilter}
          >
            <ShieldCheck
              className={`size-3.5 transition-colors ${truthFilter ? "text-[var(--wsp-green)] animate-pulse" : "text-muted-foreground"
                }`}
            />
            <span className="hidden sm:inline font-sans">Truth</span>
            <span className="font-mono text-[10px] px-1 py-0.2 rounded bg-accent/60 text-muted-foreground hidden sm:inline-block">
              T
            </span>
          </button>

          {/* Mobile Menu Drawer */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-xl text-muted-foreground hover:bg-accent/40 xl:hidden"
                aria-label="Open mobile navigation"
              >
                <Menu className="size-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 border-r border-border/70 bg-background/95 backdrop-blur-2xl">
              <SheetTitle className="flex items-center gap-3 font-sans text-base">
                <TensorLogoIcon />
                <div>
                  <span className="block font-bold">Weight-Space Programming</span>
                  <span className="block font-mono text-[10px] font-normal text-muted-foreground">
                    Independent Field Guide · 2026
                  </span>
                </div>
              </SheetTitle>

              <div className="mt-6">
                <DrawerLevelControl />
              </div>

              <div className="mt-6 border-t border-border/50 pt-4">
                <p className="mb-2 font-mono text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  Navigation
                </p>
                <nav aria-label="Mobile" className="flex flex-col gap-1">
                  {NAV.map((n) => {
                    const active = pathname === n.href || (n.href !== "/" && pathname.startsWith(n.href));
                    const Icon = n.icon;
                    return (
                      <Link
                        key={n.href}
                        href={n.href}
                        prefetch={false}
                        className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 font-sans text-sm transition-all ${active
                            ? "bg-accent font-semibold text-foreground"
                            : "text-muted-foreground hover:bg-accent/40 hover:text-foreground"
                          }`}
                      >
                        <Icon className={`size-4 ${active ? "text-[var(--wsp-chrome)]" : "opacity-60"}`} />
                        <span>{n.label}</span>
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-6 border-t border-border/50 pt-4 space-y-2">
                <button
                  onClick={() => setShortcutsOpen(true)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border/70 bg-card/60 px-4 py-2.5 font-sans text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Keyboard className="size-4" /> Keyboard Shortcuts
                </button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Truth Filter Banner */}
      {truthFilter && (
        <div className="border-t border-[var(--wsp-green)]/40 bg-[color-mix(in_oklab,var(--wsp-green)_10%,transparent)]">
          <div className="mx-auto flex max-w-[1680px] items-center justify-between px-4 py-1.5 sm:px-6 lg:px-10">
            <p className="font-sans text-xs text-foreground flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-[var(--wsp-green)] animate-ping" aria-hidden />
              <strong className="text-[var(--wsp-green)]">Truth Filter Active</strong>
              <span className="hidden sm:inline text-muted-foreground">- filtering down to paper-reported and independently reviewed empirical facts</span>
            </p>
            <span className="font-mono text-[10px] text-muted-foreground hidden sm:inline">
              Press <kbd className="kbd text-[10px]">T</kbd> to toggle
            </span>
          </div>
        </div>
      )}
    </header>
  );
}
