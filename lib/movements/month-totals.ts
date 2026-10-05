import "server-only";
import { and, desc, eq, gte, ilike, lt, lte, sum } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { db } from "@/lib/db";
import { accounts, categories, exchangeRates, movements } from "@/lib/db/schema";
import { monthRange } from "@/lib/month";

const destinationAccounts = alias(accounts, "destination_accounts");

export async function monthMovementTotals(userId: string, month: string) {
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

export async function unexpectedIncomeRows(userId: string, month: string) {
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

export async function rateFor(userId: string, month: string) {
  const [rate] = await db
    .select({ usdToUyu: exchangeRates.usdToUyu })
    .from(exchangeRates)
    .where(and(eq(exchangeRates.userId, userId), lte(exchangeRates.month, monthRange(month).start)))
    .orderBy(desc(exchangeRates.month))
    .limit(1);
  return rate?.usdToUyu;
}
