import "server-only";
import { and, desc, eq, gte, inArray, isNull, lt, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import { cache } from "react";
import { listAccounts } from "@/lib/accounts/queries";
import { requireSession } from "@/lib/auth/session";
import { listCategories } from "@/lib/categories/queries";
import { db } from "@/lib/db";
import { accounts, cardClosingOverrides, categories, creditCards, movements, type Currency } from "@/lib/db/schema";
import { monthRange } from "@/lib/month";

const destinationAccounts = alias(accounts, "destination_accounts");

export async function listMonthMovements(month: string) {
  const { user } = await requireSession();
  const { start, end } = monthRange(month);

  return db
    .select({
      id: movements.id,
      type: movements.type,
      date: movements.date,
      amount: movements.amount,
      detail: movements.detail,
      accountId: movements.accountId,
      categoryId: movements.categoryId,
      cardId: movements.cardId,
      installments: movements.installments,
      firstBillingMonth: movements.firstBillingMonth,
      accountName: accounts.name,
      accountType: accounts.type,
      cardName: creditCards.name,
      currency: sql<Currency>`coalesce(${movements.currency}, ${accounts.currency})`,
      categoryName: categories.name,
      destinationAccountId: movements.destinationAccountId,
      destinationAmount: movements.destinationAmount,
      destinationAccountName: destinationAccounts.name,
      destinationCurrency: destinationAccounts.currency,
      destinationType: destinationAccounts.type,
    })
    .from(movements)
    .leftJoin(accounts, eq(accounts.id, movements.accountId))
    .leftJoin(creditCards, eq(creditCards.id, movements.cardId))
    .leftJoin(categories, eq(categories.id, movements.categoryId))
    .leftJoin(destinationAccounts, eq(destinationAccounts.id, movements.destinationAccountId))
    .where(and(eq(movements.userId, user.id), gte(movements.date, start), lt(movements.date, end)))
    .orderBy(desc(movements.date), desc(movements.createdAt));
}

export type MonthMovement = Awaited<ReturnType<typeof listMonthMovements>>[number];

async function listCardsForForm(userId: string) {
  const cards = await db
    .select({ id: creditCards.id, name: creditCards.name, closingDay: creditCards.closingDay })
    .from(creditCards)
    .where(and(eq(creditCards.userId, userId), isNull(creditCards.archivedAt)))
    .orderBy(creditCards.name);

  const overrides = cards.length
    ? await db
        .select({ cardId: cardClosingOverrides.cardId, month: cardClosingOverrides.month, closingDay: cardClosingOverrides.closingDay })
        .from(cardClosingOverrides)
        .where(inArray(cardClosingOverrides.cardId, cards.map((card) => card.id)))
    : [];

  return cards.map((card) => ({
    ...card,
    overrides: overrides
      .filter((override) => override.cardId === card.id)
      .map(({ month, closingDay }) => ({ month, closingDay })),
  }));
}

export const getMovementFormData = cache(async () => {
  const { user } = await requireSession();

  const [accountRows, categoryRows, cards, [lastEntry]] = await Promise.all([
    listAccounts(),
    listCategories(),
    listCardsForForm(user.id),
    db
      .select({ accountId: movements.accountId, cardId: movements.cardId })
      .from(movements)
      .where(and(eq(movements.userId, user.id), inArray(movements.type, ["income", "expense"])))
      .orderBy(desc(movements.createdAt))
      .limit(1),
  ]);

  const lastSource = lastEntry?.cardId
    ? cards.some((card) => card.id === lastEntry.cardId) && `card:${lastEntry.cardId}`
    : accountRows.some((account) => account.id === lastEntry?.accountId) && `account:${lastEntry?.accountId}`;

  return {
    accounts: accountRows.map(({ id, name, currency, type }) => ({ id, name, currency, type })),
    categories: categoryRows.map(({ id, name, kind }) => ({ id, name, kind })),
    cards,
    lastSource: lastSource || (accountRows[0] ? `account:${accountRows[0].id}` : undefined),
  };
});

export type MovementFormData = Awaited<ReturnType<typeof getMovementFormData>>;
