import "server-only";
import { count, eq, or, type SQL } from "drizzle-orm";
import type { PgTable } from "drizzle-orm/pg-core";
import { db } from "@/lib/db";
import { fixedCommitments, movements } from "@/lib/db/schema";

async function hasRows(table: PgTable, condition: SQL | undefined) {
  const [{ total }] = await db.select({ total: count() }).from(table).where(condition);
  return total > 0;
}

async function isUsed(movementCondition: SQL | undefined, fixedCondition: SQL | undefined) {
  const [inMovements, inFixed] = await Promise.all([
    hasRows(movements, movementCondition),
    hasRows(fixedCommitments, fixedCondition),
  ]);
  return inMovements || inFixed;
}

export function isAccountInUse(id: string) {
  return isUsed(
    or(eq(movements.accountId, id), eq(movements.destinationAccountId, id)),
    or(eq(fixedCommitments.accountId, id), eq(fixedCommitments.destinationAccountId, id)),
  );
}

export function isCardInUse(id: string) {
  return isUsed(eq(movements.cardId, id), eq(fixedCommitments.cardId, id));
}

export function isCategoryInUse(id: string) {
  return isUsed(eq(movements.categoryId, id), eq(fixedCommitments.categoryId, id));
}
