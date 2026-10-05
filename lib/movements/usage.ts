import "server-only";
import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { movements } from "@/lib/db/schema";

type UsageColumn = typeof movements.accountId | typeof movements.categoryId;

export async function hasMovements(column: UsageColumn, id: string) {
  const [{ total }] = await db.select({ total: count() }).from(movements).where(eq(column, id));
  return total > 0;
}
