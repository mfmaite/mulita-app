import { Alert } from "@/components/ui/alert";
import { Money } from "@/components/ui/money";
import type { GoalsOverview } from "@/lib/goals/queries";
import { SavingsPlanDialog } from "./savings-plan-dialog";

export function GoalsSummary({ pool, monthlyPlan, unassigned, hasGoals }: Omit<GoalsOverview, "goals"> & { hasGoals: boolean }) {
  return (
    <div className="space-y-2">
      <section className="space-y-3 rounded-2xl bg-green-700 px-5 py-4 text-cream-50">
        <div>
          <p className="text-sm text-green-100">Ahorro acumulado</p>
          <Money cents={pool.total} currency="UYU" className="font-display text-2xl font-bold sm:text-3xl" />
          <p className="text-sm text-green-100">Lo que tenés en tus cuentas de ahorro.</p>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 border-t border-green-600 pt-3 text-sm">
          <span className="text-green-100">Ahorro mensual planificado:</span>
          {monthlyPlan > 0 ? (
            <Money cents={monthlyPlan} currency="UYU" className="font-semibold" />
          ) : (
            <span className="font-semibold">sin definir</span>
          )}
          <span aria-hidden className="text-green-200">
            ·
          </span>
          <SavingsPlanDialog monthlyPlan={monthlyPlan} />
        </div>
      </section>
      {hasGoals && unassigned > 0 && (
        <Alert tone="info">Te queda {unassigned}% de tu ahorro sin repartir entre metas.</Alert>
      )}
      {pool.unconvertedUsd > 0 && (
        <Alert tone="warning">
          Tenés <Money cents={pool.unconvertedUsd} currency="USD" /> ahorrados que no sumamos porque falta la cotización
          del dólar. Cargala en Presupuesto.
        </Alert>
      )}
    </div>
  );
}
