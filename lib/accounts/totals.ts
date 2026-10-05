import type { Currency } from "@/lib/db/schema";

type Amount = { currency: Currency; amount: number };

export function totalsByCurrency(amounts: Amount[]) {
  return amounts.reduce<Partial<Record<Currency, number>>>(
    (totals, { currency, amount }) => ({ ...totals, [currency]: (totals[currency] ?? 0) + amount }),
    {},
  );
}
