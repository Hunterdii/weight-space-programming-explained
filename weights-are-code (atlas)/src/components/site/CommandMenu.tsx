"use client";

import { useEffect, useState, useCallback, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { useUi, useReading, LEVELS, type Level } from "@/state/store";
import { CHAPTERS } from "@/content/chapters";
import { EXPERIMENTS, RISKS } from "@/content/facts";
import {
  BookOpen,
  FlaskConical,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Moon,
  Sun,
  Keyboard,
  FileDown,
  Radar,
  SlidersHorizontal,
  Compass,
  Sparkles,
  Zap,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

const LEVEL_COLORS = [
  "#10b981", // L1 - Emerald
  "#3b82f6", // L2 - Cobalt
  "#0ea5e9", // L3 - Cerulean Cyan
  "#f59e0b", // L4 - Amber
  "#ef4444", // L5 - Crimson
];

export default function CommandMenu() {
  const router = useRouter();
  const open = useUi((s) => s.commandOpen);
  const setOpen = useUi((s) => s.setCommandOpen);
  const setShortcutsOpen = useUi((s) => s.setShortcutsOpen);
  const setLevel = useReading((s) => s.setLevel);
  const toggleTruthFilter = useReading((s) => s.toggleTruthFilter);
  const truthFilter = useReading((s) => s.truthFilter);
  const { theme, setTheme } = useTheme();

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const runCommand = useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, [setOpen]);

  if (!mounted) return null;

  return (
    <CommandDialog
      open={open}
      onOpenChange={setOpen}
      title="WSP Field Guide Command & Search Palette"
      description="Search chapters, experiments, interactive modules, risks, and quick tools..."
    >
      <CommandInput placeholder="Type a chapter, experiment, risk, lab, or action..." />
      <CommandList className="max-h-[380px] overflow-y-auto">
        <CommandEmpty>No matching research objects found.</CommandEmpty>

        {/* Quick Actions & Rigor Controls */}
        <CommandGroup heading="Quick Controls & Auditing Mode">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                toggleTruthFilter();
                toast.info(`Truth Filter: ${!truthFilter ? "ACTIVE (Paper Only)" : "INACTIVE (All Content)"}`);
              })
            }
          >
            <ShieldCheck className="size-4 text-[var(--wsp-green)] mr-2" />
            <span>Toggle Truth Filter (Strict Empirical Mode)</span>
            <CommandShortcut>T</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                setTheme(theme === "dark" ? "light" : "dark");
              })
            }
          >
            {theme === "dark" ? (
              <Sun className="size-4 text-[var(--wsp-amber)] mr-2" />
            ) : (
              <Moon className="size-4 text-[var(--wsp-blue)] mr-2" />
            )}
            <span>Switch Theme ({theme === "dark" ? "Light" : "Dark"})</span>
            <CommandShortcut>D</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                setShortcutsOpen(true);
              })
            }
          >
            <Keyboard className="size-4 text-muted-foreground mr-2" />
            <span>Open Keyboard Shortcuts Palette</span>
            <CommandShortcut>?</CommandShortcut>
          </CommandItem>

          <CommandItem
            onSelect={() =>
              runCommand(() => {
                window.open("/whitepaper.pdf", "_blank");
              })
            }
          >
            <FileDown className="size-4 text-[var(--wsp-blue)] mr-2" />
            <span>Download PDF</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        {/* Audience Rigor Ladder */}
        <CommandGroup heading="Audience Rigor Ladder">
          {LEVELS.map((l, idx) => (
            <CommandItem
              key={l.n}
              onSelect={() =>
                runCommand(() => {
                  setLevel(l.n);
                  toast.success(`Audience Rigor set to Level ${l.n}: ${l.short} (${l.name})`);
                })
              }
            >
              <SlidersHorizontal
                className="size-4 mr-2"
                style={{ color: LEVEL_COLORS[idx] || "var(--wsp-blue)" }}
              />
              <span>
                Level {l.n} · {l.short}: {l.name}
              </span>
              <CommandShortcut>[ / ]</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 13 Chapters */}
        <CommandGroup heading="Field Guide Curriculum (13 Chapters)">
          {CHAPTERS.map((c) => (
            <CommandItem
              key={c.slug}
              onSelect={() =>
                runCommand(() => {
                  router.push(`/read/${c.slug}`);
                })
              }
            >
              <BookOpen className="size-4 text-[var(--wsp-cyan)] mr-2" />
              <span>
                Chapter {c.number}: {c.title}
              </span>
              <CommandShortcut>{c.minutes}m</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* 8 Experiments */}
        <CommandGroup heading="The 8 Canonical Experiments">
          {EXPERIMENTS.map((exp) => (
            <CommandItem
              key={exp.n}
              onSelect={() =>
                runCommand(() => {
                  router.push("/experiments");
                })
              }
            >
              <Layers className="size-4 text-[var(--wsp-blue)] mr-2" />
              <span>
                Exp {exp.n} ({exp.verb}): {exp.task}
              </span>
              <CommandShortcut>{exp.evidence}</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* M12 Threat Vectors & Defense */}
        <CommandGroup heading="Threat Vectors & Risk Radar (M12)">
          {RISKS.map((r) => (
            <CommandItem
              key={r.id}
              onSelect={() =>
                runCommand(() => {
                  router.push("/read/11-the-severe-stuff");
                })
              }
            >
              <ShieldAlert className="size-4 text-[var(--wsp-red)] mr-2" />
              <span>
                Risk: {r.title}
              </span>
              <CommandShortcut>Ch 11</CommandShortcut>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        {/* Instruments & Labs */}
        <CommandGroup heading="Research Instruments & Labs">
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push("/prologue");
              })
            }
          >
            <Sparkles className="size-4 text-[var(--wsp-chrome)] mr-2" />
            <span>Prologue · The Story So Far &amp; Fingerprint Lab</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push("/lab");
              })
            }
          >
            <FlaskConical className="size-4 text-[var(--wsp-amber)] mr-2" />
            <span>Runnable Python Labs (4 Standalone Scripts)</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push("/quiz");
              })
            }
          >
            <Sparkles className="size-4 text-[var(--wsp-green)] mr-2" />
            <span>Cognitive Mastery Quiz (15 Questions)</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push("/glossary");
              })
            }
          >
            <Compass className="size-4 text-[var(--wsp-cyan)] mr-2" />
            <span>WSP Technical Glossary &amp; Notation Guide</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push("/references");
              })
            }
          >
            <Zap className="size-4 text-[var(--wsp-blue)] mr-2" />
            <span>The Honesty Ledger (44 Provenance References)</span>
          </CommandItem>
          <CommandItem
            onSelect={() =>
              runCommand(() => {
                router.push("/faq");
              })
            }
          >
            <HelpCircle className="size-4 text-[var(--wsp-chrome)] mr-2" />
            <span>Frequently Asked Questions (12 Technical FAQs)</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
