import { CurrencyTotals } from "@/components/cards/currency-totals";
import type { Dashboard } from "@/lib/dashboard/queries";
import { DashboardCard } from "./dashboard-card";

export function CashCard({ cash }: Pick<Dashboard, "cash">) {
  return (
    <DashboardCard title="Saldo de caja" tone="brand" link={{ href: "/cuentas", label: "Cuentas" }}>
      <CurrencyTotals totals={cash} empty="$ 0" inverse className="block font-display text-3xl font-bold" />
      <p className="text-sm text-green-100">Lo que tenés hoy en débito y efectivo, sin contar el ahorro.</p>
    </DashboardCard>
  );
}
