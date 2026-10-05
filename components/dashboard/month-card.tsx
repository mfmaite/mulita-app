import { Alert } from "@/components/ui/alert";
import { Money } from "@/components/ui/money";
import { Stat } from "@/components/ui/stat";
import type { MonthPlan } from "@/lib/budgets/plan";
import type { Dashboard } from "@/lib/dashboard/queries";
import { DashboardCard } from "./dashboard-card";

type MonthCardProps = Pick<Dashboard, "summary"> & {
  plan: MonthPlan;
  month: string;
};

function savedHint(summary: Dashboard["summary"], plan: MonthPlan) {
  const rate = summary.savingsRate === null ? null : `${summary.savingsRate.toFixed(1).replace(".", ",")}% de lo que entró`;
  if (plan.savingsTarget <= 0) return rate;
  return (
    <>
      de <Money cents={plan.savingsTarget} currency="UYU" /> que querías{rate && ` · ${rate}`}
    </>
  );
}

export function MonthCard({ summary, plan, month }: MonthCardProps) {
  return (
    <DashboardCard title="Este mes" link={{ href: `/movimientos?mes=${month}`, label: "Movimientos" }}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Entró" cents={summary.income} />
        <Stat label="Gasto real" cents={summary.spent} hint="Incluye las cuotas del mes" />
        <Stat label="Ahorraste" cents={summary.saved} hint={savedHint(summary, plan)} progress={plan.savingsPercent} />
      </div>
      {summary.cardPayments > 0 && (
        <p className="text-sm text-muted">
          Pagaste <Money cents={summary.cardPayments} currency="UYU" className="font-semibold text-foreground" /> de
          tarjetas.
        </p>
      )}
      {summary.unconvertedUsd > 0 && (
        <Alert tone="warning">
          Hay <Money cents={summary.unconvertedUsd} currency="USD" /> que no sumamos porque falta la cotización del dólar.
        </Alert>
      )}
    </DashboardCard>
  );
}
