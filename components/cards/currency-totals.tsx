import { Money } from "@/components/ui/money";
import type { CurrencyTotals as Totals } from "@/lib/cards/statement";
import { currencies } from "@/lib/db/schema";

type CurrencyTotalsProps = {
  totals: Totals;
  empty: string;
  inverse?: boolean;
  className?: string;
};

export function CurrencyTotals({ totals, empty, inverse, className }: CurrencyTotalsProps) {
  const present = currencies.filter((currency) => totals[currency]);
  if (present.length === 0) return <span className={className}>{empty}</span>;

  return (
    <span className={className}>
      {present.map((currency, index) => (
        <span key={currency}>
          {index > 0 && " · "}
          <Money cents={totals[currency]!} currency={currency} inverse={inverse} />
        </span>
      ))}
    </span>
  );
}
