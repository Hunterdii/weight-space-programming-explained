"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Reading progress as a "sparsity" chip: you have read X% - that is N× the
 * size of the paper's flagship edit (0.016% of Qwen3.5-0.8B).
 * Signature detail of the guide; appears only on /read/* pages.
 */
export default function SparsityProgress() {
  const pathname = usePathname();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!pathname.startsWith("/read/")) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const p = max > 0 ? h.scrollTop / max : 0;
        setPct(p);
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [pathname]);

  const onReadPage = pathname.startsWith("/read/");
  const show = onReadPage && pct > 0.02 && pct < 0.995;
  if (!show) return null;
  const multiple = (pct * 100) / 0.016;
  return (
    <div
      aria-hidden
      className="fixed bottom-4 left-4 z-40 hidden items-center gap-3 rounded-full border bg-card/95 px-4 py-2 shadow-lg backdrop-blur md:flex"
    >
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden>
        <circle cx="13" cy="13" r="10" fill="none" stroke="var(--border)" strokeWidth="3" />
        <circle
          cx="13"
          cy="13"
          r="10"
          fill="none"
          stroke="var(--wsp-chrome)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={2 * Math.PI * 10}
          strokeDashoffset={2 * Math.PI * 10 * (1 - pct)}
          transform="rotate(-90 13 13)"
        />
      </svg>
      <span className="mono text-xs leading-tight">
        read {(pct * 100).toFixed(0)}%
        <span className="text-muted-foreground">
          {" "}
          ≈ {multiple >= 1000 ? `${(multiple / 1000).toFixed(1)}k` : multiple.toFixed(0)}× the Exp-8 edit (0.016%)
        </span>
      </span>
    </div>
  );
}
