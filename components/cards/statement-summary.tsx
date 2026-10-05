import type { CardStatement } from "@/lib/cards/queries";
import { CurrencyTotals } from "./currency-totals";

export function StatementSummary({ totals, pending }: Pick<CardStatement, "totals" | "pending">) {
  return (
    <section className="space-y-2 rounded-2xl bg-green-700 px-5 py-4 text-cream-50">
      <p className="text-sm text-green-100">Este mes pagás</p>
      <CurrencyTotals totals={totals} empty="Nada. ¡A disfrutar!" className="block font-display text-2xl font-bold sm:text-3xl" />
      <p className="text-sm text-green-100">
        Después de este mes te quedan{" "}
        <CurrencyTotals totals={pending} empty="cero cuotas. ¡Libre!" className="font-semibold text-cream-50" />
      </p>
    </section>
  );
}
