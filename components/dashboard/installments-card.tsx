import { CurrencyTotals } from "@/components/cards/currency-totals";
import type { Dashboard } from "@/lib/dashboard/queries";
import { DashboardCard } from "./dashboard-card";

export function InstallmentsCard({ installments }: Pick<Dashboard, "installments">) {
  return (
    <DashboardCard title="Cuotas de tarjeta" link={{ href: "/tarjetas", label: "Tarjetas" }}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-0.5">
          <p className="text-sm text-muted">Este mes</p>
          <CurrencyTotals totals={installments.thisMonth} empty="Nada" className="block font-display text-xl font-bold" />
        </div>
        <div className="space-y-0.5">
          <p className="text-sm text-muted">El mes que viene</p>
          <CurrencyTotals totals={installments.nextMonth} empty="Nada" className="block font-display text-xl font-bold" />
        </div>
      </div>
    </DashboardCard>
  );
}
