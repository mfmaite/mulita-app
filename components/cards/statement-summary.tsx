import type { CardStatement } from "@/lib/cards/queries";
import type { MovementFormData } from "@/lib/movements/queries";
import { CurrencyTotals } from "./currency-totals";
import { PayStatementDialog } from "./pay-statement-dialog";

type StatementSummaryProps = Pick<CardStatement, "totals" | "pending" | "paid"> & {
  cardId: string;
  accounts: MovementFormData["accounts"];
};

export function StatementSummary({ cardId, accounts, totals, pending, paid }: StatementSummaryProps) {
  const hasPaid = Object.keys(paid).length > 0;

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-green-700 px-5 py-4 text-cream-50 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <p className="text-sm text-green-100">Este mes pagás</p>
        <CurrencyTotals totals={totals} empty="Nada. ¡A disfrutar!" className="block font-display text-2xl font-bold sm:text-3xl" />
        <p className="text-sm text-green-100">
          Después de este mes te quedan{" "}
          <CurrencyTotals totals={pending} empty="cero cuotas. ¡Libre!" className="font-semibold text-cream-50" />
        </p>
        {hasPaid && (
          <p className="text-sm text-green-100">
            Ya pagaste <CurrencyTotals totals={paid} empty="" className="font-semibold text-cream-50" /> en este mes.
          </p>
        )}
      </div>
      {accounts.length > 0 && <PayStatementDialog cardId={cardId} accounts={accounts} totals={totals} />}
    </section>
  );
}
