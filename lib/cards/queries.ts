import "server-only";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { cardClosingOverrides, creditCards } from "@/lib/db/schema";
import { closingDayFor } from "./closing";

export async function listCards(month: string) {
  const { user } = await requireSession();

  const cards = await db
    .select()
    .from(creditCards)
    .where(and(eq(creditCards.userId, user.id), isNull(creditCards.archivedAt)))
    .orderBy(asc(creditCards.name));

  const overrides = cards.length
    ? await db
        .select()
        .from(cardClosingOverrides)
        .where(
          inArray(
            cardClosingOverrides.cardId,
            cards.map((card) => card.id),
          ),
        )
    : [];

  return cards.map((card) => ({
    ...card,
    monthClosingDay: closingDayFor(
      card.closingDay,
      overrides.filter((override) => override.cardId === card.id),
      month,
    ),
  }));
}

export type CardWithClosing = Awaited<ReturnType<typeof listCards>>[number];
