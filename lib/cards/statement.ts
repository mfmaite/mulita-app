import type { Currency } from "@/lib/db/schema";
import { shiftMonth } from "@/lib/month";
import { installmentSchedule } from "./installments";

export type CardPurchase = {
  id: string;
  cardId: string;
  title: string;
  categoryId: string | null;
  categoryName: string | null;
  currency: Currency;
  amount: number;
  installments: number;
  firstBillingMonth: string;
  date: string;
};

export type CurrencyTotals = Partial<Record<Currency, number>>;

function scheduleOf(purchase: CardPurchase) {
  return installmentSchedule({
    total: purchase.amount,
    count: purchase.installments,
    firstMonth: purchase.firstBillingMonth,
  });
}

export function installmentsInMonth(purchases: CardPurchase[], month: string) {
  return purchases.flatMap((purchase) =>
    scheduleOf(purchase)
      .filter((installment) => installment.month === month)
      .map(({ number, amount }) => ({ purchase, number, amount, remaining: purchase.installments - number })),
  );
}

export function totalsByCurrency(items: { currency: Currency; amount: number }[]) {
  return items.reduce<CurrencyTotals>(
    (totals, { currency, amount }) => ({ ...totals, [currency]: (totals[currency] ?? 0) + amount }),
    {},
  );
}

export function monthTotals(purchases: CardPurchase[], month: string) {
  return totalsByCurrency(
    installmentsInMonth(purchases, month).map(({ purchase, amount }) => ({ currency: purchase.currency, amount })),
  );
}

export function pendingAfter(purchases: CardPurchase[], month: string) {
  return totalsByCurrency(
    purchases.flatMap((purchase) =>
      scheduleOf(purchase)
        .filter((installment) => installment.month > month)
        .map(({ amount }) => ({ currency: purchase.currency, amount })),
    ),
  );
}

export function projection(purchases: CardPurchase[], month: string, count: number) {
  return Array.from({ length: count }, (_, index) => {
    const projectedMonth = shiftMonth(month, index + 1);
    return { month: projectedMonth, totals: monthTotals(purchases, projectedMonth) };
  });
}
