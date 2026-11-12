"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { usePathname, useRouter } from "next/navigation";
import { CHAPTERS } from "@/content/chapters";
import { useReading, useUi } from "@/state/store";

function isTyping(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    el.isContentEditable ||
    el.getAttribute("role") === "textbox"
  );
}

/**
 * Global keyboard layer (spec §9):
 * Space play/pause · → / ← step · R reset  (routed to the active module)
 * 1–9 jump chapter · [ ] change level · T truth filter · L labels
 * D dark/light · ? shortcut sheet · Esc close dialogs
 */
export default function KeyboardGlobal() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const bumpLevel = useReading((s) => s.bumpLevel);
  const toggleTruthFilter = useReading((s) => s.toggleTruthFilter);
  const toggleLabels = useReading((s) => s.toggleLabels);
  const setShortcutsOpen = useUi((s) => s.setShortcutsOpen);
  const setCommandOpen = useUi((s) => s.setCommandOpen);
  const activeModule = useReading((s) => s.activeModule);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Global Command palette: Cmd+K / Ctrl+K works anywhere, even in inputs
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setCommandOpen(true);
        return;
      }

      if (isTyping(e.target)) return;
      const inDialog = document.querySelector("[data-state='open'][role='dialog']");
      if (e.key === "Escape") {
        setShortcutsOpen(false);
        setCommandOpen(false);
        return;
      }
      if (inDialog) return;

      const key = e.key;
      // ---- module transport keys ----
      if (key === " " || key === "ArrowRight" || key === "ArrowLeft" || key === "r" || key === "R") {
        const focusInside = document.activeElement?.closest("[data-module]");
        let target: Element | null = null;
        if (focusInside) target = focusInside;
        else if (activeModule) {
          const el = document.querySelector(`[data-module='${activeModule}']`);
          if (el) {
            const r = el.getBoundingClientRect();
            const visible = r.top < window.innerHeight && r.bottom > 0;
            if (visible) target = el;
          }
        }
        if (target) {
          if (key === " ") e.preventDefault();
          target.dispatchEvent(
            new CustomEvent("wsp-module-key", { detail: { key }, bubbles: false })
          );
        }
        return; // no active module → Space scrolls the page normally
      }

      // ---- site-level keys ----
      if (key === "?" || (e.shiftKey && key === "/")) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }
      if (key === "[") {
        e.preventDefault();
        bumpLevel(-1);
        return;
      }
      if (key === "]") {
        e.preventDefault();
        bumpLevel(1);
        return;
      }
      if (key === "t" || key === "T") {
        e.preventDefault();
        toggleTruthFilter();
        return;
      }
      if (key === "l" || key === "L") {
        e.preventDefault();
        toggleLabels();
        return;
      }
      if (key === "d" || key === "D") {
        e.preventDefault();
        setTheme(theme === "dark" ? "light" : "dark");
        return;
      }
      if (/^[1-9]$/.test(key)) {
        const ch = CHAPTERS[parseInt(key, 10) - 1];
        if (ch) {
          e.preventDefault();
          const target = `/read/${ch.slug}`;
          if (pathname !== target) router.push(target);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [router, pathname, theme, setTheme, bumpLevel, toggleTruthFilter, toggleLabels, setShortcutsOpen, setCommandOpen, activeModule]);

  return null;
}
