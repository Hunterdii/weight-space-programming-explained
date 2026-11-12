"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function CodeBlock({
  source,
  lang = "python",
  caption,
  maxHeight,
}: {
  source: string;
  lang?: string;
  caption?: string;
  maxHeight?: number;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-xl border">
        <div className="flex items-center justify-between border-b bg-accent px-4 py-2">
          <span className="font-mono text-xs text-muted-foreground">{lang}</span>
          <button
            onClick={() => {
              try {
                navigator.clipboard.writeText(source);
              } catch {
                /* clipboard may be blocked - the code is right there */
              }
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            }}
            className="flex items-center gap-1.5 rounded-md px-2 py-1 font-sans text-xs text-muted-foreground hover:text-foreground"
            aria-label="Copy code"
          >
            {copied ? <Check className="size-3.5 text-[var(--wsp-green)]" /> : <Copy className="size-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre
          className="mono overflow-x-auto bg-card p-4 text-[0.82rem] leading-relaxed"
          {...(maxHeight ? { style: { maxHeight } } : {})}
        >
          <code>{source}</code>
        </pre>
      </div>
      {caption && <figcaption className="mt-1.5 font-sans text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
