import type { ReactNode } from "react";
import { Money } from "@/components/ui/money";
import { cn } from "@/lib/cn";
import type { FixedRow as FixedRowData } from "@/lib/fixed/queries";
import { frequencyLabels } from "./fixed-meta";
import { FixedStatusLabel, type FixedStatusRow } from "./fixed-status-label";

function routeOf({ fixed, categoryName, accountName, cardName, destinationName }: FixedRowData) {
  if (fixed.kind === "card_payment") return `${accountName} → ${cardName}`;
  if (fixed.kind === "savings") return `${accountName} → ${destinationName}`;
  return [categoryName, accountName ?? cardName].filter(Boolean).join(" · ");
}

type FixedRowProps = {
  row: FixedStatusRow;
  pay?: ReactNode;
  actions: ReactNode;
};

export function FixedRow({ row, pay, actions }: FixedRowProps) {
  const { fixed, currency, payment } = row;
  const isEstimate = fixed.variableAmount && !payment;

  return (
    <li className="flex items-center gap-3 py-2.5 pr-2 pl-4">
      <div className="min-w-0 flex-1">
        <p className="leading-snug font-semibold">{fixed.name}</p>
        <p className="text-sm text-muted">{routeOf(row)}</p>
        <p className="text-sm text-muted">
          <FixedStatusLabel row={row} /> · {frequencyLabels[fixed.frequency].toLowerCase()}
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1.5">
        <span className={cn("font-semibold", payment && "text-muted")}>
          {isEstimate && <span className="text-muted">≈ </span>}
          <Money cents={payment?.amount ?? fixed.amount} currency={currency} />
        </span>
        {pay}
      </div>
      {actions}
    </li>
  );
}
