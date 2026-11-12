"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Root Layout Crash:", error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#06080c] text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full rounded-2xl border border-red-500/40 bg-[#090d14] p-6 text-center space-y-6 shadow-2xl">
          <div className="inline-flex size-12 items-center justify-center rounded-full bg-red-500/20 text-red-400 mx-auto">
            <AlertTriangle className="size-6" />
          </div>
          <div className="space-y-2">
            <h1 className="font-mono text-xl font-bold tracking-tight">Root Manifold Exception</h1>
            <p className="text-xs text-neutral-400 font-serif">
              An unhandled root-level exception destabilized the application framework.
            </p>
          </div>
          {error?.digest && (
            <div className="font-mono text-[10px] text-neutral-500 bg-black/50 p-2 rounded border border-neutral-800">
              Digest: {error.digest}
            </div>
          )}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => reset()}
              className="inline-flex items-center gap-2 rounded-xl bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 font-mono text-xs font-bold transition-all shadow cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Re-initialize Application</span>
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}

