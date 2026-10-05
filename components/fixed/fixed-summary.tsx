import { CurrencyTotals } from "@/components/cards/currency-totals";
import { ProgressBar } from "@/components/ui/progress-bar";
import type { FixedMonth } from "@/lib/fixed/queries";

type FixedSummaryProps = {
  totals: FixedMonth["totals"];
  monthLabel: string;
};

export function FixedSummary({ totals: { left, total, paidCount, count }, monthLabel }: FixedSummaryProps) {
  return (
    <section className="space-y-2 rounded-2xl bg-green-700 px-5 py-4 text-cream-50">
      <p className="text-sm text-green-100">Te falta pagar</p>
      <CurrencyTotals totals={left} empty="Nada. Todo pago, y tá." className="block font-display text-2xl font-bold sm:text-3xl" />
      <p className="text-sm text-green-100">
        de <CurrencyTotals totals={total} empty="" className="font-semibold text-cream-50" /> en {monthLabel} · {paidCount} de{" "}
        {count} pagos
      </p>
      <ProgressBar percent={(paidCount / count) * 100} level="ok" className="bg-green-800" />
    </section>
  );
}
