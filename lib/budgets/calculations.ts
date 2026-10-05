import type { Currency } from "@/lib/db/schema";

export type UsageLevel = "none" | "ok" | "warning" | "over";

export function toPesos(cents: number, currency: Currency, usdToUyu?: number | null) {
  if (currency === "UYU") return cents;
  return usdToUyu ? Math.round((cents * usdToUyu) / 100) : null;
}

export function usageOf(spent: number, budget: number) {
  if (budget <= 0) return { percent: null, level: "none" as UsageLevel };
  const percent = (spent / budget) * 100;
  const level: UsageLevel = percent > 100 ? "over" : percent >= 90 ? "warning" : "ok";
  return { percent, level };
}

type SpentRow = { categoryId: string | null; currency: Currency; total: number };

export function spentByCategory(rows: SpentRow[], usdToUyu?: number | null) {
  const totals = new Map<string, number>();
  let unconvertedUsd = 0;

  for (const { categoryId, currency, total } of rows) {
    if (!categoryId) continue;
    const pesos = toPesos(total, currency, usdToUyu);
    if (pesos === null) {
      unconvertedUsd += total;
      continue;
    }
    totals.set(categoryId, (totals.get(categoryId) ?? 0) + pesos);
  }

  return { totals, unconvertedUsd };
}
