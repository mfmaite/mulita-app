import { Money } from "@/components/ui/money";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { BudgetMonth } from "@/lib/budgets/queries";
import { BudgetStatus } from "./budget-status";

export function BudgetSpent({ summary }: { summary: BudgetMonth["summary"] }) {
  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div>
          <p className="text-sm text-green-100">Gastado</p>
          <Money cents={summary.spent} currency="UYU" className="font-display text-2xl font-bold sm:text-3xl" />
        </div>
        <div className="text-right">
          <p className="text-sm text-green-100">Presupuestado</p>
          <Money cents={summary.budgeted} currency="UYU" className="font-display text-lg font-bold sm:text-xl" />
        </div>
      </div>
      <ProgressBar percent={summary.percent} level={summary.level} className="bg-green-800" />
      <p className="rounded-lg bg-cream-50 px-3 py-1.5 text-sm">
        <BudgetStatus budget={summary.budgeted} spent={summary.spent} level={summary.level} />
      </p>
    </>
  );
}
