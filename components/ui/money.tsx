import { cn } from "@/lib/cn";
import type { Currency } from "@/lib/db/schema";
import { formatMoney } from "@/lib/money";

type MoneyProps = {
  cents: number;
  currency: Currency;
  signed?: boolean;
  inverse?: boolean;
  className?: string;
};

export function Money({ cents, currency, signed, inverse, className }: MoneyProps) {
  return (
    <span className={cn("tabular-nums", cents < 0 && (inverse ? "text-danger-soft" : "text-danger-strong"), className)}>
      {formatMoney(cents, currency, { signed })}
    </span>
  );
}
