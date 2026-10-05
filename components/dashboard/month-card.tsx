import { Alert } from "@/components/ui/alert";
import { Money } from "@/components/ui/money";
import type { Dashboard } from "@/lib/dashboard/queries";
import { DashboardCard } from "./dashboard-card";
import { Stat } from "./stat";

export function MonthCard({ summary, month }: Pick<Dashboard, "summary"> & { month: string }) {
  const rate = summary.savingsRate === null ? null : `${summary.savingsRate.toFixed(1).replace(".", ",")}% de lo que entró`;

  return (
    <DashboardCard title="Este mes" link={{ href: `/movimientos?mes=${month}`, label: "Movimientos" }}>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        <Stat label="Entró" cents={summary.income} />
        <Stat label="Gasto real" cents={summary.spent} hint="Incluye las cuotas del mes" />
        <Stat label="Ahorraste" cents={summary.saved} hint={rate} />
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
