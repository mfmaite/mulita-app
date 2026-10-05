import Link from "next/link";
import { BudgetStatus } from "@/components/budgets/budget-status";
import { ToAssignStatus } from "@/components/budgets/to-assign-status";
import { ProgressBar } from "@/components/ui/progress-bar";
import { hasPlan } from "@/lib/budgets/plan";
import type { Dashboard } from "@/lib/dashboard/queries";
import { DashboardCard } from "./dashboard-card";

export function BudgetCard({ budget, month }: Pick<Dashboard, "budget"> & { month: string }) {
  const { summary, plan, highlights } = budget;

  return (
    <DashboardCard title="Presupuesto" link={{ href: `/presupuesto?mes=${month}`, label: "Ver todo" }}>
      {summary.budgeted === 0 ? (
        <p className="text-sm text-muted">
          Todavía no armaste el presupuesto.{" "}
          <Link href="/bienvenida" className="font-semibold text-primary underline-offset-4 hover:underline">
            Armalo en tres pasos
          </Link>{" "}
          y Mulita te avisa cómo venís.
        </p>
      ) : (
        <>
          <div className="space-y-1.5">
            <ProgressBar percent={summary.percent} level={summary.level} />
            <p className="text-sm">
              <BudgetStatus budget={summary.budgeted} spent={summary.spent} level={summary.level} />
            </p>
          </div>
          {hasPlan(plan) && plan.toAssign !== 0 && <ToAssignStatus toAssign={plan.toAssign} />}
          <ul className="space-y-2 border-t border-border pt-3">
            {highlights.map((row) => (
              <li key={row.id} className="grid grid-cols-[1fr_5rem_2.5rem] items-center gap-3 text-sm">
                <span className="truncate">{row.name}</span>
                <ProgressBar percent={row.percent} level={row.level} className="h-1.5" />
                <span className="text-right text-muted tabular-nums">{Math.round(row.percent ?? 0)}%</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </DashboardCard>
  );
}
