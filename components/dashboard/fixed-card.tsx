import { CurrencyTotals } from "@/components/cards/currency-totals";
import { FixedStatusLabel } from "@/components/fixed/fixed-status-label";
import { Money } from "@/components/ui/money";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { Dashboard } from "@/lib/dashboard/queries";
import { DashboardCard } from "./dashboard-card";

export function FixedCard({ fixed, month }: Pick<Dashboard, "fixed"> & { month: string }) {
  const { totals, pending } = fixed;

  return (
    <DashboardCard title="Fijos del mes" link={{ href: `/fijos?mes=${month}`, label: "Ver todo" }}>
      {totals.count === 0 ? (
        <p className="text-sm text-muted">Este mes no tenés fijos. Cargá el alquiler, la UTE y compañía, y Mulita te avisa qué falta pagar.</p>
      ) : (
        <>
          <div className="space-y-1.5">
            <p className="text-sm text-muted">Te falta pagar</p>
            <CurrencyTotals totals={totals.left} empty="Nada. Todo pago, y tá." className="block font-display text-xl font-bold" />
            <ProgressBar percent={(totals.paidCount / totals.count) * 100} level="ok" />
            <p className="text-sm text-muted">
              {totals.paidCount} de {totals.count} pagos
            </p>
          </div>
          {pending.length > 0 && (
            <ul className="space-y-2 border-t border-border pt-3">
              {pending.map((row) => (
                <li key={row.fixed.id} className="flex items-center justify-between gap-3 text-sm">
                  <span className="min-w-0">
                    <span className="block truncate font-semibold">{row.fixed.name}</span>
                    <span className="text-muted">
                      <FixedStatusLabel row={row} />
                    </span>
                  </span>
                  <span className="shrink-0 font-semibold">
                    {row.fixed.variableAmount && <span className="text-muted">≈ </span>}
                    <Money cents={row.fixed.amount} currency={row.currency} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </DashboardCard>
  );
}
