import { toPesos } from "@/lib/budgets/calculations";
import type { CurrencyTotals } from "@/lib/cards/statement";
import { currencies, type AccountType, type Currency, type MovementType } from "@/lib/db/schema";

export type MovementTotalRow = {
  type: MovementType;
  currency: Currency | null;
  sourceType: AccountType | null;
  destinationType: AccountType | null;
  destinationCurrency: Currency | null;
  amount: number;
  destinationAmount: number;
};

type Bucket = "income" | "spent" | "savingsIn" | "savingsOut" | "cardPayments";

function bucketOf(row: MovementTotalRow): { bucket: Bucket; amount: number; currency: Currency } | null {
  if (row.type === "income" && row.currency) return { bucket: "income", amount: row.amount, currency: row.currency };
  if (row.type === "expense" && row.sourceType && row.currency) return { bucket: "spent", amount: row.amount, currency: row.currency };
  if (row.type === "card_payment" && row.currency) return { bucket: "cardPayments", amount: row.amount, currency: row.currency };
  if (row.type !== "transfer") return null;

  const intoSavings = row.destinationType === "savings" && row.sourceType !== "savings";
  const outOfSavings = row.sourceType === "savings" && row.destinationType !== "savings";
  if (intoSavings && row.destinationCurrency) {
    return { bucket: "savingsIn", amount: row.destinationAmount, currency: row.destinationCurrency };
  }
  if (outOfSavings && row.currency) return { bucket: "savingsOut", amount: row.amount, currency: row.currency };
  return null;
}

export function monthSummary(rows: MovementTotalRow[], installments: CurrencyTotals, usdToUyu?: number | null) {
  const totals: Record<Bucket, number> = { income: 0, spent: 0, savingsIn: 0, savingsOut: 0, cardPayments: 0 };
  let unconvertedUsd = 0;

  const add = (bucket: Bucket, amount: number, currency: Currency) => {
    const pesos = toPesos(amount, currency, usdToUyu);
    if (pesos === null) unconvertedUsd += amount;
    else totals[bucket] += pesos;
  };

  for (const row of rows) {
    const entry = bucketOf(row);
    if (entry) add(entry.bucket, entry.amount, entry.currency);
  }
  for (const currency of currencies) {
    if (installments[currency]) add("spent", installments[currency], currency);
  }

  const saved = totals.savingsIn - totals.savingsOut;

  return {
    income: totals.income,
    spent: totals.spent,
    saved,
    cardPayments: totals.cardPayments,
    savingsRate: totals.income > 0 ? (saved / totals.income) * 100 : null,
    unconvertedUsd,
  };
}
