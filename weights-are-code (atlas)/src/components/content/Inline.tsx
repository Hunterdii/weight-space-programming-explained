import React from "react";

/**
 * Minimal inline renderer: **bold**, *italic*, `code`, [text](url), and [[G:glossary-term]] links.
 * Deliberately tiny and deterministic - no external markdown dependency.
 */
export function inline(text: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  // token order: code first so ** inside `..` isn't mangled, then bold, then italic, then links
  const re = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*]+\*)|(\[[^\]]+\]\([^)]+\))|(\[\[G:[^\]]+\]\])/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const tok = m[0];
    if (tok.startsWith("`")) {
      out.push(<code key={key++}>{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith("**")) {
      out.push(<strong key={key++}>{tok.slice(2, -2)}</strong>);
    } else if (tok.startsWith("[[G:")) {
      const term = tok.slice(4, -2);
      out.push(
        <a key={key++} href={`/glossary#${term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`} className="underline decoration-dotted underline-offset-2 hover:text-[var(--wsp-chrome)]">
          {term}
        </a>
      );
    } else if (tok.startsWith("[")) {
      const i = tok.indexOf("](");
      const label = tok.slice(1, i);
      const url = tok.slice(i + 2, -1);
      out.push(
        <a key={key++} href={url} className="underline decoration-dotted underline-offset-2 hover:text-[var(--wsp-chrome)]">
          {label}
        </a>
      );
    } else {
      out.push(<em key={key++}>{tok.slice(1, -1)}</em>);
    }
    last = m.index + tok.length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}
