import "server-only";
import { count, eq, or, type SQL } from "drizzle-orm";
import { db } from "@/lib/db";
import { movements } from "@/lib/db/schema";

async function hasMovements(condition: SQL | undefined) {
  const [{ total }] = await db.select({ total: count() }).from(movements).where(condition);
  return total > 0;
}

export function isAccountInUse(id: string) {
  return hasMovements(or(eq(movements.accountId, id), eq(movements.destinationAccountId, id)));
}

export function isCardInUse(id: string) {
  return hasMovements(eq(movements.cardId, id));
}

export function isCategoryInUse(id: string) {
  return hasMovements(eq(movements.categoryId, id));
}
