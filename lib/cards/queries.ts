import "server-only";
import { and, asc, eq, gte, inArray, isNotNull, isNull, lt, type SQL } from "drizzle-orm";
import { notFound } from "next/navigation";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts, cardClosingOverrides, categories, creditCards, movements } from "@/lib/db/schema";
import { monthRange } from "@/lib/month";
import { closingDayFor } from "./closing";
import { installmentsInMonth, monthTotals, pendingAfter, projection, totalsByCurrency, type CardPurchase } from "./statement";

export async function listCardPurchases(userId: string, cardCondition?: SQL): Promise<CardPurchase[]> {
  const rows = await db
    .select({
      id: movements.id,
      detail: movements.detail,
      cardId: movements.cardId,
      categoryId: movements.categoryId,
      categoryName: categories.name,
      currency: movements.currency,
      amount: movements.amount,
      installments: movements.installments,
      firstBillingMonth: movements.firstBillingMonth,
      date: movements.date,
    })
    .from(movements)
    .leftJoin(categories, eq(categories.id, movements.categoryId))
    .where(and(eq(movements.userId, userId), isNotNull(movements.cardId), eq(movements.type, "expense"), cardCondition))
    .orderBy(asc(movements.date));

  return rows.map((row) => ({
    id: row.id,
    cardId: row.cardId!,
    title: row.detail ?? row.categoryName ?? "Compra",
    categoryId: row.categoryId,
    categoryName: row.categoryName,
    currency: row.currency ?? "UYU",
    amount: row.amount,
    installments: row.installments ?? 1,
    firstBillingMonth: row.firstBillingMonth?.slice(0, 7) ?? row.date.slice(0, 7),
    date: row.date,
  }));
}

async function overridesFor(cardIds: string[]) {
  if (cardIds.length === 0) return [];
  return db.select().from(cardClosingOverrides).where(inArray(cardClosingOverrides.cardId, cardIds));
}

export async function listCards(month: string) {
  const { user } = await requireSession();

  const cards = await db
    .select()
    .from(creditCards)
    .where(and(eq(creditCards.userId, user.id), isNull(creditCards.archivedAt)))
    .orderBy(asc(creditCards.name));

  const cardIds = cards.map((card) => card.id);
  const [overrides, purchases] = await Promise.all([
    overridesFor(cardIds),
    cardIds.length ? listCardPurchases(user.id, inArray(movements.cardId, cardIds)) : [],
  ]);
  const purchasesByCard = Object.groupBy(purchases, (purchase) => purchase.cardId);

  return cards.map((card) => ({
    ...card,
    monthClosingDay: closingDayFor(
      card.closingDay,
      overrides.filter((override) => override.cardId === card.id),
      month,
    ),
    monthTotals: monthTotals(purchasesByCard[card.id] ?? [], month),
  }));
}

export type CardWithClosing = Awaited<ReturnType<typeof listCards>>[number];

export async function getCardStatement(cardId: string, month: string) {
  const { user } = await requireSession();

  const [card] = await db
    .select()
    .from(creditCards)
    .where(and(eq(creditCards.id, cardId), eq(creditCards.userId, user.id)));
  if (!card) notFound();

  const { start, end } = monthRange(month);
  const [overrides, purchases, payments] = await Promise.all([
    overridesFor([card.id]),
    listCardPurchases(user.id, eq(movements.cardId, card.id)),
    db
      .select({ currency: accounts.currency, amount: movements.amount })
      .from(movements)
      .innerJoin(accounts, eq(accounts.id, movements.accountId))
      .where(
        and(
          eq(movements.cardId, card.id),
          eq(movements.type, "card_payment"),
          gte(movements.date, start),
          lt(movements.date, end),
        ),
      ),
  ]);

  return {
    card: { ...card, monthClosingDay: closingDayFor(card.closingDay, overrides, month) },
    lines: installmentsInMonth(purchases, month),
    totals: monthTotals(purchases, month),
    pending: pendingAfter(purchases, month),
    paid: totalsByCurrency(payments),
    projection: projection(purchases, month, 6),
  };
}

export type CardStatement = Awaited<ReturnType<typeof getCardStatement>>;
