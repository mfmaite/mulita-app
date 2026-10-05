import { Money } from "@/components/ui/money";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { BudgetRow as BudgetRowData } from "@/lib/budgets/queries";
import { BudgetDialog } from "./budget-dialog";
import { BudgetStatus } from "./budget-status";

type BudgetRowProps = {
  row: BudgetRowData;
  month: string;
};

export function BudgetRow({ row, month }: BudgetRowProps) {
  if (row.budget === 0) {
    return (
      <li className="flex items-center justify-between gap-3 rounded-2xl border border-dashed border-cream-300 py-2 pr-2 pl-4">
        <div className="min-w-0">
          <p className="leading-snug font-semibold">{row.name}</p>
          <p className="text-sm">
            <BudgetStatus budget={row.budget} spent={row.spent} level={row.level} />
          </p>
        </div>
        <BudgetDialog row={row} month={month} />
      </li>
    );
  }

  return (
    <li className="space-y-2 rounded-2xl border border-border bg-surface py-3 pr-2 pl-4">
      <div className="flex items-center justify-between gap-3">
        <p className="leading-snug font-semibold">{row.name}</p>
        <div className="flex shrink-0 items-center gap-1">
          <span className="text-sm text-muted tabular-nums">{Math.round(row.percent ?? 0)}%</span>
          <BudgetDialog row={row} month={month} />
        </div>
      </div>
      <div className="space-y-1.5 pr-2">
        <ProgressBar percent={row.percent} level={row.level} />
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-sm">
          <span className="text-muted">
            <Money cents={row.spent} currency="UYU" /> de <Money cents={row.budget} currency="UYU" />
          </span>
          <BudgetStatus budget={row.budget} spent={row.spent} level={row.level} />
        </div>
      </div>
    </li>
  );
}
