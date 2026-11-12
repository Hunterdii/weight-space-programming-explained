"use client";

import { useEffect } from "react";
import { useReading } from "@/state/store";
import { useTheme } from "next-themes";

/** Syncs store state to the <html> dataset so CSS can apply the truth filter without hydration flashes. */
export default function TruthSync() {
  const truthFilter = useReading((s) => s.truthFilter);
  const labels = useReading((s) => s.labels);
  const { theme } = useTheme();
  useEffect(() => {
    // Rehydrate persisted preferences AFTER mount, so SSR HTML always matches the
    // first client render (skipHydration pattern for zustand persist).
    useReading.persist.rehydrate();
  }, []);
  useEffect(() => {
    document.documentElement.dataset.truth = truthFilter ? "on" : "off";
    document.documentElement.dataset.labels = labels ? "on" : "off";
  }, [truthFilter, labels]);
  useEffect(() => {
    document.documentElement.dataset.theme = theme ?? "dark";
  }, [theme]);
  return null;
}
