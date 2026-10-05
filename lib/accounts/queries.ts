import "server-only";
import { asc, eq } from "drizzle-orm";
import { requireSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { accounts } from "@/lib/db/schema";

export async function listAccounts() {
  const { user } = await requireSession();
  return db
    .select()
    .from(accounts)
    .where(eq(accounts.userId, user.id))
    .orderBy(asc(accounts.currency), asc(accounts.name));
}
