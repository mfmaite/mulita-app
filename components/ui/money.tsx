import { cn } from "@/lib/cn";
import type { Currency } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";

type MoneyProps = {
  cents: number;
  currency: Currency;
  signed?: boolean;
  className?: string;
};

export function Money({ cents, currency, signed, className }: MoneyProps) {
  return (
    <span className={cn("tabular-nums", cents < 0 && "text-danger-strong", className)}>
      {formatMoney(cents, currency, { signed })}
    </span>
  );
}
