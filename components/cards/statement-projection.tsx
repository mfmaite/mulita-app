import type { CardStatement } from "@/lib/cards/queries";
import { formatMonth } from "@/lib/month";
import { CurrencyTotals } from "./currency-totals";

export function StatementProjection({ projection }: Pick<CardStatement, "projection">) {
  const maxPesos = Math.max(...projection.map(({ totals }) => totals.UYU ?? 0), 1);

  return (
    <ul className="space-y-2 rounded-2xl border border-border bg-surface px-4 py-3">
      {projection.map(({ month, totals }) => (
        <li key={month} className="grid grid-cols-[1fr_auto] items-center gap-3 text-sm sm:grid-cols-[8rem_1fr_9rem]">
          <span className="text-muted">{formatMonth(month)}</span>
          <div className="h-2 overflow-hidden rounded-full bg-cream-100 max-sm:hidden">
            <div className="h-full rounded-full bg-green-500" style={{ width: `${((totals.UYU ?? 0) / maxPesos) * 100}%` }} />
          </div>
          <CurrencyTotals totals={totals} empty="—" className="text-right font-semibold" />
        </li>
      ))}
    </ul>
  );
}
