"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { Level } from "@/content/levels";

export type { Level };
export { LEVELS } from "@/content/levels";

/** Safe localStorage wrapper - the site must work with storage blocked. */
function safeStorage() {
  try {
    const t = "__wsp_probe__";
    window.localStorage.setItem(t, t);
    window.localStorage.removeItem(t);
    return window.localStorage;
  } catch {
    // In-memory fallback so the app still functions.
    const mem = new Map<string, string>();
    return {
      getItem: (k: string) => mem.get(k) ?? null,
      setItem: (k: string, v: string) => void mem.set(k, v),
      removeItem: (k: string) => void mem.delete(k),
    } as Storage;
  }
}

interface ReadingState {
  level: Level;
  truthFilter: boolean;
  labels: boolean;
  activeModule: string | null;
  setLevel: (l: Level) => void;
  bumpLevel: (delta: number) => void;
  setTruthFilter: (v: boolean) => void;
  toggleTruthFilter: () => void;
  toggleLabels: () => void;
  setActiveModule: (id: string | null) => void;
}

export const useReading = create<ReadingState>()(
  persist(
    (set, get) => ({
      level: 2,
      truthFilter: false,
      labels: true,
      activeModule: null,
      setLevel: (level) => set({ level }),
      bumpLevel: (delta) => {
        const next = Math.min(5, Math.max(1, get().level + delta)) as Level;
        set({ level: next });
      },
      setTruthFilter: (truthFilter) => set({ truthFilter }),
      toggleTruthFilter: () => set({ truthFilter: !get().truthFilter }),
      toggleLabels: () => set({ labels: !get().labels }),
      setActiveModule: (activeModule) => set({ activeModule }),
    }),
    {
      name: "wsp-reading",
      storage: createJSONStorage(safeStorage),
      partialize: (s) => ({ level: s.level, truthFilter: s.truthFilter, labels: s.labels }),
      // SSR-safe: never hydrate during React hydration (avoids server/client mismatch);
      // rehydrate explicitly from the TruthSync client effect after mount.
      skipHydration: true,
    }
  )
);

interface UiState {
  shortcutsOpen: boolean;
  setShortcutsOpen: (v: boolean) => void;
  commandOpen: boolean;
  setCommandOpen: (v: boolean) => void;
}
export const useUi = create<UiState>((set) => ({
  shortcutsOpen: false,
  setShortcutsOpen: (v) => set({ shortcutsOpen: v }),
  commandOpen: false,
  setCommandOpen: (v) => set({ commandOpen: v }),
}));
