import type { ReactNode } from "react";
import { Money } from "@/components/ui/money";
import type { FixedRow as FixedRowData } from "@/lib/fixed/queries";
import { frequencyLabels } from "./fixed-meta";

function routeOf({ fixed, categoryName, accountName, cardName, destinationName }: FixedRowData) {
  if (fixed.kind === "card_payment") return `${accountName} → ${cardName}`;
  if (fixed.kind === "savings") return `${accountName} → ${destinationName}`;
  return [categoryName, accountName ?? cardName].filter(Boolean).join(" · ");
}

type FixedRowProps = {
  row: FixedRowData;
  status?: ReactNode;
  actions: ReactNode;
};

export function FixedRow({ row, status, actions }: FixedRowProps) {
  const { fixed, currency } = row;

  return (
    <li className="flex items-center gap-3 py-2.5 pr-2 pl-4">
      <div className="min-w-0 flex-1">
        <p className="leading-snug font-semibold">{fixed.name}</p>
        <p className="text-sm text-muted">{routeOf(row)}</p>
        <p className="text-sm text-muted">
          {status ?? `Vence el ${fixed.dueDay}`} · {frequencyLabels[fixed.frequency].toLowerCase()}
        </p>
      </div>
      <span className="shrink-0 text-right font-semibold">
        {fixed.variableAmount && <span className="text-muted">≈ </span>}
        <Money cents={fixed.amount} currency={currency} />
      </span>
      {actions}
    </li>
  );
}
