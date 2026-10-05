import { Alert } from "@/components/ui/alert";
import { Money } from "@/components/ui/money";
import type { BudgetMonth } from "@/lib/budgets/queries";
import { formatMonth } from "@/lib/month";
import { ExchangeRateDialog } from "./exchange-rate-dialog";

type ExchangeRateCardProps = {
  month: string;
  rate: BudgetMonth["rate"];
  unconvertedUsd: number;
};

export function ExchangeRateCard({ month, rate, unconvertedUsd }: ExchangeRateCardProps) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted">
        {rate ? (
          <>
            <span>
              Dólar a <Money cents={rate.usdToUyu} currency="UYU" className="font-semibold text-foreground" />
              {rate.month !== month && ` (cotización de ${formatMonth(rate.month).toLowerCase()})`}
            </span>
            <span aria-hidden>·</span>
          </>
        ) : (
          <span>Todavía no cargaste la cotización del dólar.</span>
        )}
        <ExchangeRateDialog month={month} usdToUyu={rate?.month === month ? rate.usdToUyu : undefined} />
      </div>
      {unconvertedUsd > 0 && (
        <Alert tone="warning">
          Tenés <Money cents={unconvertedUsd} currency="USD" /> en gastos en dólares que no sumamos porque falta la
          cotización.
        </Alert>
      )}
    </div>
  );
}
