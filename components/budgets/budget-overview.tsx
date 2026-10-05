import Link from "next/link";
import { buttonClassName } from "@/components/ui/button";
import { hasPlan } from "@/lib/budgets/plan";
import type { BudgetMonth } from "@/lib/budgets/queries";
import { formatMonth } from "@/lib/month";
import { BudgetSpent } from "./budget-spent";
import { PlanDetails } from "./plan-details";
import { PlanDialog } from "./plan-dialog";

type BudgetOverviewProps = Pick<BudgetMonth, "summary" | "plan"> & { month: string };

export function BudgetOverview({ summary, plan, month }: BudgetOverviewProps) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="space-y-3 bg-green-700 px-5 py-4 text-cream-50">
        <header className="flex items-center justify-between gap-3">
          <h2 className="text-lg text-cream-50">Plan de {formatMonth(month).toLowerCase()}</h2>
          {hasPlan(plan) ? (
            <PlanDialog plan={plan} month={month} label="Editar" />
          ) : (
            <Link href="/bienvenida" className={buttonClassName("secondary", "px-4 py-1.5 text-sm")}>
              Empezar
            </Link>
          )}
        </header>
        <BudgetSpent summary={summary} />
      </div>
      <div className="space-y-4 px-5 py-4">
        <PlanDetails plan={plan} />
      </div>
    </section>
  );
}
