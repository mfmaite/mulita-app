import "server-only";
import { and, asc, desc, eq, gte, isNull, lt, lte, sum } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, budgets, categories, exchangeRates, movements } from "@/lib/db/schema";
import { monthRange } from "@/lib/month";
import { spentByCategory, usageOf } from "./calculations";

export async function getBudgetMonth(month: string) {
  const { user } = await requireSession();
  const { start, end } = monthRange(month);

  const [categoryRows, budgetRows, [rate], spentRows] = await Promise.all([
    db
      .select({ id: categories.id, name: categories.name })
      .from(categories)
      .where(and(eq(categories.userId, user.id), eq(categories.kind, "expense"), isNull(categories.archivedAt)))
      .orderBy(asc(categories.name)),
    db
      .selectDistinctOn([budgets.categoryId], { categoryId: budgets.categoryId, amount: budgets.amount })
      .from(budgets)
      .where(and(eq(budgets.userId, user.id), lte(budgets.effectiveFrom, start)))
      .orderBy(budgets.categoryId, desc(budgets.effectiveFrom)),
    db
      .select({ month: exchangeRates.month, usdToUyu: exchangeRates.usdToUyu })
      .from(exchangeRates)
      .where(and(eq(exchangeRates.userId, user.id), lte(exchangeRates.month, start)))
      .orderBy(desc(exchangeRates.month))
      .limit(1),
    db
      .select({ categoryId: movements.categoryId, currency: accounts.currency, total: sum(movements.amount).mapWith(Number) })
      .from(movements)
      .innerJoin(accounts, eq(accounts.id, movements.accountId))
      .where(
        and(
          eq(movements.userId, user.id),
          eq(movements.type, "expense"),
          gte(movements.date, start),
          lt(movements.date, end),
        ),
      )
      .groupBy(movements.categoryId, accounts.currency),
  ]);

  const budgetByCategory = new Map(budgetRows.map(({ categoryId, amount }) => [categoryId, amount]));
  const { totals, unconvertedUsd } = spentByCategory(spentRows, rate?.usdToUyu);

  const rows = categoryRows.map((category) => {
    const budget = budgetByCategory.get(category.id) ?? 0;
    const spent = totals.get(category.id) ?? 0;
    return { ...category, budget, spent, ...usageOf(spent, budget) };
  });

  const budgeted = rows.reduce((total, row) => total + row.budget, 0);
  const spent = rows.reduce((total, row) => total + row.spent, 0);

  return {
    rows,
    summary: { budgeted, spent, ...usageOf(spent, budgeted) },
    rate: rate ? { usdToUyu: rate.usdToUyu, month: rate.month.slice(0, 7) } : null,
    unconvertedUsd,
  };
}

export type BudgetMonth = Awaited<ReturnType<typeof getBudgetMonth>>;
export type BudgetRow = BudgetMonth["rows"][number];
