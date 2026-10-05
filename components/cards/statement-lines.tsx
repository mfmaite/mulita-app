import { format, parseISO } from "date-fns";
import { Money } from "@/components/ui/money";
import type { CardStatement } from "@/lib/cards/queries";

function remainingLabel(remaining: number) {
  if (remaining === 0) return "¡Última cuota!";
  return remaining === 1 ? "falta 1" : `faltan ${remaining}`;
}

export function StatementLines({ lines }: Pick<CardStatement, "lines">) {
  if (lines.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-cream-300 px-4 py-6 text-center text-sm text-muted">
        No hay cuotas este mes.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-border rounded-2xl border border-border bg-surface">
      {lines.map(({ purchase, number, amount, remaining }) => (
        <li key={purchase.id} className="flex items-center gap-3 px-4 py-2.5">
          <div className="min-w-0 flex-1">
            <p className="leading-snug font-semibold">{purchase.title}</p>
            <p className="text-sm text-muted">
              {[purchase.title !== purchase.categoryName && purchase.categoryName, `comprado el ${format(parseISO(purchase.date), "d/M")}`]
                .filter(Boolean)
                .join(" · ")}
            </p>
          </div>
          <div className="flex shrink-0 flex-col items-end">
            <Money cents={amount} currency={purchase.currency} className="font-semibold" />
            <span
              className={
                purchase.installments > 1 && remaining === 0 ? "text-sm font-semibold text-success-strong" : "text-sm text-muted"
              }
            >
              {purchase.installments > 1 ? `${number} de ${purchase.installments} · ${remainingLabel(remaining)}` : "1 pago"}
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
