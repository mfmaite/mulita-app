import { Money } from "@/components/ui/money";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Stat } from "@/components/ui/stat";
import { hasPlan, type MonthPlan } from "@/lib/budgets/plan";
import { ToAssignStatus } from "./to-assign-status";

function incomeHint({ expectedIncome, usesRealIncome, unexpectedIncome }: MonthPlan) {
  if (unexpectedIncome > 0) {
    return (
      <>
        Incluye <Money cents={unexpectedIncome} currency="UYU" /> inesperados
      </>
    );
  }
  if (!usesRealIncome) return "Lo que esperás ganar";
  return expectedIncome > 0 ? "Lo que entró, más de lo esperado" : "Lo que entró este mes";
}

function toAssignHint(toAssign: number) {
  if (toAssign > 0) return "Repartilo entre categorías o al ahorro";
  return toAssign === 0 ? "Todo asignado, y tá" : "Más de lo que ganás";
}

export function PlanDetails({ plan }: { plan: MonthPlan }) {
  if (!hasPlan(plan)) {
    return (
      <p className="text-sm text-muted">
        Contale a Mulita cuánto ganás y cuánto querés ahorrar, y te dice cuánto te queda para repartir.
      </p>
    );
  }

  return (
    <>
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Stat label="Ingreso" cents={plan.income} hint={incomeHint(plan)} />
        <div className="space-y-1.5">
          <Stat label="Ahorro" cents={plan.savingsTarget} hint={<>Ahorraste <Money cents={plan.saved} currency="UYU" /></>} />
          {plan.savingsPercent !== null && <ProgressBar percent={plan.savingsPercent} level="ok" className="h-1.5" />}
        </div>
        <Stat label="Sin asignar" cents={plan.toAssign} hint={toAssignHint(plan.toAssign)} />
      </div>
      {plan.toAssign < 0 && <ToAssignStatus toAssign={plan.toAssign} />}
    </>
  );
}
