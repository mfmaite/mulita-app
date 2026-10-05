import "server-only";
import { and, asc, desc, eq, gte, isNull, lt, lte, sum } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, budgets, categories, exchangeRates, movements } from "@/lib/db/schema";
import { listCardPurchases } from "@/lib/cards/queries";
import { installmentsInMonth } from "@/lib/cards/statement";
import { monthSummary } from "@/lib/dashboard/summary";
import { monthRange } from "@/lib/month";
import { monthMovementTotals, unexpectedIncomeRows } from "@/lib/movements/month-totals";
import { getMonthlyPlan } from "@/lib/plans/queries";
import { spentByCategory, toPesos, usageOf } from "./calculations";
import { monthPlan } from "./plan";

export async function getBudgetMonth(month: string) {
  const { user } = await requireSession();
  const { start, end } = monthRange(month);

  const [categoryRows, budgetRows, [rate], directSpent, cardPurchases, plan, movementTotals, unexpected] = await Promise.all([
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
    listCardPurchases(user.id),
    getMonthlyPlan(user.id, month),
    monthMovementTotals(user.id, month),
    unexpectedIncomeRows(user.id, month),
  ]);

  const installmentSpent = installmentsInMonth(cardPurchases, month).map(({ purchase, amount }) => ({
    categoryId: purchase.categoryId,
    currency: purchase.currency,
    total: amount,
  }));
  const spentRows = [...directSpent, ...installmentSpent];

  const budgetByCategory = new Map(budgetRows.map(({ categoryId, amount }) => [categoryId, amount]));
  const { totals, unconvertedUsd } = spentByCategory(spentRows, rate?.usdToUyu);

  const rows = categoryRows.map((category) => {
    const budget = budgetByCategory.get(category.id) ?? 0;
    const spent = totals.get(category.id) ?? 0;
    return { ...category, budget, spent, ...usageOf(spent, budget) };
  });

  const budgeted = rows.reduce((total, row) => total + row.budget, 0);
  const spent = rows.reduce((total, row) => total + row.spent, 0);

  const { income, saved } = monthSummary(movementTotals, {}, rate?.usdToUyu);
  const unexpectedIncome = unexpected.reduce((total, row) => total + (toPesos(row.total, row.currency, rate?.usdToUyu) ?? 0), 0);

  return {
    rows,
    summary: { budgeted, spent, ...usageOf(spent, budgeted) },
    plan: monthPlan({ ...plan, income, unexpectedIncome, saved, budgeted }),
    rate: rate ? { usdToUyu: rate.usdToUyu, month: rate.month.slice(0, 7) } : null,
    unconvertedUsd,
  };
}

export type BudgetMonth = Awaited<ReturnType<typeof getBudgetMonth>>;
export type BudgetRow = BudgetMonth["rows"][number];
