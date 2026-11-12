"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUi } from "@/state/store";

const ROWS: [string, string][] = [
  ["⌘K / Ctrl+K", "Open omnibus Command & Search palette"],
  ["Space", "Play / pause active interactive simulation module"],
  ["→ / ←", "Step active simulation module forward / back"],
  ["R", "Reset the active simulation module"],
  ["1 – 9", "Jump directly to chapter 1 … 9"],
  ["[ / ]", "Adjust audience rigor ladder (step down / up)"],
  ["T", "Truth filter: isolate paper-reported & reviewed facts"],
  ["L", "Toggle numerical data labels on charts"],
  ["D", "Toggle dark / light observatory theme"],
  ["?", "Open this keyboard shortcuts console"],
  ["Esc", "Close open dialogs and sheets"],
];

export default function ShortcutsSheet() {
  const open = useUi((s) => s.shortcutsOpen);
  const setOpen = useUi((s) => s.setShortcutsOpen);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);
  if (!mounted) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="font-sans">Keyboard shortcuts</DialogTitle>
          <DialogDescription className="font-sans">
            Hover or focus a module to make it “active”, then steer it with the keyboard.
          </DialogDescription>
        </DialogHeader>
        <ul className="space-y-2.5">
          {ROWS.map(([k, d]) => (
            <li key={k} className="flex items-center justify-between gap-4 text-sm">
              <span className="text-muted-foreground font-sans">{d}</span>
              <kbd className="kbd shrink-0">{k}</kbd>
            </li>
          ))}
        </ul>
        <p className="text-xs text-muted-foreground font-sans border-t pt-3">
          Reduced-motion preference is respected: animations become step-through controls everywhere.
        </p>
      </DialogContent>
    </Dialog>
  );
}
