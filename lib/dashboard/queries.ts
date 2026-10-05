import "server-only";
import { and, desc, eq, gte, ilike, lt, lte, sum } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { accountsWithBalance } from "@/lib/accounts/queries";
import { requireSession } from "@/lib/auth/session";
import { toPesos } from "@/lib/budgets/calculations";
import { getBudgetMonth } from "@/lib/budgets/queries";
import { listCardPurchases } from "@/lib/cards/queries";
import { monthTotals, totalsByCurrency } from "@/lib/cards/statement";
import { db } from "@/lib/db";
import { dayOfYear } from "@/lib/dates";
import { accounts, categories, exchangeRates, movements } from "@/lib/db/schema";
import { getFixedMonth } from "@/lib/fixed/queries";
import { monthRange, shiftMonth } from "@/lib/month";
import { pickTip } from "@/lib/tips";
import { monthSummary } from "./summary";

const destinationAccounts = alias(accounts, "destination_accounts");

async function monthMovementTotals(userId: string, month: string) {
  const { start, end } = monthRange(month);
  return db
    .select({
      type: movements.type,
      currency: accounts.currency,
      sourceType: accounts.type,
      destinationType: destinationAccounts.type,
      destinationCurrency: destinationAccounts.currency,
      amount: sum(movements.amount).mapWith(Number),
      destinationAmount: sum(movements.destinationAmount).mapWith(Number),
    })
    .from(movements)
    .leftJoin(accounts, eq(accounts.id, movements.accountId))
    .leftJoin(destinationAccounts, eq(destinationAccounts.id, movements.destinationAccountId))
    .where(and(eq(movements.userId, userId), gte(movements.date, start), lt(movements.date, end)))
    .groupBy(movements.type, accounts.currency, accounts.type, destinationAccounts.type, destinationAccounts.currency);
}

async function unexpectedIncomeRows(userId: string, month: string) {
  const { start, end } = monthRange(month);
  return db
    .select({ currency: accounts.currency, total: sum(movements.amount).mapWith(Number) })
    .from(movements)
    .innerJoin(accounts, eq(accounts.id, movements.accountId))
    .innerJoin(categories, eq(categories.id, movements.categoryId))
    .where(
      and(
        eq(movements.userId, userId),
        eq(movements.type, "income"),
        ilike(categories.name, "%inesperad%"),
        gte(movements.date, start),
        lt(movements.date, end),
      ),
    )
    .groupBy(accounts.currency);
}

async function rateFor(userId: string, month: string) {
  const [rate] = await db
    .select({ usdToUyu: exchangeRates.usdToUyu })
    .from(exchangeRates)
    .where(and(eq(exchangeRates.userId, userId), lte(exchangeRates.month, monthRange(month).start)))
    .orderBy(desc(exchangeRates.month))
    .limit(1);
  return rate?.usdToUyu;
}

export async function getDashboard(month: string) {
  const { user } = await requireSession();

  const [accountRows, totalsRows, purchases, rate, budget, unexpected, fixedMonth] = await Promise.all([
    accountsWithBalance(user.id),
    monthMovementTotals(user.id, month),
    listCardPurchases(user.id),
    rateFor(user.id, month),
    getBudgetMonth(month),
    unexpectedIncomeRows(user.id, month),
    getFixedMonth(month),
  ]);

  const installmentsThisMonth = monthTotals(purchases, month);

  const tip = pickTip(
    {
      overBudget: budget.rows.filter((row) => row.level === "over").map((row) => row.name),
      unexpectedIncome: unexpected.reduce((total, { currency, total: amount }) => total + (toPesos(amount, currency, rate) ?? 0), 0),
      hasBudget: budget.summary.budgeted > 0,
    },
    dayOfYear(),
  );

  return {
    hasAccounts: accountRows.length > 0,
    tip,
    cash: totalsByCurrency(
      accountRows
        .filter((account) => account.type !== "savings")
        .map(({ currency, balance }) => ({ currency, amount: balance })),
    ),
    summary: monthSummary(totalsRows, installmentsThisMonth, rate),
    installments: { thisMonth: installmentsThisMonth, nextMonth: monthTotals(purchases, shiftMonth(month, 1)) },
    fixed: {
      totals: fixedMonth.totals,
      pending: fixedMonth.due.filter(({ payment }) => !payment).slice(0, 3),
    },
    budget: {
      summary: budget.summary,
      highlights: budget.rows
        .filter((row) => row.budget > 0)
        .toSorted((a, b) => (b.percent ?? 0) - (a.percent ?? 0))
        .slice(0, 3),
    },
  };
}

export type Dashboard = Awaited<ReturnType<typeof getDashboard>>;
