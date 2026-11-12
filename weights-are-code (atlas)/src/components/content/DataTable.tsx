import { BadgeChip } from "./Badge";
import { inline } from "./Inline";
import { TABLE_BY_ID } from "@/content/tables";

/** Truth-filter classes: applied purely via CSS on [data-truth='on']. */
export function badgeTf(badge: string): string {
  return badge === "schematic" ? "tf-schematic" : badge === "speculation" ? "tf-speculation" : "";
}

export default function DataTable({ id }: { id: string }) {
  const t = TABLE_BY_ID[id];
  if (!t) return null;
  const numericSet = new Set(t.numeric ?? []);
  return (
    <figure className={`my-6 max-w-full ${badgeTf(t.badge)}`}>
      <div className="table-scroll">
        <table className="wsp">
          <caption className="flex items-center gap-2">
            <BadgeChip b={t.badge} />
            <span className="normal-case tracking-normal text-foreground/80">{t.caption}</span>
          </caption>
          <thead>
            <tr>
              {t.columns.map((c, i) => (
                <th key={c} scope="col" className={numericSet.has(i) ? "text-right" : ""}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r, ri) => (
              <tr
                key={ri}
                className={t.highlight?.some((h) => h.row === ri) ? "bg-[color-mix(in_oklab,var(--wsp-chrome)_9%,transparent)]" : ""}
              >
                {r.map((cell, ci) => (
                  <td
                    key={ci}
                    className={ci === 0 ? "txt" : numericSet.has(ci) ? "text-right" : "txt"}
                  >
                    {inline(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {t.note && <figcaption className="mt-2 text-xs text-muted-foreground font-sans">{inline(t.note)}</figcaption>}
    </figure>
  );
}
